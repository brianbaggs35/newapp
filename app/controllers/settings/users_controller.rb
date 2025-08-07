class Settings::UsersController < SettingsController
  before_action :ensure_organization_access
  before_action :set_organization
  before_action :set_user, except: [ :index ]

  def index
    @users = @organization.users.order(:email)
              .page(params[:page]).per(25)
  end

  def show
    @user_stats = {
      test_cases_created: @user.created_manual_test_cases.count,
      test_executions: @user.test_executions.count,
      recent_activity: @user.created_manual_test_cases.recent.limit(5)
    }
  end

  def edit
  end

  def update
    if @user.update(user_params)
      render json: {
        success: true,
        message: "User updated successfully"
      }
    else
      render json: {
        success: false,
        errors: @user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def change_role
    new_role = params[:role]

    # Check permissions
    unless can_assign_role?(new_role)
      return render json: {
        success: false,
        error: "You do not have permission to assign this role"
      }, status: :forbidden
    end

    if @user.update(role: new_role)
      render json: {
        success: true,
        message: "Role updated to #{new_role}"
      }
    else
      render json: {
        success: false,
        errors: @user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def remove
    # Cannot remove yourself or the organization owner
    if @user == current_user
      return render json: {
        success: false,
        error: "You cannot remove yourself"
      }, status: :unprocessable_entity
    end

    if @user.owner?
      return render json: {
        success: false,
        error: "Cannot remove organization owner"
      }, status: :unprocessable_entity
    end

    @user.update!(organization: nil)

    render json: {
      success: true,
      message: "User removed from organization"
    }
  rescue StandardError => e
    render json: {
      success: false,
      error: e.message
    }, status: :unprocessable_entity
  end

  def destroy
    # Same as remove but completely deletes the user
    if @user == current_user
      return render json: {
        success: false,
        error: "You cannot delete yourself"
      }, status: :unprocessable_entity
    end

    if @user.owner?
      return render json: {
        success: false,
        error: "Cannot delete organization owner"
      }, status: :unprocessable_entity
    end

    @user.destroy!

    render json: {
      success: true,
      message: "User deleted successfully"
    }
  rescue StandardError => e
    render json: {
      success: false,
      error: e.message
    }, status: :unprocessable_entity
  end

  private

  def set_organization
    @organization = current_organization
  end

  def set_user
    @user = @organization.users.find_by!(uuid: params[:id])
  end

  def ensure_organization_access
    unless current_user.can_manage_organization?
      redirect_to root_path, alert: "Access denied."
    end
  end

  def user_params
    params.require(:user).permit(:email, :role)
  end

  def can_assign_role?(role)
    case role
    when "owner"
      current_user.owner? && !@organization.owner # Only if no existing owner
    when "admin"
      current_user.can_invite_users?
    when "member"
      current_user.can_invite_users?
    else
      false
    end
  end
end
