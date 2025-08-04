class AddOrganizationToTestSuites < ActiveRecord::Migration[8.0]
  def change
    add_reference :test_suites, :organization, null: false, foreign_key: true
    add_index :test_suites, [:organization_id, :name]
  end
end
