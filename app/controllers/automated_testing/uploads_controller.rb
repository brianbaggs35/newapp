class AutomatedTesting::UploadsController < AutomatedTestingController
  def index
    @test_runs = current_organization.test_runs.includes(:created_by).recent
                  .page(params[:page]).per(25)
  end

  def new
    @test_run = current_organization.test_runs.build
  end

  def create
    @test_run = current_organization.test_runs.build(test_run_params)
    @test_run.created_by = current_user
    @test_run.status = 'processing'

    if @test_run.save && process_xml_file
      render json: { 
        success: true, 
        message: 'Test run uploaded and processed successfully',
        test_run_id: @test_run.uuid
      }
    else
      render json: { 
        success: false, 
        errors: @test_run.errors.full_messages 
      }, status: :unprocessable_entity
    end
  end

  def update
    @test_run = current_organization.test_runs.find_by!(uuid: params[:id])
    
    if @test_run.update(name: params[:name])
      render json: { success: true, message: 'Test run renamed successfully' }
    else
      render json: { success: false, errors: @test_run.errors.full_messages }
    end
  end

  def destroy
    @test_run = current_organization.test_runs.find_by!(uuid: params[:id])
    @test_run.destroy!
    
    render json: { success: true, message: 'Test run deleted successfully' }
  rescue StandardError => e
    render json: { success: false, error: e.message }, status: :unprocessable_entity
  end

  private

  def test_run_params
    params.require(:test_run).permit(:name, :description, :xml_file)
  end

  def process_xml_file
    return false unless @test_run.xml_file.attached?

    xml_file_path = ActiveStorage::Blob.service.send(:path_for, @test_run.xml_file.blob.key)
    
    parser = XmlParserService.new(
      organization: current_organization,
      user: current_user,
      file_path: xml_file_path
    )
    
    parsed_test_run = parser.parse_and_create_test_run
    
    if parsed_test_run
      # Update our placeholder test run with parsed data
      @test_run.update!(
        total_tests: parsed_test_run.total_tests,
        passed_tests: parsed_test_run.passed_tests,
        failed_tests: parsed_test_run.failed_tests,
        skipped_tests: parsed_test_run.skipped_tests,
        duration: parsed_test_run.duration,
        status: 'completed',
        completed_at: parsed_test_run.completed_at
      )
      
      # Transfer test results to our test run
      parsed_test_run.test_results.update_all(test_run_id: @test_run.id)
      parsed_test_run.destroy!
      
      true
    else
      @test_run.update!(status: 'failed')
      false
    end
  rescue StandardError => e
    Rails.logger.error "Failed to process XML file: #{e.message}"
    @test_run.update!(status: 'failed')
    false
  end
end