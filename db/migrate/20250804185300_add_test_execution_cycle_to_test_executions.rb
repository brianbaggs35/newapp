class AddTestExecutionCycleToTestExecutions < ActiveRecord::Migration[8.0]
  def change
    add_reference :test_executions, :test_execution_cycle, null: true, foreign_key: true
    add_index :test_executions, [ :test_execution_cycle_id, :status ]
  end
end
