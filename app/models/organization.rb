class Organization < ApplicationRecord
  has_many :users, dependent: :restrict_with_error
  has_many :test_suites, dependent: :destroy
  has_many :test_cases, through: :test_suites
  has_many :manual_test_cases, dependent: :destroy
  has_many :test_executions, dependent: :destroy
  has_many :test_execution_cycles, dependent: :destroy

  validates :name, presence: true, uniqueness: true, length: { minimum: 2, maximum: 100 }
  validates :description, length: { maximum: 1000 }

  scope :active, -> { where(active: true) }

  def owner
    users.find_by(role: 'test_owner')
  end

  def managers
    users.where(role: ['test_owner', 'test_manager'])
  end

  def members
    users.where(role: 'test_runner')
  end

  def deactivate!
    update!(active: false)
  end

  def activate!
    update!(active: true)
  end
end
