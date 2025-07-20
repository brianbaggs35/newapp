import React, { useState } from 'react';
import { Table, Badge, Button, Card, Modal, Textarea } from 'flowbite-react';
import { HiEye, HiClock, HiCheckCircle, HiXCircle, HiExclamation } from 'react-icons/hi';

const TestCaseDetails = ({ testSuite, testCases }) => {
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [showFailureModal, setShowFailureModal] = useState(false);

  const formatDuration = (seconds) => {
    if (!seconds) return '0.00s';
    return `${seconds.toFixed(3)}s`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      passed: { color: 'success', icon: HiCheckCircle, text: 'Passed' },
      failed: { color: 'failure', icon: HiXCircle, text: 'Failed' },
      error: { color: 'failure', icon: HiXCircle, text: 'Error' },
      skipped: { color: 'warning', icon: HiExclamation, text: 'Skipped' },
      pending: { color: 'gray', icon: HiClock, text: 'Pending' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge color={config.color} className="flex items-center">
        <Icon className="mr-1 h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const handleViewFailure = (testCase) => {
    setSelectedTestCase(testCase);
    setShowFailureModal(true);
  };

  const getStatusCounts = () => {
    const counts = {
      passed: 0,
      failed: 0,
      error: 0,
      skipped: 0,
      pending: 0
    };

    testCases.forEach(testCase => {
      counts[testCase.status] = (counts[testCase.status] || 0) + 1;
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Test Suite Summary */}
      <Card>
        <div className="p-4">
          <h4 className="text-lg font-semibold mb-4">Test Suite Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{testSuite.total_tests}</div>
              <div className="text-sm text-gray-500">Total Tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{statusCounts.passed}</div>
              <div className="text-sm text-gray-500">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{statusCounts.failed + statusCounts.error}</div>
              <div className="text-sm text-gray-500">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.skipped}</div>
              <div className="text-sm text-gray-500">Skipped</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600 mb-2">Success Rate: {testSuite.success_rate}%</div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${testSuite.success_rate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Test Cases Table */}
      <Card>
        <div className="p-6">
          <h4 className="text-lg font-semibold mb-4">Test Cases ({testCases.length})</h4>
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Test Name</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Duration</Table.HeadCell>
                <Table.HeadCell>Error Type</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {testCases.map((testCase) => (
                  <Table.Row key={testCase.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      <div>
                        <div className="font-semibold">{testCase.name}</div>
                        <div className="text-sm text-gray-500">{testCase.description}</div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      {getStatusBadge(testCase.status)}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center">
                        <HiClock className="mr-1 h-4 w-4 text-gray-400" />
                        {formatDuration(testCase.duration)}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      {testCase.error_type && (
                        <Badge color="failure" size="sm">
                          {testCase.error_type}
                        </Badge>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {(testCase.status === 'failed' || testCase.status === 'error') && testCase.failure_message && (
                        <Button
                          size="xs"
                          color="red"
                          onClick={() => handleViewFailure(testCase)}
                        >
                          <HiEye className="mr-1" />
                          View Error
                        </Button>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      </Card>

      {/* Failure Details Modal */}
      <Modal show={showFailureModal} onClose={() => setShowFailureModal(false)} size="4xl">
        <Modal.Header>
          Test Failure Details: {selectedTestCase?.name}
        </Modal.Header>
        <Modal.Body>
          {selectedTestCase && (
            <div className="space-y-4">
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Test Information</h5>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Name:</span> {selectedTestCase.name}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> {getStatusBadge(selectedTestCase.status)}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span> {formatDuration(selectedTestCase.duration)}
                    </div>
                    <div>
                      <span className="font-medium">Error Type:</span> {selectedTestCase.error_type || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedTestCase.failure_message && (
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Failure Message</h5>
                  <Textarea
                    value={selectedTestCase.failure_message}
                    readOnly
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setShowFailureModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TestCaseDetails;