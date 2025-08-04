class ManualTestCase < ApplicationRecord
  belongs_to :organization
  belongs_to :created_by, class_name: 'User'
  belongs_to :updated_by, class_name: 'User', optional: true
  has_many :test_executions, dependent: :destroy
  has_many :executors, through: :test_executions, source: :executed_by

  validates :title, presence: true, length: { minimum: 3, maximum: 255 }
  validates :steps, presence: true
  validates :expected_result, presence: true
  validates :priority, inclusion: { in: %w[critical high medium low] }
  validates :status, inclusion: { in: %w[draft review approved deprecated] }
  validates :estimated_time, numericality: { greater_than: 0 }, allow_nil: true

  enum :priority, { critical: 'critical', high: 'high', medium: 'medium', low: 'low' }
  enum :status, { draft: 'draft', review: 'review', approved: 'approved', deprecated: 'deprecated' }

  scope :by_priority, ->(priority) { where(priority: priority) }
  scope :by_status, ->(status) { where(status: status) }
  scope :by_category, ->(category) { where(category: category) }
  scope :recent, -> { order(created_at: :desc) }
  scope :for_organization, ->(org) { where(organization: org) }

  def tags_array
    return [] if tags.blank?
    tags.split(',').map(&:strip).reject(&:blank?)
  end

  def tags_array=(tag_list)
    self.tags = tag_list.join(', ') if tag_list.is_a?(Array)
  end

  def latest_execution
    test_executions.order(executed_at: :desc).first
  end

  def execution_history
    test_executions.order(executed_at: :desc)
  end

  def pass_rate
    return 0 if test_executions.count == 0
    passed_count = test_executions.passed.count
    (passed_count.to_f / test_executions.count * 100).round(2)
  end

  def average_execution_time
    executions_with_time = test_executions.where.not(execution_time: nil)
    return nil if executions_with_time.count == 0
    executions_with_time.average(:execution_time).round(2)
  end

  def can_be_executed?
    approved?
  end

  def ready_for_execution?
    approved? && steps.present? && expected_result.present?
  end
end