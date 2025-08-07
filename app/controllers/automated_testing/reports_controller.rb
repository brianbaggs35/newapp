class AutomatedTesting::ReportsController < AutomatedTestingController
  def index
    @test_runs = current_organization.test_runs.completed.recent.limit(10)
  end

  def show
    @test_run = current_organization.test_runs.find_by!(uuid: params[:id])
    @report_options = {
      include_summary: true,
      include_details: params[:include_details] == "true",
      include_failures: params[:include_failures] == "true",
      include_charts: params[:include_charts] == "true"
    }
  end

  def preview
    @test_run = current_organization.test_runs.find_by!(uuid: params[:test_run_uuid])
    @report_options = report_params

    render layout: "report_preview"
  end

  def generate
    @test_run = current_organization.test_runs.find_by!(uuid: params[:test_run_uuid])
    options = report_params

    begin
      generator = ReportGeneratorService.new(
        organization: current_organization,
        user: current_user
      )

      pdf_content = generator.generate_test_run_report(@test_run, options)

      filename = "test_run_report_#{@test_run.name.parameterize}_#{Date.current}.pdf"

      send_data pdf_content,
                filename: filename,
                type: "application/pdf",
                disposition: "attachment"

    rescue StandardError => e
      Rails.logger.error "Report generation failed: #{e.message}"
      flash[:error] = "Failed to generate report: #{e.message}"
      redirect_to automated_testing_reports_path
    end
  end

  private

  def report_params
    params.permit(:include_summary, :include_details, :include_failures, :include_charts)
          .to_h.transform_values { |v| v == "true" }
  end
end
