class ManualTestRunItem < ApplicationRecord
  belongs_to :manual_test_run
  belongs_to :manual_test_case
  belongs_to :organization
  belongs_to :executed_by, class_name: 'User', optional: true

  validates :status, inclusion: { in: %w[to_do in_progress blocked failed passed] }
  validates :actual_results, presence: true, if: -> { status == 'passed' }
  validates :failure_information, presence: true, if: -> { %w[blocked failed].include?(status) }

  scope :to_do, -> { where(status: 'to_do') }
  scope :in_progress, -> { where(status: 'in_progress') }
  scope :blocked, -> { where(status: 'blocked') }
  scope :failed, -> { where(status: 'failed') }
  scope :passed, -> { where(status: 'passed') }
  scope :completed, -> { where(status: ['passed', 'failed']) }

  def completed?
    %w[passed failed].include?(status)
  end

  def can_move_to_status?(new_status)
    return false if status == new_status
    
    case status
    when 'to_do'
      %w[in_progress].include?(new_status)
    when 'in_progress'
      %w[to_do blocked failed passed].include?(new_status)
    when 'blocked'
      %w[to_do in_progress].include?(new_status)
    when 'failed'
      %w[to_do in_progress].include?(new_status)
    when 'passed'
      %w[to_do in_progress].include?(new_status)
    else
      false
    end
  end
end