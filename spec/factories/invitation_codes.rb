FactoryBot.define do
  factory :invitation_code do
    code { SecureRandom.alphanumeric(12).upcase }
    code_type { 'user' }
    max_uses { 1 }
    uses_count { 0 }
    expires_at { 30.days.from_now }
    association :created_by, factory: :user

    trait :owner_type do
      code_type { 'owner' }
    end

    trait :expired do
      expires_at { 1.day.ago }
    end

    trait :used do
      max_uses { 1 }
      uses_count { 1 }
    end

    trait :with_organization do
      association :organization
    end
  end
end
