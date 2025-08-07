class TestResult < ApplicationRecord
  belongs_to :test_run
  belongs_to :organization
  
  validates :class_name, presence: true
  validates :test_name, presence: true
  validates :status, inclusion: { in: %w[passed failed skipped] }
  validates :duration, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true

  scope :passed, -> { where(status: 'passed') }
  scope :failed, -> { where(status: 'failed') }
  scope :skipped, -> { where(status: 'skipped') }
  scope :with_failures, -> { where.not(failure_message: nil) }

  def duration_ms
    return 0 if duration.nil?
    (duration * 1000).round
  end

  def has_failure?
    status == 'failed' && failure_message.present?
  end

  def has_error?
    error_type.present? || error_message.present?
  end
end