class Admin::InvitationCodesController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_system_admin

  def index
    @invitation_codes = InvitationCode.includes(:organization, :created_by)
                                     .order(created_at: :desc)
                                     .page(params[:page])
  end

  def create
    @invitation_code = InvitationCode.new(invitation_code_params)
    @invitation_code.created_by = current_user
    @invitation_code.generate_code

    if @invitation_code.save
      render json: {
        success: true,
        invitation_code: @invitation_code,
        message: "Invitation code generated successfully"
      }
    else
      render json: {
        success: false,
        errors: @invitation_code.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def destroy
    @invitation_code = InvitationCode.find(params[:id])
    @invitation_code.destroy

    render json: { success: true, message: "Invitation code deleted successfully" }
  end

  private

  def ensure_system_admin
    redirect_to root_path unless current_user&.system_admin?
  end

  def invitation_code_params
    params.require(:invitation_code).permit(:code_type, :max_uses, :expires_at, :organization_id)
  end
end
