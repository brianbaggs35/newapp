class TestCase < ApplicationRecord
  belongs_to :test_suite
  has_one :organization, through: :test_suite

  validates :name, presence: true, length: { minimum: 1, maximum: 255 }
  validates :description, presence: true

  enum :status, { pending: 0, passed: 1, failed: 2, skipped: 3, error: 4 }

  scope :by_status, ->(status) { where(status: status) }
  scope :recent, -> { order(executed_at: :desc) }
  scope :for_organization, ->(org) { joins(:test_suite).where(test_suites: { organization: org }) }

  def duration_in_seconds
    duration || 0.0
  end

  def has_failure?
    failed? || error?
  end

  def has_failure_details?
    failure_message.present? || error_type.present?
  end
end
