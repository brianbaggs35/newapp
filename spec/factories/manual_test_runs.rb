FactoryBot.define do
  factory :manual_test_run do
    sequence(:name) { |n| "Manual Test Run #{n}" }
    description { "Manual test run description" }
    association :organization
    association :created_by, factory: :user
    status { 'planning' }

    trait :in_progress do
      status { 'in_progress' }
      started_at { 1.hour.ago }
    end

    trait :completed do
      status { 'completed' }
      started_at { 2.hours.ago }
      completed_at { 1.hour.ago }
    end

    trait :with_test_items do
      after(:create) do |test_run|
        test_cases = create_list(:manual_test_case, 5, organization: test_run.organization)
        test_cases.each do |test_case|
          create(:manual_test_run_item,
                 manual_test_run: test_run,
                 manual_test_case: test_case,
                 organization: test_run.organization)
        end
      end
    end
  end
end
