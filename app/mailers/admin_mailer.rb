class AdminMailer < ApplicationMailer
  def test_email(to_email)
    @to_email = to_email
    @timestamp = Time.current

    mail(
      to: to_email,
      subject: "QA Platform - SMTP Test Email",
      from: smtp_from_address
    )
  end

  def invitation_email(invitation_code, to_email)
    @invitation_code = invitation_code
    @to_email = to_email
    @signup_url = if invitation_code.owner?
                    new_user_registration_url(invitation_code: invitation_code.code, type: "owner")
    else
                    new_user_registration_url(invitation_code: invitation_code.code, type: "user")
    end

    mail(
      to: to_email,
      subject: "QA Platform - You're Invited!",
      from: smtp_from_address
    )
  end

  private

  def smtp_from_address
    smtp_setting = SmtpSetting.first
    return Rails.application.config.action_mailer.default_options[:from] unless smtp_setting

    "#{smtp_setting.from_name} <#{smtp_setting.from_email}>"
  end
end
