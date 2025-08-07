class AutomatedTesting::FailureAnalysisController < AutomatedTestingController
  before_action :set_failure_analysis, except: [:index, :create]
  before_action :set_test_run, only: [:index, :create]

  def index
    @test_run = current_organization.test_runs.find_by!(uuid: params[:test_run_uuid])
    @failed_test_results = @test_run.test_results.failed.includes(:failure_analysis)
    
    @failure_analyses = @test_run.test_results.joins(:failure_analysis)
                         .includes(:failure_analysis)
                         .group_by { |tr| tr.failure_analysis.status }
    
    @to_do = @failure_analyses['to_do'] || []
    @in_progress = @failure_analyses['in_progress'] || []
    @fixed = @failure_analyses['fixed'] || []
    
    # Create failure analyses for failed tests that don't have them yet
    @failed_test_results.each do |test_result|
      next if test_result.failure_analysis.present?
      
      FailureAnalysis.create!(
        test_result: test_result,
        organization: current_organization,
        created_by: current_user,
        status: 'to_do',
        priority: determine_priority(test_result)
      )
    end
    
    # Refresh the data after creating new analyses
    @failure_analyses = @test_run.test_results.joins(:failure_analysis)
                         .includes(:failure_analysis)
                         .group_by { |tr| tr.failure_analysis.status }
                         
    @to_do = @failure_analyses['to_do'] || []
    @in_progress = @failure_analyses['in_progress'] || []
    @fixed = @failure_analyses['fixed'] || []
  end

  def show
    respond_to do |format|
      format.html
      format.json { render json: @failure_analysis }
    end
  end

  def update_status
    new_status = params[:status]
    
    unless @failure_analysis.can_move_to_status?(new_status)
      return render json: { 
        success: false, 
        error: "Cannot move from #{@failure_analysis.status} to #{new_status}" 
      }, status: :unprocessable_entity
    end

    @failure_analysis.status = new_status
    @failure_analysis.updated_by = current_user
    
    if new_status == 'fixed'
      @failure_analysis.resolved_at = Time.current
      @failure_analysis.resolution_notes = params[:resolution_notes] if params[:resolution_notes].present?
    end

    if @failure_analysis.save
      render json: { 
        success: true, 
        message: "Status updated to #{new_status}",
        failure_analysis: @failure_analysis
      }
    else
      render json: { 
        success: false, 
        errors: @failure_analysis.errors.full_messages 
      }, status: :unprocessable_entity
    end
  end

  def assign
    assignee = current_organization.users.find_by!(uuid: params[:assigned_to_uuid])
    
    @failure_analysis.assigned_to = assignee
    @failure_analysis.updated_by = current_user
    
    if @failure_analysis.save
      render json: { 
        success: true, 
        message: "Assigned to #{assignee.email}",
        failure_analysis: @failure_analysis
      }
    else
      render json: { 
        success: false, 
        errors: @failure_analysis.errors.full_messages 
      }, status: :unprocessable_entity
    end
  end

  def update
    if @failure_analysis.update(failure_analysis_params)
      @failure_analysis.update!(updated_by: current_user)
      
      render json: { 
        success: true, 
        message: 'Failure analysis updated successfully',
        failure_analysis: @failure_analysis
      }
    else
      render json: { 
        success: false, 
        errors: @failure_analysis.errors.full_messages 
      }, status: :unprocessable_entity
    end
  end

  private

  def set_failure_analysis
    @failure_analysis = current_organization.failure_analyses.find_by!(uuid: params[:uuid])
  end

  def set_test_run
    @test_run = current_organization.test_runs.find_by!(uuid: params[:test_run_uuid]) if params[:test_run_uuid]
  end

  def failure_analysis_params
    params.require(:failure_analysis).permit(:notes, :priority, :resolution_notes)
  end

  def determine_priority(test_result)
    # Simple logic to determine priority based on test failure characteristics
    return 'critical' if test_result.error_type&.include?('Error')
    return 'high' if test_result.failure_message&.include?('assertion')
    return 'medium' if test_result.class_name&.include?('Integration')
    'low'
  end
end