import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Dashboard from '../Dashboard';

// Mock fetch globally
global.fetch = jest.fn();

// Mock Chart.js components
jest.mock('react-chartjs-2', () => ({
  Bar: ({ data, options }) => (
    <div data-testid="bar-chart">
      Bar Chart - {data.labels?.join(', ')} - {data.datasets?.[0]?.data?.join(', ')}
    </div>
  ),
  Doughnut: ({ data, options }) => (
    <div data-testid="doughnut-chart">
      Doughnut Chart - {data.labels?.join(', ')} - {data.datasets?.[0]?.data?.join(', ')}
    </div>
  ),
  Line: ({ data, options }) => (
    <div data-testid="line-chart">
      Line Chart - {data.labels?.join(', ')} - {data.datasets?.[0]?.data?.join(', ')}
    </div>
  )
}));

// Mock Chart.js
jest.mock('chart.js', () => ({
  Chart: { register: jest.fn() },
  CategoryScale: 'CategoryScale',
  LinearScale: 'LinearScale',
  BarElement: 'BarElement',
  LineElement: 'LineElement',
  PointElement: 'PointElement',
  ArcElement: 'ArcElement',
  Title: 'Title',
  Tooltip: 'Tooltip',
  Legend: 'Legend'
}));

describe('QA Platform Dashboard Component', () => {
  const mockStats = {
    automated_testing: {
      total_runs: 150,
      passed_tests: 1200,
      failed_tests: 80,
      success_rate: 93.8,
      trend_data: [
        { date: '2023-12-01', passed: 45, failed: 2 },
        { date: '2023-12-02', passed: 50, failed: 1 },
        { date: '2023-12-03', passed: 48, failed: 3 }
      ],
      recent_runs: [
        {
          id: '1',
          name: 'API Tests',
          status: 'passed',
          passed: 45,
          failed: 2,
          created_at: '2023-12-01T10:00:00Z'
        },
        {
          id: '2',
          name: 'UI Tests',
          status: 'failed',
          passed: 30,
          failed: 8,
          created_at: '2023-12-01T09:00:00Z'
        }
      ]
    },
    manual_testing: {
      total_cases: 250,
      completed_runs: 45,
      pending_runs: 12,
      status_distribution: {
        pending: 12,
        in_progress: 8,
        completed: 45,
        blocked: 3
      },
      trend_data: [
        { date: '2023-12-01', completed: 5, pending: 2 },
        { date: '2023-12-02', completed: 6, pending: 1 },
        { date: '2023-12-03', completed: 4, pending: 3 }
      ],
      recent_activity: [
        {
          id: '1',
          case_name: 'Login Flow Test',
          status: 'completed',
          assignee: 'John Doe',
          updated_at: '2023-12-01T11:00:00Z'
        }
      ]
    },
    overall_metrics: {
      test_coverage: 87.5,
      defect_resolution_rate: 92.0,
      avg_test_execution_time: 4.2
    }
  };

  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders dashboard title correctly', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockStats)
    });

    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('QA Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Comprehensive testing metrics and insights')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    fetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<Dashboard />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.getByText('Loading dashboard data...')).toBeInTheDocument();
  });

  it('fetches dashboard data on mount', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockStats)
    });

    await act(async () => {
      render(<Dashboard />);
    });

    expect(fetch).toHaveBeenCalledWith('/qa_platform/dashboard/stats');
  });

  it('displays automated testing metrics correctly', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockStats)
    });

    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('Automated Testing')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument(); // Total runs
      expect(screen.getByText('1200')).toBeInTheDocument(); // Passed tests
      expect(screen.getByText('80')).toBeInTheDocument(); // Failed tests
      expect(screen.getByText('93.8%')).toBeInTheDocument(); // Success rate
    });
  });

  it('displays manual testing metrics correctly', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockStats)
    });

    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('Manual Testing')).toBeInTheDocument();
      expect(screen.getByText('250')).toBeInTheDocument(); // Total cases
      expect(screen.getByText('45')).toBeInTheDocument(); // Completed runs
      expect(screen.getByText('12')).toBeInTheDocument(); // Pending runs
    });
  });

  it('displays overall metrics correctly', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockStats)
    });

    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('Overall Metrics')).toBeInTheDocument();
      expect(screen.getByText('87.5%')).toBeInTheDocument(); // Test coverage
      expect(screen.getByText('92.0%')).toBeInTheDocument(); // Defect resolution rate
      expect(screen.getByText('4.2s')).toBeInTheDocument(); // Avg execution time
    });
  });

  it('renders charts with correct data', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockStats)
    });

    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });

  it('displays recent automated test runs', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockStats)
    });

    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('Recent Test Runs')).toBeInTheDocument();
      expect(screen.getByText('API Tests')).toBeInTheDocument();
      expect(screen.getByText('UI Tests')).toBeInTheDocument();
    });
  });

  it('displays recent manual testing activity', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockStats)
    });

    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
      expect(screen.getByText('Login Flow Test')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('shows appropriate status badges', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockStats)
    });

    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('Passed')).toBeInTheDocument();
      expect(screen.getByText('Failed')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });
  });

  it('displays appropriate icons for different states', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockStats)
    });

    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('hi-check-circle')).toBeInTheDocument(); // Passed
      expect(screen.getByTestId('hi-x-circle')).toBeInTheDocument(); // Failed
      expect(screen.getByTestId('hi-trending-up')).toBeInTheDocument(); // Trending up
    });
  });

  it('handles API error gracefully', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('Error loading dashboard data')).toBeInTheDocument();
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });
  });

  it('handles network error gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('Error loading dashboard data')).toBeInTheDocument();
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });
  });

  it('displays refresh button and handles refresh', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockStats)
    });

    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
    });

    // Clear previous calls
    fetch.mockClear();
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockStats)
    });

    const user = userEvent.setup();
    const refreshButton = screen.getByRole('button', { name: /refresh/i });

    await act(async () => {
      await user.click(refreshButton);
    });

    // Should refetch data
    expect(fetch).toHaveBeenCalledWith('/qa_platform/dashboard/stats');
  });

  it('formats dates correctly in recent activity', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockStats)
    });

    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      // Should format the ISO date string to a readable format
      expect(screen.getByText(/Dec 1, 2023/)).toBeInTheDocument();
    });
  });

  it('shows empty state when no data available', async () => {
    const emptyStats = {
      automated_testing: {
        total_runs: 0,
        passed_tests: 0,
        failed_tests: 0,
        success_rate: 0,
        recent_runs: []
      },
      manual_testing: {
        total_cases: 0,
        completed_runs: 0,
        pending_runs: 0,
        recent_activity: []
      },
      overall_metrics: {
        test_coverage: 0,
        defect_resolution_rate: 0,
        avg_test_execution_time: 0
      }
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(emptyStats)
    });

    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('No recent test runs')).toBeInTheDocument();
      expect(screen.getByText('No recent activity')).toBeInTheDocument();
    });
  });

  it('calculates and displays trend indicators correctly', async () => {
    const statsWithTrends = {
      ...mockStats,
      automated_testing: {
        ...mockStats.automated_testing,
        trend: 'up', // or 'down'
        trend_percentage: 15.2
      }
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(statsWithTrends)
    });

    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('hi-trending-up')).toBeInTheDocument();
      expect(screen.getByText('15.2%')).toBeInTheDocument();
    });
  });

  it('renders metric labels correctly', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockStats)
    });

    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('Total Runs')).toBeInTheDocument();
      expect(screen.getByText('Passed Tests')).toBeInTheDocument();
      expect(screen.getByText('Failed Tests')).toBeInTheDocument();
      expect(screen.getByText('Success Rate')).toBeInTheDocument();
      expect(screen.getByText('Total Cases')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.getByText('Test Coverage')).toBeInTheDocument();
      expect(screen.getByText('Defect Resolution')).toBeInTheDocument();
      expect(screen.getByText('Avg Execution Time')).toBeInTheDocument();
    });
  });
});