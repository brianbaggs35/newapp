class TestSuite < ApplicationRecord
  belongs_to :organization
  belongs_to :created_by, class_name: "User", optional: true
  has_many :test_cases, dependent: :destroy
  has_many :manual_test_cases, dependent: :destroy

  validates :name, presence: true, length: { minimum: 1, maximum: 255 }
  validates :project, presence: true, length: { minimum: 1, maximum: 255 }
  validates :description, length: { maximum: 1000 }

  scope :recent, -> { order(executed_at: :desc, created_at: :desc) }
  scope :for_organization, ->(org) { where(organization: org) }

  enum :status, { pending: 0, running: 1, completed: 2, failed: 3 }

  def success_rate
    return 0 if total_tests == 0
    (passed_tests.to_f / total_tests * 100).round(2)
  end

  def passed_percentage
    return 0 if total_tests == 0
    (passed_tests.to_f / total_tests * 100).round(2)
  end

  def failed_percentage
    return 0 if total_tests == 0
    (failed_tests.to_f / total_tests * 100).round(2)
  end

  def skipped_percentage
    return 0 if total_tests == 0
    (skipped_tests.to_f / total_tests * 100).round(2)
  end

  def test_status
    if failed_tests > 0
      "failed"
    elsif skipped_tests > 0
      "partial"
    else
      "passed"
    end
  end

  def update_statistics!
    self.total_tests = test_cases.count
    self.passed_tests = test_cases.where(status: "passed").count
    self.failed_tests = test_cases.where(status: "failed").count
    self.skipped_tests = test_cases.where(status: "skipped").count
    self.total_duration = test_cases.sum(:duration) || 0.0
    save!
  end

  def manual_test_case_count
    manual_test_cases.count
  end

  def automated_test_case_count
    test_cases.count
  end

  def all_test_case_count
    manual_test_case_count + automated_test_case_count
  end
end
