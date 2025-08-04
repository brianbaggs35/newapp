require 'rails_helper'

RSpec.describe TestExecution, type: :model do
  let(:organization) { create(:organization) }
  let(:user) { create(:user, organization: organization) }
  let(:manual_test_case) { create(:manual_test_case, organization: organization, created_by: user) }
  
  describe 'associations' do
    it { should belong_to(:manual_test_case) }
    it { should belong_to(:executed_by).class_name('User') }
    it { should belong_to(:organization) }
    it { should belong_to(:test_execution_cycle).optional }
  end

  describe 'validations' do
    it { should validate_inclusion_of(:status).in_array(%w[pending in_progress passed failed blocked]) }
    it { should validate_numericality_of(:execution_time).is_greater_than(0).allow_nil }
  end

  describe 'enums' do
    it { should define_enum_for(:status).with_values(
      pending: 'pending',
      in_progress: 'in_progress', 
      passed: 'passed',
      failed: 'failed',
      blocked: 'blocked'
    ) }
  end

  describe 'scopes' do
    let!(:pending_execution) { create(:test_execution, status: 'pending', manual_test_case: manual_test_case, executed_by: user, organization: organization) }
    let!(:passed_execution) { create(:test_execution, status: 'passed', manual_test_case: manual_test_case, executed_by: user, organization: organization) }
    let!(:failed_execution) { create(:test_execution, status: 'failed', manual_test_case: manual_test_case, executed_by: user, organization: organization) }
    let!(:recent_execution) { create(:test_execution, executed_at: 1.hour.ago, manual_test_case: manual_test_case, executed_by: user, organization: organization) }
    let!(:old_execution) { create(:test_execution, executed_at: 1.week.ago, manual_test_case: manual_test_case, executed_by: user, organization: organization) }

    describe '.by_status' do
      it 'returns executions with specific status' do
        expect(TestExecution.by_status('pending')).to include(pending_execution)
        expect(TestExecution.by_status('pending')).not_to include(passed_execution)
      end
    end

    describe '.by_executor' do
      let(:other_user) { create(:user, organization: organization) }
      let!(:other_execution) { create(:test_execution, executed_by: other_user, manual_test_case: manual_test_case, organization: organization) }

      it 'returns executions by specific executor' do
        expect(TestExecution.by_executor(user)).to include(pending_execution)
        expect(TestExecution.by_executor(user)).not_to include(other_execution)
      end
    end

    describe '.completed' do
      it 'returns completed executions' do
        completed = TestExecution.completed
        expect(completed).to include(passed_execution, failed_execution)
        expect(completed).not_to include(pending_execution)
      end
    end

    describe '.active' do
      let!(:in_progress_execution) { create(:test_execution, status: 'in_progress', manual_test_case: manual_test_case, executed_by: user, organization: organization) }

      it 'returns active executions' do
        active = TestExecution.active
        expect(active).to include(pending_execution, in_progress_execution)
        expect(active).not_to include(passed_execution)
      end
    end

    describe '.recent' do
      it 'returns executions ordered by executed_at desc' do
        expect(TestExecution.recent.first).to eq(recent_execution)
      end
    end

    describe '.in_date_range' do
      let(:start_date) { 2.days.ago }
      let(:end_date) { Date.current }

      it 'returns executions within date range' do
        in_range = TestExecution.in_date_range(start_date, end_date)
        expect(in_range).to include(recent_execution)
        expect(in_range).not_to include(old_execution)
      end
    end
  end

  describe 'callbacks' do
    let(:test_execution) { build(:test_execution, manual_test_case: manual_test_case, executed_by: user, organization: organization) }

    describe 'set_execution_timestamps' do
      it 'sets started_at when status changes to in_progress' do
        test_execution.status = 'in_progress'
        test_execution.save!
        expect(test_execution.started_at).to be_present
        expect(test_execution.executed_at).to be_present
      end

      it 'sets completed_at when status changes to passed' do
        test_execution.status = 'passed'
        test_execution.save!
        expect(test_execution.completed_at).to be_present
        expect(test_execution.executed_at).to be_present
      end

      it 'sets completed_at when status changes to failed' do
        test_execution.status = 'failed'
        test_execution.save!
        expect(test_execution.completed_at).to be_present
      end

      it 'sets completed_at when status changes to blocked' do
        test_execution.status = 'blocked'
        test_execution.save!
        expect(test_execution.completed_at).to be_present
      end
    end
  end

  describe 'instance methods' do
    let(:test_execution) { create(:test_execution, manual_test_case: manual_test_case, executed_by: user, organization: organization) }

    describe '#screenshots_list' do
      it 'returns array when screenshots_urls is valid JSON' do
        test_execution.update(screenshots_urls: '["url1.jpg", "url2.jpg"]')
        expect(test_execution.screenshots_list).to eq(['url1.jpg', 'url2.jpg'])
      end

      it 'returns empty array when screenshots_urls is blank' do
        test_execution.update(screenshots_urls: nil)
        expect(test_execution.screenshots_list).to eq([])
      end

      it 'returns empty array when screenshots_urls is invalid JSON' do
        test_execution.update(screenshots_urls: 'invalid json')
        expect(test_execution.screenshots_list).to eq([])
      end
    end

    describe '#screenshots_list=' do
      it 'sets screenshots_urls as JSON' do
        test_execution.screenshots_list = ['url1.jpg', 'url2.jpg']
        expect(test_execution.screenshots_urls).to eq('["url1.jpg","url2.jpg"]')
      end
    end

    describe '#duration_minutes' do
      it 'calculates duration in minutes' do
        test_execution.update(
          started_at: Time.current,
          completed_at: Time.current + 30.minutes
        )
        expect(test_execution.duration_minutes).to eq(30.0)
      end

      it 'returns nil when timestamps are missing' do
        expect(test_execution.duration_minutes).to be_nil
      end
    end

    describe '#is_completed?' do
      it 'returns true for completed statuses' do
        %w[passed failed blocked].each do |status|
          test_execution.update(status: status)
          expect(test_execution.is_completed?).to be true
        end
      end

      it 'returns false for non-completed statuses' do
        %w[pending in_progress].each do |status|
          test_execution.update(status: status)
          expect(test_execution.is_completed?).to be false
        end
      end
    end

    describe '#is_successful?' do
      it 'returns true only for passed status' do
        test_execution.update(status: 'passed')
        expect(test_execution.is_successful?).to be true
      end

      it 'returns false for non-passed statuses' do
        %w[pending in_progress failed blocked].each do |status|
          test_execution.update(status: status)
          expect(test_execution.is_successful?).to be false
        end
      end
    end

    describe '#has_defect?' do
      it 'returns true when defect_id is present' do
        test_execution.update(defect_id: 'BUG-123')
        expect(test_execution.has_defect?).to be true
      end

      it 'returns false when defect_id is blank' do
        test_execution.update(defect_id: nil)
        expect(test_execution.has_defect?).to be false
      end
    end

    describe '#execution_summary' do
      before do
        test_execution.update(
          status: 'passed',
          execution_time: 15,
          defect_id: 'BUG-123'
        )
      end

      it 'returns execution summary hash' do
        summary = test_execution.execution_summary
        
        expect(summary[:test_case_title]).to eq(manual_test_case.title)
        expect(summary[:executor]).to eq(user.email)
        expect(summary[:status]).to eq('passed')
        expect(summary[:execution_time]).to eq(15)
        expect(summary[:has_defect]).to be true
        expect(summary[:defect_id]).to eq('BUG-123')
      end
    end
  end
end