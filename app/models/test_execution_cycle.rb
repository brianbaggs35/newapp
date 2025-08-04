class TestExecutionCycle < ApplicationRecord
  belongs_to :organization
  belongs_to :created_by, class_name: 'User'
  has_many :test_executions, dependent: :destroy
  has_many :manual_test_cases, through: :test_executions

  validates :name, presence: true, length: { minimum: 3, maximum: 255 }
  validates :status, inclusion: { in: %w[planned active completed archived] }

  enum :status, { planned: 'planned', active: 'active', completed: 'completed', archived: 'archived' }

  scope :recent, -> { order(created_at: :desc) }
  scope :by_status, ->(status) { where(status: status) }
  scope :for_organization, ->(org) { where(organization: org) }
  scope :current, -> { where(status: %w[planned active]) }

  def total_test_cases
    test_executions.joins(:manual_test_case).distinct.count('manual_test_cases.id')
  end

  def total_executions
    test_executions.count
  end

  def passed_executions
    test_executions.passed.count
  end

  def failed_executions
    test_executions.failed.count
  end

  def blocked_executions
    test_executions.blocked.count
  end

  def pending_executions
    test_executions.pending.count
  end

  def in_progress_executions
    test_executions.in_progress.count
  end

  def completion_percentage
    return 0 if total_executions == 0
    completed_count = test_executions.completed.count
    (completed_count.to_f / total_executions * 100).round(2)
  end

  def pass_rate
    return 0 if test_executions.completed.count == 0
    passed_count = test_executions.passed.count
    completed_count = test_executions.completed.count
    (passed_count.to_f / completed_count * 100).round(2)
  end

  def average_execution_time
    executions_with_time = test_executions.where.not(execution_time: nil)
    return 0 if executions_with_time.count == 0
    executions_with_time.average(:execution_time).round(2)
  end

  def is_overdue?
    return false unless planned_end_date
    Date.current > planned_end_date.to_date && !completed?
  end

  def days_remaining
    return nil unless planned_end_date
    (planned_end_date.to_date - Date.current).to_i
  end

  def execution_summary
    {
      total_test_cases: total_test_cases,
      total_executions: total_executions,
      passed: passed_executions,
      failed: failed_executions,
      blocked: blocked_executions,
      pending: pending_executions,
      in_progress: in_progress_executions,
      completion_percentage: completion_percentage,
      pass_rate: pass_rate,
      average_execution_time: average_execution_time,
      is_overdue: is_overdue?,
      days_remaining: days_remaining
    }
  end

  def can_be_started?
    planned? && (planned_start_date.nil? || planned_start_date <= Date.current)
  end

  def can_be_completed?
    active? && completion_percentage >= 100
  end
end