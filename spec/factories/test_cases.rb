FactoryBot.define do
  factory :test_case do
    association :test_suite
    name { "Test Case #{SecureRandom.hex(4)}" }
    description { "A test case for testing" }
    project { "Test Project" }
    status { :passed }
    duration { 1.5 }
    executed_at { Time.current }

    trait :failed do
      status { :failed }
      failure_message { "Test failed due to assertion error" }
      error_type { "AssertionError" }
    end

    trait :skipped do
      status { :skipped }
      failure_message { "Test was skipped" }
    end

    trait :with_error do
      status { :error }
      failure_message { "Test failed due to runtime error" }
      error_type { "RuntimeError" }
    end
  end
end