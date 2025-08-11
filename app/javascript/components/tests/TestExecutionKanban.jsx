import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Badge, 
  Button, 
  Modal, 
  Textarea, 
  Select,
  Alert,
  Spinner,
  Avatar,
  Tooltip
} from 'flowbite-react';
import { 
  HiPlay, 
  HiCheck, 
  HiX, 
  HiClock,
  HiExclamation,
  HiRefresh,
  HiFilter,
  HiPlus
} from 'react-icons/hi';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TestExecutionKanban = () => {
  const [columns, setColumns] = useState({
    'todo': {
      id: 'todo',
      title: 'To Do',
      color: 'gray',
      icon: HiClock,
      testCases: []
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      color: 'warning',
      icon: HiPlay,
      testCases: []
    },
    'blocked': {
      id: 'blocked',
      title: 'Blocked',
      color: 'failure',
      icon: HiExclamation,
      testCases: []
    },
    'passed': {
      id: 'passed',
      title: 'Passed',
      color: 'success',
      icon: HiCheck,
      testCases: []
    },
    'failed': {
      id: 'failed',
      title: 'Failed',
      color: 'failure',
      icon: HiX,
      testCases: []
    }
  });

  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [showExecutionModal, setShowExecutionModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const [executionData, setExecutionData] = useState({
    status: '',
    actualResult: '',
    notes: '',
    defectId: '',
    executionTime: '',
    screenshots: []
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockTestCases = [
      {
        id: 'tc-1',
        title: 'User Login with Valid Credentials',
        description: 'Verify that users can log in with valid username and password',
        priority: 'high',
        category: 'Authentication',
        estimatedTime: 15,
        assignedTo: 'john.doe@example.com',
        status: 'todo',
        steps: ['Navigate to login page', 'Enter valid credentials', 'Click login button'],
        expectedResult: 'User should be redirected to dashboard',
        preconditions: 'User account must exist in the system'
      },
      {
        id: 'tc-2',
        title: 'Dashboard Navigation Test',
        description: 'Test all navigation elements on the main dashboard',
        priority: 'medium',
        category: 'UI/UX',
        estimatedTime: 10,
        assignedTo: 'jane.smith@example.com',
        status: 'in-progress',
        steps: ['Login to application', 'Navigate to dashboard', 'Click each menu item'],
        expectedResult: 'All navigation links should work correctly',
        preconditions: 'User must be logged in'
      },
      {
        id: 'tc-3',
        title: 'Form Validation Test',
        description: 'Verify form validation for required fields',
        priority: 'medium',
        category: 'Validation',
        estimatedTime: 20,
        assignedTo: 'john.doe@example.com',
        status: 'blocked',
        steps: ['Navigate to form', 'Leave required fields empty', 'Submit form'],
        expectedResult: 'Validation errors should be displayed',
        preconditions: 'Form must be accessible'
      },
      {
        id: 'tc-4',
        title: 'Data Export Functionality',
        description: 'Test export of data to CSV format',
        priority: 'low',
        category: 'Export',
        estimatedTime: 25,
        assignedTo: 'jane.smith@example.com',
        status: 'passed',
        steps: ['Navigate to data page', 'Select data to export', 'Click export button'],
        expectedResult: 'CSV file should be downloaded successfully',
        preconditions: 'Data must be available in the system'
      },
      {
        id: 'tc-5',
        title: 'Password Reset Flow',
        description: 'Verify password reset functionality works correctly',
        priority: 'high',
        category: 'Authentication',
        estimatedTime: 30,
        assignedTo: 'john.doe@example.com',
        status: 'failed',
        steps: ['Click forgot password', 'Enter email', 'Check email and click reset link'],
        expectedResult: 'User should be able to reset password successfully',
        preconditions: 'User account must exist'
      }
    ];

    // Distribute test cases into columns
    const newColumns = { ...columns };
    mockTestCases.forEach(testCase => {
      newColumns[testCase.status].testCases.push(testCase);
    });

    setColumns(newColumns);
    setLoading(false);
  }, []);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const testCase = sourceColumn.testCases.find(tc => tc.id === draggableId);

    // Remove from source
    const newSourceTestCases = Array.from(sourceColumn.testCases);
    newSourceTestCases.splice(source.index, 1);

    // Add to destination
    const newDestTestCases = Array.from(destColumn.testCases);
    newDestTestCases.splice(destination.index, 0, { ...testCase, status: destination.droppableId });

    // Update state
    const newColumns = {
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        testCases: newSourceTestCases
      },
      [destination.droppableId]: {
        ...destColumn,
        testCases: newDestTestCases
      }
    };

    setColumns(newColumns);

    // Update status in backend
    try {
      await fetch(`/api/test_executions/${draggableId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: destination.droppableId })
      });
    } catch (error) {
      console.error('Failed to update test case status:', error);
      setAlert({ type: 'failure', message: 'Failed to update test case status' });
    }
  };

  const handleExecuteTest = (testCase) => {
    setSelectedTestCase(testCase);
    setExecutionData({
      status: testCase.status || 'in-progress',
      actualResult: '',
      notes: '',
      defectId: '',
      executionTime: '',
      screenshots: []
    });
    setShowExecutionModal(true);
  };

  const handleSaveExecution = async () => {
    try {
      const response = await fetch(`/api/test_executions/${selectedTestCase.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...executionData,
          testCaseId: selectedTestCase.id,
          executedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        // Update the test case status in the Kanban board
        const newColumns = { ...columns };
        const currentColumn = Object.values(newColumns).find(col => 
          col.testCases.some(tc => tc.id === selectedTestCase.id)
        );
        
        if (currentColumn) {
          const testCaseIndex = currentColumn.testCases.findIndex(tc => tc.id === selectedTestCase.id);
          currentColumn.testCases[testCaseIndex] = {
            ...currentColumn.testCases[testCaseIndex],
            status: executionData.status
          };

          // Move to appropriate column if status changed
          if (executionData.status !== currentColumn.id) {
            const testCase = currentColumn.testCases.splice(testCaseIndex, 1)[0];
            newColumns[executionData.status].testCases.push({
              ...testCase,
              status: executionData.status
            });
          }
        }

        setColumns(newColumns);
        setShowExecutionModal(false);
        setAlert({ type: 'success', message: 'Test execution saved successfully' });
      }
    } catch (error) {
      console.error('Failed to save test execution:', error);
      setAlert({ type: 'failure', message: 'Failed to save test execution' });
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'failure',
      high: 'warning',
      medium: 'info',
      low: 'gray'
    };
    return colors[priority] || 'gray';
  };

  const getColumnStats = (columnId) => {
    const testCases = columns[columnId].testCases;
    const totalTime = testCases.reduce((sum, tc) => sum + (tc.estimatedTime || 0), 0);
    return {
      count: testCases.length,
      totalTime
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" />
        <span className="ml-2">Loading test execution board...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Test Execution Board</h1>
          <p className="text-gray-600 mt-2">Track and manage manual test case execution</p>
        </div>
        <div className="flex gap-2">
          <Button color="gray" size="sm">
            <HiFilter className="mr-2" />
            Filters
          </Button>
          <Button color="blue" size="sm">
            <HiPlus className="mr-2" />
            Add Test Case
          </Button>
          <Button color="gray" size="sm">
            <HiRefresh className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <Alert color={alert.type} className="mb-6" onDismiss={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {Object.values(columns).map((column) => {
            const stats = getColumnStats(column.id);
            const IconComponent = column.icon;

            return (
              <div key={column.id} className="bg-gray-50 rounded-lg p-4">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <IconComponent className="w-5 h-5 mr-2" />
                    <h3 className="font-semibold text-gray-900">{column.title}</h3>
                  </div>
                  <Badge color={column.color} size="sm">
                    {stats.count}
                  </Badge>
                </div>

                {/* Column Stats */}
                <div className="text-xs text-gray-500 mb-4">
                  Total time: {stats.totalTime} min
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[400px] space-y-3 ${
                        snapshot.isDraggingOver ? 'bg-blue-50 border-2 border-blue-200 border-dashed rounded-lg p-2' : ''
                      }`}
                    >
                      {column.testCases.map((testCase, index) => (
                        <Draggable key={testCase.id} draggableId={testCase.id} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`cursor-move hover:shadow-lg transition-shadow ${
                                snapshot.isDragging ? 'rotate-2 shadow-xl' : ''
                              }`}
                            >
                              <div className="p-4">
                                {/* Test Case Header */}
                                <div className="flex justify-between items-start mb-3">
                                  <h4 className="font-semibold text-sm text-gray-900 line-clamp-2">
                                    {testCase.title}
                                  </h4>
                                  <Badge color={getPriorityColor(testCase.priority)} size="xs">
                                    {testCase.priority}
                                  </Badge>
                                </div>

                                {/* Test Case Description */}
                                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                  {testCase.description}
                                </p>

                                {/* Test Case Meta */}
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                  <span className="flex items-center">
                                    <HiClock className="w-3 h-3 mr-1" />
                                    {testCase.estimatedTime}m
                                  </span>
                                  <Badge color="info" size="xs">
                                    {testCase.category}
                                  </Badge>
                                </div>

                                {/* Assignee */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <Avatar
                                      img={`https://ui-avatars.com/api/?name=${testCase.assignedTo}&size=24`}
                                      size="xs"
                                      rounded
                                    />
                                    <Tooltip content={testCase.assignedTo}>
                                      <span className="ml-2 text-xs text-gray-600 truncate max-w-20">
                                        {testCase.assignedTo.split('@')[0]}
                                      </span>
                                    </Tooltip>
                                  </div>

                                  <Button
                                    size="xs"
                                    color="blue"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleExecuteTest(testCase);
                                    }}
                                  >
                                    <HiPlay className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Test Execution Modal */}
      <Modal show={showExecutionModal} onClose={() => setShowExecutionModal(false)} size="5xl">
        <Modal.Header>
          Execute Test Case: {selectedTestCase?.title}
        </Modal.Header>
        <Modal.Body>
          {selectedTestCase && (
            <div className="space-y-6">
              {/* Test Case Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Test Case Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Category:</span> {selectedTestCase.category}
                  </div>
                  <div>
                    <span className="font-medium">Priority:</span> 
                    <Badge color={getPriorityColor(selectedTestCase.priority)} size="xs" className="ml-2">
                      {selectedTestCase.priority}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Estimated Time:</span> {selectedTestCase.estimatedTime} minutes
                  </div>
                  <div>
                    <span className="font-medium">Assigned To:</span> {selectedTestCase.assignedTo}
                  </div>
                </div>
              </div>

              {/* Preconditions */}
              <div>
                <h5 className="font-semibold mb-2">Preconditions</h5>
                <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400 text-sm">
                  {selectedTestCase.preconditions}
                </div>
              </div>

              {/* Test Steps */}
              <div>
                <h5 className="font-semibold mb-2">Test Steps</h5>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  {selectedTestCase.steps.map((step, index) => (
                    <li key={index} className="pl-2">{step}</li>
                  ))}
                </ol>
              </div>

              {/* Expected Result */}
              <div>
                <h5 className="font-semibold mb-2">Expected Result</h5>
                <div className="bg-green-50 p-3 rounded border-l-4 border-green-400 text-sm">
                  {selectedTestCase.expectedResult}
                </div>
              </div>

              {/* Execution Form */}
              <div className="border-t pt-6">
                <h4 className="font-semibold mb-4">Execution Results</h4>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <Select
                      value={executionData.status}
                      onChange={(e) => setExecutionData({ ...executionData, status: e.target.value })}
                    >
                      <option value="in-progress">In Progress</option>
                      <option value="passed">Passed</option>
                      <option value="failed">Failed</option>
                      <option value="blocked">Blocked</option>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Execution Time (minutes)
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      value={executionData.executionTime}
                      onChange={(e) => setExecutionData({ ...executionData, executionTime: e.target.value })}
                      placeholder="Actual time taken"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Actual Result
                  </label>
                  <Textarea
                    rows={4}
                    value={executionData.actualResult}
                    onChange={(e) => setExecutionData({ ...executionData, actualResult: e.target.value })}
                    placeholder="Describe what actually happened during test execution..."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes & Comments
                  </label>
                  <Textarea
                    rows={3}
                    value={executionData.notes}
                    onChange={(e) => setExecutionData({ ...executionData, notes: e.target.value })}
                    placeholder="Additional notes, observations, or comments..."
                  />
                </div>

                {executionData.status === 'failed' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Defect/Bug ID (Optional)
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      value={executionData.defectId}
                      onChange={(e) => setExecutionData({ ...executionData, defectId: e.target.value })}
                      placeholder="Enter defect or bug tracking ID"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-between w-full">
            <Button color="gray" onClick={() => setShowExecutionModal(false)}>
              Cancel
            </Button>
            <Button color="blue" onClick={handleSaveExecution}>
              Save Execution
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TestExecutionKanban;