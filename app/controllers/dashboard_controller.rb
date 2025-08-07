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
      stats = calculate_system_admin_stats
    elsif current_user.organization
      stats = calculate_organization_stats
    else
      render json: { error: 'No organization found' }, status: :unprocessable_entity
      return
    end

    respond_to do |format|
      format.json { render json: stats }
      format.turbo_stream do
        render turbo_stream: [
          turbo_stream.update("dashboard_stats", 
            render_to_string(partial: "dashboard/stats", locals: { stats: stats }, formats: [:html])
          )
        ]
      end
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
    
    # Automated Testing Stats
    automated_test_runs = org.test_runs.includes(:test_results).limit(100)
    total_automated_tests = automated_test_runs.joins(:test_results).count
    passed_automated_tests = automated_test_runs.joins(:test_results).where(test_results: { status: 'passed' }).count
    failed_automated_tests = automated_test_runs.joins(:test_results).where(test_results: { status: 'failed' }).count
    automated_success_rate = total_automated_tests > 0 ? passed_automated_tests.to_f / total_automated_tests : 0
    
    # Manual Testing Stats  
    manual_test_runs = org.manual_test_runs.includes(:manual_test_run_items).limit(100)
    total_manual_test_cases = org.manual_test_cases.count
    completed_manual_runs = manual_test_runs.where(status: 'completed').count
    manual_success_rate = manual_test_runs.count > 0 ? completed_manual_runs.to_f / manual_test_runs.count : 0
    
    # Trend data for charts
    trend_data = 7.days.ago.to_date.upto(Date.current).map do |date|
      day_runs = automated_test_runs.where(created_at: date.beginning_of_day..date.end_of_day)
      {
        date: date.strftime('%Y-%m-%d'),
        passed: day_runs.joins(:test_results).where(test_results: { status: 'passed' }).count,
        failed: day_runs.joins(:test_results).where(test_results: { status: 'failed' }).count
      }
    end
    
    # Status distribution for manual testing
    status_distribution = {
      pending: manual_test_runs.where(status: 'pending').count,
      in_progress: manual_test_runs.where(status: 'in_progress').count,
      completed: manual_test_runs.where(status: 'completed').count,
      blocked: manual_test_runs.where(status: 'blocked').count
    }
    
    {
      automated_testing: {
        total_runs: automated_test_runs.count,
        passed_tests: passed_automated_tests,
        failed_tests: failed_automated_tests,
        success_rate: automated_success_rate,
        recent_runs: automated_test_runs.order(created_at: :desc).limit(5).map do |run|
          passed = run.test_results.where(status: 'passed').count
          failed = run.test_results.where(status: 'failed').count
          {
            id: run.uuid,
            name: run.name || "Test Run #{run.id}",
            status: failed > 0 ? 'failed' : 'passed',
            passed: passed,
            failed: failed,
            created_at: run.created_at.iso8601
          }
        end,
        trend_data: trend_data
      },
      manual_testing: {
        total_test_cases: total_manual_test_cases,
        total_runs: manual_test_runs.count,
        completed_runs: completed_manual_runs,
        success_rate: manual_success_rate,
        recent_runs: manual_test_runs.order(created_at: :desc).limit(5).map do |run|
          total_items = run.manual_test_run_items.count
          completed_items = run.manual_test_run_items.where.not(status: 'pending').count
          progress = total_items > 0 ? (completed_items.to_f / total_items * 100).round : 0
          
          {
            id: run.uuid,
            name: run.name || "Manual Test Run #{run.id}",
            status: run.status,
            progress: progress,
            created_at: run.created_at.iso8601
          }
        end,
        status_distribution: status_distribution
      }
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
