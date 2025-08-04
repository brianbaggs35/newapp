class DashboardController < ApplicationController
  before_action :ensure_organization_member!, unless: :system_admin?

  def index
    if current_user.system_admin?
      redirect_to organizations_path
      return
    end

    unless current_user.organization
      redirect_to organizations_path
      return
    end

    @stats = calculate_dashboard_stats
    @recent_test_suites = current_user.organization.test_suites.recent.limit(5)
    @recent_users = current_user.organization.users.order(created_at: :desc).limit(5) if current_user.can_manage_users?
  end

  def stats
    if current_user.system_admin?
      render json: calculate_system_admin_stats
    elsif current_user.organization
      render json: calculate_organization_stats
    else
      render json: { error: 'No organization found' }, status: :unprocessable_entity
    end
  end

  private

  def system_admin?
    current_user&.system_admin?
  end

  def calculate_dashboard_stats
    return {} unless current_user.organization

    org = current_user.organization
    {
      total_test_suites: org.test_suites.count,
      total_test_cases: org.test_cases.count,
      total_users: org.users.count,
      recent_test_runs: org.test_suites.where('executed_at > ?', 7.days.ago).count,
      passed_tests: org.test_cases.where(status: 'passed').count,
      failed_tests: org.test_cases.where(status: 'failed').count,
      success_rate: calculate_success_rate(org)
    }
  end

  def calculate_organization_stats
    org = current_user.organization
    {
      totalTestSuites: org.test_suites.count,
      totalTestCases: org.test_cases.count,
      totalUsers: org.users.count,
      recentTestRuns: org.test_suites.where('executed_at > ?', 7.days.ago).count,
      passedTests: org.test_cases.where(status: 'passed').count,
      failedTests: org.test_cases.where(status: 'failed').count,
      successRate: calculate_success_rate(org),
      testsThisWeek: org.test_suites.where('created_at > ?', 1.week.ago).count,
      testsThisMonth: org.test_suites.where('created_at > ?', 1.month.ago).count
    }
  end

  def calculate_system_admin_stats
    {
      totalOrganizations: Organization.count,
      activeOrganizations: Organization.active.count,
      totalUsers: User.count,
      totalTestSuites: TestSuite.count,
      totalTestCases: TestCase.count,
      systemAdmins: User.where(role: 'system_admin').count,
      recentOrganizations: Organization.where('created_at > ?', 7.days.ago).count
    }
  end

  def calculate_success_rate(organization)
    total_tests = organization.test_cases.count
    return 0 if total_tests == 0
    
    passed_tests = organization.test_cases.where(status: 'passed').count
    ((passed_tests.to_f / total_tests) * 100).round(2)
  end
end
