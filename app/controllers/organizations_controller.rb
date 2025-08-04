class OrganizationsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_organization, only: [:show, :edit, :update, :destroy]
  before_action :ensure_organization_access, only: [:show, :edit, :update, :destroy]
  before_action :ensure_can_manage_organization, only: [:edit, :update, :destroy]

  def index
    if current_user.system_admin?
      @organizations = Organization.all.order(:name)
    elsif current_user.organization.present?
      redirect_to organization_path(current_user.organization)
      return
    else
      redirect_to new_organization_path
      return
    end

    respond_to do |format|
      format.html
      format.json do
        render json: @organizations.map { |org|
          {
            id: org.id,
            name: org.name,
            description: org.description,
            active: org.active,
            user_count: org.users.count,
            test_suite_count: org.test_suites.count
          }
        }
      end
    end
  end

  def show
    @users = @organization.users.order(:role, :email)
    @test_suites = @organization.test_suites.recent.limit(10)
    @stats = {
      total_users: @organization.users.count,
      total_test_suites: @organization.test_suites.count,
      total_test_cases: @organization.test_cases.count,
      recent_test_runs: @organization.test_suites.where('executed_at > ?', 7.days.ago).count
    }
  end

  def new
    ensure_can_create_organization
    @organization = Organization.new
  end

  def create
    ensure_can_create_organization
    @organization = Organization.new(organization_params)

    if @organization.save
      # If the current user is not a system admin, make them the owner of this organization
      unless current_user.system_admin?
        current_user.update!(organization: @organization, role: 'test_owner')
      end
      
      redirect_to @organization, notice: 'Organization was successfully created.'
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @organization.update(organization_params)
      redirect_to @organization, notice: 'Organization was successfully updated.'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    ensure_system_admin
    if @organization.users.any?
      redirect_to @organization, alert: 'Cannot delete organization with users. Transfer or remove users first.'
    else
      @organization.destroy
      redirect_to organizations_path, notice: 'Organization was successfully deleted.'
    end
  end

  private

  def set_organization
    @organization = Organization.find(params[:id])
  end

  def organization_params
    params.require(:organization).permit(:name, :description, :active)
  end

  def ensure_organization_access
    unless current_user.system_admin? || current_user.organization == @organization
      redirect_to root_path, alert: 'Access denied.'
    end
  end

  def ensure_can_manage_organization
    unless current_user.system_admin? || current_user.can_manage_organization?
      redirect_to @organization, alert: 'You do not have permission to manage this organization.'
    end
  end

  def ensure_can_create_organization
    unless current_user.system_admin? || current_user.organization.nil?
      redirect_to current_user.organization, alert: 'You already belong to an organization.'
    end
  end

  def ensure_system_admin
    unless current_user.system_admin?
      redirect_to root_path, alert: 'Access denied. System admin required.'
    end
  end
end
