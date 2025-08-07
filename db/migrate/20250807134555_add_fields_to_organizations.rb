class AddFieldsToOrganizations < ActiveRecord::Migration[8.0]
  def change
    add_column :organizations, :industry, :string
    add_column :organizations, :size, :string
    add_reference :organizations, :created_by, foreign_key: { to_table: :users }, null: true
  end
end
