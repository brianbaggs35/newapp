class InvitationCode < ApplicationRecord
  belongs_to :organization, optional: true
  belongs_to :created_by, class_name: "User"
  has_many :users, dependent: :nullify

  validates :code, presence: true, uniqueness: true
  validates :code_type, presence: true, inclusion: { in: %w[owner user] }
  validates :max_uses, presence: true, numericality: { greater_than: 0 }

  scope :active, -> { where("expires_at IS NULL OR expires_at > ?", Time.current) }
  scope :unused, -> { where("uses_count < max_uses") }
  scope :available, -> { active.unused }

  enum :code_type, {
    owner: "owner",     # For new organization owners (subscription purchasers)
    user: "user"        # For inviting users to existing organizations
  }

  def generate_code
    self.code = SecureRandom.alphanumeric(12).upcase
  end

  def available?
    !expired? && uses_count < max_uses
  end

  def expired?
    expires_at.present? && expires_at < Time.current
  end

  def use!
    return false unless available?

    increment!(:uses_count)
    true
  end

  def remaining_uses
    max_uses - uses_count
  end
end
