import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestDashboard from '../TestDashboard';

// Mock all the child components to avoid import issues
jest.mock('../TestImport', () => {
  return function MockTestImport({ onImportSuccess }) {
    return (
      <div data-testid="test-import">
        <h3>Import JUnit XML Test Results</h3>
        <button onClick={() => onImportSuccess && onImportSuccess([])}>
          Mock Import
        </button>
      </div>
    );
  };
});

jest.mock('../TestStatistics', () => {
  return function MockTestStatistics({ statistics }) {
    return <div data-testid="test-statistics">Statistics Component</div>;
  };
});

jest.mock('../TestSuitesList', () => {
  return function MockTestSuitesList({ testSuites, onDelete, onRefresh }) {
    return (
      <div data-testid="test-suites-list">
        <h3>Test Suites</h3>
        <button onClick={() => onDelete && onDelete(1)}>Mock Delete</button>
        <button onClick={() => onRefresh && onRefresh()}>Mock Refresh</button>
      </div>
    );
  };
});

// Mock fetch
global.fetch = jest.fn();

describe('TestDashboard', () => {
  beforeEach(() => {
    fetch.mockClear();
    // Mock CSRF token
    document.head.innerHTML = '<meta name="csrf-token" content="test-token" />';
  });

  const mockTestSuites = [
    {
      id: 1,
      name: 'Test Suite 1',
      description: 'A test suite',
      project: 'Project A',
      total_tests: 10,
      passed_tests: 8,
      failed_tests: 1,
      skipped_tests: 1,
      success_rate: 80.0,
      total_duration: 15.5,
      executed_at: '2023-01-01T12:00:00Z',
      created_at: '2023-01-01T12:00:00Z'
    }
  ];

  const mockStatistics = {
    total_suites: 1,
    total_tests: 10,
    passed_tests: 8,
    failed_tests: 1,
    skipped_tests: 1,
    success_rate: 80.0,
    recent_suites: mockTestSuites
  };

  test('renders dashboard components correctly', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTestSuites)
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStatistics)
      });

    await act(async () => {
      render(<TestDashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('Automated Testing Dashboard')).toBeInTheDocument();
      expect(screen.getByTestId('test-import')).toBeInTheDocument();
      expect(screen.getByTestId('test-statistics')).toBeInTheDocument();
      expect(screen.getByTestId('test-suites-list')).toBeInTheDocument();
    });
  });

  test('shows loading state initially', () => {
    fetch
      .mockImplementationOnce(() => new Promise(() => {}))
      .mockImplementationOnce(() => new Promise(() => {}));

    act(() => {
      render(<TestDashboard />);
    });

    expect(screen.getByText('Loading test data...')).toBeInTheDocument();
  });

  test('refresh button works correctly', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTestSuites)
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStatistics)
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTestSuites)
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStatistics)
      });

    await act(async () => {
      render(<TestDashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('Automated Testing Dashboard')).toBeInTheDocument();
    });

    const refreshButton = screen.getByText('Refresh');
    
    await act(async () => {
      fireEvent.click(refreshButton);
      // Give time for the state update to trigger
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Check that the refresh was triggered by verifying fetch was called again
    expect(fetch).toHaveBeenCalledTimes(4); // 2 initial + 2 refresh calls
  });
});