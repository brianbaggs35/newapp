class TestExecution < ApplicationRecord
  belongs_to :manual_test_case
  belongs_to :executed_by, class_name: "User"
  belongs_to :organization
  belongs_to :test_execution_cycle, optional: true

  validates :status, inclusion: { in: %w[pending in_progress passed failed blocked] }
  validates :execution_time, numericality: { greater_than: 0 }, allow_nil: true

  enum :status, {
    pending: "pending",
    in_progress: "in_progress",
    passed: "passed",
    failed: "failed",
    blocked: "blocked"
  }

  scope :recent, -> { order(executed_at: :desc) }
  scope :by_status, ->(status) { where(status: status) }
  scope :by_executor, ->(user) { where(executed_by: user) }
  scope :for_organization, ->(org) { where(organization: org) }
  scope :in_date_range, ->(start_date, end_date) { where(executed_at: start_date..end_date) }
  scope :completed, -> { where(status: %w[passed failed blocked]) }
  scope :active, -> { where(status: %w[pending in_progress]) }

  before_save :set_execution_timestamps
  after_update :update_test_case_status, if: :saved_change_to_status?

  def screenshots_list
    return [] if screenshots_urls.blank?
    JSON.parse(screenshots_urls)
  rescue JSON::ParserError
    []
  end

  def screenshots_list=(urls)
    self.screenshots_urls = urls.to_json if urls.is_a?(Array)
  end

  def duration_minutes
    return nil unless started_at && completed_at
    ((completed_at - started_at) / 1.minute).round(2)
  end

  def is_completed?
    %w[passed failed blocked].include?(status)
  end

  def is_successful?
    status == "passed"
  end

  def has_defect?
    defect_id.present?
  end

  def execution_summary
    {
      test_case_title: manual_test_case.title,
      executor: executed_by.email,
      status: status,
      execution_time: execution_time,
      executed_at: executed_at,
      has_defect: has_defect?,
      defect_id: defect_id
    }
  end

  private

  def set_execution_timestamps
    case status
    when "in_progress"
      self.started_at ||= Time.current
      self.executed_at ||= Time.current
    when "passed", "failed", "blocked"
      self.completed_at ||= Time.current
      self.executed_at ||= Time.current
    end
  end

  def update_test_case_status
    # Optional: Update test case status based on recent execution results
    # This could be used to automatically update test case status based on execution patterns
  end
end
