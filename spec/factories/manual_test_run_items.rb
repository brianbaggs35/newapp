FactoryBot.define do
  factory :manual_test_run_item do
    association :manual_test_run
    association :manual_test_case
    association :organization
    status { 'to_do' }

    trait :in_progress do
      status { 'in_progress' }
      association :executed_by, factory: :user
    end

    trait :passed do
      status { 'passed' }
      association :executed_by, factory: :user
      actual_results { 'Test passed as expected' }
      execution_time { 15.5 }
      executed_at { Time.current }
    end

    trait :failed do
      status { 'failed' }
      association :executed_by, factory: :user
      failure_information { 'Test failed due to incorrect data' }
      execution_time { 10.0 }
      executed_at { Time.current }
    end

    trait :blocked do
      status { 'blocked' }
      association :executed_by, factory: :user
      failure_information { 'Unable to execute due to environment issues' }
    end
  end
end