class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  # Use UUID as primary key for all models
  self.implicit_order_column = "created_at"
  
  def to_param
    uuid
  end
end
