require 'rails_helper'

RSpec.describe Admin::InvitationCodesController, type: :controller do
  let(:system_admin) { create(:user, role: 'system_admin') }
  let(:regular_user) { create(:user, role: 'member') }
  let(:organization) { create(:organization) }

  before { sign_in system_admin }

  describe 'GET #index' do
    it 'returns success' do
      get :index
      expect(response).to have_http_status(:success)
    end

    it 'assigns invitation codes' do
      codes = create_list(:invitation_code, 3, created_by: system_admin)
      get :index
      expect(assigns(:invitation_codes)).to match_array(codes)
    end
  end

  describe 'POST #create' do
    let(:valid_params) do
      {
        invitation_code: {
          code_type: 'owner',
          max_uses: 1,
          expires_at: 30.days.from_now,
          organization_id: nil
        }
      }
    end

    context 'with valid params' do
      it 'creates invitation code' do
        expect {
          post :create, params: valid_params, format: :json
        }.to change(InvitationCode, :count).by(1)
      end

      it 'returns success response' do
        post :create, params: valid_params, format: :json
        expect(response).to have_http_status(:success)

        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be true
        expect(json_response['invitation_code']['code']).to be_present
      end

      it 'sets created_by to current user' do
        post :create, params: valid_params, format: :json
        code = InvitationCode.last
        expect(code.created_by).to eq(system_admin)
      end
    end

    context 'with invalid params' do
      let(:invalid_params) do
        {
          invitation_code: {
            code_type: 'invalid',
            max_uses: 0
          }
        }
      end

      it 'does not create invitation code' do
        expect {
          post :create, params: invalid_params, format: :json
        }.not_to change(InvitationCode, :count)
      end

      it 'returns error response' do
        post :create, params: invalid_params, format: :json
        expect(response).to have_http_status(:unprocessable_entity)

        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be false
        expect(json_response['errors']).to be_present
      end
    end
  end

  describe 'DELETE #destroy' do
    let!(:invitation_code) { create(:invitation_code, created_by: system_admin) }

    it 'deletes the invitation code' do
      expect {
        delete :destroy, params: { id: invitation_code.id }, format: :json
      }.to change(InvitationCode, :count).by(-1)
    end

    it 'returns success response' do
      delete :destroy, params: { id: invitation_code.id }, format: :json
      expect(response).to have_http_status(:success)

      json_response = JSON.parse(response.body)
      expect(json_response['success']).to be true
    end
  end

  context 'when user is not system admin' do
    before { sign_in regular_user }

    it 'redirects to root path for index' do
      get :index
      expect(response).to redirect_to(root_path)
    end

    it 'redirects to root path for create' do
      post :create, params: { invitation_code: { code_type: 'user' } }, format: :json
      expect(response).to redirect_to(root_path)
    end
  end
end
