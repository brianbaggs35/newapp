import React, { useState } from 'react';
import { Card, Button, Badge, Table, Modal, TextInput, FileInput, Progress } from 'flowbite-react';
import { HiUpload, HiTrash, HiPencil, HiEye } from 'react-icons/hi';

interface TestRun {
  uuid: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total_tests: number;
  passed_tests: number;
  failed_tests: number;
  skipped_tests: number;
  duration_formatted: string;
  created_at: string;
  created_by: {
    email: string;
  };
}

interface AutomatedTestUploadProps {
  testRuns: TestRun[];
  onUpload: (file: File, name?: string) => Promise<void>;
  onRename: (uuid: string, name: string) => Promise<void>;
  onDelete: (uuid: string) => Promise<void>;
}

export default function AutomatedTestUpload({ 
  testRuns, 
  onUpload, 
  onRename, 
  onDelete 
}: AutomatedTestUploadProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [testRunName, setTestRunName] = useState('');
  const [renameTestRun, setRenameTestRun] = useState<TestRun | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate progress for UI feedback
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 200);
    
    try {
      await onUpload(selectedFile, testRunName || undefined);
      setUploadProgress(100);
      
      // Reset form
      setSelectedFile(null);
      setTestRunName('');
      setIsUploadModalOpen(false);
      
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      clearInterval(progressInterval);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRename = async () => {
    if (!renameTestRun || !testRunName) return;
    
    try {
      await onRename(renameTestRun.uuid, testRunName);
      setIsRenameModalOpen(false);
      setRenameTestRun(null);
      setTestRunName('');
    } catch (error) {
      console.error('Rename failed:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'yellow',
      processing: 'blue', 
      completed: 'green',
      failed: 'red'
    };
    return <Badge color={colors[status] || 'gray'}>{status}</Badge>;
  };

  const getSuccessRate = (testRun: TestRun) => {
    if (testRun.total_tests === 0) return 0;
    return Math.round((testRun.passed_tests / testRun.total_tests) * 100);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Test Upload</h1>
          <p className="text-gray-600 mt-2">
            Upload JUnit or TestNG XML files to analyze test results
          </p>
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)} className="bg-blue-600">
          <HiUpload className="mr-2 h-5 w-5" />
          Upload Test Results
        </Button>
      </div>

      {/* Test Runs Table */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Test Runs</h2>
          
          {testRuns.length === 0 ? (
            <div className="text-center py-8">
              <HiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No test runs yet</h3>
              <p className="text-gray-600 mb-4">Upload your first JUnit or TestNG XML file to get started</p>
              <Button onClick={() => setIsUploadModalOpen(true)} className="bg-blue-600">
                Upload Test Results
              </Button>
            </div>
          ) : (
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Tests</Table.HeadCell>
                <Table.HeadCell>Success Rate</Table.HeadCell>
                <Table.HeadCell>Duration</Table.HeadCell>
                <Table.HeadCell>Uploaded By</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {testRuns.map((testRun) => (
                  <Table.Row key={testRun.uuid} className="bg-white border-b">
                    <Table.Cell className="font-medium text-gray-900">
                      {testRun.name}
                    </Table.Cell>
                    <Table.Cell>
                      {getStatusBadge(testRun.status)}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex space-x-2">
                        <Badge color="green">{testRun.passed_tests}P</Badge>
                        <Badge color="red">{testRun.failed_tests}F</Badge>
                        <Badge color="yellow">{testRun.skipped_tests}S</Badge>
                        <Badge color="gray">{testRun.total_tests}T</Badge>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center">
                        <span className="mr-2">{getSuccessRate(testRun)}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${getSuccessRate(testRun)}%` }}
                          ></div>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>{testRun.duration_formatted}</Table.Cell>
                    <Table.Cell>{testRun.created_by.email}</Table.Cell>
                    <Table.Cell>
                      <div className="flex space-x-2">
                        <Button
                          size="xs"
                          color="blue"
                          href={`/automated_testing/test_results/${testRun.uuid}`}
                        >
                          <HiEye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="xs"
                          color="yellow"
                          onClick={() => {
                            setRenameTestRun(testRun);
                            setTestRunName(testRun.name);
                            setIsRenameModalOpen(true);
                          }}
                        >
                          <HiPencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="xs"
                          color="red"
                          onClick={() => onDelete(testRun.uuid)}
                        >
                          <HiTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </div>
      </Card>

      {/* Upload Modal */}
      <Modal show={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)}>
        <Modal.Header>Upload Test Results</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Run Name (Optional)
              </label>
              <TextInput
                placeholder="Leave empty to auto-generate from XML"
                value={testRunName}
                onChange={(e) => setTestRunName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                XML File
              </label>
              <FileInput
                accept=".xml"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              <p className="text-sm text-gray-500 mt-1">
                Supported formats: JUnit XML, TestNG XML
              </p>
            </div>
            
            {isUploading && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Progress
                </label>
                <Progress progress={uploadProgress} />
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading}
            className="bg-blue-600"
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
          <Button color="gray" onClick={() => setIsUploadModalOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Rename Modal */}
      <Modal show={isRenameModalOpen} onClose={() => setIsRenameModalOpen(false)}>
        <Modal.Header>Rename Test Run</Modal.Header>
        <Modal.Body>
          <TextInput
            placeholder="Enter new name"
            value={testRunName}
            onChange={(e) => setTestRunName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleRename} disabled={!testRunName} className="bg-blue-600">
            Save
          </Button>
          <Button color="gray" onClick={() => setIsRenameModalOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}