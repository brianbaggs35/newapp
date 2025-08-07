require 'rails_helper'

RSpec.describe OnboardingController, type: :controller do
  let(:user) { create(:user, role: 'owner', onboarding_completed: false) }
  let(:completed_user) { create(:user, role: 'owner', onboarding_completed: true) }

  before { sign_in user }

  describe 'GET #show' do
    context 'when user has not completed onboarding' do
      it 'returns success for organization step' do
        get :show, params: { step: 'organization' }
        expect(response).to have_http_status(:success)
        expect(assigns(:current_step)).to eq('organization')
      end

      it 'redirects to organization step if no step specified' do
        get :show
        expect(assigns(:current_step)).to eq('organization')
      end

      it 'redirects to organization step for invalid steps' do
        get :show, params: { step: 'profile' }
        expect(response).to redirect_to(onboarding_path(step: 'organization'))
      end
    end

    context 'when user has completed onboarding' do
      before { sign_in completed_user }

      it 'redirects to dashboard' do
        get :show
        expect(response).to redirect_to(dashboard_path)
      end
    end
  end

  describe 'PATCH #update_organization' do
    let(:organization_params) do
      {
        organization: {
          name: 'Test Organization',
          description: 'A test organization',
          industry: 'Technology',
          size: '10-50'
        }
      }
    end

    context 'when user has no organization' do
      it 'creates new organization and assigns user as owner' do
        expect {
          patch :update_organization, params: organization_params, format: :json
        }.to change(Organization, :count).by(1)

        user.reload
        expect(user.organization.name).to eq('Test Organization')
        expect(user.role).to eq('owner')
      end

      it 'returns success response' do
        patch :update_organization, params: organization_params, format: :json
        expect(response).to have_http_status(:success)

        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be true
        expect(json_response['next_step']).to eq('profile')
      end
    end

    context 'when user already has organization' do
      let!(:existing_org) { create(:organization, name: 'Existing Org') }
      let(:user_with_org) { create(:user, role: 'owner', organization: existing_org, onboarding_completed: false) }

      before { sign_in user_with_org }

      it 'updates existing organization' do
        patch :update_organization, params: organization_params, format: :json

        existing_org.reload
        expect(existing_org.name).to eq('Test Organization')
      end
    end

    context 'with invalid params' do
      let(:invalid_params) do
        {
          organization: {
            name: '', # blank name
            description: 'A test organization'
          }
        }
      end

      it 'returns error response' do
        patch :update_organization, params: invalid_params, format: :json
        expect(response).to have_http_status(:unprocessable_entity)

        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be false
        expect(json_response['errors']).to be_present
      end
    end
  end

  describe 'PATCH #update_profile' do
    let(:profile_params) do
      {
        user: {
          first_name: 'John',
          last_name: 'Doe',
          phone: '+1234567890',
          job_title: 'QA Manager'
        }
      }
    end

    it 'updates user profile' do
      patch :update_profile, params: profile_params, format: :json

      user.reload
      expect(user.first_name).to eq('John')
      expect(user.last_name).to eq('Doe')
      expect(user.phone).to eq('+1234567890')
      expect(user.job_title).to eq('QA Manager')
    end

    it 'returns success response' do
      patch :update_profile, params: profile_params, format: :json
      expect(response).to have_http_status(:success)

      json_response = JSON.parse(response.body)
      expect(json_response['success']).to be true
      expect(json_response['next_step']).to eq('team')
    end

    context 'with invalid params' do
      let(:invalid_params) do
        {
          user: {
            email: 'invalid-email' # invalid email format
          }
        }
      end

      it 'returns error response' do
        patch :update_profile, params: invalid_params, format: :json
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'POST #complete' do
    it 'marks onboarding as completed' do
      post :complete

      user.reload
      expect(user.onboarding_completed?).to be true
    end

    it 'redirects to dashboard with notice' do
      post :complete
      expect(response).to redirect_to(dashboard_path)
      expect(flash[:notice]).to include('Welcome to QA Platform')
    end
  end

  context 'when user is not signed in' do
    before { sign_out user }

    it 'redirects to sign in page' do
      get :show
      expect(response).to redirect_to(new_user_session_path)
    end
  end
end
