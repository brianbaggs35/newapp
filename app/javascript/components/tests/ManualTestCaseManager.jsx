import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Modal, 
  Card, 
  Table, 
  Badge, 
  TextInput, 
  Textarea, 
  Select, 
  Alert,
  Spinner,
  Dropdown
} from 'flowbite-react';
import { 
  HiPlus, 
  HiPencil, 
  HiTrash, 
  HiEye, 
  HiClipboardCheck,
  HiSearch,
  HiFilter,
  HiDotsVertical
} from 'react-icons/hi';
import RichTextEditor from './RichTextEditor';

const ManualTestCaseManager = () => {
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [alert, setAlert] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    preconditions: '',
    steps: '',
    expectedResult: '',
    actualResult: '',
    priority: 'medium',
    status: 'draft',
    category: '',
    tags: '',
    estimatedTime: ''
  });

  const priorities = [
    { value: 'critical', label: 'Critical', color: 'failure' },
    { value: 'high', label: 'High', color: 'warning' },
    { value: 'medium', label: 'Medium', color: 'info' },
    { value: 'low', label: 'Low', color: 'gray' }
  ];

  const statuses = [
    { value: 'draft', label: 'Draft', color: 'gray' },
    { value: 'review', label: 'In Review', color: 'warning' },
    { value: 'approved', label: 'Approved', color: 'success' },
    { value: 'deprecated', label: 'Deprecated', color: 'failure' }
  ];

  useEffect(() => {
    fetchTestCases();
  }, []);

  const fetchTestCases = async () => {
    try {
      setLoading(true);
      // Mock API call - replace with actual endpoint
      const response = await fetch('/api/manual_test_cases');
      if (response.ok) {
        const data = await response.json();
        setTestCases(data);
      } else {
        // Mock data for development
        setTestCases([
          {
            id: 1,
            title: 'User Login Test',
            description: 'Test user authentication functionality',
            priority: 'high',
            status: 'approved',
            category: 'Authentication',
            tags: 'login, auth, security',
            estimatedTime: '15',
            createdAt: '2025-01-15T10:00:00Z',
            updatedAt: '2025-01-15T10:00:00Z'
          },
          {
            id: 2,
            title: 'Dashboard Navigation Test',
            description: 'Verify all dashboard navigation elements work correctly',
            priority: 'medium',
            status: 'draft',
            category: 'UI/UX',
            tags: 'navigation, dashboard',
            estimatedTime: '10',
            createdAt: '2025-01-15T11:00:00Z',
            updatedAt: '2025-01-15T11:00:00Z'
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch test cases:', error);
      setAlert({ type: 'failure', message: 'Failed to load test cases' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setSelectedTestCase(null);
    setFormData({
      title: '',
      description: '',
      preconditions: '',
      steps: '',
      expectedResult: '',
      actualResult: '',
      priority: 'medium',
      status: 'draft',
      category: '',
      tags: '',
      estimatedTime: ''
    });
    setShowModal(true);
  };

  const handleEdit = (testCase) => {
    setModalMode('edit');
    setSelectedTestCase(testCase);
    setFormData({
      title: testCase.title || '',
      description: testCase.description || '',
      preconditions: testCase.preconditions || '',
      steps: testCase.steps || '',
      expectedResult: testCase.expectedResult || '',
      actualResult: testCase.actualResult || '',
      priority: testCase.priority || 'medium',
      status: testCase.status || 'draft',
      category: testCase.category || '',
      tags: testCase.tags || '',
      estimatedTime: testCase.estimatedTime || ''
    });
    setShowModal(true);
  };

  const handleView = (testCase) => {
    setModalMode('view');
    setSelectedTestCase(testCase);
    setFormData({
      title: testCase.title || '',
      description: testCase.description || '',
      preconditions: testCase.preconditions || '',
      steps: testCase.steps || '',
      expectedResult: testCase.expectedResult || '',
      actualResult: testCase.actualResult || '',
      priority: testCase.priority || 'medium',
      status: testCase.status || 'draft',
      category: testCase.category || '',
      tags: testCase.tags || '',
      estimatedTime: testCase.estimatedTime || ''
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const url = modalMode === 'create' ? '/api/manual_test_cases' : `/api/manual_test_cases/${selectedTestCase.id}`;
      const method = modalMode === 'create' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchTestCases();
        setShowModal(false);
        setAlert({ 
          type: 'success', 
          message: `Test case ${modalMode === 'create' ? 'created' : 'updated'} successfully` 
        });
      } else {
        throw new Error('Failed to save test case');
      }
    } catch (error) {
      console.error('Failed to save test case:', error);
      setAlert({ type: 'failure', message: 'Failed to save test case' });
    }
  };

  const handleDelete = async (testCaseId) => {
    if (!window.confirm('Are you sure you want to delete this test case?')) {
      return;
    }

    try {
      const response = await fetch(`/api/manual_test_cases/${testCaseId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchTestCases();
        setAlert({ type: 'success', message: 'Test case deleted successfully' });
      } else {
        throw new Error('Failed to delete test case');
      }
    } catch (error) {
      console.error('Failed to delete test case:', error);
      setAlert({ type: 'failure', message: 'Failed to delete test case' });
    }
  };

  const filteredTestCases = testCases.filter(testCase => {
    const matchesSearch = testCase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testCase.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testCase.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || testCase.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || testCase.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityBadge = (priority) => {
    const config = priorities.find(p => p.value === priority) || priorities[2];
    return (
      <Badge color={config.color} size="sm">
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    const config = statuses.find(s => s.value === status) || statuses[0];
    return (
      <Badge color={config.color} size="sm">
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" />
        <span className="ml-2">Loading test cases...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manual Test Cases</h1>
          <p className="text-gray-600 mt-2">Create and manage manual test cases for comprehensive testing</p>
        </div>
        <Button color="blue" onClick={handleCreate}>
          <HiPlus className="mr-2" />
          Create Test Case
        </Button>
      </div>

      {/* Alert */}
      {alert && (
        <Alert color={alert.type} className="mb-6" onDismiss={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <TextInput
                type="text"
                placeholder="Search test cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={HiSearch}
              />
            </div>
            <div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                {priorities.map(priority => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex items-center justify-end">
              <Button color="gray" size="sm">
                <HiFilter className="mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Test Cases Table */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Test Cases ({filteredTestCases.length})</h3>
          </div>
          
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Priority</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Est. Time</Table.HeadCell>
                <Table.HeadCell>Updated</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {filteredTestCases.map((testCase) => (
                  <Table.Row key={testCase.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      <div>
                        <div className="font-semibold">{testCase.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {testCase.description}
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color="info" size="sm">
                        {testCase.category || 'Uncategorized'}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      {getPriorityBadge(testCase.priority)}
                    </Table.Cell>
                    <Table.Cell>
                      {getStatusBadge(testCase.status)}
                    </Table.Cell>
                    <Table.Cell>
                      {testCase.estimatedTime ? `${testCase.estimatedTime} min` : 'N/A'}
                    </Table.Cell>
                    <Table.Cell>
                      {new Date(testCase.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Dropdown 
                        label=""
                        dismissOnClick={false}
                        renderTrigger={() => (
                          <Button size="xs" color="gray" pill>
                            <HiDotsVertical />
                          </Button>
                        )}
                      >
                        <Dropdown.Item 
                          icon={HiEye}
                          onClick={() => handleView(testCase)}
                        >
                          View
                        </Dropdown.Item>
                        <Dropdown.Item 
                          icon={HiPencil}
                          onClick={() => handleEdit(testCase)}
                        >
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item 
                          icon={HiClipboardCheck}
                          onClick={() => {/* Navigate to execution */}}
                        >
                          Execute
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item 
                          icon={HiTrash}
                          onClick={() => handleDelete(testCase.id)}
                          className="text-red-600"
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>

          {filteredTestCases.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No test cases found matching your criteria.</p>
              <Button color="blue" className="mt-4" onClick={handleCreate}>
                <HiPlus className="mr-2" />
                Create Your First Test Case
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Modal for Create/Edit/View */}
      <Modal show={showModal} onClose={() => setShowModal(false)} size="6xl">
        <Modal.Header>
          {modalMode === 'create' && 'Create New Test Case'}
          {modalMode === 'edit' && 'Edit Test Case'}
          {modalMode === 'view' && 'View Test Case'}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <TextInput
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter test case title"
                  disabled={modalMode === 'view'}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <TextInput
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Authentication, UI/UX"
                  disabled={modalMode === 'view'}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <Select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  disabled={modalMode === 'view'}
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  disabled={modalMode === 'view'}
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Time (minutes)
                </label>
                <TextInput
                  type="number"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                  placeholder="15"
                  disabled={modalMode === 'view'}
                  min="1"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <RichTextEditor
                content={formData.description}
                onChange={(content) => setFormData({ ...formData, description: content })}
                readOnly={modalMode === 'view'}
                placeholder="Describe what this test case validates..."
              />
            </div>

            {/* Preconditions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preconditions
              </label>
              <RichTextEditor
                content={formData.preconditions}
                onChange={(content) => setFormData({ ...formData, preconditions: content })}
                readOnly={modalMode === 'view'}
                placeholder="What conditions must be met before executing this test..."
              />
            </div>

            {/* Test Steps */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Steps *
              </label>
              <RichTextEditor
                content={formData.steps}
                onChange={(content) => setFormData({ ...formData, steps: content })}
                readOnly={modalMode === 'view'}
                placeholder="1. Step one description&#10;2. Step two description&#10;3. Step three description..."
              />
            </div>

            {/* Expected Result */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Result *
              </label>
              <RichTextEditor
                content={formData.expectedResult}
                onChange={(content) => setFormData({ ...formData, expectedResult: content })}
                readOnly={modalMode === 'view'}
                placeholder="Describe what should happen when the test steps are executed correctly..."
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <TextInput
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="login, security, smoke-test"
                disabled={modalMode === 'view'}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-between w-full">
            <Button color="gray" onClick={() => setShowModal(false)}>
              {modalMode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {modalMode !== 'view' && (
              <Button color="blue" onClick={handleSave}>
                {modalMode === 'create' ? 'Create Test Case' : 'Update Test Case'}
              </Button>
            )}
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManualTestCaseManager;