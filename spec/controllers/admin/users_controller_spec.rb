require 'rails_helper'

RSpec.describe Admin::UsersController, type: :controller do
  let(:admin_user) { create(:user, :admin) }
  let(:regular_user) { create(:user, :user) }
  let(:target_user) { create(:user, :user) }

  before do
    sign_in admin_user  # Using Devise test helpers
  end

  describe 'security - mass assignment protection' do
    context 'when admin updates user' do
      it 'allows admin to update role' do
        put :update, params: {
          id: target_user.id,
          user: { email: 'newemail@example.com', role: 'admin' }
        }

        expect(response).to have_http_status(:success)
        target_user.reload
        expect(target_user.role).to eq('admin')
        expect(target_user.email).to eq('newemail@example.com')
      end

      it 'allows email updates without role change' do
        original_role = target_user.role
        put :update, params: {
          id: target_user.id,
          user: { email: 'newemail@example.com' }
        }

        expect(response).to have_http_status(:success)
        target_user.reload
        expect(target_user.email).to eq('newemail@example.com')
        expect(target_user.role).to eq(original_role)
      end
    end

    context 'when non-admin tries to access' do
      before do
        sign_out admin_user
        sign_in regular_user
      end

      it 'redirects to root path' do
        put :update, params: {
          id: target_user.id,
          user: { role: 'admin' }
        }

        expect(response).to redirect_to(root_path)
      end
    end
  end

  describe 'CRUD operations' do
    describe 'GET #index' do
      it 'returns all users' do
        get :index
        expect(response).to have_http_status(:success)

        json_response = JSON.parse(response.body)
        expect(json_response).to be_an(Array)
        expect(json_response.length).to be >= 2  # admin + target user
      end
    end

    describe 'POST #create' do
      it 'creates a new user with role when admin' do
        user_params = {
          email: 'newuser@example.com',
          role: 'user',
          password: 'password123',
          password_confirmation: 'password123'
        }

        expect {
          post :create, params: { user: user_params }
        }.to change(User, :count).by(1)

        expect(response).to have_http_status(:created)
        new_user = User.find_by(email: 'newuser@example.com')
        expect(new_user.role).to eq('user')
      end
    end

    describe 'PATCH #confirm' do
      it 'confirms user account' do
        unconfirmed_user = create(:user, :user, confirmed_at: nil)

        patch :confirm, params: { id: unconfirmed_user.id }

        expect(response).to have_http_status(:success)
        unconfirmed_user.reload
        expect(unconfirmed_user.confirmed?).to be_truthy
      end
    end

    describe 'DELETE #destroy' do
      it 'deletes the user' do
        user_to_delete = create(:user, :user)

        expect {
          delete :destroy, params: { id: user_to_delete.id }
        }.to change(User, :count).by(-1)

        expect(response).to have_http_status(:no_content)
      end
    end
  end
end
