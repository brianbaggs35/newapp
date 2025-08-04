class CreateTestExecutions < ActiveRecord::Migration[8.0]
  def change
    create_table :test_executions do |t|
      t.references :manual_test_case, null: false, foreign_key: true
      t.references :executed_by, null: false, foreign_key: { to_table: :users }
      t.references :organization, null: false, foreign_key: true
      
      t.string :status, default: 'pending' # pending, in_progress, passed, failed, blocked
      t.text :actual_result
      t.text :notes
      t.string :defect_id
      t.integer :execution_time # actual time taken in minutes
      t.text :screenshots_urls # JSON array of screenshot URLs
      t.datetime :started_at
      t.datetime :completed_at
      t.datetime :executed_at

      t.timestamps
    end

    add_index :test_executions, :status
    add_index :test_executions, :executed_at
    add_index :test_executions, [:manual_test_case_id, :executed_at]
  end
end