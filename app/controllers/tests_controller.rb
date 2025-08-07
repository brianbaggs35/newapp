class TestsController < ApplicationController
  before_action :ensure_organization_member!
  before_action :set_organization
  before_action :set_test_suite, only: [ :show, :destroy ]

  def index
    @test_suites = @organization.test_suites.includes(:test_cases).order(created_at: :desc)
    render json: @test_suites.map { |suite| test_suite_json(suite) }
  end

  def show
    @test_cases = @test_suite.test_cases.includes(:test_suite).order(:name)
    render json: {
      test_suite: test_suite_json(@test_suite),
      test_cases: @test_cases.map { |test_case| test_case_json(test_case) }
    }
  end

  def import
    unless params[:xml_file]
      render json: { error: "No XML file provided" }, status: :bad_request
      return
    end

    begin
      xml_content = params[:xml_file].read
      parser = JunitXmlParserService.new(xml_content, @organization)
      test_suites = parser.parse

      render json: {
        message: "Successfully imported #{test_suites.length} test suite(s)",
        test_suites: test_suites.map { |suite| test_suite_json(suite) }
      }
    rescue StandardError => e
      render json: { error: "Failed to parse XML: #{e.message}" }, status: :unprocessable_entity
    end
  end

  def destroy
    unless current_user.can_manage_organization?
      render json: { error: "Access denied" }, status: :forbidden
      return
    end

    @test_suite.destroy
    head :no_content
  end

  def statistics
    total_suites = @organization.test_suites.count
    total_tests = @organization.test_cases.count
    passed_tests = @organization.test_cases.passed.count
    failed_tests = @organization.test_cases.failed.count
    skipped_tests = @organization.test_cases.skipped.count

    render json: {
      total_suites: total_suites,
      total_tests: total_tests,
      passed_tests: passed_tests,
      failed_tests: failed_tests,
      skipped_tests: skipped_tests,
      success_rate: total_tests > 0 ? (passed_tests.to_f / total_tests * 100).round(2) : 0,
      recent_suites: @organization.test_suites.order(created_at: :desc).limit(5).map { |suite| test_suite_json(suite) }
    }
  end

  private

  def set_organization
    @organization = current_user.organization
  end

  def set_test_suite
    @test_suite = @organization.test_suites.find(params[:id])
  end

  def test_suite_json(suite)
    {
      id: suite.id,
      name: suite.name,
      description: suite.description,
      project: suite.project,
      total_tests: suite.total_tests,
      passed_tests: suite.passed_tests,
      failed_tests: suite.failed_tests,
      skipped_tests: suite.skipped_tests,
      success_rate: suite.success_rate,
      total_duration: suite.total_duration,
      executed_at: suite.executed_at,
      created_at: suite.created_at
    }
  end

  def test_case_json(test_case)
    {
      id: test_case.id,
      name: test_case.name,
      description: test_case.description,
      status: test_case.status,
      duration: test_case.duration,
      failure_message: test_case.failure_message,
      error_type: test_case.error_type,
      executed_at: test_case.executed_at
    }
  end
end
