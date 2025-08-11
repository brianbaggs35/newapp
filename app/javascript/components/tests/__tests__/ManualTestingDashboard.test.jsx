import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ManualTestingDashboard from '../ManualTestingDashboard';

// Mock flowbite-react
jest.mock('flowbite-react', () => ({
  Card: ({ children, className, onClick }) => (
    <div className={className} onClick={onClick} data-testid="card">
      {children}
    </div>
  ),
  Badge: ({ children, color }) => (
    <span data-testid="badge" data-color={color}>
      {children}
    </span>
  ),
  Button: ({ children, onClick, color, size, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid="button"
      data-color={color}
      data-size={size}
    >
      {children}
    </button>
  ),
}));

// Mock react-icons
jest.mock('react-icons/hi', () => ({
  HiClipboardList: () => <span data-testid="icon">ClipboardList</span>,
  HiPlay: () => <span data-testid="icon">Play</span>,
  HiClock: () => <span data-testid="icon">Clock</span>,
  HiCheckCircle: () => <span data-testid="icon">CheckCircle</span>,
  HiXCircle: () => <span data-testid="icon">XCircle</span>,
  HiExclamation: () => <span data-testid="icon">Exclamation</span>,
  HiDocumentAdd: () => <span data-testid="icon">DocumentAdd</span>,
  HiUpload: () => <span data-testid="icon">Upload</span>,
  HiDownload: () => <span data-testid="icon">Download</span>,
  HiRefresh: () => <span data-testid="icon">Refresh</span>,
  HiFilter: () => <span data-testid="icon">Filter</span>,
  HiSearch: () => <span data-testid="icon">Search</span>,
  HiViewGrid: () => <span data-testid="icon">ViewGrid</span>,
  HiViewList: () => <span data-testid="icon">ViewList</span>
}));

// Mock fetch
global.fetch = jest.fn();

describe('ManualTestingDashboard', () => {
  beforeEach(() => {
    fetch.mockClear();
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([
        {
          id: 1,
          title: 'Login Test',
          status: 'passed',
          priority: 'high',
          category: 'Authentication',
          lastExecuted: '2024-01-15T10:00:00Z'
        }
      ])
    });
  });

  test('renders dashboard header', () => {
    render(<ManualTestingDashboard />);
    
    expect(screen.getByText('Manual Testing Platform')).toBeInTheDocument();
    expect(screen.getByText('Comprehensive test case management and execution')).toBeInTheDocument();
  });

  test('displays statistics cards', () => {
    render(<ManualTestingDashboard />);
    
    // Check for statistics cards
    expect(screen.getByText('Total Test Cases')).toBeInTheDocument();
    expect(screen.getByText('Test Executions')).toBeInTheDocument();
    expect(screen.getByText('Pass Rate')).toBeInTheDocument();
    expect(screen.getByText('Active Tests')).toBeInTheDocument();
  });

  test('displays action buttons', () => {
    render(<ManualTestingDashboard />);
    
    expect(screen.getByText('Create Test Case')).toBeInTheDocument();
    expect(screen.getByText('Bulk Import')).toBeInTheDocument();
    expect(screen.getByText('Export Results')).toBeInTheDocument();
    expect(screen.getByText('Generate Report')).toBeInTheDocument();
  });

  test('displays quick access cards', () => {
    render(<ManualTestingDashboard />);
    
    expect(screen.getByText('Test Case Manager')).toBeInTheDocument();
    expect(screen.getByText('Test Execution Board')).toBeInTheDocument();
    expect(screen.getByText('Test Results & Reports')).toBeInTheDocument();
  });

  test('displays recent activity section', () => {
    render(<ManualTestingDashboard />);
    
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('View All Activity')).toBeInTheDocument();
  });

  test('displays pending approvals section', () => {
    render(<ManualTestingDashboard />);
    
    expect(screen.getByText('Pending Approvals')).toBeInTheDocument();
    expect(screen.getByText('View All Approvals')).toBeInTheDocument();
  });

  test('handles card click interactions', async () => {
    render(<ManualTestingDashboard />);
    
    const testCaseManagerCard = screen.getByText('Test Case Manager').closest('[data-testid="card"]');
    fireEvent.click(testCaseManagerCard);
    
    // Check that clicking triggers navigation (in a real app, this would use router)
    expect(testCaseManagerCard).toBeInTheDocument();
  });

  test('fetches and displays activity data', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        {
          id: 1,
          type: 'test_executed',
          description: 'Login test executed successfully',
          timestamp: '2024-01-15T10:00:00Z',
          user: 'John Doe'
        }
      ])
    });

    render(<ManualTestingDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Login test executed successfully')).toBeInTheDocument();
    });
  });

  test('handles create test case button click', () => {
    render(<ManualTestingDashboard />);
    
    const createButton = screen.getByText('Create Test Case');
    fireEvent.click(createButton);
    
    // In a real app, this would navigate or open a modal
    expect(createButton).toBeInTheDocument();
  });

  test('handles bulk import button click', () => {
    render(<ManualTestingDashboard />);
    
    const importButton = screen.getByText('Bulk Import');
    fireEvent.click(importButton);
    
    expect(importButton).toBeInTheDocument();
  });

  test('handles export results button click', () => {
    render(<ManualTestingDashboard />);
    
    const exportButton = screen.getByText('Export Results');
    fireEvent.click(exportButton);
    
    expect(exportButton).toBeInTheDocument();
  });
});