class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :set_current_organization

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [ :role ])
    devise_parameter_sanitizer.permit(:account_update, keys: [ :role ])
  end

  def ensure_system_admin!
    unless current_user&.system_admin?
      redirect_to root_path, alert: "Access denied. System admin required."
    end
  end

  def ensure_organization_member!
    unless current_user&.organization.present?
      redirect_to organizations_path, alert: "You must belong to an organization to access this feature."
    end
  end

  def ensure_can_manage_organization!
    unless current_user&.can_manage_organization?
      redirect_to dashboard_path, alert: "You do not have permission to manage organization settings."
    end
  end

  def ensure_can_manage_users!
    unless current_user&.can_manage_users?
      redirect_to dashboard_path, alert: "You do not have permission to manage users."
    end
  end

  private

  def set_current_organization
    @current_organization = current_user&.organization
  end
end
