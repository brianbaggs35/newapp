import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Select,
  DatePicker,
  Badge,
  Table,
  Spinner,
  Alert,
  Progress
} from 'flowbite-react';
import { 
  HiDownload, 
  HiPrinter,
  HiChartBar,
  HiDocumentReport,
  HiCalendar,
  HiTrendingUp,
  HiTrendingDown,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiExclamation
} from 'react-icons/hi';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const TestReporting = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date()
  });
  const [reportType, setReportType] = useState('summary');
  const [selectedProject, setSelectedProject] = useState('all');
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchReportData();
  }, [dateRange, reportType, selectedProject]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      // Mock API call - replace with actual endpoint
      const response = await fetch(`/api/reports/test_execution?` + new URLSearchParams({
        start_date: dateRange.start.toISOString(),
        end_date: dateRange.end.toISOString(),
        report_type: reportType,
        project: selectedProject
      }));

      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      } else {
        // Mock data for development
        setReportData({
          summary: {
            totalTestCases: 145,
            totalExecutions: 1250,
            passedExecutions: 1050,
            failedExecutions: 150,
            blockedExecutions: 50,
            avgExecutionTime: 12.5,
            testCoverage: 87.3,
            defectsFound: 23,
            defectsFixed: 18
          },
          trends: {
            executionTrends: {
              labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
              datasets: [
                {
                  label: 'Passed',
                  data: [245, 280, 265, 310],
                  backgroundColor: 'rgba(34, 197, 94, 0.8)',
                  borderColor: 'rgb(34, 197, 94)',
                  borderWidth: 1
                },
                {
                  label: 'Failed',
                  data: [45, 38, 42, 35],
                  backgroundColor: 'rgba(239, 68, 68, 0.8)',
                  borderColor: 'rgb(239, 68, 68)',
                  borderWidth: 1
                },
                {
                  label: 'Blocked',
                  data: [15, 12, 18, 10],
                  backgroundColor: 'rgba(245, 158, 11, 0.8)',
                  borderColor: 'rgb(245, 158, 11)',
                  borderWidth: 1
                }
              ]
            },
            defectTrends: {
              labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
              datasets: [
                {
                  label: 'Defects Found',
                  data: [8, 6, 5, 4],
                  borderColor: 'rgb(239, 68, 68)',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  tension: 0.1
                },
                {
                  label: 'Defects Fixed',
                  data: [5, 7, 4, 2],
                  borderColor: 'rgb(34, 197, 94)',
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  tension: 0.1
                }
              ]
            }
          },
          distribution: {
            statusDistribution: {
              labels: ['Passed', 'Failed', 'Blocked'],
              datasets: [
                {
                  data: [84, 12, 4],
                  backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(245, 158, 11, 0.8)'
                  ],
                  borderColor: [
                    'rgb(34, 197, 94)',
                    'rgb(239, 68, 68)',
                    'rgb(245, 158, 11)'
                  ],
                  borderWidth: 1
                }
              ]
            },
            priorityDistribution: {
              labels: ['Critical', 'High', 'Medium', 'Low'],
              datasets: [
                {
                  data: [15, 35, 40, 10],
                  backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(107, 114, 128, 0.8)'
                  ],
                  borderColor: [
                    'rgb(239, 68, 68)',
                    'rgb(245, 158, 11)',
                    'rgb(59, 130, 246)',
                    'rgb(107, 114, 128)'
                  ],
                  borderWidth: 1
                }
              ]
            }
          },
          topFailedTests: [
            {
              id: 1,
              title: 'Login with invalid credentials',
              category: 'Authentication',
              failureRate: 85.5,
              lastFailed: '2025-01-15T10:30:00Z',
              defectId: 'BUG-123'
            },
            {
              id: 2,
              title: 'Form validation edge cases',
              category: 'Validation',
              failureRate: 72.3,
              lastFailed: '2025-01-14T15:45:00Z',
              defectId: 'BUG-124'
            },
            {
              id: 3,
              title: 'Data export timeout',
              category: 'Export',
              failureRate: 68.1,
              lastFailed: '2025-01-13T09:15:00Z',
              defectId: 'BUG-125'
            }
          ],
          testExecutors: [
            {
              name: 'John Doe',
              email: 'john.doe@example.com',
              totalExecutions: 450,
              passedExecutions: 380,
              avgExecutionTime: 11.2,
              efficiency: 84.4
            },
            {
              name: 'Jane Smith',
              email: 'jane.smith@example.com',
              totalExecutions: 380,
              passedExecutions: 340,
              avgExecutionTime: 13.8,
              efficiency: 89.5
            },
            {
              name: 'Mike Johnson',
              email: 'mike.johnson@example.com',
              totalExecutions: 420,
              passedExecutions: 330,
              avgExecutionTime: 12.6,
              efficiency: 78.6
            }
          ]
        });
      }
    } catch (error) {
      console.error('Failed to fetch report data:', error);
      setAlert({ type: 'failure', message: 'Failed to load report data' });
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await fetch('/api/reports/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format: 'pdf',
          reportType,
          dateRange,
          project: selectedProject
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `test-report-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setAlert({ type: 'success', message: 'Report exported successfully' });
      }
    } catch (error) {
      console.error('Failed to export report:', error);
      setAlert({ type: 'failure', message: 'Failed to export report' });
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch('/api/reports/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format: 'csv',
          reportType,
          dateRange,
          project: selectedProject
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `test-report-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setAlert({ type: 'success', message: 'Data exported successfully' });
      }
    } catch (error) {
      console.error('Failed to export data:', error);
      setAlert({ type: 'failure', message: 'Failed to export data' });
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      passed: HiCheckCircle,
      failed: HiXCircle,
      blocked: HiExclamation,
      pending: HiClock
    };
    return icons[status] || HiClock;
  };

  const getStatusColor = (status) => {
    const colors = {
      passed: 'success',
      failed: 'failure',
      blocked: 'warning',
      pending: 'gray'
    };
    return colors[status] || 'gray';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" />
        <span className="ml-2">Generating report...</span>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No report data available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Test Execution Reports</h1>
          <p className="text-gray-600 mt-2">Comprehensive testing analytics and insights</p>
        </div>
        <div className="flex gap-2">
          <Button color="gray" size="sm" onClick={handleExportCSV}>
            <HiDownload className="mr-2" />
            Export CSV
          </Button>
          <Button color="blue" size="sm" onClick={handleExportPDF}>
            <HiDocumentReport className="mr-2" />
            Export PDF
          </Button>
          <Button color="gray" size="sm" onClick={() => window.print()}>
            <HiPrinter className="mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <Alert color={alert.type} className="mb-6" onDismiss={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      {/* Filters */}
      <Card className="mb-8">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <Select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="summary">Summary Report</option>
                <option value="detailed">Detailed Report</option>
                <option value="trends">Trend Analysis</option>
                <option value="defects">Defect Analysis</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project
              </label>
              <Select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="all">All Projects</option>
                <option value="web-app">Web Application</option>
                <option value="mobile-app">Mobile Application</option>
                <option value="api">API Testing</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={dateRange.start.toISOString().split('T')[0]}
                onChange={(e) => setDateRange({ 
                  ...dateRange, 
                  start: new Date(e.target.value) 
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={dateRange.end.toISOString().split('T')[0]}
                onChange={(e) => setDateRange({ 
                  ...dateRange, 
                  end: new Date(e.target.value) 
                })}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Executive Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {reportData.summary.totalTestCases}
            </div>
            <div className="text-sm text-gray-600">Total Test Cases</div>
          </div>
        </Card>

        <Card>
          <div className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {((reportData.summary.passedExecutions / reportData.summary.totalExecutions) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Pass Rate</div>
            <Progress 
              progress={(reportData.summary.passedExecutions / reportData.summary.totalExecutions) * 100}
              color="green"
              size="sm"
              className="mt-2"
            />
          </div>
        </Card>

        <Card>
          <div className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {reportData.summary.avgExecutionTime}m
            </div>
            <div className="text-sm text-gray-600">Avg Execution Time</div>
          </div>
        </Card>

        <Card>
          <div className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {reportData.summary.defectsFound}
            </div>
            <div className="text-sm text-gray-600">Defects Found</div>
            <div className="text-xs text-gray-500 mt-1">
              {reportData.summary.defectsFixed} fixed
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Execution Trends */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <HiTrendingUp className="mr-2" />
              Execution Trends
            </h3>
            <Bar 
              data={reportData.trends.executionTrends}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true,
                  },
                },
              }}
            />
          </div>
        </Card>

        {/* Status Distribution */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <HiChartBar className="mr-2" />
              Status Distribution
            </h3>
            <Doughnut 
              data={reportData.distribution.statusDistribution}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </Card>

        {/* Defect Trends */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <HiTrendingDown className="mr-2" />
              Defect Trends
            </h3>
            <Line 
              data={reportData.trends.defectTrends}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <HiExclamation className="mr-2" />
              Priority Distribution
            </h3>
            <Doughnut 
              data={reportData.distribution.priorityDistribution}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </Card>
      </div>

      {/* Top Failed Tests */}
      <Card className="mb-8">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Failed Test Cases</h3>
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Test Case</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Failure Rate</Table.HeadCell>
                <Table.HeadCell>Last Failed</Table.HeadCell>
                <Table.HeadCell>Defect ID</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {reportData.topFailedTests.map((test) => (
                  <Table.Row key={test.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {test.title}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color="info" size="sm">
                        {test.category}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center">
                        <Progress 
                          progress={test.failureRate}
                          color="red"
                          size="sm"
                          className="w-20 mr-2"
                        />
                        <span className="text-sm font-medium text-red-600">
                          {test.failureRate}%
                        </span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      {new Date(test.lastFailed).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color="failure" size="sm">
                        {test.defectId}
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      </Card>

      {/* Test Executors Performance */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Test Executor Performance</h3>
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Executor</Table.HeadCell>
                <Table.HeadCell>Total Executions</Table.HeadCell>
                <Table.HeadCell>Pass Rate</Table.HeadCell>
                <Table.HeadCell>Avg Time</Table.HeadCell>
                <Table.HeadCell>Efficiency</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {reportData.testExecutors.map((executor, index) => (
                  <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      <div>
                        <div className="font-semibold">{executor.name}</div>
                        <div className="text-sm text-gray-500">{executor.email}</div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      {executor.totalExecutions}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center">
                        <Progress 
                          progress={(executor.passedExecutions / executor.totalExecutions) * 100}
                          color="green"
                          size="sm"
                          className="w-20 mr-2"
                        />
                        <span className="text-sm font-medium">
                          {((executor.passedExecutions / executor.totalExecutions) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      {executor.avgExecutionTime}m
                    </Table.Cell>
                    <Table.Cell>
                      <Badge 
                        color={executor.efficiency > 85 ? 'success' : executor.efficiency > 70 ? 'warning' : 'failure'}
                        size="sm"
                      >
                        {executor.efficiency}%
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TestReporting;