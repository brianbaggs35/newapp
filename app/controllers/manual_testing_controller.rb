class ManualTestingController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_organization
  
  private
  
  def ensure_organization
    redirect_to root_path unless current_user.organization
  end
  
  def current_organization
    current_user.organization
  end
end