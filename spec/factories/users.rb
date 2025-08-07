FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "password123" }
    password_confirmation { "password123" }
    role { "member" }
    confirmed_at { Time.current }
    association :organization

    trait :system_admin do
      role { "system_admin" }
      organization { nil }
    end

    trait :owner do
      role { "owner" }
      association :organization
    end

    trait :admin do
      role { "admin" }
      association :organization
    end

    trait :member do
      role { "member" }
      association :organization
    end
  end
end
