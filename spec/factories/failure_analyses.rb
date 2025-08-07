FactoryBot.define do
  factory :failure_analysis do
    association :test_result
    association :organization
    association :created_by, factory: :user
    status { 'to_do' }
    priority { 'medium' }
    notes { 'Initial analysis notes' }

    trait :in_progress do
      status { 'in_progress' }
      association :assigned_to, factory: :user
    end

    trait :fixed do
      status { 'fixed' }
      association :assigned_to, factory: :user
      resolution_notes { 'Fixed by updating test data' }
      resolved_at { Time.current }
    end

    trait :high_priority do
      priority { 'high' }
    end

    trait :critical_priority do
      priority { 'critical' }
    end
  end
end