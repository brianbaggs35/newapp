class ManualTesting::TestRunItemsController < ManualTestingController
  before_action :set_test_run
  before_action :set_test_run_item, except: [ :index, :create ]

  def index
    @test_run_items = @test_run.manual_test_run_items.includes(:manual_test_case, :executed_by)
  end

  def show
    respond_to do |format|
      format.html
      format.json { render json: @test_run_item.as_json(include: [ :manual_test_case, :executed_by ]) }
    end
  end

  def update_status
    new_status = params[:status]

    unless @test_run_item.can_move_to_status?(new_status)
      return render json: {
        success: false,
        error: "Cannot move from #{@test_run_item.status} to #{new_status}"
      }, status: :unprocessable_entity
    end

    @test_run_item.status = new_status
    @test_run_item.executed_by = current_user if new_status != "to_do"
    @test_run_item.executed_at = Time.current if %w[passed failed].include?(new_status)

    # Set required fields based on status
    case new_status
    when "passed"
      @test_run_item.actual_results = params[:actual_results] if params[:actual_results].present?
    when "failed", "blocked"
      @test_run_item.failure_information = params[:failure_information] if params[:failure_information].present?
    end

    @test_run_item.notes = params[:notes] if params[:notes].present?
    @test_run_item.execution_time = params[:execution_time] if params[:execution_time].present?

    if @test_run_item.save
      # Update test run status if all items are completed
      update_test_run_status_if_completed

      render json: {
        success: true,
        message: "Status updated to #{new_status}",
        test_run_item: @test_run_item.as_json(include: [ :executed_by ])
      }
    else
      render json: {
        success: false,
        errors: @test_run_item.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def update
    @test_run_item.executed_by = current_user

    if @test_run_item.update(test_run_item_params)
      render json: {
        success: true,
        message: "Test run item updated successfully"
      }
    else
      render json: {
        success: false,
        errors: @test_run_item.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

  def set_test_run
    @test_run = current_organization.manual_test_runs.find_by!(uuid: params[:test_run_uuid])
  end

  def set_test_run_item
    @test_run_item = @test_run.manual_test_run_items.find_by!(uuid: params[:uuid])
  end

  def test_run_item_params
    params.require(:manual_test_run_item).permit(
      :actual_results, :failure_information, :notes, :execution_time
    )
  end

  def update_test_run_status_if_completed
    total_items = @test_run.manual_test_run_items.count
    completed_items = @test_run.manual_test_run_items.completed.count

    if total_items > 0 && completed_items == total_items
      @test_run.update!(status: "completed", completed_at: Time.current)
    end
  end
end
