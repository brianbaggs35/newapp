class AddTestSuiteToTestCasesAndTestResults < ActiveRecord::Migration[8.0]
  def change
    # Add foreign key to link test cases to test suites
    add_reference :test_cases, :test_suite, null: true, foreign_key: true

    # Add fields for test execution results
    add_column :test_cases, :status, :string, default: 'pending'
    add_column :test_cases, :duration, :float
    add_column :test_cases, :failure_message, :text
    add_column :test_cases, :error_type, :string
    add_column :test_cases, :executed_at, :datetime

    # Add fields to test suites for overall results
    add_column :test_suites, :total_tests, :integer, default: 0
    add_column :test_suites, :passed_tests, :integer, default: 0
    add_column :test_suites, :failed_tests, :integer, default: 0
    add_column :test_suites, :skipped_tests, :integer, default: 0
    add_column :test_suites, :total_duration, :float, default: 0.0
    add_column :test_suites, :executed_at, :datetime
  end
end
