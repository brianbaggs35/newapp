FactoryBot.define do
  factory :test_run do
    sequence(:name) { |n| "Test Run #{n}" }
    description { "Test run description" }
    association :organization
    association :created_by, factory: :user
    status { 'pending' }
    total_tests { 0 }
    passed_tests { 0 }
    failed_tests { 0 }
    skipped_tests { 0 }
    duration { 0.0 }

    trait :completed do
      status { 'completed' }
      total_tests { 10 }
      passed_tests { 8 }
      failed_tests { 1 }
      skipped_tests { 1 }
      duration { 120.5 }
      completed_at { Time.current }
    end

    trait :failed do
      status { 'failed' }
    end

    trait :with_results do
      after(:create) do |test_run|
        create_list(:test_result, 3, test_run: test_run, organization: test_run.organization, status: 'passed')
        create_list(:test_result, 2, test_run: test_run, organization: test_run.organization, status: 'failed')
        create_list(:test_result, 1, test_run: test_run, organization: test_run.organization, status: 'skipped')

        test_run.update!(
          total_tests: test_run.test_results.count,
          passed_tests: test_run.test_results.passed.count,
          failed_tests: test_run.test_results.failed.count,
          skipped_tests: test_run.test_results.skipped.count
        )
      end
    end
  end
end
