require 'rails_helper'

RSpec.describe ManualTestCasesController, type: :controller do
  let(:organization) { create(:organization) }
  let(:user) { create(:user, organization: organization, role: 'test_manager') }
  let!(:manual_test_case) { create(:manual_test_case, organization: organization, created_by: user) }

  before do
    sign_in user
    allow(controller).to receive(:current_user).and_return(user)
    allow(controller).to receive(:ensure_organization_member!).and_return(true)
  end

  describe 'GET #index' do
    let!(:another_test_case) { create(:manual_test_case, organization: organization, created_by: user, priority: 'high') }
    
    it 'returns all test cases for the organization' do
      get :index
      
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).length).to eq(2)
    end

    it 'filters by status' do
      another_test_case.update(status: 'draft')
      
      get :index, params: { status: 'draft' }
      
      expect(response).to have_http_status(:ok)
      parsed_response = JSON.parse(response.body)
      expect(parsed_response.length).to eq(1)
      expect(parsed_response.first['status']).to eq('draft')
    end

    it 'filters by priority' do
      get :index, params: { priority: 'high' }
      
      expect(response).to have_http_status(:ok)
      parsed_response = JSON.parse(response.body)
      expect(parsed_response.length).to eq(1)
      expect(parsed_response.first['priority']).to eq('high')
    end

    it 'searches by title and description' do
      another_test_case.update(title: 'Unique Search Title')
      
      get :index, params: { search: 'Unique' }
      
      expect(response).to have_http_status(:ok)
      parsed_response = JSON.parse(response.body)
      expect(parsed_response.length).to eq(1)
      expect(parsed_response.first['title']).to include('Unique')
    end
  end

  describe 'GET #show' do
    it 'returns the test case with execution history' do
      execution = create(:test_execution, manual_test_case: manual_test_case, executed_by: user, organization: organization)
      
      get :show, params: { id: manual_test_case.id }
      
      expect(response).to have_http_status(:ok)
      parsed_response = JSON.parse(response.body)
      expect(parsed_response['test_case']['id']).to eq(manual_test_case.id)
      expect(parsed_response['execution_history']).to be_present
    end

    it 'returns 404 for non-existent test case' do
      expect {
        get :show, params: { id: 999999 }
      }.to raise_error(ActiveRecord::RecordNotFound)
    end
  end

  describe 'POST #create' do
    let(:valid_attributes) do
      {
        title: 'New Test Case',
        description: 'Test description',
        steps: 'Step 1\nStep 2',
        expected_result: 'Expected result',
        priority: 'high',
        category: 'Functional',
        estimated_time: 20
      }
    end

    context 'with valid parameters' do
      it 'creates a new manual test case' do
        expect {
          post :create, params: { manual_test_case: valid_attributes }
        }.to change(ManualTestCase, :count).by(1)
        
        expect(response).to have_http_status(:created)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['title']).to eq('New Test Case')
        expect(parsed_response['created_by']).to eq(user.email)
      end
    end

    context 'with invalid parameters' do
      it 'returns validation errors' do
        invalid_attributes = valid_attributes.merge(title: '')
        
        post :create, params: { manual_test_case: invalid_attributes }
        
        expect(response).to have_http_status(:unprocessable_entity)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['errors']).to be_present
      end
    end

    context 'without proper permissions' do
      let(:unauthorized_user) { create(:user, organization: organization, role: 'test_runner') }
      
      before do
        allow(controller).to receive(:current_user).and_return(unauthorized_user)
        allow(unauthorized_user).to receive(:can_manage_organization?).and_return(false)
        allow(unauthorized_user).to receive(:test_runner?).and_return(true)
      end

      it 'allows test runners to create test cases' do
        expect {
          post :create, params: { manual_test_case: valid_attributes }
        }.to change(ManualTestCase, :count).by(1)
        
        expect(response).to have_http_status(:created)
      end
    end
  end

  describe 'PATCH #update' do
    let(:update_attributes) { { title: 'Updated Title', priority: 'critical' } }

    context 'as the creator' do
      it 'updates the test case' do
        patch :update, params: { id: manual_test_case.id, manual_test_case: update_attributes }
        
        expect(response).to have_http_status(:ok)
        manual_test_case.reload
        expect(manual_test_case.title).to eq('Updated Title')
        expect(manual_test_case.priority).to eq('critical')
        expect(manual_test_case.updated_by).to eq(user)
      end
    end

    context 'with invalid parameters' do
      it 'returns validation errors' do
        patch :update, params: { 
          id: manual_test_case.id, 
          manual_test_case: { title: '' } 
        }
        
        expect(response).to have_http_status(:unprocessable_entity)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['errors']).to be_present
      end
    end

    context 'without proper permissions' do
      let(:other_user) { create(:user, organization: organization) }
      
      before do
        allow(controller).to receive(:current_user).and_return(other_user)
        allow(other_user).to receive(:can_manage_organization?).and_return(false)
      end

      it 'returns access denied' do
        patch :update, params: { id: manual_test_case.id, manual_test_case: update_attributes }
        
        expect(response).to have_http_status(:forbidden)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['error']).to eq('Access denied')
      end
    end
  end

  describe 'DELETE #destroy' do
    context 'with proper permissions' do
      it 'deletes the test case' do
        expect {
          delete :destroy, params: { id: manual_test_case.id }
        }.to change(ManualTestCase, :count).by(-1)
        
        expect(response).to have_http_status(:no_content)
      end
    end

    context 'without proper permissions' do
      let(:unauthorized_user) { create(:user, organization: organization) }
      
      before do
        allow(controller).to receive(:current_user).and_return(unauthorized_user)
        allow(unauthorized_user).to receive(:can_manage_organization?).and_return(false)
      end

      it 'returns access denied' do
        delete :destroy, params: { id: manual_test_case.id }
        
        expect(response).to have_http_status(:forbidden)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['error']).to eq('Access denied')
      end
    end
  end

  describe 'PATCH #bulk_update_status' do
    let!(:test_case_2) { create(:manual_test_case, organization: organization, created_by: user) }
    let(:test_case_ids) { [manual_test_case.id, test_case_2.id] }

    context 'with proper permissions' do
      it 'updates status of multiple test cases' do
        patch :bulk_update_status, params: { 
          test_case_ids: test_case_ids,
          status: 'approved'
        }
        
        expect(response).to have_http_status(:ok)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['message']).to include('2 test cases updated')
        
        manual_test_case.reload
        test_case_2.reload
        expect(manual_test_case.status).to eq('approved')
        expect(test_case_2.status).to eq('approved')
      end
    end

    context 'with invalid status' do
      it 'returns validation error' do
        patch :bulk_update_status, params: { 
          test_case_ids: test_case_ids,
          status: 'invalid_status'
        }
        
        expect(response).to have_http_status(:unprocessable_entity)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['error']).to eq('Invalid status')
      end
    end
  end

  describe 'GET #statistics' do
    let!(:draft_test) { create(:manual_test_case, status: 'draft', organization: organization, created_by: user) }
    let!(:approved_test) { create(:manual_test_case, status: 'approved', priority: 'critical', category: 'Security', organization: organization, created_by: user) }

    it 'returns comprehensive statistics' do
      get :statistics
      
      expect(response).to have_http_status(:ok)
      parsed_response = JSON.parse(response.body)
      
      expect(parsed_response['total_test_cases']).to eq(3) # including the original one
      expect(parsed_response['by_status']).to be_present
      expect(parsed_response['by_priority']).to be_present
      expect(parsed_response['categories']).to be_present
      expect(parsed_response['recent_test_cases']).to be_present
      
      # Verify status breakdown
      status_breakdown = parsed_response['by_status']
      draft_count = status_breakdown.find { |s| s['status'] == 'draft' }['count']
      approved_count = status_breakdown.find { |s| s['status'] == 'approved' }['count']
      
      expect(draft_count).to eq(1)
      expect(approved_count).to eq(2) # approved_test + original manual_test_case
    end
  end
end