require 'rails_helper'

RSpec.describe TestRun, type: :model do
  let(:organization) { create(:organization) }
  let(:user) { create(:user, organization: organization) }

  describe 'associations' do
    it { should belong_to(:organization) }
    it { should belong_to(:created_by).class_name('User') }
    it { should have_many(:test_results).dependent(:destroy) }
  end

  describe 'validations' do
    it { should validate_presence_of(:name) }
    it { should validate_length_of(:name).is_at_least(1).is_at_most(255) }
    it { should validate_inclusion_of(:status).in_array(%w[pending processing completed failed]) }
  end

  describe 'scopes' do
    let!(:completed_run) { create(:test_run, organization: organization, status: 'completed') }
    let!(:failed_run) { create(:test_run, organization: organization, status: 'failed') }
    let!(:pending_run) { create(:test_run, organization: organization, status: 'pending') }

    it 'returns completed test runs' do
      expect(TestRun.completed).to include(completed_run)
      expect(TestRun.completed).not_to include(failed_run, pending_run)
    end

    it 'returns failed test runs' do
      expect(TestRun.failed).to include(failed_run)
      expect(TestRun.failed).not_to include(completed_run, pending_run)
    end

    it 'returns recent test runs in order' do
      expect(TestRun.recent.first).to eq(pending_run) # most recent
    end
  end

  describe 'methods' do
    let(:test_run) { create(:test_run, organization: organization) }
    let!(:passed_results) { create_list(:test_result, 3, test_run: test_run, organization: organization, status: 'passed') }
    let!(:failed_results) { create_list(:test_result, 2, test_run: test_run, organization: organization, status: 'failed') }
    let!(:skipped_results) { create_list(:test_result, 1, test_run: test_run, organization: organization, status: 'skipped') }

    it 'calculates passed count correctly' do
      expect(test_run.passed_count).to eq(3)
    end

    it 'calculates failed count correctly' do
      expect(test_run.failed_count).to eq(2)
    end

    it 'calculates skipped count correctly' do
      expect(test_run.skipped_count).to eq(1)
    end

    it 'calculates total count correctly' do
      expect(test_run.total_count).to eq(6)
    end

    it 'calculates success rate correctly' do
      expect(test_run.success_rate).to eq(50.0) # 3 out of 6
    end

    context 'with no test results' do
      let(:empty_test_run) { create(:test_run, organization: organization) }

      it 'returns 0 for success rate' do
        expect(empty_test_run.success_rate).to eq(0)
      end
    end
  end

  describe 'duration formatting' do
    it 'formats duration correctly for hours, minutes, seconds' do
      test_run = create(:test_run, organization: organization, duration: 3661.5) # 1h 1m 1.5s
      expect(test_run.duration_formatted).to eq('1h 1m 1s')
    end

    it 'formats duration correctly for minutes and seconds' do
      test_run = create(:test_run, organization: organization, duration: 61.5) # 1m 1.5s
      expect(test_run.duration_formatted).to eq('1m 1s')
    end

    it 'formats duration correctly for seconds only' do
      test_run = create(:test_run, organization: organization, duration: 30.5) # 30.5s
      expect(test_run.duration_formatted).to eq('30s')
    end

    it 'handles nil duration' do
      test_run = create(:test_run, organization: organization, duration: nil)
      expect(test_run.duration_formatted).to eq('0s')
    end
  end
end
