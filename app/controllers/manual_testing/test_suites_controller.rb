class ManualTesting::TestSuitesController < ManualTestingController
  before_action :set_test_suite, except: [:index, :new, :create]

  def index
    @test_suites = current_organization.test_suites.includes(:created_by, :manual_test_cases)
                    .order(:name)
                    .page(params[:page]).per(25)
  end

  def show
    @test_cases = @test_suite.manual_test_cases.includes(:created_by)
                   .page(params[:page]).per(25)
  end

  def new
    @test_suite = current_organization.test_suites.build
  end

  def create
    @test_suite = current_organization.test_suites.build(test_suite_params)
    @test_suite.created_by = current_user

    if @test_suite.save
      render json: { 
        success: true, 
        message: 'Test suite created successfully',
        test_suite_id: @test_suite.uuid
      }
    else
      render json: { 
        success: false, 
        errors: @test_suite.errors.full_messages 
      }, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @test_suite.update(test_suite_params)
      render json: { 
        success: true, 
        message: 'Test suite updated successfully'
      }
    else
      render json: { 
        success: false, 
        errors: @test_suite.errors.full_messages 
      }, status: :unprocessable_entity
    end
  end

  def destroy
    @test_suite.destroy!
    
    render json: { success: true, message: 'Test suite deleted successfully' }
  rescue StandardError => e
    render json: { success: false, error: e.message }, status: :unprocessable_entity
  end

  private

  def set_test_suite
    @test_suite = current_organization.test_suites.find_by!(uuid: params[:uuid])
  end

  def test_suite_params
    params.require(:test_suite).permit(:name, :project, :description)
  end
end