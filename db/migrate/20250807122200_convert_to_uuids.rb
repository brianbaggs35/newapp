class ConvertToUuids < ActiveRecord::Migration[8.0]
  def up
    # Create new UUID columns for all tables
    add_column :users, :uuid, :uuid, default: "gen_random_uuid()", null: false
    add_column :organizations, :uuid, :uuid, default: "gen_random_uuid()", null: false
    add_column :test_suites, :uuid, :uuid, default: "gen_random_uuid()", null: false
    add_column :test_cases, :uuid, :uuid, default: "gen_random_uuid()", null: false
    add_column :manual_test_cases, :uuid, :uuid, default: "gen_random_uuid()", null: false
    add_column :test_executions, :uuid, :uuid, default: "gen_random_uuid()", null: false
    add_column :test_execution_cycles, :uuid, :uuid, default: "gen_random_uuid()", null: false

    # Add UUID indexes
    add_index :users, :uuid, unique: true
    add_index :organizations, :uuid, unique: true
    add_index :test_suites, :uuid, unique: true
    add_index :test_cases, :uuid, unique: true
    add_index :manual_test_cases, :uuid, unique: true
    add_index :test_executions, :uuid, unique: true
    add_index :test_execution_cycles, :uuid, unique: true
  end

  def down
    remove_column :users, :uuid
    remove_column :organizations, :uuid
    remove_column :test_suites, :uuid
    remove_column :test_cases, :uuid
    remove_column :manual_test_cases, :uuid
    remove_column :test_executions, :uuid
    remove_column :test_execution_cycles, :uuid
  end
end
