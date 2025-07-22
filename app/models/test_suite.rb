class TestSuite < ApplicationRecord
  has_many :test_cases, dependent: :destroy
  validates :name, presence: true
  validates :description, presence: true

  enum :status, { pending: 0, running: 1, completed: 2, failed: 3 }

  def success_rate
    return 0 if total_tests == 0
    (passed_tests.to_f / total_tests * 100).round(2)
  end

  def update_statistics!
    self.total_tests = test_cases.count
    self.passed_tests = test_cases.where(status: "passed").count
    self.failed_tests = test_cases.where(status: "failed").count
    self.skipped_tests = test_cases.where(status: "skipped").count
    self.total_duration = test_cases.sum(:duration) || 0.0
    save!
  end
end
