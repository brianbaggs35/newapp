class Admin::SmtpSettingsController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_system_admin

  def show
    @smtp_settings = SmtpSetting.first_or_initialize
  end

  def update
    @smtp_settings = SmtpSetting.first_or_initialize
    
    if @smtp_settings.update(smtp_settings_params)
      # Update ActionMailer configuration
      ActionMailer::Base.delivery_method = :smtp
      ActionMailer::Base.smtp_settings = @smtp_settings.to_hash
      
      render json: { 
        success: true, 
        message: 'SMTP settings updated successfully' 
      }
    else
      render json: { 
        success: false, 
        errors: @smtp_settings.errors.full_messages 
      }, status: :unprocessable_entity
    end
  end

  def test_email
    begin
      AdminMailer.test_email(current_user.email).deliver_now
      render json: { success: true, message: 'Test email sent successfully' }
    rescue => e
      render json: { 
        success: false, 
        message: "Failed to send test email: #{e.message}" 
      }, status: :unprocessable_entity
    end
  end

  private

  def ensure_system_admin
    redirect_to root_path unless current_user&.system_admin?
  end

  def smtp_settings_params
    params.require(:smtp_setting).permit(:host, :port, :username, :password, :authentication, :enable_starttls_auto, :from_email, :from_name)
  end
end