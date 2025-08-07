require 'rails_helper'

RSpec.describe AutomatedTesting::UploadsController, type: :controller do
  let(:organization) { create(:organization) }
  let(:user) { create(:user, organization: organization, role: 'member') }

  before do
    sign_in user
  end

  describe 'GET #index' do
    let!(:test_runs) { create_list(:test_run, 3, organization: organization) }
    let!(:other_org_run) { create(:test_run) } # Different organization

    it 'returns successful response' do
      get :index
      expect(response).to be_successful
    end

    it 'assigns test runs from current organization only' do
      get :index
      expect(assigns(:test_runs)).to match_array(test_runs)
      expect(assigns(:test_runs)).not_to include(other_org_run)
    end

    it 'orders test runs by recent first' do
      get :index
      expect(assigns(:test_runs).first).to eq(test_runs.last)
    end
  end

  describe 'POST #create' do
    let(:valid_xml_content) do
      <<~XML
        <?xml version="1.0" encoding="UTF-8"?>
        <testsuite name="Sample Test" tests="1" failures="0" errors="0" skipped="0" time="1.0">
          <testcase classname="TestClass" name="testMethod" time="1.0"/>
        </testsuite>
      XML
    end

    let(:xml_file) do
      file = Tempfile.new([ 'test', '.xml' ])
      file.write(valid_xml_content)
      file.rewind
      fixture_file_upload(file.path, 'application/xml')
    end

    context 'with valid parameters' do
      let(:valid_params) do
        {
          test_run: {
            name: 'Test Upload',
            description: 'Test description',
            xml_file: xml_file
          }
        }
      end

      before do
        allow_any_instance_of(XmlParserService).to receive(:parse_and_create_test_run).and_return(
          create(:test_run, organization: organization, status: 'completed')
        )
      end

      it 'creates a test run' do
        expect {
          post :create, params: valid_params
        }.to change(TestRun, :count).by(1)
      end

      it 'returns success response' do
        post :create, params: valid_params
        expect(response).to be_successful

        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be true
      end
    end

    context 'with invalid parameters' do
      let(:invalid_params) do
        {
          test_run: {
            name: '', # Invalid - empty name
            xml_file: xml_file
          }
        }
      end

      it 'does not create a test run' do
        expect {
          post :create, params: invalid_params
        }.not_to change(TestRun, :count)
      end

      it 'returns error response' do
        post :create, params: invalid_params
        expect(response).to have_http_status(:unprocessable_entity)

        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be false
        expect(json_response['errors']).to be_present
      end
    end
  end

  describe 'PATCH #update' do
    let!(:test_run) { create(:test_run, organization: organization, name: 'Original Name') }

    context 'with valid parameters' do
      it 'updates the test run name' do
        patch :update, params: { id: test_run.uuid, name: 'New Name' }

        expect(response).to be_successful
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be true

        test_run.reload
        expect(test_run.name).to eq('New Name')
      end
    end

    context 'with invalid parameters' do
      it 'does not update the test run' do
        patch :update, params: { id: test_run.uuid, name: '' }

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be false

        test_run.reload
        expect(test_run.name).to eq('Original Name')
      end
    end

    context 'with non-existent test run' do
      it 'raises RecordNotFound' do
        expect {
          patch :update, params: { id: 'non-existent-uuid', name: 'New Name' }
        }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end

  describe 'DELETE #destroy' do
    let!(:test_run) { create(:test_run, organization: organization) }

    it 'destroys the test run' do
      expect {
        delete :destroy, params: { id: test_run.uuid }
      }.to change(TestRun, :count).by(-1)
    end

    it 'returns success response' do
      delete :destroy, params: { id: test_run.uuid }

      expect(response).to be_successful
      json_response = JSON.parse(response.body)
      expect(json_response['success']).to be true
    end

    context 'when test run has dependent records' do
      let!(:test_run_with_results) { create(:test_run, :with_results, organization: organization) }

      it 'destroys the test run and its results' do
        expect {
          delete :destroy, params: { id: test_run_with_results.uuid }
        }.to change(TestRun, :count).by(-1).and change(TestResult, :count).by(-6)
      end
    end
  end

  context 'when user is not signed in' do
    before { sign_out user }

    it 'redirects to sign in page' do
      get :index
      expect(response).to redirect_to(new_user_session_path)
    end
  end

  context 'when user has no organization' do
    let(:user_without_org) { create(:user, organization: nil, role: 'system_admin') }

    before do
      sign_out user
      sign_in user_without_org
    end

    it 'redirects to root path' do
      get :index
      expect(response).to redirect_to(root_path)
    end
  end
end
