require 'rails_helper'

RSpec.describe InvitationCode, type: :model do
  let(:user) { create(:user, role: 'system_admin') }
  let(:organization) { create(:organization) }

  describe 'validations' do
    it 'requires a code' do
      invitation_code = build(:invitation_code, code: nil)
      expect(invitation_code).not_to be_valid
      expect(invitation_code.errors[:code]).to include("can't be blank")
    end

    it 'requires a unique code' do
      create(:invitation_code, code: 'TEST123')
      duplicate = build(:invitation_code, code: 'TEST123')
      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:code]).to include('has already been taken')
    end

    it 'requires a valid code_type' do
      invitation_code = build(:invitation_code, code_type: 'invalid')
      expect(invitation_code).not_to be_valid
    end

    it 'requires max_uses to be positive' do
      invitation_code = build(:invitation_code, max_uses: 0)
      expect(invitation_code).not_to be_valid
    end
  end

  describe 'associations' do
    it 'belongs to created_by user' do
      invitation_code = create(:invitation_code, created_by: user)
      expect(invitation_code.created_by).to eq(user)
    end

    it 'can belong to an organization' do
      invitation_code = create(:invitation_code, organization: organization)
      expect(invitation_code.organization).to eq(organization)
    end
  end

  describe '#generate_code' do
    it 'generates a unique alphanumeric code' do
      invitation_code = build(:invitation_code, code: nil)
      invitation_code.generate_code
      expect(invitation_code.code).to match(/\A[A-Z0-9]{12}\z/)
    end
  end

  describe '#available?' do
    it 'returns true for unused, non-expired codes' do
      invitation_code = create(:invitation_code, max_uses: 5, uses_count: 0)
      expect(invitation_code.available?).to be true
    end

    it 'returns false for expired codes' do
      invitation_code = create(:invitation_code, expires_at: 1.day.ago)
      expect(invitation_code.available?).to be false
    end

    it 'returns false for fully used codes' do
      invitation_code = create(:invitation_code, max_uses: 1, uses_count: 1)
      expect(invitation_code.available?).to be false
    end
  end

  describe '#use!' do
    it 'increments uses_count when available' do
      invitation_code = create(:invitation_code, max_uses: 5, uses_count: 0)
      expect { invitation_code.use! }.to change { invitation_code.uses_count }.by(1)
    end

    it 'returns false when not available' do
      invitation_code = create(:invitation_code, max_uses: 1, uses_count: 1)
      expect(invitation_code.use!).to be false
    end
  end

  describe 'scopes' do
    let!(:active_code) { create(:invitation_code, expires_at: 1.day.from_now) }
    let!(:expired_code) { create(:invitation_code, expires_at: 1.day.ago) }
    let!(:used_code) { create(:invitation_code, max_uses: 1, uses_count: 1) }
    let!(:available_code) { create(:invitation_code, max_uses: 5, uses_count: 0) }

    describe '.active' do
      it 'returns non-expired codes' do
        expect(InvitationCode.active).to include(active_code, available_code)
        expect(InvitationCode.active).not_to include(expired_code)
      end
    end

    describe '.unused' do
      it 'returns codes with remaining uses' do
        expect(InvitationCode.unused).to include(active_code, available_code)
        expect(InvitationCode.unused).not_to include(used_code)
      end
    end

    describe '.available' do
      it 'returns active and unused codes' do
        expect(InvitationCode.available).to include(available_code)
        expect(InvitationCode.available).not_to include(expired_code, used_code)
      end
    end
  end
end
