class TestRun < ApplicationRecord
  belongs_to :organization
  belongs_to :created_by, class_name: "User"
  has_many :test_results, dependent: :destroy
  has_one_attached :xml_file

  validates :name, presence: true, length: { minimum: 1, maximum: 255 }
  validates :status, inclusion: { in: %w[pending processing completed failed] }

  scope :completed, -> { where(status: "completed") }
  scope :failed, -> { where(status: "failed") }
  scope :recent, -> { order(created_at: :desc) }

  def passed_count
    test_results.where(status: "passed").count
  end

  def failed_count
    test_results.where(status: "failed").count
  end

  def skipped_count
    test_results.where(status: "skipped").count
  end

  def total_count
    test_results.count
  end

  def success_rate
    return 0 if total_count.zero?
    (passed_count.to_f / total_count * 100).round(2)
  end

  def duration_formatted
    return "0s" if duration.nil?

    hours = duration / 3600
    minutes = (duration % 3600) / 60
    seconds = duration % 60

    if hours > 0
      "#{hours}h #{minutes}m #{seconds}s"
    elsif minutes > 0
      "#{minutes}m #{seconds}s"
    else
      "#{seconds}s"
    end
  end
end
