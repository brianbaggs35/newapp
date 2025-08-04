import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestReporting from '../TestReporting';

// Mock Chart.js components
jest.mock('react-chartjs-2', () => ({
  Bar: ({ data, options }) => (
    <div data-testid="bar-chart" data-chart-data={JSON.stringify(data)} data-chart-options={JSON.stringify(options)} />
  ),
  Line: ({ data, options }) => (
    <div data-testid="line-chart" data-chart-data={JSON.stringify(data)} data-chart-options={JSON.stringify(options)} />
  ),
  Doughnut: ({ data, options }) => (
    <div data-testid="doughnut-chart" data-chart-data={JSON.stringify(data)} data-chart-options={JSON.stringify(options)} />
  )
}));

// Mock Chart.js registration
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn()
  },
  CategoryScale: {},
  LinearScale: {},
  BarElement: {},
  LineElement: {},
  PointElement: {},
  Title: {},
  Tooltip: {},
  Legend: {},
  ArcElement: {}
}));

// Mock fetch
global.fetch = jest.fn();

describe('TestReporting', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  const mockReportData = {
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
            backgroundColor: 'rgba(34, 197, 94, 0.8)'
          },
          {
            label: 'Failed',
            data: [45, 38, 42, 35],
            backgroundColor: 'rgba(239, 68, 68, 0.8)'
          }
        ]
      },
      defectTrends: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Defects Found',
            data: [8, 6, 5, 4],
            borderColor: 'rgb(239, 68, 68)'
          }
        ]
      }
    },
    distribution: {
      statusDistribution: {
        labels: ['Passed', 'Failed', 'Blocked'],
        datasets: [{
          data: [84, 12, 4],
          backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)', 'rgba(245, 158, 11, 0.8)']
        }]
      },
      priorityDistribution: {
        labels: ['Critical', 'High', 'Medium', 'Low'],
        datasets: [{
          data: [15, 35, 40, 10],
          backgroundColor: ['rgba(239, 68, 68, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(107, 114, 128, 0.8)']
        }]
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
      }
    ]
  };

  test('renders loading state initially', () => {
    fetch.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<TestReporting />);
    
    expect(screen.getByText('Generating report...')).toBeInTheDocument();
  });

  test('renders report dashboard after loading', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve(mockReportData)
    });

    render(<TestReporting />);

    await waitFor(() => {
      expect(screen.getByText('Test Execution Reports')).toBeInTheDocument();
    });

    expect(screen.getByText('Comprehensive testing analytics and insights')).toBeInTheDocument();
  });

  test('displays executive summary metrics', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve(mockReportData)
    });

    render(<TestReporting />);

    await waitFor(() => {
      expect(screen.getByText('145')).toBeInTheDocument(); // Total test cases
      expect(screen.getByText('84.0%')).toBeInTheDocument(); // Pass rate
      expect(screen.getByText('12.5m')).toBeInTheDocument(); // Avg execution time
      expect(screen.getByText('23')).toBeInTheDocument(); // Defects found
    });

    expect(screen.getByText('Total Test Cases')).toBeInTheDocument();
    expect(screen.getByText('Pass Rate')).toBeInTheDocument();
    expect(screen.getByText('Avg Execution Time')).toBeInTheDocument();
    expect(screen.getByText('Defects Found')).toBeInTheDocument();
  });

  test('renders all chart components', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve(mockReportData)
    });

    render(<TestReporting />);

    await waitFor(() => {
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument(); // Execution trends
      expect(screen.getAllByTestId('doughnut-chart')).toHaveLength(2); // Status and priority distribution
      expect(screen.getByTestId('line-chart')).toBeInTheDocument(); // Defect trends
    });

    expect(screen.getByText('Execution Trends')).toBeInTheDocument();
    expect(screen.getByText('Status Distribution')).toBeInTheDocument();
    expect(screen.getByText('Defect Trends')).toBeInTheDocument();
    expect(screen.getByText('Priority Distribution')).toBeInTheDocument();
  });

  test('displays top failed tests table', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve(mockReportData)
    });

    render(<TestReporting />);

    await waitFor(() => {
      expect(screen.getByText('Top Failed Test Cases')).toBeInTheDocument();
    });

    expect(screen.getByText('Login with invalid credentials')).toBeInTheDocument();
    expect(screen.getByText('Authentication')).toBeInTheDocument();
    expect(screen.getByText('85.5%')).toBeInTheDocument();
    expect(screen.getByText('BUG-123')).toBeInTheDocument();
  });

  test('displays test executor performance table', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve(mockReportData)
    });

    render(<TestReporting />);

    await waitFor(() => {
      expect(screen.getByText('Test Executor Performance')).toBeInTheDocument();
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('450')).toBeInTheDocument(); // Total executions
    expect(screen.getByText('84.4%')).toBeInTheDocument(); // Efficiency
  });

  test('allows changing report type', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve(mockReportData)
    });

    render(<TestReporting />);

    await waitFor(() => {
      expect(screen.getByText('Test Execution Reports')).toBeInTheDocument();
    });

    const reportTypeSelect = screen.getByDisplayValue('Summary Report');
    fireEvent.change(reportTypeSelect, { target: { value: 'detailed' } });

    // Should trigger a new API call with the different report type
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('report_type=detailed'),
        undefined
      );
    });
  });

  test('allows changing date range', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve(mockReportData)
    });

    render(<TestReporting />);

    await waitFor(() => {
      expect(screen.getByText('Test Execution Reports')).toBeInTheDocument();
    });

    const startDateInput = screen.getByLabelText('Start Date');
    fireEvent.change(startDateInput, { target: { value: '2025-01-01' } });

    const endDateInput = screen.getByLabelText('End Date');
    fireEvent.change(endDateInput, { target: { value: '2025-01-31' } });

    // Should trigger new API calls with the updated date range
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('start_date=2025-01-01'),
        undefined
      );
    });
  });

  test('allows changing project filter', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve(mockReportData)
    });

    render(<TestReporting />);

    await waitFor(() => {
      expect(screen.getByText('Test Execution Reports')).toBeInTheDocument();
    });

    const projectSelect = screen.getByDisplayValue('All Projects');
    fireEvent.change(projectSelect, { target: { value: 'web-app' } });

    // Should trigger a new API call with the project filter
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('project=web-app'),
        undefined
      );
    });
  });

  test('handles export PDF functionality', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve(mockReportData)
      })
      .mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(new Blob(['PDF content'], { type: 'application/pdf' }))
      });

    // Mock URL.createObjectURL and related functions
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
    global.URL.revokeObjectURL = jest.fn();

    const mockLink = {
      click: jest.fn(),
      style: {},
      download: '',
      href: ''
    };
    document.createElement = jest.fn(() => mockLink);
    document.body.appendChild = jest.fn();

    render(<TestReporting />);

    await waitFor(() => {
      expect(screen.getByText('Export PDF')).toBeInTheDocument();
    });

    const exportPdfButton = screen.getByText('Export PDF');
    fireEvent.click(exportPdfButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/reports/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('pdf')
      });
    });
  });

  test('handles export CSV functionality', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve(mockReportData)
      })
      .mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(new Blob(['CSV content'], { type: 'text/csv' }))
      });

    // Mock URL.createObjectURL and related functions
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
    global.URL.revokeObjectURL = jest.fn();

    const mockLink = {
      click: jest.fn(),
      style: {},
      download: '',
      href: ''
    };
    document.createElement = jest.fn(() => mockLink);
    document.body.appendChild = jest.fn();

    render(<TestReporting />);

    await waitFor(() => {
      expect(screen.getByText('Export CSV')).toBeInTheDocument();
    });

    const exportCsvButton = screen.getByText('Export CSV');
    fireEvent.click(exportCsvButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/reports/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('csv')
      });
    });
  });

  test('handles API errors gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<TestReporting />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load report data')).toBeInTheDocument();
    });
  });

  test('shows no data state when report data is null', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve(null)
    });

    render(<TestReporting />);

    await waitFor(() => {
      expect(screen.getByText('No report data available')).toBeInTheDocument();
    });
  });

  test('displays progress bars in tables', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve(mockReportData)
    });

    render(<TestReporting />);

    await waitFor(() => {
      expect(screen.getByText('Top Failed Test Cases')).toBeInTheDocument();
    });

    // Progress bars should be present for failure rates and executor performance
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars.length).toBeGreaterThan(0);
  });

  test('formats dates correctly', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve(mockReportData)
    });

    render(<TestReporting />);

    await waitFor(() => {
      expect(screen.getByText('Top Failed Test Cases')).toBeInTheDocument();
    });

    // Date should be formatted as expected
    expect(screen.getByText('1/15/2025')).toBeInTheDocument();
  });
});