import React from 'react';
import { Card } from 'flowbite-react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const TestStatistics = ({ statistics }) => {
  if (!statistics) return null;

  const {
    total_tests,
    passed_tests,
    failed_tests,
    skipped_tests,
    success_rate,
    total_suites
  } = statistics;

  // Doughnut chart data for test status distribution
  const doughnutData = {
    labels: ['Passed', 'Failed', 'Skipped'],
    datasets: [
      {
        data: [passed_tests, failed_tests, skipped_tests],
        backgroundColor: [
          '#10B981', // Green for passed
          '#EF4444', // Red for failed
          '#F59E0B', // Yellow for skipped
        ],
        borderColor: [
          '#065F46',
          '#991B1B',
          '#92400E',
        ],
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Test Results Distribution',
      },
    },
  };

  // Bar chart data for test suites (if available)
  const recentSuites = statistics.recent_suites || [];
  const barData = {
    labels: recentSuites.map(suite => suite.name.substring(0, 20) + '...'),
    datasets: [
      {
        label: 'Passed',
        data: recentSuites.map(suite => suite.passed_tests),
        backgroundColor: '#10B981',
      },
      {
        label: 'Failed',
        data: recentSuites.map(suite => suite.failed_tests),
        backgroundColor: '#EF4444',
      },
      {
        label: 'Skipped',
        data: recentSuites.map(suite => suite.skipped_tests),
        backgroundColor: '#F59E0B',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Recent Test Suites Results',
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
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Statistics Cards */}
      <Card>
        <div className="p-4 text-center">
          <h3 className="text-2xl font-bold text-gray-900">{total_suites}</h3>
          <p className="text-sm text-gray-500">Test Suites</p>
        </div>
      </Card>
      
      <Card>
        <div className="p-4 text-center">
          <h3 className="text-2xl font-bold text-gray-900">{total_tests}</h3>
          <p className="text-sm text-gray-500">Total Tests</p>
        </div>
      </Card>
      
      <Card>
        <div className="p-4 text-center">
          <h3 className="text-2xl font-bold text-green-600">{passed_tests}</h3>
          <p className="text-sm text-gray-500">Passed Tests</p>
        </div>
      </Card>
      
      <Card>
        <div className="p-4 text-center">
          <h3 className="text-2xl font-bold text-blue-600">{success_rate}%</h3>
          <p className="text-sm text-gray-500">Success Rate</p>
        </div>
      </Card>

      {/* Charts */}
      {total_tests > 0 && (
        <>
          <Card className="col-span-1 md:col-span-1 lg:col-span-2">
            <div className="p-4">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </Card>
          
          {recentSuites.length > 0 && (
            <Card className="col-span-1 md:col-span-1 lg:col-span-2">
              <div className="p-4">
                <Bar data={barData} options={barOptions} />
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default TestStatistics;