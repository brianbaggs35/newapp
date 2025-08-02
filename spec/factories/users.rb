FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "password123" }
    password_confirmation { "password123" }
    role { "user" }
    confirmed_at { Time.current }

    trait :admin do
      role { "admin" }
    end

    trait :user do
      role { "user" }
    end
  end
end
