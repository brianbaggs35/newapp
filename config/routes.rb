Rails.application.routes.draw do
  devise_for :users, controllers: {
    registrations: 'users/registrations'
  }, path_names: {
    sign_up: 'register'
  }
  root "homepage#index"

  # Dashboard and user management routes
  get "/dashboard", to: "dashboard#index"
  get "/dashboard/stats", to: "dashboard#stats"

  # Organization management
  resources :organizations do
    resources :users, only: [:index, :show, :edit, :update, :destroy], controller: 'organization_users' do
      member do
        patch :change_role
      end
    end
  end

  # System Admin routes
  namespace :admin do
    resources :users do
      member do
        patch :confirm
      end
    end
    resources :organizations
  end

  # Automated Testing Routes
  namespace :automated_testing do
    resources :uploads, only: [:index, :new, :create, :update, :destroy], param: :uuid do
      collection do
        post :process_xml
      end
    end
    resources :test_results, only: [:index, :show], param: :uuid do
      collection do
        get :search
      end
    end
    resources :failure_analysis, param: :uuid do
      member do
        patch :update_status
        patch :assign
      end
    end
    resources :reports, only: [:index, :show] do
      collection do
        post :generate
        get :preview
      end
    end
  end

  # Manual Testing Routes
  namespace :manual_testing do
    resources :test_cases, param: :uuid do
      collection do
        get :search
        post :bulk_update
      end
      member do
        patch :move_to_suite
      end
    end
    resources :test_suites, param: :uuid
    resources :test_runs, param: :uuid do
      resources :items, controller: 'test_run_items', param: :uuid do
        member do
          patch :update_status
        end
      end
    end
    resources :reports, only: [:index, :show] do
      collection do
        post :generate
        get :preview
      end
    end
  end

  # Settings Routes
  namespace :settings do
    resource :organization, only: [:show, :edit, :update] do
      resources :users, except: [:new, :create] do
        member do
          patch :change_role
          delete :remove
        end
      end
      resources :invitations, only: [:index, :create, :destroy]
    end
    resource :profile, only: [:show, :edit, :update]
    resource :password, only: [:edit, :update]
  end

  # API Routes
  namespace :api do
    resources :test_runs, only: [:index, :show], param: :uuid
    resources :test_results, only: [:index, :show], param: :uuid
    resources :manual_test_cases, param: :uuid
    resources :manual_test_runs, param: :uuid
    namespace :reports do
      post :automated_test
      post :manual_test
    end
  end

  get "newlink", to: "homepage#index"

  # Legacy routes (to be removed)
  resources :tests, only: [ :index, :show, :destroy ]
  resources :manual_test_cases
  resources :test_executions
  resources :test_execution_cycles
  resources :reports, only: [] do
    collection do
      get :test_execution
      post :export
    end
  end

  # Health check
  get "up" => "rails/health#show", as: :rails_health_check
end
