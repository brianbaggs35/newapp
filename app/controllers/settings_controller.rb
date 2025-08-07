class SettingsController < ApplicationController
  layout 'qa_platform'
  before_action :authenticate_user!
  
  private
  
  def current_organization
    current_user.organization
  end
end