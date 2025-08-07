require 'rails_helper'

RSpec.describe Admin::DashboardController, type: :controller do
  let(:system_admin) { create(:user, role: 'system_admin') }
  let(:regular_user) { create(:user, role: 'member') }

  describe 'GET #index' do
    context 'when user is system admin' do
      before { sign_in system_admin }

      it 'returns success' do
        get :index
        expect(response).to have_http_status(:success)
      end

      it 'assigns stats' do
        create_list(:user, 3)
        create_list(:organization, 2)
        
        get :index
        expect(assigns(:stats)).to include(
          :total_users,
          :total_organizations,
          :users_this_month,
          :organizations_this_month
        )
      end
    end

    context 'when user is not system admin' do
      before { sign_in regular_user }

      it 'redirects to root path' do
        get :index
        expect(response).to redirect_to(root_path)
      end
    end

    context 'when user is not signed in' do
      it 'redirects to sign in page' do
        get :index
        expect(response).to redirect_to(new_user_session_path)
      end
    end
  end
end