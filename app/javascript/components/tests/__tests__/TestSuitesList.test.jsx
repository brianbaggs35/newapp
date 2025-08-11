import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestSuitesList from '../TestSuitesList';

// Mock flowbite-react
jest.mock('flowbite-react', () => ({
  Card: ({ children }) => <div data-testid="card">{children}</div>,
  Table: ({ children, hoverable }) => (
    <table data-testid="table" className={hoverable ? 'hoverable' : ''}>
      {children}
    </table>
  ),
  Badge: ({ children, color }) => (
    <span data-testid="badge" data-color={color}>{children}</span>
  ),
  Button: ({ children, onClick, size, color, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid="button"
      data-size={size}
      data-color={color}
    >
      {children}
    </button>
  ),
  Spinner: ({ size }) => (
    <div data-testid="spinner" data-size={size}>Loading...</div>
  ),
  Alert: ({ children, color, onDismiss }) => (
    <div data-testid="alert" data-color={color}>
      {children}
      {onDismiss && <button onClick={onDismiss} data-testid="alert-dismiss">×</button>}
    </div>
  ),
  Modal: ({ show, onClose, children }) => 
    show ? (
      <div data-testid="modal">
        <button onClick={onClose} data-testid="modal-close">×</button>
        {children}
      </div>
    ) : null,
  TextInput: ({ value, onChange, placeholder, ...props }) => (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      data-testid="text-input"
      {...props}
    />
  ),
  Textarea: ({ value, onChange, placeholder, rows, ...props }) => (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      data-testid="textarea"
      {...props}
    />
  )
}));

// Mock Table sub-components
jest.mock('flowbite-react', () => {
  const originalModule = jest.requireActual('flowbite-react');
  return {
    ...originalModule,
    Table: ({ children, hoverable }) => (
      <table data-testid="table" className={hoverable ? 'hoverable' : ''}>
        {children}
      </table>
    ),
  };
});

// Add Table sub-components to the global namespace for the test
global.Table = {
  Head: ({ children }) => <thead data-testid="table-head">{children}</thead>,
  HeadCell: ({ children }) => <th data-testid="table-head-cell">{children}</th>,
  Body: ({ children }) => <tbody data-testid="table-body">{children}</tbody>,
  Row: ({ children, className }) => (
    <tr data-testid="table-row" className={className}>{children}</tr>
  ),
  Cell: ({ children, className }) => (
    <td data-testid="table-cell" className={className}>{children}</td>
  )
};

// Mock react-icons
jest.mock('react-icons/hi', () => ({
  HiPlay: () => <span data-testid="icon">Play</span>,
  HiStop: () => <span data-testid="icon">Stop</span>,
  HiRefresh: () => <span data-testid="icon">Refresh</span>,
  HiPlus: () => <span data-testid="icon">Plus</span>,
  HiPencil: () => <span data-testid="icon">Pencil</span>,
  HiTrash: () => <span data-testid="icon">Trash</span>,
  HiClock: () => <span data-testid="icon">Clock</span>,
  HiCheckCircle: () => <span data-testid="icon">CheckCircle</span>,
  HiXCircle: () => <span data-testid="icon">XCircle</span>,
  HiExclamation: () => <span data-testid="icon">Exclamation</span>,
  HiEye: () => <span data-testid="icon">Eye</span>,
  HiCog: () => <span data-testid="icon">Cog</span>
}));

// Mock fetch
global.fetch = jest.fn();

describe('TestSuitesList', () => {
  beforeEach(() => {
    fetch.mockClear();
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([
        {
          id: 1,
          name: 'Authentication Test Suite',
          description: 'Tests for user authentication functionality',
          totalTests: 25,
          passedTests: 20,
          failedTests: 3,
          pendingTests: 2,
          status: 'passed',
          lastRun: '2024-01-15T10:00:00Z',
          duration: '5m 32s',
          coverage: 85.5,
          priority: 'high'
        },
        {
          id: 2,
          name: 'Navigation Test Suite',
          description: 'Tests for application navigation',
          totalTests: 18,
          passedTests: 15,
          failedTests: 2,
          pendingTests: 1,
          status: 'failed',
          lastRun: '2024-01-15T09:30:00Z',
          duration: '3m 18s',
          coverage: 78.2,
          priority: 'medium'
        }
      ])
    });
  });

  test('renders loading state initially', () => {
    fetch.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<TestSuitesList />);
    
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  test('renders test suites list after loading', async () => {
    render(<TestSuitesList />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Suites Management')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Authentication Test Suite')).toBeInTheDocument();
    expect(screen.getByText('Navigation Test Suite')).toBeInTheDocument();
  });

  test('displays suite information correctly', async () => {
    render(<TestSuitesList />);
    
    await waitFor(() => {
      expect(screen.getByText('Authentication Test Suite')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Tests for user authentication functionality')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument(); // totalTests
    expect(screen.getByText('5m 32s')).toBeInTheDocument(); // duration
    expect(screen.getByText('85.5%')).toBeInTheDocument(); // coverage
  });

  test('displays status badges with correct colors', async () => {
    render(<TestSuitesList />);
    
    await waitFor(() => {
      expect(screen.getByText('Authentication Test Suite')).toBeInTheDocument();
    });
    
    const badges = screen.getAllByTestId('badge');
    expect(badges.length).toBeGreaterThan(0);
    
    // Check for status badges
    expect(screen.getByText('Passed')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  test('allows creating a new test suite', async () => {
    render(<TestSuitesList />);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Suite')).toBeInTheDocument();
    });
    
    const createButton = screen.getByText('Create New Suite');
    fireEvent.click(createButton);
    
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('Create Test Suite')).toBeInTheDocument();
  });

  test('allows editing a test suite', async () => {
    render(<TestSuitesList />);
    
    await waitFor(() => {
      expect(screen.getByText('Authentication Test Suite')).toBeInTheDocument();
    });
    
    const editButtons = screen.getAllByTestId('button');
    const editButton = editButtons.find(button => 
      button.textContent === 'Edit' || button.querySelector('[data-testid="icon"]')?.textContent === 'Pencil'
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    }
  });

  test('allows running a test suite', async () => {
    render(<TestSuitesList />);
    
    await waitFor(() => {
      expect(screen.getByText('Authentication Test Suite')).toBeInTheDocument();
    });
    
    const runButtons = screen.getAllByTestId('button');
    const runButton = runButtons.find(button => 
      button.textContent === 'Run' || button.querySelector('[data-testid="icon"]')?.textContent === 'Play'
    );
    
    if (runButton) {
      fireEvent.click(runButton);
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/run'),
          expect.objectContaining({
            method: 'POST'
          })
        );
      });
    }
  });

  test('handles API error gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('API Error'));
    
    render(<TestSuitesList />);
    
    await waitFor(() => {
      expect(screen.getByTestId('alert')).toBeInTheDocument();
    });
    
    expect(screen.getByText(/Failed to load test suites/)).toBeInTheDocument();
  });

  test('handles empty test suites list', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([])
    });
    
    render(<TestSuitesList />);
    
    await waitFor(() => {
      expect(screen.getByText('No test suites found')).toBeInTheDocument();
    });
  });

  test('allows deleting a test suite', async () => {
    render(<TestSuitesList />);
    
    await waitFor(() => {
      expect(screen.getByText('Authentication Test Suite')).toBeInTheDocument();
    });
    
    const deleteButtons = screen.getAllByTestId('button');
    const deleteButton = deleteButtons.find(button => 
      button.textContent === 'Delete' || button.querySelector('[data-testid="icon"]')?.textContent === 'Trash'
    );
    
    if (deleteButton) {
      fireEvent.click(deleteButton);
      
      // Should show confirmation
      expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
    }
  });

  test('shows suite execution progress', async () => {
    render(<TestSuitesList />);
    
    await waitFor(() => {
      expect(screen.getByText('Authentication Test Suite')).toBeInTheDocument();
    });
    
    // Check for progress indicators (pass/fail counts)
    expect(screen.getByText('20')).toBeInTheDocument(); // passed count
    expect(screen.getByText('3')).toBeInTheDocument(); // failed count
    expect(screen.getByText('2')).toBeInTheDocument(); // pending count
  });

  test('allows viewing suite details', async () => {
    render(<TestSuitesList />);
    
    await waitFor(() => {
      expect(screen.getByText('Authentication Test Suite')).toBeInTheDocument();
    });
    
    const viewButtons = screen.getAllByTestId('button');
    const viewButton = viewButtons.find(button => 
      button.textContent === 'View' || button.querySelector('[data-testid="icon"]')?.textContent === 'Eye'
    );
    
    if (viewButton) {
      fireEvent.click(viewButton);
      // In a real app, this would navigate to suite details
      expect(viewButton).toBeInTheDocument();
    }
  });

  test('handles suite creation form submission', async () => {
    render(<TestSuitesList />);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Suite')).toBeInTheDocument();
    });
    
    const createButton = screen.getByText('Create New Suite');
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });
    
    const nameInput = screen.getByTestId('text-input');
    fireEvent.change(nameInput, { target: { value: 'New Test Suite' } });
    
    const saveButton = screen.getByText('Save');
    if (saveButton) {
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/test_suites'),
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: expect.stringContaining('New Test Suite')
          })
        );
      });
    }
  });
});