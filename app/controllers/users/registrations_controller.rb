# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  before_action :configure_sign_up_params, only: [:create]
  # before_action :configure_account_update_params, only: [:update]

  # GET /resource/sign_up
  # def new
  #   super
  # end

  # POST /resource
  def create
    build_resource(sign_up_params)

    # Handle organization logic
    if params[:registration_type] == 'create_new'
      # Create new organization
      organization_params = params[:organization] || {}
      @organization = Organization.new(
        name: organization_params[:name],
        description: organization_params[:description],
        active: true
      )
      
      unless @organization.valid?
        resource.errors.add(:base, "Organization #{@organization.errors.full_messages.join(', ')}")
        respond_with resource
        return
      end
    elsif params[:registration_type] == 'join_existing'
      # Join existing organization
      @organization = Organization.find_by(id: params[:organization_id])
      unless @organization
        resource.errors.add(:base, "Selected organization not found")
        respond_with resource
        return
      end
    else
      # Default behavior - no organization (system admin can be created this way)
      @organization = nil
    end

    # Set organization before saving user
    resource.organization = @organization if @organization

    # Validate user role based on organization context
    if @organization && params[:registration_type] == 'create_new'
      resource.role = 'test_owner'
    elsif @organization && params[:registration_type] == 'join_existing'
      resource.role = resource.role.presence || 'test_runner'
    end

    resource.save
    yield resource if block_given?

    if resource.persisted?
      # Save organization after user is created
      if @organization && @organization.new_record?
        @organization.save!
      end

      if resource.active_for_authentication?
        set_flash_message! :notice, :signed_up
        sign_up(resource_name, resource)
        respond_with resource, location: after_sign_up_path_for(resource)
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

  # GET /resource/edit
  # def edit
  #   super
  # end

  # PUT /resource
  # def update
  #   super
  # end

  # DELETE /resource
  # def destroy
  #   super
  # end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  # def cancel
  #   super
  # end

  protected

  # If you have extra params to permit, append them to the sanitizer.
  def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up, keys: [:role])
  end

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_account_update_params
  #   devise_parameter_sanitizer.permit(:account_update, keys: [:attribute])
  # end

  # The path used after sign up.
  def after_sign_up_path_for(resource)
    if resource.system_admin?
      organizations_path
    elsif resource.organization
      organization_path(resource.organization)
    else
      organizations_path
    end
  end

  # The path used after sign up for inactive accounts.
  def after_inactive_sign_up_path_for(resource)
    new_user_session_path
  end

  def respond_with(resource, _opts = {})
    if request.format.json?
      if resource.persisted?
        render json: {
          message: 'Registration successful',
          user: {
            id: resource.id,
            email: resource.email,
            role: resource.role,
            organization_id: resource.organization_id
          }
        }, status: :created
      else
        render json: {
          error: resource.errors.full_messages.join(', ')
        }, status: :unprocessable_entity
      end
    else
      super
    end
  end
end