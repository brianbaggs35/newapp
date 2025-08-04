class HomepageController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index]

  def index
    # Redirect authenticated users to appropriate dashboard
    if user_signed_in?
      if current_user.system_admin?
        redirect_to organizations_path
      elsif current_user.organization.present?
        redirect_to organization_path(current_user.organization)
      else
        redirect_to organizations_path
      end
    end
    # Non-authenticated users see the public homepage
  end
end
