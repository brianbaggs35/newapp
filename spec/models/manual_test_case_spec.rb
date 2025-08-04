require 'rails_helper'

RSpec.describe ManualTestCase, type: :model do
  let(:organization) { create(:organization) }
  let(:user) { create(:user, organization: organization) }
  
  describe 'associations' do
    it { should belong_to(:organization) }
    it { should belong_to(:created_by).class_name('User') }
    it { should belong_to(:updated_by).class_name('User').optional }
    it { should have_many(:test_executions).dependent(:destroy) }
    it { should have_many(:executors).through(:test_executions) }
  end

  describe 'validations' do
    it { should validate_presence_of(:title) }
    it { should validate_length_of(:title).is_at_least(3).is_at_most(255) }
    it { should validate_presence_of(:steps) }
    it { should validate_presence_of(:expected_result) }
    it { should validate_inclusion_of(:priority).in_array(%w[critical high medium low]) }
    it { should validate_inclusion_of(:status).in_array(%w[draft review approved deprecated]) }
    it { should validate_numericality_of(:estimated_time).is_greater_than(0).allow_nil }
  end

  describe 'enums' do
    it { should define_enum_for(:priority).with_values(critical: 'critical', high: 'high', medium: 'medium', low: 'low') }
    it { should define_enum_for(:status).with_values(draft: 'draft', review: 'review', approved: 'approved', deprecated: 'deprecated') }
  end

  describe 'scopes' do
    let!(:critical_test) { create(:manual_test_case, priority: 'critical', organization: organization, created_by: user) }
    let!(:high_test) { create(:manual_test_case, priority: 'high', organization: organization, created_by: user) }
    let!(:draft_test) { create(:manual_test_case, status: 'draft', organization: organization, created_by: user) }
    let!(:approved_test) { create(:manual_test_case, status: 'approved', organization: organization, created_by: user) }
    let!(:functional_test) { create(:manual_test_case, category: 'Functional', organization: organization, created_by: user) }

    describe '.by_priority' do
      it 'returns test cases with specific priority' do
        expect(ManualTestCase.by_priority('critical')).to include(critical_test)
        expect(ManualTestCase.by_priority('critical')).not_to include(high_test)
      end
    end

    describe '.by_status' do
      it 'returns test cases with specific status' do
        expect(ManualTestCase.by_status('draft')).to include(draft_test)
        expect(ManualTestCase.by_status('draft')).not_to include(approved_test)
      end
    end

    describe '.by_category' do
      it 'returns test cases with specific category' do
        expect(ManualTestCase.by_category('Functional')).to include(functional_test)
      end
    end

    describe '.for_organization' do
      let(:other_organization) { create(:organization) }
      let(:other_user) { create(:user, organization: other_organization) }
      let!(:other_test) { create(:manual_test_case, organization: other_organization, created_by: other_user) }

      it 'returns test cases for specific organization' do
        org_tests = ManualTestCase.for_organization(organization)
        expect(org_tests).to include(critical_test, high_test)
        expect(org_tests).not_to include(other_test)
      end
    end
  end

  describe 'instance methods' do
    let(:manual_test_case) { create(:manual_test_case, tags: 'login, auth, security', organization: organization, created_by: user) }

    describe '#tags_array' do
      it 'returns array of tags' do
        expect(manual_test_case.tags_array).to eq(['login', 'auth', 'security'])
      end

      it 'returns empty array when tags is blank' do
        manual_test_case.update(tags: nil)
        expect(manual_test_case.tags_array).to eq([])
      end
    end

    describe '#tags_array=' do
      it 'sets tags from array' do
        manual_test_case.tags_array = ['new', 'tags']
        expect(manual_test_case.tags).to eq('new, tags')
      end
    end

    describe '#latest_execution' do
      let!(:old_execution) { create(:test_execution, manual_test_case: manual_test_case, executed_at: 2.days.ago, executed_by: user, organization: organization) }
      let!(:recent_execution) { create(:test_execution, manual_test_case: manual_test_case, executed_at: 1.day.ago, executed_by: user, organization: organization) }

      it 'returns the most recent execution' do
        expect(manual_test_case.latest_execution).to eq(recent_execution)
      end
    end

    describe '#pass_rate' do
      before do
        create(:test_execution, manual_test_case: manual_test_case, status: 'passed', executed_by: user, organization: organization)
        create(:test_execution, manual_test_case: manual_test_case, status: 'passed', executed_by: user, organization: organization)
        create(:test_execution, manual_test_case: manual_test_case, status: 'failed', executed_by: user, organization: organization)
      end

      it 'calculates pass rate correctly' do
        expect(manual_test_case.pass_rate).to eq(66.67)
      end

      it 'returns 0 when no executions exist' do
        new_test = create(:manual_test_case, organization: organization, created_by: user)
        expect(new_test.pass_rate).to eq(0)
      end
    end

    describe '#average_execution_time' do
      before do
        create(:test_execution, manual_test_case: manual_test_case, execution_time: 10, executed_by: user, organization: organization)
        create(:test_execution, manual_test_case: manual_test_case, execution_time: 20, executed_by: user, organization: organization)
        create(:test_execution, manual_test_case: manual_test_case, execution_time: nil, executed_by: user, organization: organization)
      end

      it 'calculates average execution time correctly' do
        expect(manual_test_case.average_execution_time).to eq(15.0)
      end

      it 'returns nil when no executions with time exist' do
        new_test = create(:manual_test_case, organization: organization, created_by: user)
        expect(new_test.average_execution_time).to be_nil
      end
    end

    describe '#can_be_executed?' do
      it 'returns true for approved test cases' do
        manual_test_case.update(status: 'approved')
        expect(manual_test_case.can_be_executed?).to be true
      end

      it 'returns false for non-approved test cases' do
        manual_test_case.update(status: 'draft')
        expect(manual_test_case.can_be_executed?).to be false
      end
    end

    describe '#ready_for_execution?' do
      it 'returns true when approved and has required fields' do
        manual_test_case.update(status: 'approved', steps: 'Step 1', expected_result: 'Result')
        expect(manual_test_case.ready_for_execution?).to be true
      end

      it 'returns false when not approved' do
        manual_test_case.update(status: 'draft', steps: 'Step 1', expected_result: 'Result')
        expect(manual_test_case.ready_for_execution?).to be false
      end

      it 'returns false when missing steps' do
        manual_test_case.update(status: 'approved', steps: '', expected_result: 'Result')
        expect(manual_test_case.ready_for_execution?).to be false
      end

      it 'returns false when missing expected result' do
        manual_test_case.update(status: 'approved', steps: 'Step 1', expected_result: '')
        expect(manual_test_case.ready_for_execution?).to be false
      end
    end
  end
end