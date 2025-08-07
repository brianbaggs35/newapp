require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validations' do
    it 'is valid with valid attributes' do
      user = build(:user)
      expect(user).to be_valid
    end

    it 'requires an email' do
      user = build(:user, email: nil)
      expect(user).not_to be_valid
      expect(user.errors[:email]).to include("can't be blank")
    end

    it 'requires a unique email' do
      create(:user, email: 'test@example.com')
      user = build(:user, email: 'test@example.com')
      expect(user).not_to be_valid
      expect(user.errors[:email]).to include('has already been taken')
    end

    it 'validates role inclusion' do
      user = build(:user, role: 'invalid_role')
      expect(user).not_to be_valid
      expect(user.errors[:role]).to include('is not included in the list')
    end

    it 'allows system_admin without organization' do
      user = build(:user, :system_admin)
      expect(user).to be_valid
    end

    it 'requires organization for non-system admin users' do
      user = build(:user, organization: nil)
      expect(user).not_to be_valid
      expect(user.errors[:organization]).to include('is required for non-system admin users')
    end
  end

  describe 'associations' do
    it 'belongs to organization optionally' do
      user = build(:user, organization: nil)
      user.role = 'system_admin'  # system admin can have nil organization
      expect(user).to be_valid
    end

    it 'has many created manual test cases' do
      user = create(:user)
      manual_test_case = create(:manual_test_case, created_by: user)
      expect(user.created_manual_test_cases).to include(manual_test_case)
    end
  end

  describe 'role methods' do
    it 'returns true for system_admin?' do
      user = build(:user, :system_admin)
      expect(user.system_admin?).to be true
    end

    it 'returns true for owner?' do
      user = build(:user, :owner)
      expect(user.owner?).to be true
    end

    it 'returns true for admin?' do
      user = build(:user, :admin)
      expect(user.admin?).to be true
    end

    it 'returns true for member?' do
      user = build(:user, :member)
      expect(user.member?).to be true
    end
  end
end
