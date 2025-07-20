require 'rails_helper'

RSpec.describe JunitXmlParserService do
  let(:sample_xml) do
    <<~XML
      <?xml version="1.0" encoding="UTF-8"?>
      <testsuite name="com.example.TestSuite" tests="3" failures="1" errors="0" skipped="1" time="15.5" timestamp="2023-01-01T12:00:00">
        <testcase name="testSuccess" classname="com.example.TestSuite" time="5.0"/>
        <testcase name="testFailure" classname="com.example.TestSuite" time="3.5">
          <failure type="AssertionError">Expected true but was false</failure>
        </testcase>
        <testcase name="testSkipped" classname="com.example.TestSuite" time="7.0">
          <skipped>Test was skipped</skipped>
        </testcase>
      </testsuite>
    XML
  end

  describe '#parse' do
    it 'parses valid JUnit XML correctly' do
      parser = JunitXmlParserService.new(sample_xml)
      test_suites = parser.parse

      expect(test_suites.length).to eq(1)
      
      test_suite = test_suites.first
      expect(test_suite.name).to eq('com.example.TestSuite')
      expect(test_suite.total_tests).to eq(3)
      expect(test_suite.passed_tests).to eq(1)
      expect(test_suite.failed_tests).to eq(1)
      expect(test_suite.skipped_tests).to eq(1)
      expect(test_suite.total_duration).to eq(15.5)
      expect(test_suite.project).to eq('com')
    end

    it 'creates test cases correctly' do
      parser = JunitXmlParserService.new(sample_xml)
      test_suites = parser.parse
      test_suite = test_suites.first

      expect(test_suite.test_cases.count).to eq(3)
      
      passed_test = test_suite.test_cases.find_by(name: 'testSuccess')
      expect(passed_test.status).to eq('passed')
      expect(passed_test.duration).to eq(5.0)
      expect(passed_test.failure_message).to be_nil

      failed_test = test_suite.test_cases.find_by(name: 'testFailure')
      expect(failed_test.status).to eq('failed')
      expect(failed_test.duration).to eq(3.5)
      expect(failed_test.failure_message).to eq('Expected true but was false')
      expect(failed_test.error_type).to eq('AssertionError')

      skipped_test = test_suite.test_cases.find_by(name: 'testSkipped')
      expect(skipped_test.status).to eq('skipped')
      expect(skipped_test.duration).to eq(7.0)
      expect(skipped_test.failure_message).to eq('Test was skipped')
    end

    it 'handles multiple test suites' do
      multiple_suites_xml = <<~XML
        <?xml version="1.0" encoding="UTF-8"?>
        <testsuites>
          <testsuite name="Suite1" tests="1" failures="0" errors="0" skipped="0" time="1.0">
            <testcase name="test1" classname="Suite1" time="1.0"/>
          </testsuite>
          <testsuite name="Suite2" tests="1" failures="0" errors="0" skipped="0" time="2.0">
            <testcase name="test2" classname="Suite2" time="2.0"/>
          </testsuite>
        </testsuites>
      XML

      parser = JunitXmlParserService.new(multiple_suites_xml)
      test_suites = parser.parse

      expect(test_suites.length).to eq(2)
      expect(test_suites.map(&:name)).to contain_exactly('Suite1', 'Suite2')
    end

    it 'handles error test cases' do
      error_xml = <<~XML
        <?xml version="1.0" encoding="UTF-8"?>
        <testsuite name="ErrorSuite" tests="1" failures="0" errors="1" skipped="0" time="1.0">
          <testcase name="testError" classname="ErrorSuite" time="1.0">
            <error type="RuntimeError">Something went wrong</error>
          </testcase>
        </testsuite>
      XML

      parser = JunitXmlParserService.new(error_xml)
      test_suites = parser.parse
      test_suite = test_suites.first

      error_test = test_suite.test_cases.first
      expect(error_test.status).to eq('error')
      expect(error_test.failure_message).to eq('Something went wrong')
      expect(error_test.error_type).to eq('RuntimeError')
    end

    it 'handles invalid timestamps gracefully' do
      invalid_timestamp_xml = <<~XML
        <?xml version="1.0" encoding="UTF-8"?>
        <testsuite name="TestSuite" tests="1" failures="0" errors="0" skipped="0" time="1.0" timestamp="invalid-date">
          <testcase name="test1" classname="TestSuite" time="1.0"/>
        </testsuite>
      XML

      parser = JunitXmlParserService.new(invalid_timestamp_xml)
      test_suites = parser.parse
      test_suite = test_suites.first

      expect(test_suite.executed_at).to be_within(1.second).of(Time.current)
    end
  end
end