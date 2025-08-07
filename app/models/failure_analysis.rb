class FailureAnalysis < ApplicationRecord
  belongs_to :test_result
  belongs_to :organization
  belongs_to :assigned_to, class_name: 'User', optional: true
  belongs_to :created_by, class_name: 'User'
  belongs_to :updated_by, class_name: 'User', optional: true

  validates :status, inclusion: { in: %w[to_do in_progress fixed] }
  validates :priority, inclusion: { in: %w[low medium high critical] }

  scope :to_do, -> { where(status: 'to_do') }
  scope :in_progress, -> { where(status: 'in_progress') }
  scope :fixed, -> { where(status: 'fixed') }
  scope :by_priority, ->(priority) { where(priority: priority) }

  def can_move_to_status?(new_status)
    case status
    when 'to_do'
      %w[in_progress].include?(new_status)
    when 'in_progress'
      %w[to_do fixed].include?(new_status)
    when 'fixed'
      %w[to_do in_progress].include?(new_status)
    else
      false
    end
  end
end