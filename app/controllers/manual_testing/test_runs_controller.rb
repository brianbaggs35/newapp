class ManualTesting::TestRunsController < ManualTestingController
  before_action :set_test_run, except: [ :index, :new, :create ]

  def index
    @test_runs = current_organization.manual_test_runs.includes(:created_by)
                  .order(created_at: :desc)
                  .page(params[:page]).per(25)
  end

  def show
    @items_by_status = {
      "to_do" => @test_run.manual_test_run_items.to_do.includes(:manual_test_case, :executed_by),
      "in_progress" => @test_run.manual_test_run_items.in_progress.includes(:manual_test_case, :executed_by),
      "blocked" => @test_run.manual_test_run_items.blocked.includes(:manual_test_case, :executed_by),
      "failed" => @test_run.manual_test_run_items.failed.includes(:manual_test_case, :executed_by),
      "passed" => @test_run.manual_test_run_items.passed.includes(:manual_test_case, :executed_by)
    }

    @summary = {
      total: @test_run.total_count,
      to_do: @test_run.to_do_count,
      in_progress: @test_run.in_progress_count,
      blocked: @test_run.blocked_count,
      failed: @test_run.failed_count,
      passed: @test_run.passed_count,
      completion_rate: @test_run.completion_percentage,
      success_rate: @test_run.success_rate
    }
  end

  def new
    @test_run = current_organization.manual_test_runs.build
    @available_test_cases = current_organization.manual_test_cases.approved
                             .includes(:test_suite)
                             .order(:title)
    @test_suites = current_organization.test_suites.includes(:manual_test_cases)
                    .order(:name)
  end

  def create
    @test_run = current_organization.manual_test_runs.build(test_run_params)
    @test_run.created_by = current_user

    ActiveRecord::Base.transaction do
      @test_run.save!

      # Add selected test cases to the run
      test_case_ids = params[:test_case_ids] || []
      test_cases = current_organization.manual_test_cases.where(uuid: test_case_ids)

      test_cases.each do |test_case|
        @test_run.manual_test_run_items.create!(
          manual_test_case: test_case,
          organization: current_organization,
          status: "to_do"
        )
      end

      @test_run.update!(status: "in_progress") if @test_run.manual_test_run_items.any?
    end

    render json: {
      success: true,
      message: "Test run created successfully",
      test_run_id: @test_run.uuid
    }
  rescue StandardError => e
    render json: {
      success: false,
      error: e.message
    }, status: :unprocessable_entity
  end

  def edit
  end

  def update
    if @test_run.update(test_run_params)
      render json: {
        success: true,
        message: "Test run updated successfully"
      }
    else
      render json: {
        success: false,
        errors: @test_run.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def destroy
    @test_run.destroy!

    render json: { success: true, message: "Test run deleted successfully" }
  rescue StandardError => e
    render json: { success: false, error: e.message }, status: :unprocessable_entity
  end

  private

  def set_test_run
    @test_run = current_organization.manual_test_runs.find_by!(uuid: params[:uuid])
  end

  def test_run_params
    params.require(:manual_test_run).permit(:name, :description)
  end
end
