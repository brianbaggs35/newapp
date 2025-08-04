class ManualTestCasesController < ApplicationController
  before_action :ensure_organization_member!
  before_action :set_organization
  before_action :set_manual_test_case, only: [:show, :update, :destroy]

  def index
    @manual_test_cases = @organization.manual_test_cases
                                     .includes(:created_by, :updated_by, :latest_execution)
                                     .order(created_at: :desc)

    # Apply filters
    @manual_test_cases = @manual_test_cases.by_status(params[:status]) if params[:status].present?
    @manual_test_cases = @manual_test_cases.by_priority(params[:priority]) if params[:priority].present?
    @manual_test_cases = @manual_test_cases.by_category(params[:category]) if params[:category].present?

    # Search
    if params[:search].present?
      search_term = "%#{params[:search]}%"
      @manual_test_cases = @manual_test_cases.where(
        "title ILIKE ? OR description ILIKE ? OR category ILIKE ?",
        search_term, search_term, search_term
      )
    end

    render json: @manual_test_cases.map { |test_case| manual_test_case_json(test_case) }
  end

  def show
    render json: {
      test_case: manual_test_case_json(@manual_test_case),
      execution_history: @manual_test_case.execution_history.limit(10).map { |execution| test_execution_json(execution) }
    }
  end

  def create
    unless current_user.can_manage_organization? || current_user.test_runner?
      render json: { error: 'Access denied' }, status: :forbidden
      return
    end

    @manual_test_case = @organization.manual_test_cases.build(manual_test_case_params)
    @manual_test_case.created_by = current_user

    if @manual_test_case.save
      render json: manual_test_case_json(@manual_test_case), status: :created
    else
      render json: { errors: @manual_test_case.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    unless current_user.can_manage_organization? || current_user == @manual_test_case.created_by
      render json: { error: 'Access denied' }, status: :forbidden
      return
    end

    @manual_test_case.updated_by = current_user

    if @manual_test_case.update(manual_test_case_params)
      render json: manual_test_case_json(@manual_test_case)
    else
      render json: { errors: @manual_test_case.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    unless current_user.can_manage_organization?
      render json: { error: 'Access denied' }, status: :forbidden
      return
    end

    @manual_test_case.destroy
    head :no_content
  end

  def bulk_update_status
    unless current_user.can_manage_organization?
      render json: { error: 'Access denied' }, status: :forbidden
      return
    end

    test_case_ids = params[:test_case_ids]
    new_status = params[:status]

    unless ManualTestCase.statuses.keys.include?(new_status)
      render json: { error: 'Invalid status' }, status: :unprocessable_entity
      return
    end

    @manual_test_cases = @organization.manual_test_cases.where(id: test_case_ids)
    @manual_test_cases.update_all(
      status: new_status,
      updated_by_id: current_user.id,
      updated_at: Time.current
    )

    render json: { message: "#{@manual_test_cases.count} test cases updated successfully" }
  end

  def statistics
    stats = {
      total_test_cases: @organization.manual_test_cases.count,
      by_status: ManualTestCase.statuses.keys.map do |status|
        {
          status: status,
          count: @organization.manual_test_cases.by_status(status).count
        }
      end,
      by_priority: ManualTestCase.priorities.keys.map do |priority|
        {
          priority: priority,
          count: @organization.manual_test_cases.by_priority(priority).count
        }
      end,
      categories: @organization.manual_test_cases
                                .where.not(category: [nil, ''])
                                .group(:category)
                                .count,
      recent_test_cases: @organization.manual_test_cases
                                     .recent
                                     .limit(5)
                                     .map { |tc| manual_test_case_json(tc) }
    }

    render json: stats
  end

  private

  def set_organization
    @organization = current_user.organization
  end

  def set_manual_test_case
    @manual_test_case = @organization.manual_test_cases.find(params[:id])
  end

  def manual_test_case_params
    params.require(:manual_test_case).permit(
      :title, :description, :preconditions, :steps, :expected_result,
      :priority, :status, :category, :tags, :estimated_time
    )
  end

  def manual_test_case_json(test_case)
    {
      id: test_case.id,
      title: test_case.title,
      description: test_case.description,
      preconditions: test_case.preconditions,
      steps: test_case.steps,
      expected_result: test_case.expected_result,
      actual_result: test_case.actual_result,
      priority: test_case.priority,
      status: test_case.status,
      category: test_case.category,
      tags: test_case.tags,
      estimated_time: test_case.estimated_time,
      created_by: test_case.created_by.email,
      updated_by: test_case.updated_by&.email,
      pass_rate: test_case.pass_rate,
      average_execution_time: test_case.average_execution_time,
      latest_execution: test_case.latest_execution ? test_execution_json(test_case.latest_execution) : nil,
      created_at: test_case.created_at,
      updated_at: test_case.updated_at
    }
  end

  def test_execution_json(execution)
    {
      id: execution.id,
      status: execution.status,
      executed_by: execution.executed_by.email,
      execution_time: execution.execution_time,
      executed_at: execution.executed_at,
      defect_id: execution.defect_id
    }
  end
end