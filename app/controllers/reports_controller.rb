class ReportsController < ApplicationController
  before_action :ensure_organization_member!
  before_action :set_organization
  before_action :set_date_range

  def test_execution
    case params[:report_type]
    when "summary"
      render json: summary_report
    when "detailed"
      render json: detailed_report
    when "trends"
      render json: trends_report
    when "defects"
      render json: defects_report
    else
      render json: summary_report
    end
  end

  def export
    format = params[:format] || "pdf"
    report_type = params[:report_type] || "summary"

    case format
    when "pdf"
      export_pdf(report_type)
    when "csv"
      export_csv(report_type)
    else
      render json: { error: "Unsupported format" }, status: :unprocessable_entity
    end
  end

  private

  def set_organization
    @organization = current_user.organization
  end

  def set_date_range
    @start_date = params[:start_date] ? Date.parse(params[:start_date]) : 30.days.ago.to_date
    @end_date = params[:end_date] ? Date.parse(params[:end_date]) : Date.current
  end

  def summary_report
    executions = @organization.test_executions.in_date_range(@start_date, @end_date)

    {
      summary: {
        total_test_cases: @organization.manual_test_cases.count,
        total_executions: executions.count,
        passed_executions: executions.passed.count,
        failed_executions: executions.failed.count,
        blocked_executions: executions.blocked.count,
        avg_execution_time: executions.where.not(execution_time: nil).average(:execution_time)&.round(2) || 0,
        test_coverage: calculate_test_coverage(executions),
        defects_found: executions.where.not(defect_id: nil).count,
        defects_fixed: calculate_fixed_defects(executions)
      },
      trends: generate_trends_data(executions),
      distribution: generate_distribution_data(executions),
      top_failed_tests: generate_top_failed_tests,
      test_executors: generate_executor_performance(executions)
    }
  end

  def detailed_report
    executions = @organization.test_executions
                              .includes(:manual_test_case, :executed_by)
                              .in_date_range(@start_date, @end_date)
                              .order(executed_at: :desc)

    {
      executions: executions.map do |execution|
        {
          id: execution.id,
          test_case_title: execution.manual_test_case.title,
          test_case_category: execution.manual_test_case.category,
          test_case_priority: execution.manual_test_case.priority,
          executor: execution.executed_by.email,
          status: execution.status,
          execution_time: execution.execution_time,
          executed_at: execution.executed_at,
          defect_id: execution.defect_id,
          notes: execution.notes&.truncate(100)
        }
      end,
      summary: summary_report[:summary]
    }
  end

  def trends_report
    executions = @organization.test_executions.in_date_range(@start_date, @end_date)

    {
      execution_trends: generate_execution_trends(executions),
      defect_trends: generate_defect_trends(executions),
      pass_rate_trends: generate_pass_rate_trends(executions),
      executor_trends: generate_executor_trends(executions)
    }
  end

  def defects_report
    executions_with_defects = @organization.test_executions
                                          .where.not(defect_id: nil)
                                          .in_date_range(@start_date, @end_date)
                                          .includes(:manual_test_case, :executed_by)

    {
      total_defects: executions_with_defects.count,
      defects_by_priority: executions_with_defects
                           .joins(:manual_test_case)
                           .group("manual_test_cases.priority")
                           .count,
      defects_by_category: executions_with_defects
                           .joins(:manual_test_case)
                           .group("manual_test_cases.category")
                           .count,
      defects_by_executor: executions_with_defects
                           .joins(:executed_by)
                           .group("users.email")
                           .count,
      defect_details: executions_with_defects.map do |execution|
        {
          defect_id: execution.defect_id,
          test_case_title: execution.manual_test_case.title,
          category: execution.manual_test_case.category,
          priority: execution.manual_test_case.priority,
          found_by: execution.executed_by.email,
          found_at: execution.executed_at,
          notes: execution.notes
        }
      end
    }
  end

  def export_pdf(report_type)
    # This would typically use a PDF generation library like Prawn or WickedPDF
    # For now, return a mock response
    send_data(
      "PDF content for #{report_type} report",
      filename: "test-report-#{report_type}-#{Date.current}.pdf",
      type: "application/pdf",
      disposition: "attachment"
    )
  end

  def export_csv(report_type)
    require "csv"

    csv_data = generate_csv_data(report_type)

    send_data(
      csv_data,
      filename: "test-report-#{report_type}-#{Date.current}.csv",
      type: "text/csv",
      disposition: "attachment"
    )
  end

  def generate_csv_data(report_type)
    executions = @organization.test_executions
                              .includes(:manual_test_case, :executed_by)
                              .in_date_range(@start_date, @end_date)

    CSV.generate(headers: true) do |csv|
      csv << [
        "Test Case Title", "Category", "Priority", "Executor",
        "Status", "Execution Time (min)", "Executed At", "Defect ID", "Notes"
      ]

      executions.each do |execution|
        csv << [
          execution.manual_test_case.title,
          execution.manual_test_case.category,
          execution.manual_test_case.priority,
          execution.executed_by.email,
          execution.status,
          execution.execution_time,
          execution.executed_at,
          execution.defect_id,
          execution.notes&.truncate(100)
        ]
      end
    end
  end

  def calculate_test_coverage(executions)
    total_test_cases = @organization.manual_test_cases.approved.count
    return 0 if total_test_cases == 0

    executed_test_cases = executions.joins(:manual_test_case).distinct.count("manual_test_cases.id")
    (executed_test_cases.to_f / total_test_cases * 100).round(2)
  end

  def calculate_fixed_defects(executions)
    # This is a simplified calculation - in reality, you'd track defect status separately
    defects_found = executions.where.not(defect_id: nil).count
    (defects_found * 0.8).round # Assume 80% are fixed
  end

  def generate_trends_data(executions)
    # Group executions by week for the last 4 weeks
    weeks = 4.times.map { |i| (i + 1).weeks.ago.beginning_of_week }

    execution_trends = {
      labels: weeks.map { |week| "Week #{weeks.index(week) + 1}" },
      datasets: [
        {
          label: "Passed",
          data: weeks.map { |week| executions.passed.where(executed_at: week..week.end_of_week).count },
          backgroundColor: "rgba(34, 197, 94, 0.8)",
          borderColor: "rgb(34, 197, 94)",
          borderWidth: 1
        },
        {
          label: "Failed",
          data: weeks.map { |week| executions.failed.where(executed_at: week..week.end_of_week).count },
          backgroundColor: "rgba(239, 68, 68, 0.8)",
          borderColor: "rgb(239, 68, 68)",
          borderWidth: 1
        },
        {
          label: "Blocked",
          data: weeks.map { |week| executions.blocked.where(executed_at: week..week.end_of_week).count },
          backgroundColor: "rgba(245, 158, 11, 0.8)",
          borderColor: "rgb(245, 158, 11)",
          borderWidth: 1
        }
      ]
    }

    defect_trends = {
      labels: weeks.map { |week| "Week #{weeks.index(week) + 1}" },
      datasets: [
        {
          label: "Defects Found",
          data: weeks.map { |week| executions.where.not(defect_id: nil).where(executed_at: week..week.end_of_week).count },
          borderColor: "rgb(239, 68, 68)",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          tension: 0.1
        }
      ]
    }

    { execution_trends: execution_trends, defect_trends: defect_trends }
  end

  def generate_distribution_data(executions)
    status_counts = TestExecution.statuses.keys.map do |status|
      executions.by_status(status).count
    end

    priority_counts = ManualTestCase.priorities.keys.map do |priority|
      executions.joins(:manual_test_case).where(manual_test_cases: { priority: priority }).count
    end

    {
      status_distribution: {
        labels: [ "Passed", "Failed", "Blocked" ],
        datasets: [ {
          data: [ status_counts[2], status_counts[3], status_counts[4] ], # passed, failed, blocked
          backgroundColor: [
            "rgba(34, 197, 94, 0.8)",
            "rgba(239, 68, 68, 0.8)",
            "rgba(245, 158, 11, 0.8)"
          ]
        } ]
      },
      priority_distribution: {
        labels: [ "Critical", "High", "Medium", "Low" ],
        datasets: [ {
          data: priority_counts,
          backgroundColor: [
            "rgba(239, 68, 68, 0.8)",
            "rgba(245, 158, 11, 0.8)",
            "rgba(59, 130, 246, 0.8)",
            "rgba(107, 114, 128, 0.8)"
          ]
        } ]
      }
    }
  end

  def generate_top_failed_tests
    @organization.manual_test_cases
                 .joins(:test_executions)
                 .where(test_executions: { status: [ "failed", "blocked" ], executed_at: @start_date..@end_date })
                 .group("manual_test_cases.id")
                 .having("COUNT(test_executions.id) > 0")
                 .order("COUNT(test_executions.id) DESC")
                 .limit(5)
                 .map do |test_case|
      failed_count = test_case.test_executions.where(status: [ "failed", "blocked" ]).count
      total_count = test_case.test_executions.count
      failure_rate = total_count > 0 ? (failed_count.to_f / total_count * 100).round(1) : 0

      {
        id: test_case.id,
        title: test_case.title,
        category: test_case.category,
        failure_rate: failure_rate,
        last_failed: test_case.test_executions.where(status: [ "failed", "blocked" ]).maximum(:executed_at),
        defect_id: test_case.test_executions.where.not(defect_id: nil).last&.defect_id || "N/A"
      }
    end
  end

  def generate_executor_performance(executions)
    @organization.users
                 .joins(:test_executions)
                 .where(test_executions: { executed_at: @start_date..@end_date })
                 .group("users.id")
                 .map do |user|
      user_executions = executions.where(executed_by: user)
      total_executions = user_executions.count
      passed_executions = user_executions.passed.count
      avg_time = user_executions.where.not(execution_time: nil).average(:execution_time)&.round(2) || 0
      efficiency = total_executions > 0 ? (passed_executions.to_f / total_executions * 100).round(1) : 0

      {
        name: user.email.split("@").first.humanize,
        email: user.email,
        total_executions: total_executions,
        passed_executions: passed_executions,
        avg_execution_time: avg_time,
        efficiency: efficiency
      }
    end
  end
end
