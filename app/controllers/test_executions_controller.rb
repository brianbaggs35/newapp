class TestExecutionsController < ApplicationController
  before_action :ensure_organization_member!
  before_action :set_organization
  before_action :set_test_execution, only: [ :show, :update, :destroy ]

  def index
    @test_executions = @organization.test_executions
                                   .includes(:manual_test_case, :executed_by, :test_execution_cycle)
                                   .order(executed_at: :desc)

    # Apply filters
    @test_executions = @test_executions.by_status(params[:status]) if params[:status].present?
    @test_executions = @test_executions.by_executor(User.find(params[:executor_id])) if params[:executor_id].present?

    if params[:cycle_id].present?
      @test_executions = @test_executions.where(test_execution_cycle_id: params[:cycle_id])
    end

    # Date range filter
    if params[:start_date].present? && params[:end_date].present?
      @test_executions = @test_executions.in_date_range(
        Date.parse(params[:start_date]),
        Date.parse(params[:end_date])
      )
    end

    # Group by status for Kanban board
    if params[:format] == "kanban"
      kanban_data = TestExecution.statuses.keys.map do |status|
        {
          status: status,
          test_cases: @test_executions.by_status(status).map do |execution|
            {
              id: execution.manual_test_case.id,
              title: execution.manual_test_case.title,
              description: execution.manual_test_case.description,
              priority: execution.manual_test_case.priority,
              category: execution.manual_test_case.category,
              estimated_time: execution.manual_test_case.estimated_time,
              assigned_to: execution.executed_by.email,
              status: execution.status,
              execution_id: execution.id,
              steps: execution.manual_test_case.steps,
              expected_result: execution.manual_test_case.expected_result,
              preconditions: execution.manual_test_case.preconditions
            }
          end
        }
      end
      render json: kanban_data
    else
      render json: @test_executions.map { |execution| test_execution_json(execution) }
    end
  end

  def show
    render json: {
      execution: test_execution_json(@test_execution),
      test_case: manual_test_case_json(@test_execution.manual_test_case)
    }
  end

  def create
    @manual_test_case = @organization.manual_test_cases.find(params[:manual_test_case_id])

    unless @manual_test_case.can_be_executed?
      render json: { error: "Test case is not approved for execution" }, status: :unprocessable_entity
      return
    end

    @test_execution = @organization.test_executions.build(test_execution_params)
    @test_execution.manual_test_case = @manual_test_case
    @test_execution.executed_by = current_user

    if @test_execution.save
      render json: test_execution_json(@test_execution), status: :created
    else
      render json: { errors: @test_execution.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    unless current_user == @test_execution.executed_by || current_user.can_manage_organization?
      render json: { error: "Access denied" }, status: :forbidden
      return
    end

    if @test_execution.update(test_execution_params)
      render json: test_execution_json(@test_execution)
    else
      render json: { errors: @test_execution.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    unless current_user.can_manage_organization?
      render json: { error: "Access denied" }, status: :forbidden
      return
    end

    @test_execution.destroy
    head :no_content
  end

  def update_status
    @test_execution = @organization.test_executions.find(params[:id])

    unless current_user == @test_execution.executed_by || current_user.can_manage_organization?
      render json: { error: "Access denied" }, status: :forbidden
      return
    end

    new_status = params[:status]
    unless TestExecution.statuses.keys.include?(new_status)
      render json: { error: "Invalid status" }, status: :unprocessable_entity
      return
    end

    if @test_execution.update(status: new_status)
      render json: test_execution_json(@test_execution)
    else
      render json: { errors: @test_execution.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def statistics
    stats = {
      total_executions: @organization.test_executions.count,
      by_status: TestExecution.statuses.keys.map do |status|
        {
          status: status,
          count: @organization.test_executions.by_status(status).count
        }
      end,
      by_executor: @organization.test_executions
                                 .joins(:executed_by)
                                 .group("users.email")
                                 .count,
      recent_executions: @organization.test_executions
                                     .recent
                                     .limit(10)
                                     .map { |execution| test_execution_json(execution) },
      average_execution_time: @organization.test_executions
                                          .where.not(execution_time: nil)
                                          .average(:execution_time)&.round(2) || 0,
      pass_rate: calculate_pass_rate,
      executions_this_week: @organization.test_executions
                                        .where(executed_at: 1.week.ago..Time.current)
                                        .count
    }

    render json: stats
  end

  private

  def set_organization
    @organization = current_user.organization
  end

  def set_test_execution
    @test_execution = @organization.test_executions.find(params[:id])
  end

  def test_execution_params
    params.require(:test_execution).permit(
      :status, :actual_result, :notes, :defect_id, :execution_time,
      :test_execution_cycle_id, screenshots_urls: []
    )
  end

  def test_execution_json(execution)
    {
      id: execution.id,
      manual_test_case_id: execution.manual_test_case_id,
      test_case_title: execution.manual_test_case.title,
      executed_by: execution.executed_by.email,
      status: execution.status,
      actual_result: execution.actual_result,
      notes: execution.notes,
      defect_id: execution.defect_id,
      execution_time: execution.execution_time,
      screenshots_urls: execution.screenshots_list,
      started_at: execution.started_at,
      completed_at: execution.completed_at,
      executed_at: execution.executed_at,
      cycle_name: execution.test_execution_cycle&.name,
      created_at: execution.created_at,
      updated_at: execution.updated_at
    }
  end

  def manual_test_case_json(test_case)
    {
      id: test_case.id,
      title: test_case.title,
      description: test_case.description,
      preconditions: test_case.preconditions,
      steps: test_case.steps,
      expected_result: test_case.expected_result,
      priority: test_case.priority,
      category: test_case.category,
      estimated_time: test_case.estimated_time
    }
  end

  def calculate_pass_rate
    completed = @organization.test_executions.completed.count
    return 0 if completed == 0
    passed = @organization.test_executions.passed.count
    (passed.to_f / completed * 100).round(2)
  end
end
