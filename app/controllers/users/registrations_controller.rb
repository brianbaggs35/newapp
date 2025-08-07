# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  before_action :configure_sign_up_params, only: [ :create ]
  before_action :validate_invitation_code, only: [ :new, :create ]

  def new
    @invitation_code = InvitationCode.find_by(code: params[:invitation_code]) if params[:invitation_code]
    @invitation_type = params[:type] # 'owner' or 'user'

    if params[:invitation_code] && !@invitation_code&.available?
      redirect_to new_user_registration_path, alert: "Invalid or expired invitation code."
      return
    end

    super
  end

  def create
    @invitation_code = InvitationCode.find_by(code: params[:invitation_code]) if params[:invitation_code]

    build_resource(sign_up_params)

    # Handle invitation-based registration
    if @invitation_code
      if @invitation_code.owner?
        # Owner invitation - create new organization
        handle_owner_registration
      else
        # User invitation - join existing organization
        handle_user_registration
      end
    else
      # Regular registration (should be disabled in production)
      resource.errors.add(:base, "Registration requires an invitation code")
      respond_with resource
      return
    end

    resource.invitation_code = @invitation_code if @invitation_code
    resource.save
    yield resource if block_given?

    if resource.persisted?
      @invitation_code&.use!

      if resource.active_for_authentication?
        set_flash_message! :notice, :signed_up
        sign_up(resource_name, resource)

        # Redirect to onboarding for owners, dashboard for users
        location = if resource.owner?
                    onboarding_path
        else
                    dashboard_path
        end
        respond_with resource, location: location
      else
        set_flash_message! :notice, :"signed_up_but_#{resource.inactive_message}"
        expire_data_after_sign_up!
        respond_with resource, location: after_inactive_sign_up_path_for(resource)
      end
    else
      clean_up_passwords resource
      set_minimum_password_length
      respond_with resource
    end
  end

  protected

  def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up, keys: [ :first_name, :last_name, :phone, :job_title ])
  end

  def after_sign_up_path_for(resource)
    if resource.owner?
      onboarding_path
    else
      dashboard_path
    end
  end

  def after_inactive_sign_up_path_for(resource)
    new_user_session_path
  end

  private

  def validate_invitation_code
    return unless params[:invitation_code]

    @invitation_code = InvitationCode.find_by(code: params[:invitation_code])
    unless @invitation_code&.available?
      redirect_to root_path, alert: "Invalid or expired invitation code."
    end
  end

  def handle_owner_registration
    # Create new organization for owner
    @organization = Organization.new(organization_params)
    @organization.created_by = resource

    unless @organization.valid?
      resource.errors.add(:base, "Organization: #{@organization.errors.full_messages.join(', ')}")
      return
    end

    resource.role = "owner"
    resource.organization = @organization

    # Save organization if resource saves successfully
    @organization.save! if resource.valid?
  end

  def handle_user_registration
    # Join existing organization
    resource.organization = @invitation_code.organization
    resource.role = "member"

    unless resource.organization
      resource.errors.add(:base, "No organization associated with invitation code")
    end
  end

  def organization_params
    params.require(:organization).permit(:name, :description, :industry, :size) if params[:organization]
  end
end
