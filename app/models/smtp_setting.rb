class SmtpSetting < ApplicationRecord
  validates :host, presence: true
  validates :port, presence: true, numericality: { greater_than: 0, less_than: 65536 }
  validates :from_email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :from_name, presence: true

  def to_hash
    {
      address: host,
      port: port,
      user_name: username,
      password: password,
      authentication: authentication&.to_sym,
      enable_starttls_auto: enable_starttls_auto,
      from: from_email
    }.compact
  end

  def masked_password
    return "" if password.blank?
    "*" * 8
  end
end
