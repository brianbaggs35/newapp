class Settings::OrganizationsController < SettingsController
  before_action :ensure_organization_access
  before_action :set_organization

  def show
    @users = @organization.users.includes(:created_manual_test_cases, :test_executions)
              .order(:email)
    @stats = {
      total_users: @users.count,
      owners: @users.select(&:owner?).count,
      admins: @users.select(&:admin?).count,
      members: @users.select(&:member?).count
    }
  end

  def edit
  end

  def update
    if @organization.update(organization_params)
      render json: {
        success: true,
        message: "Organization updated successfully"
      }
    else
      render json: {
        success: false,
        errors: @organization.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

  def set_organization
    @organization = current_organization
  end

  def ensure_organization_access
    unless current_user.can_see_organization_management?
      redirect_to root_path, alert: "Access denied."
    end
  end

  def organization_params
    params.require(:organization).permit(:name, :description)
  end
end
