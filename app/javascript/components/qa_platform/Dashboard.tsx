import React, { useEffect, useState } from 'react';
import { Card, Badge } from 'flowbite-react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement, 
  PointElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { 
  HiTrendingUp, 
  HiTrendingDown, 
  HiCheckCircle, 
  HiXCircle,
  HiClock,
  HiExclamation
} from 'react-icons/hi';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardStats {
  automated_testing: {
    total_runs: number;
    passed_tests: number;
    failed_tests: number;
    success_rate: number;
    recent_runs: Array<{
      id: string;
      name: string;
      status: string;
      passed: number;
      failed: number;
      created_at: string;
    }>;
    trend_data: Array<{
      date: string;
      passed: number;
      failed: number;
    }>;
  };
  manual_testing: {
    total_test_cases: number;
    total_runs: number;
    completed_runs: number;
    success_rate: number;
    recent_runs: Array<{
      id: string;
      name: string;
      status: string;
      progress: number;
      created_at: string;
    }>;
    status_distribution: {
      pending: number;
      in_progress: number;
      completed: number;
      blocked: number;
    };
  };
}

interface DashboardProps {
  currentUser: {
    name: string;
    email: string;
    role: string;
    organization?: {
      name: string;
    };
  };
}

export default function Dashboard({ currentUser }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/dashboard/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatSuccessRate = (rate: number) => `${(rate * 100).toFixed(1)}%`;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  // Automated Testing Chart Data
  const automatedTestsChart = {
    labels: stats.automated_testing.trend_data.map(d => formatDate(d.date)),
    datasets: [
      {
        label: 'Passed Tests',
        data: stats.automated_testing.trend_data.map(d => d.passed),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
      },
      {
        label: 'Failed Tests', 
        data: stats.automated_testing.trend_data.map(d => d.failed),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
      }
    ]
  };

  // Manual Testing Status Distribution
  const manualTestingChart = {
    labels: ['Pending', 'In Progress', 'Completed', 'Blocked'],
    datasets: [
      {
        data: [
          stats.manual_testing.status_distribution.pending,
          stats.manual_testing.status_distribution.in_progress,
          stats.manual_testing.status_distribution.completed,
          stats.manual_testing.status_distribution.blocked,
        ],
        backgroundColor: [
          'rgba(107, 114, 128, 0.5)',
          'rgba(59, 130, 246, 0.5)',
          'rgba(34, 197, 94, 0.5)',
          'rgba(239, 68, 68, 0.5)',
        ],
        borderColor: [
          'rgba(107, 114, 128, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {currentUser.name || currentUser.email}!
        </h1>
        {currentUser.organization && (
          <p className="text-gray-600 mt-2">
            {currentUser.organization.name} • {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
          </p>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <HiCheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Automated Success Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatSuccessRate(stats.automated_testing.success_rate)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <HiClock className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Manual Success Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatSuccessRate(stats.manual_testing.success_rate)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <HiTrendingUp className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Test Runs</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.automated_testing.total_runs + stats.manual_testing.total_runs}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <HiExclamation className="h-8 w-8 text-orange-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Manual Test Cases</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.manual_testing.total_test_cases}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Automated Testing Trends
          </h3>
          <div className="h-64">
            <Bar data={automatedTestsChart} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                title: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }} />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Manual Testing Status Distribution
          </h3>
          <div className="h-64">
            <Doughnut data={manualTestingChart} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom' as const,
                },
                title: {
                  display: false,
                },
              },
            }} />
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Automated Runs */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Automated Test Runs
          </h3>
          <div className="space-y-3">
            {stats.automated_testing.recent_runs.map((run) => (
              <div key={run.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{run.name}</p>
                  <p className="text-sm text-gray-600">{formatDate(run.created_at)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge color={run.status === 'passed' ? 'success' : 'failure'}>
                    {run.passed}/{run.passed + run.failed}
                  </Badge>
                  {run.status === 'passed' ? (
                    <HiCheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <HiXCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Manual Runs */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Manual Test Runs
          </h3>
          <div className="space-y-3">
            {stats.manual_testing.recent_runs.map((run) => (
              <div key={run.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{run.name}</p>
                  <p className="text-sm text-gray-600">{formatDate(run.created_at)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${run.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{run.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}