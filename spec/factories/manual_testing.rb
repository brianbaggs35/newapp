FactoryBot.define do
  factory :manual_test_case do
    title { "Test Case #{SecureRandom.hex(4)}" }
    description { "Description for test case" }
    preconditions { "User must be logged in" }
    steps { "1. Navigate to page\n2. Click button\n3. Verify result" }
    expected_result { "Expected result description" }
    priority { "medium" }
    status { "approved" }
    category { "Functional" }
    tags { "smoke, regression" }
    estimated_time { 15 }
    
    association :organization
    association :created_by, factory: :user
    association :updated_by, factory: :user
  end

  factory :test_execution do
    status { "pending" }
    actual_result { nil }
    notes { nil }
    execution_time { nil }
    executed_at { Time.current }
    
    association :manual_test_case
    association :executed_by, factory: :user
    association :organization
  end

  factory :test_execution_cycle do
    name { "Test Cycle #{SecureRandom.hex(4)}" }
    description { "Test execution cycle description" }
    status { "planned" }
    planned_start_date { 1.week.from_now }
    planned_end_date { 2.weeks.from_now }
    environment_details { "Test environment details" }
    entry_criteria { "All features are developed" }
    exit_criteria { "All tests pass with 95% success rate" }
    
    association :organization
    association :created_by, factory: :user
  end
end