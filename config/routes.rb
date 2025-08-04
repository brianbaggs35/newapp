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

  # User management routes (admin only)
  namespace :admin do
    resources :users do
      member do
        patch :confirm
      end
    end
    resources :organizations
  end

  get "newlink", to: "homepage#index"

  # Test management routes
  resources :tests, only: [ :index, :show, :destroy ] do
    collection do
      post :import
      get :statistics
    end
  end

  # Manual Testing Routes
  resources :manual_test_cases do
    collection do
      get :statistics
      patch :bulk_update_status
    end
  end

  resources :test_executions do
    member do
      patch :update_status
    end
    collection do
      get :statistics
    end
  end

  resources :test_execution_cycles

  # API Routes for manual testing
  namespace :api do
    resources :manual_test_cases do
      collection do
        get :statistics
        patch :bulk_update_status
      end
    end

    resources :test_executions do
      member do
        patch :update_status
      end
      collection do
        get :statistics
      end
    end

    resources :test_execution_cycles

    namespace :reports do
      get :test_execution
      post :export
    end
  end

  # Reports
  resources :reports, only: [] do
    collection do
      get :test_execution
      post :export
    end
  end

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
end
