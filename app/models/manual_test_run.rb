class ManualTestRun < ApplicationRecord
  belongs_to :organization
  belongs_to :created_by, class_name: 'User'
  has_many :manual_test_run_items, dependent: :destroy
  has_many :manual_test_cases, through: :manual_test_run_items

  validates :name, presence: true, length: { minimum: 1, maximum: 255 }
  validates :status, inclusion: { in: %w[planning in_progress completed cancelled] }

  scope :active, -> { where.not(status: 'cancelled') }
  scope :in_progress, -> { where(status: 'in_progress') }
  scope :completed, -> { where(status: 'completed') }

  def to_do_count
    manual_test_run_items.where(status: 'to_do').count
  end

  def in_progress_count
    manual_test_run_items.where(status: 'in_progress').count
  end

  def blocked_count
    manual_test_run_items.where(status: 'blocked').count
  end

  def failed_count
    manual_test_run_items.where(status: 'failed').count
  end

  def passed_count
    manual_test_run_items.where(status: 'passed').count
  end

  def total_count
    manual_test_run_items.count
  end

  def completion_percentage
    return 0 if total_count.zero?
    completed_items = passed_count + failed_count
    (completed_items.to_f / total_count * 100).round(2)
  end

  def success_rate
    return 0 if (passed_count + failed_count).zero?
    (passed_count.to_f / (passed_count + failed_count) * 100).round(2)
  end
end