class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable

  belongs_to :organization, optional: true
  belongs_to :invitation_code, optional: true
  has_many :created_manual_test_cases, class_name: 'ManualTestCase', foreign_key: 'created_by_id'
  has_many :updated_manual_test_cases, class_name: 'ManualTestCase', foreign_key: 'updated_by_id'
  has_many :test_executions, foreign_key: 'executed_by_id'
  has_many :created_test_execution_cycles, class_name: 'TestExecutionCycle', foreign_key: 'created_by_id'
  has_many :created_invitation_codes, class_name: 'InvitationCode', foreign_key: 'created_by_id'

  validates :email, presence: true, uniqueness: true
  validates :role, inclusion: { in: %w[system_admin owner admin member] }
  validate :organization_required_for_non_system_admin
  validate :only_one_owner_per_organization

  # Role helper methods based on requirements
  def system_admin?
    role == 'system_admin'
  end

  def owner?
    role == 'owner'
  end

  def admin?
    role == 'admin'
  end

  def member?
    role == 'member'
  end

  def can_manage_organization?
    owner? || admin?
  end

  def can_invite_owners?
    owner?
  end

  def can_invite_users?
    owner? || admin?
  end

  def can_manage_all_organizations?
    system_admin?
  end

  def can_see_organization_management?
    owner? || admin?
  end

  def onboarding_completed?
    onboarding_completed
  end

  def full_name
    [first_name, last_name].compact.join(' ').presence || email
  end

  private

  def organization_required_for_non_system_admin
    if !system_admin? && organization.nil?
      errors.add(:organization, 'is required for non-system admin users')
    end
  end

  def only_one_owner_per_organization
    if owner? && organization.present?
      existing_owner = organization.users.where(role: 'owner').where.not(id: id).first
      if existing_owner.present?
        errors.add(:role, 'organization can only have one owner')
      end
    end
  end
end
