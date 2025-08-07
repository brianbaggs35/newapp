class AddOnboardingAndProfileFieldsToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :onboarding_completed, :boolean, default: false, null: false
    add_column :users, :first_name, :string
    add_column :users, :last_name, :string
    add_column :users, :phone, :string
    add_column :users, :job_title, :string
    
    add_index :users, :onboarding_completed
  end
end
