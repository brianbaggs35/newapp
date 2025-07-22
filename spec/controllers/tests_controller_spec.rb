require 'rails_helper'

RSpec.describe TestsController, type: :controller do
  let!(:test_suite) { create(:test_suite) }
  let!(:test_cases) { create_list(:test_case, 3, test_suite: test_suite) }

  describe 'GET #index' do
    it 'returns all test suites' do
      get :index
      expect(response).to have_http_status(:success)

      json_response = JSON.parse(response.body)
      expect(json_response.length).to eq(1)
      expect(json_response.first['name']).to eq(test_suite.name)
    end
  end

  describe 'GET #show' do
    it 'returns test suite with test cases' do
      get :show, params: { id: test_suite.id }
      expect(response).to have_http_status(:success)

      json_response = JSON.parse(response.body)
      expect(json_response['test_suite']['name']).to eq(test_suite.name)
      expect(json_response['test_cases'].length).to eq(3)
    end

    it 'returns 404 for non-existent test suite' do
      expect {
        get :show, params: { id: 99999 }
      }.to raise_error(ActiveRecord::RecordNotFound)
    end
  end

  describe 'POST #import' do
    let(:xml_content) do
      <<~XML
        <?xml version="1.0" encoding="UTF-8"?>
        <testsuite name="ImportedSuite" tests="2" failures="0" errors="0" skipped="0" time="3.0">
          <testcase name="test1" classname="ImportedSuite" time="1.5"/>
          <testcase name="test2" classname="ImportedSuite" time="1.5"/>
        </testsuite>
      XML
    end

    let(:xml_file) { fixture_file_upload('test.xml', 'text/xml', xml_content) }

    before do
      # Create a temporary file for testing
      File.write(Rails.root.join('spec', 'fixtures', 'test.xml'), xml_content)
    end

    after do
      # Clean up the temporary file
      File.delete(Rails.root.join('spec', 'fixtures', 'test.xml')) if File.exist?(Rails.root.join('spec', 'fixtures', 'test.xml'))
    end

    it 'successfully imports valid XML' do
      post :import, params: { xml_file: xml_file }
      expect(response).to have_http_status(:success)

      json_response = JSON.parse(response.body)
      expect(json_response['message']).to include('Successfully imported')
      expect(json_response['test_suites'].length).to eq(1)

      imported_suite = TestSuite.find_by(name: 'ImportedSuite')
      expect(imported_suite).to be_present
      expect(imported_suite.test_cases.count).to eq(2)
    end

    it 'returns error when no file provided' do
      post :import
      expect(response).to have_http_status(:bad_request)

      json_response = JSON.parse(response.body)
      expect(json_response['error']).to eq('No XML file provided')
    end

    it 'returns error for invalid XML' do
      invalid_file = fixture_file_upload('invalid.xml', 'text/xml', 'invalid xml content')

      # Create a temporary invalid file
      File.write(Rails.root.join('spec', 'fixtures', 'invalid.xml'), 'invalid xml content')

      post :import, params: { xml_file: invalid_file }
      expect(response).to have_http_status(:unprocessable_entity)

      json_response = JSON.parse(response.body)
      expect(json_response['error']).to include('Failed to parse XML')

      # Clean up
      File.delete(Rails.root.join('spec', 'fixtures', 'invalid.xml'))
    end
  end

  describe 'DELETE #destroy' do
    it 'deletes the test suite' do
      expect {
        delete :destroy, params: { id: test_suite.id }
      }.to change(TestSuite, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end
  end

  describe 'GET #statistics' do
    before do
      create(:test_case, :failed, test_suite: test_suite)
      create(:test_case, :skipped, test_suite: test_suite)
    end

    it 'returns test statistics' do
      get :statistics
      expect(response).to have_http_status(:success)

      json_response = JSON.parse(response.body)
      expect(json_response['total_suites']).to eq(1)
      expect(json_response['total_tests']).to eq(5) # 3 + 2 new ones
      expect(json_response['passed_tests']).to eq(3)
      expect(json_response['failed_tests']).to eq(1)
      expect(json_response['skipped_tests']).to eq(1)
      expect(json_response['success_rate']).to eq(60.0)
      expect(json_response['recent_suites']).to be_present
    end
  end

  private

  def fixture_file_upload(filename, content_type, content)
    file = Tempfile.new(filename)
    file.write(content)
    file.rewind

    ActionDispatch::Http::UploadedFile.new(
      tempfile: file,
      filename: filename,
      type: content_type
    )
  end
end
