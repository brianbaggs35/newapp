import React, { useState } from 'react';
import { Button, FileInput, Label, Alert, Card, Spinner } from 'flowbite-react';
import { HiUpload, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';

const TestImport = ({ onImportSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('info');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setMessage(null);
  };

  const handleImport = async () => {
    if (!file) {
      setMessage('Please select a JUnit XML file');
      setMessageType('failure');
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('xml_file', file);

    try {
      const response = await fetch('/tests/import', {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content || ''
        }
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setMessageType('success');
        setFile(null);
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
        
        if (onImportSuccess) {
          onImportSuccess(data.test_suites);
        }
      } else {
        setMessage(data.error || 'Import failed');
        setMessageType('failure');
      }
    } catch (error) {
      setMessage('Failed to import file: ' + error.message);
      setMessageType('failure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <HiUpload className="mr-2" />
          Import JUnit XML Test Results
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="xml-file" value="Select JUnit XML file" />
            <FileInput
              id="xml-file"
              accept=".xml"
              onChange={handleFileChange}
              disabled={loading}
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Upload a JUnit XML file to import test results
            </p>
          </div>

          {message && (
            <Alert color={messageType} className="mb-4">
              <div className="flex items-center">
                {messageType === 'success' ? (
                  <HiCheckCircle className="mr-2" />
                ) : (
                  <HiExclamationCircle className="mr-2" />
                )}
                {message}
              </div>
            </Alert>
          )}

          <Button 
            onClick={handleImport} 
            disabled={!file || loading}
            color="blue"
            className="w-full"
          >
            {loading ? (
              <>
                <Spinner size="sm" light={true} className="mr-2" />
                Importing...
              </>
            ) : (
              <>
                <HiUpload className="mr-2" />
                Import Test Results
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TestImport;