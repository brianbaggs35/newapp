require 'rails_helper'

RSpec.describe Organization, type: :model do
  describe 'validations' do
    it 'is valid with valid attributes' do
      organization = build(:organization)
      expect(organization).to be_valid
    end

    it 'requires a name' do
      organization = build(:organization, name: nil)
      expect(organization).not_to be_valid
      expect(organization.errors[:name]).to include("can't be blank")
    end

    it 'requires a unique name' do
      create(:organization, name: 'Test Org')
      organization = build(:organization, name: 'Test Org')
      expect(organization).not_to be_valid
      expect(organization.errors[:name]).to include('has already been taken')
    end
  end

  describe 'associations' do
    it 'has many users' do
      organization = create(:organization)
      user = create(:user, organization: organization)
      expect(organization.users).to include(user)
    end

    it 'has many test suites' do
      organization = create(:organization)
      test_suite = create(:test_suite, organization: organization)
      expect(organization.test_suites).to include(test_suite)
    end
  end

  describe 'scopes' do
    it 'returns active organizations' do
      active_org = create(:organization, active: true)
      inactive_org = create(:organization, active: false)

      expect(Organization.active).to include(active_org)
      expect(Organization.active).not_to include(inactive_org)
    end
  end
end
