class Admin::DashboardController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_system_admin

  def index
    @stats = {
      total_users: User.count,
      total_organizations: Organization.count,
      users_this_month: User.where(created_at: 1.month.ago..Time.current).count,
      organizations_this_month: Organization.where(created_at: 1.month.ago..Time.current).count,
      recent_users: User.includes(:organization).order(created_at: :desc).limit(5),
      recent_organizations: Organization.order(created_at: :desc).limit(5)
    }
  end

  private

  def ensure_system_admin
    redirect_to root_path unless current_user&.system_admin?
  end
end