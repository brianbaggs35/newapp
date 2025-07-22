class DashboardController < ApplicationController
  before_action :authenticate_user!

  def index
    # This will render the dashboard view with React components
  end

  def stats
    @stats = {
      totalTests: TestCase.count,
      passedTests: TestCase.where(status: :passed).count,
      failedTests: TestCase.where(status: :failed).count,
      pendingTests: TestCase.where(status: :pending).count,
      recentTestSuites: TestSuite.order(created_at: :desc).limit(5)
    }

    render json: @stats
  end
end