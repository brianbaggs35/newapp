require 'rails_helper'

RSpec.describe SmtpSetting, type: :model do
  describe 'validations' do
    it 'requires a host' do
      smtp_setting = build(:smtp_setting, host: nil)
      expect(smtp_setting).not_to be_valid
      expect(smtp_setting.errors[:host]).to include("can't be blank")
    end

    it 'requires a port' do
      smtp_setting = build(:smtp_setting, port: nil)
      expect(smtp_setting).not_to be_valid
      expect(smtp_setting.errors[:port]).to include("can't be blank")
    end

    it 'requires port to be in valid range' do
      smtp_setting = build(:smtp_setting, port: 0)
      expect(smtp_setting).not_to be_valid
      
      smtp_setting = build(:smtp_setting, port: 70000)
      expect(smtp_setting).not_to be_valid
    end

    it 'requires a valid from_email format' do
      smtp_setting = build(:smtp_setting, from_email: 'invalid-email')
      expect(smtp_setting).not_to be_valid
      expect(smtp_setting.errors[:from_email]).to include('is invalid')
    end

    it 'requires from_name' do
      smtp_setting = build(:smtp_setting, from_name: nil)
      expect(smtp_setting).not_to be_valid
      expect(smtp_setting.errors[:from_name]).to include("can't be blank")
    end
  end

  describe '#to_hash' do
    it 'returns proper SMTP configuration hash' do
      smtp_setting = create(:smtp_setting,
        host: 'smtp.gmail.com',
        port: 587,
        username: 'user@gmail.com',
        password: 'secret',
        authentication: 'plain',
        enable_starttls_auto: true,
        from_email: 'noreply@example.com'
      )

      hash = smtp_setting.to_hash
      expect(hash).to eq({
        address: 'smtp.gmail.com',
        port: 587,
        user_name: 'user@gmail.com',
        password: 'secret',
        authentication: :plain,
        enable_starttls_auto: true,
        from: 'noreply@example.com'
      })
    end

    it 'excludes nil values' do
      smtp_setting = create(:smtp_setting, username: nil, password: nil)
      hash = smtp_setting.to_hash
      expect(hash).not_to have_key(:user_name)
      expect(hash).not_to have_key(:password)
    end
  end

  describe '#masked_password' do
    it 'returns asterisks for non-blank password' do
      smtp_setting = create(:smtp_setting, password: 'secret123')
      expect(smtp_setting.masked_password).to eq('********')
    end

    it 'returns empty string for blank password' do
      smtp_setting = create(:smtp_setting, password: nil)
      expect(smtp_setting.masked_password).to eq('')
    end
  end
end