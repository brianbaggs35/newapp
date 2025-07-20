import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestStatistics from '../TestStatistics';

// Mock Chart.js components
jest.mock('react-chartjs-2', () => ({
  Doughnut: () => <div data-testid="doughnut-chart">Doughnut Chart</div>,
  Bar: () => <div data-testid="bar-chart">Bar Chart</div>
}));

jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn()
  },
  CategoryScale: {},
  LinearScale: {},
  BarElement: {},
  ArcElement: {},
  Title: {},
  Tooltip: {},
  Legend: {}
}));

describe('TestStatistics', () => {
  const mockStatistics = {
    total_suites: 5,
    total_tests: 100,
    passed_tests: 85,
    failed_tests: 10,
    skipped_tests: 5,
    success_rate: 85.0,
    recent_suites: [
      { 
        name: 'Test Suite 1', 
        passed_tests: 20, 
        failed_tests: 2, 
        skipped_tests: 1 
      },
      { 
        name: 'Test Suite 2', 
        passed_tests: 15, 
        failed_tests: 1, 
        skipped_tests: 0 
      }
    ]
  };

  test('renders statistics cards correctly', () => {
    render(<TestStatistics statistics={mockStatistics} />);
    
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Test Suites')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Total Tests')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('Passed Tests')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('Success Rate')).toBeInTheDocument();
  });

  test('renders charts when tests are available', () => {
    render(<TestStatistics statistics={mockStatistics} />);
    
    expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  test('does not render charts when no tests available', () => {
    const emptyStatistics = {
      ...mockStatistics,
      total_tests: 0,
      passed_tests: 0,
      failed_tests: 0,
      skipped_tests: 0
    };
    
    render(<TestStatistics statistics={emptyStatistics} />);
    
    expect(screen.queryByTestId('doughnut-chart')).not.toBeInTheDocument();
    expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
  });

  test('does not render when statistics prop is null', () => {
    const { container } = render(<TestStatistics statistics={null} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders bar chart only when recent suites are available', () => {
    const statisticsWithoutRecentSuites = {
      ...mockStatistics,
      recent_suites: []
    };
    
    render(<TestStatistics statistics={statisticsWithoutRecentSuites} />);
    
    expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
    expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
  });
});