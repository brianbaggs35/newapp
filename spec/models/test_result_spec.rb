require 'rails_helper'

RSpec.describe TestResult, type: :model do
  let(:organization) { create(:organization) }
  let(:test_run) { create(:test_run, organization: organization) }
  
  describe 'associations' do
    it { should belong_to(:test_run) }
    it { should belong_to(:organization) }
  end

  describe 'validations' do
    it { should validate_presence_of(:class_name) }
    it { should validate_presence_of(:test_name) }
    it { should validate_inclusion_of(:status).in_array(%w[passed failed skipped]) }
    it { should validate_numericality_of(:duration).is_greater_than_or_equal_to(0).allow_nil }
  end

  describe 'scopes' do
    let!(:passed_result) { create(:test_result, test_run: test_run, organization: organization, status: 'passed') }
    let!(:failed_result) { create(:test_result, test_run: test_run, organization: organization, status: 'failed') }
    let!(:skipped_result) { create(:test_result, test_run: test_run, organization: organization, status: 'skipped') }
    let!(:failed_with_message) { create(:test_result, test_run: test_run, organization: organization, status: 'failed', failure_message: 'Error occurred') }

    it 'returns passed results' do
      expect(TestResult.passed).to include(passed_result)
      expect(TestResult.passed).not_to include(failed_result, skipped_result)
    end

    it 'returns failed results' do
      expect(TestResult.failed).to include(failed_result, failed_with_message)
      expect(TestResult.failed).not_to include(passed_result, skipped_result)
    end

    it 'returns skipped results' do
      expect(TestResult.skipped).to include(skipped_result)
      expect(TestResult.skipped).not_to include(passed_result, failed_result)
    end

    it 'returns results with failures' do
      expect(TestResult.with_failures).to include(failed_with_message)
      expect(TestResult.with_failures).not_to include(passed_result, failed_result, skipped_result)
    end
  end

  describe 'methods' do
    let(:test_result) { create(:test_result, test_run: test_run, organization: organization, duration: 2.5) }
    
    it 'converts duration to milliseconds' do
      expect(test_result.duration_ms).to eq(2500)
    end

    it 'handles nil duration for milliseconds' do
      test_result.duration = nil
      expect(test_result.duration_ms).to eq(0)
    end

    context 'with failure' do
      let(:failed_result) { create(:test_result, test_run: test_run, organization: organization, status: 'failed', failure_message: 'Test failed') }
      
      it 'returns true for has_failure?' do
        expect(failed_result.has_failure?).to be true
      end
    end

    context 'without failure' do
      let(:passed_result) { create(:test_result, test_run: test_run, organization: organization, status: 'passed') }
      
      it 'returns false for has_failure?' do
        expect(passed_result.has_failure?).to be false
      end
    end

    context 'with error' do
      let(:error_result) { create(:test_result, test_run: test_run, organization: organization, error_type: 'RuntimeError') }
      
      it 'returns true for has_error?' do
        expect(error_result.has_error?).to be true
      end
    end

    context 'without error' do
      let(:clean_result) { create(:test_result, test_run: test_run, organization: organization) }
      
      it 'returns false for has_error?' do
        expect(clean_result.has_error?).to be false
      end
    end
  end
end