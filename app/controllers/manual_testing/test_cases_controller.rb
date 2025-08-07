class ManualTesting::TestCasesController < ManualTestingController
  before_action :set_test_case, except: [:index, :new, :create, :search, :bulk_update]

  def index
    @test_cases = current_organization.manual_test_cases.includes(:created_by, :test_suite)
    
    # Apply filters
    @test_cases = @test_cases.by_status(params[:status]) if params[:status].present?
    @test_cases = @test_cases.by_priority(params[:priority]) if params[:priority].present?
    @test_cases = @test_cases.in_test_suite(params[:test_suite_id]) if params[:test_suite_id].present?
    @test_cases = @test_cases.where("title ILIKE ?", "%#{params[:search]}%") if params[:search].present?
    
    # Pagination
    @test_cases = @test_cases.page(params[:page]).per(25)
    
    @test_suites = current_organization.test_suites.order(:name)
    @summary = {
      total: current_organization.manual_test_cases.count,
      approved: current_organization.manual_test_cases.approved.count,
      draft: current_organization.manual_test_cases.draft.count,
      orphaned: current_organization.manual_test_cases.orphaned.count
    }
  end

  def show
    respond_to do |format|
      format.html
      format.json { render json: @test_case }
    end
  end

  def new
    @test_case = current_organization.manual_test_cases.build
    @test_suites = current_organization.test_suites.order(:name)
  end

  def create
    @test_case = current_organization.manual_test_cases.build(test_case_params)
    @test_case.created_by = current_user

    if @test_case.save
      render json: { 
        success: true, 
        message: 'Test case created successfully',
        test_case_id: @test_case.uuid
      }
    else
      render json: { 
        success: false, 
        errors: @test_case.errors.full_messages 
      }, status: :unprocessable_entity
    end
  end

  def edit
    @test_suites = current_organization.test_suites.order(:name)
  end

  def update
    @test_case.updated_by = current_user
    
    if @test_case.update(test_case_params)
      render json: { 
        success: true, 
        message: 'Test case updated successfully'
      }
    else
      render json: { 
        success: false, 
        errors: @test_case.errors.full_messages 
      }, status: :unprocessable_entity
    end
  end

  def destroy
    @test_case.destroy!
    
    render json: { success: true, message: 'Test case deleted successfully' }
  rescue StandardError => e
    render json: { success: false, error: e.message }, status: :unprocessable_entity
  end

  def search
    query = params[:q]
    return render json: [] unless query.present?
    
    test_cases = current_organization.manual_test_cases
                  .where("title ILIKE ? OR steps ILIKE ?", "%#{query}%", "%#{query}%")
                  .limit(20)
                  
    results = test_cases.map do |tc|
      {
        id: tc.uuid,
        title: tc.title,
        status: tc.status,
        priority: tc.priority,
        test_suite_name: tc.test_suite&.name
      }
    end
    
    render json: results
  end

  def bulk_update
    test_case_ids = params[:test_case_ids] || []
    updates = params[:updates] || {}
    
    test_cases = current_organization.manual_test_cases.where(uuid: test_case_ids)
    
    ActiveRecord::Base.transaction do
      test_cases.each do |test_case|
        test_case.updated_by = current_user
        test_case.update!(updates.permit(:status, :priority, :test_suite_id))
      end
    end
    
    render json: { 
      success: true, 
      message: "#{test_cases.count} test cases updated successfully" 
    }
  rescue StandardError => e
    render json: { success: false, error: e.message }, status: :unprocessable_entity
  end

  def move_to_suite
    test_suite = params[:test_suite_id].present? ? 
                 current_organization.test_suites.find_by!(uuid: params[:test_suite_id]) : 
                 nil
                 
    @test_case.test_suite = test_suite
    @test_case.updated_by = current_user
    
    if @test_case.save
      suite_name = test_suite&.name || 'No Suite'
      render json: { 
        success: true, 
        message: "Test case moved to #{suite_name}" 
      }
    else
      render json: { 
        success: false, 
        errors: @test_case.errors.full_messages 
      }, status: :unprocessable_entity
    end
  end

  private

  def set_test_case
    @test_case = current_organization.manual_test_cases.find_by!(uuid: params[:uuid])
  end

  def test_case_params
    params.require(:manual_test_case).permit(
      :title, :steps, :expected_result, :priority, :status,
      :module_name, :environment, :account, :category, :tags,
      :estimated_time, :test_suite_id
    )
  end
end