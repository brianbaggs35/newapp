class OnboardingController < ApplicationController
  before_action :authenticate_user!
  before_action :redirect_if_onboarded
  
  def show
    @current_step = params[:step] || 'organization'
    @steps = %w[organization profile team complete]
    
    case @current_step
    when 'organization'
      @organization = current_user.organization || Organization.new
    when 'profile'
      redirect_to onboarding_path(step: 'organization') unless current_user.organization
    when 'team'
      redirect_to onboarding_path(step: 'organization') unless current_user.organization
    when 'complete'
      redirect_to onboarding_path(step: 'organization') unless current_user.organization
    end
  end

  def update_organization
    @organization = current_user.organization || Organization.new(organization_params)
    
    if current_user.organization.nil?
      @organization.created_by = current_user
      if @organization.save
        current_user.update!(organization: @organization, role: 'owner')
        render json: { success: true, next_step: 'profile' }
      else
        render json: { success: false, errors: @organization.errors.full_messages }, status: :unprocessable_entity
      end
    else
      if current_user.organization.update(organization_params)
        render json: { success: true, next_step: 'profile' }
      else
        render json: { success: false, errors: current_user.organization.errors.full_messages }, status: :unprocessable_entity
      end
    end
  end

  def update_profile
    if current_user.update(profile_params)
      render json: { success: true, next_step: 'team' }
    else
      render json: { success: false, errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def complete
    current_user.update!(onboarding_completed: true)
    redirect_to dashboard_path, notice: 'Welcome to QA Platform! Your onboarding is complete.'
  end

  private

  def redirect_if_onboarded
    redirect_to dashboard_path if current_user.onboarding_completed?
  end

  def organization_params
    params.require(:organization).permit(:name, :description, :industry, :size)
  end

  def profile_params
    params.require(:user).permit(:first_name, :last_name, :phone, :job_title)
  end
end