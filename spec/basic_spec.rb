require 'rails_helper_basic'

RSpec.describe "Application", type: :request do
  describe "GET /" do
    it "returns http success" do
      get "/"
      expect(response).to have_http_status(:success)
    end
  end
end

RSpec.describe ApplicationHelper, type: :helper do
  describe "application helper methods" do
    it "has basic helper functionality" do
      expect(helper).to be_present
    end
  end
end

RSpec.describe User, type: :model do
  describe "user model" do
    it "can be created" do
      user = User.new(email: "test@example.com")
      expect(user.email).to eq("test@example.com")
    end
  end
end if defined?(User)