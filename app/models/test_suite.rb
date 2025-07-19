class TestSuite < ApplicationRecord
  has_many :test_cases
  validates :name, presence: true
  validates :description, presence: true
end
