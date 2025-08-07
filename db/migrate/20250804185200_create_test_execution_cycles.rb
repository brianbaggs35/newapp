class CreateTestExecutionCycles < ActiveRecord::Migration[8.0]
  def change
    create_table :test_execution_cycles do |t|
      t.string :name, null: false
      t.text :description
      t.references :organization, null: false, foreign_key: true
      t.references :created_by, null: false, foreign_key: { to_table: :users }
      t.string :status, default: 'planned' # planned, active, completed, archived
      t.datetime :planned_start_date
      t.datetime :planned_end_date
      t.datetime :actual_start_date
      t.datetime :actual_end_date
      t.text :environment_details
      t.text :entry_criteria
      t.text :exit_criteria

      t.timestamps
    end

    add_index :test_execution_cycles, :status
    add_index :test_execution_cycles, :planned_start_date
    add_index :test_execution_cycles, :actual_start_date
  end
end
