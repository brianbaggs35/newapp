class CreateQaPlatformTables < ActiveRecord::Migration[8.0]
  def change
    # Test Runs table for automated testing
    create_table :test_runs, id: false do |t|
      t.uuid :id, primary_key: true, default: "gen_random_uuid()"
      t.uuid :uuid, default: "gen_random_uuid()", null: false
      t.string :name, null: false
      t.text :description
      t.references :organization, type: :bigint, null: false, foreign_key: true
      t.references :created_by, type: :bigint, null: false, foreign_key: { to_table: :users }
      t.string :status, default: 'pending', null: false
      t.integer :total_tests, default: 0
      t.integer :passed_tests, default: 0
      t.integer :failed_tests, default: 0
      t.integer :skipped_tests, default: 0
      t.decimal :duration, precision: 10, scale: 3
      t.datetime :started_at
      t.datetime :completed_at
      t.timestamps
    end

    # Test Results table for individual test results
    create_table :test_results, id: false do |t|
      t.uuid :id, primary_key: true, default: "gen_random_uuid()"
      t.uuid :uuid, default: "gen_random_uuid()", null: false
      t.references :test_run, type: :uuid, null: false, foreign_key: true
      t.references :organization, type: :bigint, null: false, foreign_key: true
      t.string :class_name, null: false
      t.string :test_name, null: false
      t.string :status, null: false
      t.decimal :duration, precision: 10, scale: 3
      t.text :failure_message
      t.text :error_message
      t.string :error_type
      t.text :system_out
      t.text :system_err
      t.timestamps
    end

    # Failure Analysis table for kanban board
    create_table :failure_analyses, id: false do |t|
      t.uuid :id, primary_key: true, default: "gen_random_uuid()"
      t.uuid :uuid, default: "gen_random_uuid()", null: false
      t.references :test_result, type: :uuid, null: false, foreign_key: true
      t.references :organization, type: :bigint, null: false, foreign_key: true
      t.references :assigned_to, type: :bigint, null: true, foreign_key: { to_table: :users }
      t.references :created_by, type: :bigint, null: false, foreign_key: { to_table: :users }
      t.references :updated_by, type: :bigint, null: true, foreign_key: { to_table: :users }
      t.string :status, default: 'to_do', null: false
      t.string :priority, default: 'medium', null: false
      t.text :notes
      t.text :resolution_notes
      t.datetime :resolved_at
      t.timestamps
    end

    # Manual Test Runs table
    create_table :manual_test_runs, id: false do |t|
      t.uuid :id, primary_key: true, default: "gen_random_uuid()"
      t.uuid :uuid, default: "gen_random_uuid()", null: false
      t.string :name, null: false
      t.text :description
      t.references :organization, type: :bigint, null: false, foreign_key: true
      t.references :created_by, type: :bigint, null: false, foreign_key: { to_table: :users }
      t.string :status, default: 'planning', null: false
      t.datetime :started_at
      t.datetime :completed_at
      t.timestamps
    end

    # Manual Test Run Items (test cases in a run)
    create_table :manual_test_run_items, id: false do |t|
      t.uuid :id, primary_key: true, default: "gen_random_uuid()"
      t.uuid :uuid, default: "gen_random_uuid()", null: false
      t.references :manual_test_run, type: :uuid, null: false, foreign_key: true
      t.references :manual_test_case, type: :bigint, null: false, foreign_key: true
      t.references :organization, type: :bigint, null: false, foreign_key: true
      t.references :executed_by, type: :bigint, null: true, foreign_key: { to_table: :users }
      t.string :status, default: 'to_do', null: false
      t.text :actual_results
      t.text :failure_information
      t.text :notes
      t.decimal :execution_time, precision: 8, scale: 2
      t.datetime :executed_at
      t.timestamps
    end

    # Add new columns to existing tables
    add_column :manual_test_cases, :module_name, :string, limit: 100
    add_column :manual_test_cases, :environment, :string, limit: 100
    add_column :manual_test_cases, :account, :string, limit: 100
    add_reference :manual_test_cases, :test_suite, type: :bigint, foreign_key: true

    add_reference :test_suites, :created_by, type: :bigint, foreign_key: { to_table: :users }

    # Add indexes for performance
    add_index :test_runs, :uuid, unique: true
    add_index :test_runs, [ :organization_id, :status ]
    add_index :test_runs, :created_at

    add_index :test_results, :uuid, unique: true
    add_index :test_results, [ :test_run_id, :status ]
    add_index :test_results, [ :organization_id, :status ]

    add_index :failure_analyses, :uuid, unique: true
    add_index :failure_analyses, [ :organization_id, :status ]
    # Note: assigned_to_id index already created by add_reference

    add_index :manual_test_runs, :uuid, unique: true
    add_index :manual_test_runs, [ :organization_id, :status ]

    add_index :manual_test_run_items, :uuid, unique: true
    add_index :manual_test_run_items, [ :manual_test_run_id, :status ]
    # Note: executed_by_id index already created by add_reference
  end
end
