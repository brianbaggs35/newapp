class CreateInvitationCodes < ActiveRecord::Migration[8.0]
  def change
    create_table :invitation_codes do |t|
      t.string :code, null: false, index: { unique: true }
      t.string :code_type, null: false
      t.integer :max_uses, null: false, default: 1
      t.integer :uses_count, null: false, default: 0
      t.datetime :expires_at
      t.references :organization, foreign_key: true, null: true
      t.references :created_by, null: false, foreign_key: { to_table: :users }
      t.timestamps
    end

    add_index :invitation_codes, [ :code_type, :expires_at ]
    add_index :invitation_codes, [ :uses_count, :max_uses ]
  end
end
