FactoryBot.define do
  factory :organization do
    sequence(:name) { |n| "Test Organization #{n}" }
    description { "A test organization for running tests" }
    active { true }
  end
end
