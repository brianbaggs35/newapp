class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable

  belongs_to :organization, optional: true
  has_many :created_manual_test_cases, class_name: 'ManualTestCase', foreign_key: 'created_by_id'
  has_many :updated_manual_test_cases, class_name: 'ManualTestCase', foreign_key: 'updated_by_id'
  has_many :test_executions, foreign_key: 'executed_by_id'
  has_many :created_test_execution_cycles, class_name: 'TestExecutionCycle', foreign_key: 'created_by_id'

  validates :email, presence: true, uniqueness: true
  validates :role, inclusion: { in: %w[system_admin test_owner test_manager test_runner] }
  validate :organization_required_for_non_system_admin
  validate :only_one_owner_per_organization

  # Role helper methods
  def system_admin?
    role == 'system_admin'
  end

  def test_owner?
    role == 'test_owner'
  end

  def test_manager?
    role == 'test_manager'
  end

  def test_runner?
    role == 'test_runner'
  end

  def admin?
    # Backwards compatibility - system admins are admins
    system_admin?
  end

  def can_manage_organization?
    test_owner? || test_manager?
  end

  def can_manage_users?
    test_owner? || test_manager?
  end

  def can_manage_all_organizations?
    system_admin?
  end

  private

  def organization_required_for_non_system_admin
    if !system_admin? && organization.nil?
      errors.add(:organization, 'is required for non-system admin users')
    end
  end

  def only_one_owner_per_organization
    if test_owner? && organization.present?
      existing_owner = organization.users.where(role: 'test_owner').where.not(id: id).first
      if existing_owner.present?
        errors.add(:role, 'organization can only have one owner')
      end
    end
  end
end
