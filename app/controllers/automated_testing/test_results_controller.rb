class AutomatedTesting::TestResultsController < AutomatedTestingController
  before_action :set_test_run, except: [ :search ]

  def index
    @test_results = @test_run.test_results.includes(:organization)

    # Apply filters
    @test_results = @test_results.where(status: params[:status]) if params[:status].present?
    @test_results = @test_results.where("class_name ILIKE ? OR test_name ILIKE ?",
                                       "%#{params[:search]}%", "%#{params[:search]}%") if params[:search].present?

    # Pagination
    per_page = [ params[:per_page].to_i, 25 ].max
    per_page = [ per_page, 100 ].min
    @test_results = @test_results.page(params[:page]).per(per_page)

    @summary = {
      total: @test_run.total_tests,
      passed: @test_run.passed_tests,
      failed: @test_run.failed_tests,
      skipped: @test_run.skipped_tests,
      duration: @test_run.duration_formatted
    }
  end

  def show
    @test_result = @test_run.test_results.find_by!(uuid: params[:uuid])

    respond_to do |format|
      format.html
      format.json { render json: @test_result }
    end
  end

  def search
    query = params[:q]
    return render json: [] unless query.present?

    test_results = current_organization.test_results
                    .joins(:test_run)
                    .where("class_name ILIKE ? OR test_name ILIKE ? OR test_runs.name ILIKE ?",
                          "%#{query}%", "%#{query}%", "%#{query}%")
                    .limit(20)

    results = test_results.map do |result|
      {
        id: result.uuid,
        class_name: result.class_name,
        test_name: result.test_name,
        status: result.status,
        test_run_name: result.test_run.name
      }
    end

    render json: results
  end

  private

  def set_test_run
    @test_run = current_organization.test_runs.find_by!(uuid: params[:test_run_uuid] || params[:uuid])
  end
end
