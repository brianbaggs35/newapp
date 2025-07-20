require 'rails_helper'

RSpec.describe TestCase, type: :model do
  describe 'associations' do
    it { should belong_to(:test_suite) }
  end

  describe 'validations' do
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:description) }
  end

  describe 'enums' do
    it { should define_enum_for(:status).with_values(pending: 0, passed: 1, failed: 2, skipped: 3, error: 4) }
  end

  describe 'scopes' do
    let(:test_suite) { create(:test_suite) }
    let!(:passed_test) { create(:test_case, test_suite: test_suite, status: :passed) }
    let!(:failed_test) { create(:test_case, test_suite: test_suite, status: :failed) }

    it 'filters by status' do
      expect(TestCase.by_status(:passed)).to include(passed_test)
      expect(TestCase.by_status(:passed)).not_to include(failed_test)
    end
  end

  describe '#duration_in_seconds' do
    it 'returns duration when present' do
      test_case = create(:test_case, duration: 2.5)
      expect(test_case.duration_in_seconds).to eq(2.5)
    end

    it 'returns 0.0 when duration is nil' do
      test_case = create(:test_case, duration: nil)
      expect(test_case.duration_in_seconds).to eq(0.0)
    end
  end

  describe '#has_failure?' do
    it 'returns true for failed tests' do
      test_case = create(:test_case, :failed)
      expect(test_case.has_failure?).to be true
    end

    it 'returns true for error tests' do
      test_case = create(:test_case, :with_error)
      expect(test_case.has_failure?).to be true
    end

    it 'returns false for passed tests' do
      test_case = create(:test_case, status: :passed)
      expect(test_case.has_failure?).to be false
    end

    it 'returns false for skipped tests' do
      test_case = create(:test_case, :skipped)
      expect(test_case.has_failure?).to be false
    end
  end
end