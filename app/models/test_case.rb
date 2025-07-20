class TestCase < ApplicationRecord
  belongs_to :test_suite
  validates :name, presence: true
  validates :description, presence: true
  
  enum status: { pending: 0, passed: 1, failed: 2, skipped: 3, error: 4 }
  
  scope :by_status, ->(status) { where(status: status) }
  scope :recent, -> { order(executed_at: :desc) }
  
  def duration_in_seconds
    duration || 0.0
  end
  
  def has_failure?
    failed? || error?
  end
end
