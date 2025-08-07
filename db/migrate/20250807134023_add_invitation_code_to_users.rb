class AddInvitationCodeToUsers < ActiveRecord::Migration[8.0]
  def change
    add_reference :users, :invitation_code, foreign_key: true, null: true
  end
end
