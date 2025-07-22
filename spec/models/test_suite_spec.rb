require 'rails_helper'

RSpec.describe TestSuite, type: :model do
  describe 'associations' do
    it { should have_many(:test_cases).dependent(:destroy) }
  end

  describe 'validations' do
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:description) }
  end

  describe '#success_rate' do
    let(:test_suite) { create(:test_suite, total_tests: 10, passed_tests: 8) }

    it 'calculates success rate correctly' do
      expect(test_suite.success_rate).to eq(80.0)
    end

    it 'returns 0 when total_tests is 0' do
      test_suite.update(total_tests: 0, passed_tests: 0)
      expect(test_suite.success_rate).to eq(0)
    end
  end

  describe '#update_statistics!' do
    let(:test_suite) { create(:test_suite) }

    before do
      create(:test_case, test_suite: test_suite, status: :passed, duration: 1.5)
      create(:test_case, test_suite: test_suite, status: :failed, duration: 2.0)
      create(:test_case, test_suite: test_suite, status: :skipped, duration: 0.5)
    end

    it 'updates test counts correctly' do
      test_suite.update_statistics!

      expect(test_suite.total_tests).to eq(3)
      expect(test_suite.passed_tests).to eq(1)
      expect(test_suite.failed_tests).to eq(1)
      expect(test_suite.skipped_tests).to eq(1)
      expect(test_suite.total_duration).to eq(4.0)
    end
  end
end
