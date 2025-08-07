require 'rails_helper'

RSpec.describe XmlParserService, type: :service do
  let(:organization) { create(:organization) }
  let(:user) { create(:user, organization: organization) }
  let(:service) { described_class.new(organization: organization, user: user, file_path: file_path) }

  describe '#parse_and_create_test_run' do
    context 'with valid JUnit XML' do
      let(:junit_xml) do
        <<~XML
          <?xml version="1.0" encoding="UTF-8"?>
          <testsuite name="SampleTestSuite" tests="3" failures="1" errors="0" skipped="1" time="45.123">
            <testcase classname="com.example.TestClass" name="testPassed" time="10.5"/>
            <testcase classname="com.example.TestClass" name="testFailed" time="20.0">
              <failure message="Assertion failed" type="AssertionError">
                Stack trace here
              </failure>
            </testcase>
            <testcase classname="com.example.TestClass" name="testSkipped" time="0.0">
              <skipped/>
            </testcase>
          </testsuite>
        XML
      end
      
      let(:file_path) { write_temp_file(junit_xml) }

      it 'creates a test run with correct data' do
        expect { service.parse_and_create_test_run }.to change(TestRun, :count).by(1)
        
        test_run = TestRun.last
        expect(test_run.name).to eq('SampleTestSuite')
        expect(test_run.organization).to eq(organization)
        expect(test_run.created_by).to eq(user)
        expect(test_run.status).to eq('completed')
        expect(test_run.total_tests).to eq(3)
        expect(test_run.passed_tests).to eq(1)
        expect(test_run.failed_tests).to eq(1)
        expect(test_run.skipped_tests).to eq(1)
        expect(test_run.duration).to be_within(0.1).of(30.5)
      end

      it 'creates test results with correct data' do
        service.parse_and_create_test_run
        
        test_run = TestRun.last
        expect(test_run.test_results.count).to eq(3)
        
        passed_result = test_run.test_results.find_by(test_name: 'testPassed')
        expect(passed_result.status).to eq('passed')
        expect(passed_result.class_name).to eq('com.example.TestClass')
        expect(passed_result.duration).to eq(10.5)
        
        failed_result = test_run.test_results.find_by(test_name: 'testFailed')
        expect(failed_result.status).to eq('failed')
        expect(failed_result.failure_message).to include('Stack trace here')
        expect(failed_result.error_type).to eq('AssertionError')
        
        skipped_result = test_run.test_results.find_by(test_name: 'testSkipped')
        expect(skipped_result.status).to eq('skipped')
      end

      after { File.delete(file_path) if File.exist?(file_path) }
    end

    context 'with valid TestNG XML' do
      let(:testng_xml) do
        <<~XML
          <?xml version="1.0" encoding="UTF-8"?>
          <suite name="TestNG Suite">
            <test name="Test">
              <class name="com.example.TestClass">
                <test-method name="testPassed" status="PASS" duration-ms="5000"/>
                <test-method name="testFailed" status="FAIL" duration-ms="3000">
                  <exception class="java.lang.AssertionError">
                    <message>Test failed</message>
                    <full-stacktrace>Full stack trace</full-stacktrace>
                  </exception>
                </test-method>
              </class>
            </test>
          </suite>
        XML
      end
      
      let(:file_path) { write_temp_file(testng_xml) }

      it 'creates a test run with correct data' do
        expect { service.parse_and_create_test_run }.to change(TestRun, :count).by(1)
        
        test_run = TestRun.last
        expect(test_run.name).to eq('TestNG Suite')
        expect(test_run.total_tests).to eq(2)
        expect(test_run.passed_tests).to eq(1)
        expect(test_run.failed_tests).to eq(1)
        expect(test_run.skipped_tests).to eq(0)
      end

      after { File.delete(file_path) if File.exist?(file_path) }
    end

    context 'with invalid XML' do
      let(:file_path) { write_temp_file('invalid xml content') }

      it 'returns nil and logs error' do
        expect(Rails.logger).to receive(:error).with(/XML parsing failed/)
        expect(service.parse_and_create_test_run).to be_nil
      end

      after { File.delete(file_path) if File.exist?(file_path) }
    end

    context 'with unsupported XML format' do
      let(:unsupported_xml) do
        <<~XML
          <?xml version="1.0" encoding="UTF-8"?>
          <custom-format>
            <test>Some test</test>
          </custom-format>
        XML
      end
      
      let(:file_path) { write_temp_file(unsupported_xml) }

      it 'returns nil and logs error' do
        expect(Rails.logger).to receive(:error).with(/XML parsing failed/)
        expect(service.parse_and_create_test_run).to be_nil
      end

      after { File.delete(file_path) if File.exist?(file_path) }
    end
  end

  private

  def write_temp_file(content)
    file = Tempfile.new(['test', '.xml'])
    file.write(content)
    file.close
    file.path
  end
end