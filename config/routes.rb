Rails.application.routes.draw do
  devise_for :users, controllers: {
    registrations: 'users/registrations'
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
