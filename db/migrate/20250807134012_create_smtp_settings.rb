class CreateSmtpSettings < ActiveRecord::Migration[8.0]
  def change
    create_table :smtp_settings do |t|
      t.string :host, null: false
      t.integer :port, null: false, default: 587
      t.string :username
      t.string :password
      t.string :authentication, default: 'plain'
      t.boolean :enable_starttls_auto, default: true
      t.string :from_email, null: false
      t.string :from_name, null: false
      t.timestamps
    end
  end
end
