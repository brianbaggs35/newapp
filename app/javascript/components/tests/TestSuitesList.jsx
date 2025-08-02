import React, { useState } from 'react';
import { Table, Button, Badge, Modal, Card } from 'flowbite-react';
import { HiEye, HiTrash, HiExclamationCircle } from 'react-icons/hi';
import TestCaseDetails from './TestCaseDetails';

const TestSuitesList = ({ testSuites, onDelete, onRefresh }) => {
  const [selectedSuite, setSelectedSuite] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [suiteToDelete, setSuiteToDelete] = useState(null);

  const formatDuration = (seconds) => {
    if (!seconds) return '0s';
    if (seconds < 60) return `${seconds.toFixed(2)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
  };

  const getStatusBadge = (suite) => {
    if (suite.failed_tests > 0) {
      return <Badge color="failure">Failed</Badge>;
    } else if (suite.skipped_tests > 0) {
      return <Badge color="warning">Partial</Badge>;
    } else {
      return <Badge color="success">Passed</Badge>;
    }
  };

  const handleViewDetails = async (suite) => {
    try {
      const response = await fetch(`/tests/${suite.id}`);
      const data = await response.json();
      setSelectedSuite(data);
      setShowDetailsModal(true);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch test details:', error);
    }
  };

  const handleDeleteClick = (suite) => {
    setSuiteToDelete(suite);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!suiteToDelete) return;

    try {
      const response = await fetch(`/tests/${suiteToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content || ''
        }
      });

      if (response.ok) {
        onDelete?.(suiteToDelete.id);
        setShowDeleteModal(false);
        setSuiteToDelete(null);
        onRefresh?.();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete test suite:', error);
    }
  };

  if (!testSuites || testSuites.length === 0) {
    return (
      <Card>
        <div className="p-8 text-center">
          <p className="text-gray-500">No test suites found. Import some JUnit XML files to get started.</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Suites</h3>
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Project</Table.HeadCell>
                <Table.HeadCell>Tests</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Success Rate</Table.HeadCell>
                <Table.HeadCell>Duration</Table.HeadCell>
                <Table.HeadCell>Executed</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {testSuites.map((suite) => (
                  <Table.Row key={suite.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {suite.name}
                    </Table.Cell>
                    <Table.Cell>{suite.project}</Table.Cell>
                    <Table.Cell>
                      <div className="text-sm">
                        <div className="text-green-600">{suite.passed_tests} passed</div>
                        {suite.failed_tests > 0 && (
                          <div className="text-red-600">{suite.failed_tests} failed</div>
                        )}
                        {suite.skipped_tests > 0 && (
                          <div className="text-yellow-600">{suite.skipped_tests} skipped</div>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell>{getStatusBadge(suite)}</Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${suite.success_rate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{suite.success_rate}%</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>{formatDuration(suite.total_duration)}</Table.Cell>
                    <Table.Cell>
                      {suite.executed_at ? new Date(suite.executed_at).toLocaleDateString() : 'N/A'}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex space-x-2">
                        <Button
                          size="xs"
                          color="blue"
                          onClick={() => handleViewDetails(suite)}
                        >
                          <HiEye className="mr-1" />
                          View
                        </Button>
                        <Button
                          size="xs"
                          color="failure"
                          onClick={() => handleDeleteClick(suite)}
                        >
                          <HiTrash className="mr-1" />
                          Delete
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      </Card>

      {/* Details Modal */}
      <Modal show={showDetailsModal} onClose={() => setShowDetailsModal(false)} size="7xl">
        <Modal.Header>
          Test Suite Details: {selectedSuite?.test_suite?.name}
        </Modal.Header>
        <Modal.Body>
          {selectedSuite && (
            <TestCaseDetails 
              testSuite={selectedSuite.test_suite}
              testCases={selectedSuite.test_cases}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} size="md">
        <Modal.Header>
          <HiExclamationCircle className="text-red-600 mr-2" />
          Confirm Delete
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the test suite &quot;{suiteToDelete?.name}&quot;? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="failure" onClick={handleDeleteConfirm}>
            Delete
          </Button>
          <Button color="gray" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TestSuitesList;