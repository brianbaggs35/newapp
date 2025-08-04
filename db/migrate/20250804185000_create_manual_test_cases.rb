class CreateManualTestCases < ActiveRecord::Migration[8.0]
  def change
    create_table :manual_test_cases do |t|
      t.string :title, null: false
      t.text :description
      t.text :preconditions
      t.text :steps, null: false
      t.text :expected_result, null: false
      t.text :actual_result
      t.string :priority, default: 'medium'
      t.string :status, default: 'draft'
      t.string :category
      t.text :tags
      t.integer :estimated_time # in minutes
      t.references :organization, null: false, foreign_key: true
      t.references :created_by, null: false, foreign_key: { to_table: :users }
      t.references :updated_by, null: true, foreign_key: { to_table: :users }

      t.timestamps
    end

    add_index :manual_test_cases, :priority
    add_index :manual_test_cases, :status
    add_index :manual_test_cases, :category
    add_index :manual_test_cases, :created_at
  end
end