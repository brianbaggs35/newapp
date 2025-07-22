require "nokogiri"

class JunitXmlParserService
  def initialize(xml_content)
    @xml_content = xml_content
    @doc = Nokogiri::XML(xml_content)
  end

  def parse
    test_suites = []

    # Handle both single testsuite and testsuites wrapper
    suite_nodes = @doc.xpath("//testsuite")

    suite_nodes.each do |suite_node|
      test_suite = create_test_suite(suite_node)
      test_suites << test_suite if test_suite
    end

    test_suites
  end

  private

  def create_test_suite(suite_node)
    name = suite_node["name"] || "Unknown Test Suite"
    description = "Test suite with #{suite_node['tests']} tests"

    test_suite = TestSuite.create!(
      name: name,
      description: description,
      project: extract_project_name(name),
      total_tests: suite_node["tests"].to_i,
      passed_tests: (suite_node["tests"].to_i - suite_node["failures"].to_i - suite_node["errors"].to_i - suite_node["skipped"].to_i),
      failed_tests: suite_node["failures"].to_i,
      skipped_tests: suite_node["skipped"].to_i,
      total_duration: suite_node["time"].to_f,
      executed_at: parse_timestamp(suite_node["timestamp"])
    )

    # Parse test cases
    suite_node.xpath(".//testcase").each do |case_node|
      create_test_case(case_node, test_suite)
    end

    test_suite.update_statistics!
    test_suite
  end

  def create_test_case(case_node, test_suite)
    name = case_node["name"] || "Unknown Test"
    classname = case_node["classname"] || ""
    description = "#{classname}##{name}"

    status, failure_message, error_type = determine_test_status(case_node)

    TestCase.create!(
      test_suite: test_suite,
      name: name,
      description: description,
      project: test_suite.project,
      status: status,
      duration: case_node["time"].to_f,
      failure_message: failure_message,
      error_type: error_type,
      executed_at: test_suite.executed_at
    )
  end

  def determine_test_status(case_node)
    failure_node = case_node.at_xpath(".//failure")
    error_node = case_node.at_xpath(".//error")
    skipped_node = case_node.at_xpath(".//skipped")

    if failure_node
      [ "failed", failure_node.text, failure_node["type"] ]
    elsif error_node
      [ "error", error_node.text, error_node["type"] ]
    elsif skipped_node
      [ "skipped", skipped_node.text, nil ]
    else
      [ "passed", nil, nil ]
    end
  end

  def extract_project_name(suite_name)
    # Extract project name from suite name (basic heuristic)
    parts = suite_name.split(".")
    parts.length > 1 ? parts.first : "Default Project"
  end

  def parse_timestamp(timestamp_str)
    return Time.current unless timestamp_str

    begin
      Time.parse(timestamp_str)
    rescue ArgumentError
      Time.current
    end
  end
end
