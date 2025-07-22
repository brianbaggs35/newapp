FactoryBot.define do
  factory :test_suite do
    name { "Test Suite #{SecureRandom.hex(4)}" }
    description { "A test suite for testing" }
    project { "Test Project" }
    total_tests { 10 }
    passed_tests { 8 }
    failed_tests { 1 }
    skipped_tests { 1 }
    total_duration { 15.5 }
    executed_at { Time.current }
  end
end
