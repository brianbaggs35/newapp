class AddOrganizationToUsers < ActiveRecord::Migration[8.0]
  def change
    # Add organization reference
    add_reference :users, :organization, null: true, foreign_key: true
    
    # Update role column to support new roles
    # Remove the old role index first
    remove_index :users, :role if index_exists?(:users, :role)
    
    # Change the role column to support new values
    change_column_default :users, :role, from: "user", to: "test_runner"
    
    # Add new index
    add_index :users, :role
    add_index :users, [:organization_id, :role]
  end
end
