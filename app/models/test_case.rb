class TestCase < ApplicationRecord
  belongs_to :test_suite
  validates :name, presence: true
  validates :description, presence: true
end
