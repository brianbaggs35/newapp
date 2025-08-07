class XmlParserService
  attr_reader :organization, :user, :file_path

  def initialize(organization:, user:, file_path:)
    @organization = organization
    @user = user
    @file_path = file_path
  end

  def parse_and_create_test_run
    parsed_data = parse_xml
    create_test_run(parsed_data)
  rescue StandardError => e
    Rails.logger.error "XML parsing failed: #{e.message}"
    nil
  end

  private

  def parse_xml
    doc = Nokogiri::XML(File.read(file_path))

    # Handle both JUnit and TestNG formats
    if doc.xpath("//testsuite").any?
      parse_junit_format(doc)
    elsif doc.xpath("//suite").any?
      parse_testng_format(doc)
    else
      raise "Unsupported XML format"
    end
  end

  def parse_junit_format(doc)
    test_run_data = {
      name: extract_test_run_name(doc),
      total_tests: 0,
      passed_tests: 0,
      failed_tests: 0,
      skipped_tests: 0,
      duration: 0.0,
      test_results: []
    }

    doc.xpath("//testsuite").each do |testsuite|
      suite_name = testsuite["name"] || "Unknown Suite"

      testsuite.xpath(".//testcase").each do |testcase|
        result = parse_junit_testcase(testcase, suite_name)
        test_run_data[:test_results] << result

        # Update counters
        test_run_data[:total_tests] += 1
        test_run_data[:duration] += result[:duration] || 0

        case result[:status]
        when "passed"
          test_run_data[:passed_tests] += 1
        when "failed"
          test_run_data[:failed_tests] += 1
        when "skipped"
          test_run_data[:skipped_tests] += 1
        end
      end
    end

    test_run_data
  end

  def parse_junit_testcase(testcase, suite_name)
    result = {
      class_name: testcase["classname"] || suite_name,
      test_name: testcase["name"],
      duration: testcase["time"]&.to_f,
      status: "passed",
      failure_message: nil,
      error_message: nil,
      error_type: nil,
      system_out: nil,
      system_err: nil
    }

    # Check for failures
    failure = testcase.xpath(".//failure").first
    if failure
      result[:status] = "failed"
      result[:failure_message] = failure.text&.strip
      result[:error_type] = failure["type"]
    end

    # Check for errors
    error = testcase.xpath(".//error").first
    if error
      result[:status] = "failed"
      result[:error_message] = error.text&.strip
      result[:error_type] = error["type"]
    end

    # Check for skipped
    skipped = testcase.xpath(".//skipped").first
    if skipped
      result[:status] = "skipped"
      result[:failure_message] = skipped.text&.strip
    end

    # System output
    system_out = testcase.xpath(".//system-out").first
    result[:system_out] = system_out&.text&.strip

    system_err = testcase.xpath(".//system-err").first
    result[:system_err] = system_err&.text&.strip

    result
  end

  def parse_testng_format(doc)
    # Similar implementation for TestNG format
    # This would parse TestNG specific XML structure
    test_run_data = {
      name: doc.xpath("//suite").first&.[]("name") || "TestNG Run",
      total_tests: 0,
      passed_tests: 0,
      failed_tests: 0,
      skipped_tests: 0,
      duration: 0.0,
      test_results: []
    }

    doc.xpath("//test-method").each do |test_method|
      result = parse_testng_testmethod(test_method)
      test_run_data[:test_results] << result

      test_run_data[:total_tests] += 1
      test_run_data[:duration] += result[:duration] || 0

      case result[:status]
      when "PASS"
        test_run_data[:passed_tests] += 1
      when "FAIL"
        test_run_data[:failed_tests] += 1
      when "SKIP"
        test_run_data[:skipped_tests] += 1
      end
    end

    test_run_data
  end

  def parse_testng_testmethod(test_method)
    {
      class_name: test_method.xpath("../..")[0]&.[]("name") || "Unknown Class",
      test_name: test_method["name"],
      duration: test_method["duration-ms"]&.to_f&./(1000),
      status: map_testng_status(test_method["status"]),
      failure_message: test_method.xpath(".//message").text&.strip,
      error_message: test_method.xpath(".//full-stacktrace").text&.strip,
      error_type: test_method.xpath(".//exception").first&.[]("class")
    }
  end

  def map_testng_status(status)
    case status
    when "PASS" then "passed"
    when "FAIL" then "failed"
    when "SKIP" then "skipped"
    else "passed"
    end
  end

  def extract_test_run_name(doc)
    # Try to extract a meaningful name from the XML
    suite_name = doc.xpath("//testsuite").first&.[]("name")
    return suite_name if suite_name.present?

    "Test Run #{Time.current.strftime('%Y-%m-%d %H:%M')}"
  end

  def create_test_run(data)
    test_run = TestRun.create!(
      name: data[:name],
      organization: organization,
      created_by: user,
      status: "completed",
      total_tests: data[:total_tests],
      passed_tests: data[:passed_tests],
      failed_tests: data[:failed_tests],
      skipped_tests: data[:skipped_tests],
      duration: data[:duration],
      completed_at: Time.current
    )

    data[:test_results].each do |result_data|
      TestResult.create!(
        test_run: test_run,
        organization: organization,
        class_name: result_data[:class_name],
        test_name: result_data[:test_name],
        status: result_data[:status],
        duration: result_data[:duration],
        failure_message: result_data[:failure_message],
        error_message: result_data[:error_message],
        error_type: result_data[:error_type],
        system_out: result_data[:system_out],
        system_err: result_data[:system_err]
      )
    end

    test_run
  end
end
