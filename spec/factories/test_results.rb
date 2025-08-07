FactoryBot.define do
  factory :test_result do
    sequence(:class_name) { |n| "com.example.TestClass#{n}" }
    sequence(:test_name) { |n| "testMethod#{n}" }
    status { 'passed' }
    duration { 1.5 }
    association :test_run
    association :organization

    trait :passed do
      status { 'passed' }
    end

    trait :failed do
      status { 'failed' }
      failure_message { 'Assertion failed: expected true but was false' }
      error_type { 'AssertionError' }
    end

    trait :skipped do
      status { 'skipped' }
      duration { 0.0 }
    end

    trait :with_failure_details do
      status { 'failed' }
      failure_message { 'Test assertion failed' }
      error_message { 'java.lang.AssertionError: expected:<true> but was:<false>' }
      error_type { 'AssertionError' }
      system_out { 'System output from test' }
      system_err { 'System error from test' }
    end
  end
end