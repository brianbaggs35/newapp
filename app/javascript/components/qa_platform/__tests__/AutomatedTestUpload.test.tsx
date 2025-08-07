import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AutomatedTestUpload from '../AutomatedTestUpload';

// Mock file for testing
const createMockFile = (name = 'test.xml', content = '<xml>test content</xml>') => {
  const file = new File([content], name, { type: 'application/xml' });
  return file;
};

describe('AutomatedTestUpload', () => {
  const mockProps = {
    testRuns: [],
    onUpload: jest.fn(),
    onRename: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with header and upload button', () => {
    render(<AutomatedTestUpload {...mockProps} />);
    
    expect(screen.getByText('Test Upload')).toBeInTheDocument();
    expect(screen.getByText('Upload JUnit or TestNG XML files to analyze test results')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload test results/i })).toBeInTheDocument();
  });

  it('shows empty state when no test runs exist', () => {
    render(<AutomatedTestUpload {...mockProps} />);
    
    expect(screen.getByText('No test runs yet')).toBeInTheDocument();
    expect(screen.getByText('Upload your first JUnit or TestNG XML file to get started')).toBeInTheDocument();
  });

  it('displays test runs in table when available', () => {
    const testRuns = [
      {
        uuid: '123',
        name: 'Test Run 1',
        status: 'completed',
        total_tests: 10,
        passed_tests: 8,
        failed_tests: 1,
        skipped_tests: 1,
        duration_formatted: '2m 30s',
        created_at: '2024-01-01T10:00:00Z',
        created_by: { email: 'user@example.com' }
      }
    ];

    render(<AutomatedTestUpload {...mockProps} testRuns={testRuns} />);
    
    expect(screen.getByText('Test Run 1')).toBeInTheDocument();
    expect(screen.getByText('completed')).toBeInTheDocument();
    expect(screen.getByText('8P')).toBeInTheDocument(); // Passed badge
    expect(screen.getByText('1F')).toBeInTheDocument(); // Failed badge
    expect(screen.getByText('1S')).toBeInTheDocument(); // Skipped badge
    expect(screen.getByText('10T')).toBeInTheDocument(); // Total badge
    expect(screen.getByText('2m 30s')).toBeInTheDocument();
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
  });

  it('calculates success rate correctly', () => {
    const testRuns = [
      {
        uuid: '123',
        name: 'Test Run 1',
        status: 'completed',
        total_tests: 10,
        passed_tests: 7,
        failed_tests: 3,
        skipped_tests: 0,
        duration_formatted: '1m 0s',
        created_at: '2024-01-01T10:00:00Z',
        created_by: { email: 'user@example.com' }
      }
    ];

    render(<AutomatedTestUpload {...mockProps} testRuns={testRuns} />);
    
    expect(screen.getByText('70%')).toBeInTheDocument();
  });

  it('opens upload modal when upload button is clicked', async () => {
    render(<AutomatedTestUpload {...mockProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /upload test results/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Upload Test Results')).toBeInTheDocument();
      expect(screen.getByLabelText(/test run name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/xml file/i)).toBeInTheDocument();
    });
  });

  it('handles file upload process', async () => {
    const mockOnUpload = jest.fn().mockResolvedValue(undefined);
    render(<AutomatedTestUpload {...mockProps} onUpload={mockOnUpload} />);
    
    // Open modal
    fireEvent.click(screen.getByRole('button', { name: /upload test results/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Upload Test Results')).toBeInTheDocument();
    });

    // Add file
    const file = createMockFile();
    const fileInput = screen.getByLabelText(/xml file/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Add optional name
    const nameInput = screen.getByLabelText(/test run name/i);
    fireEvent.change(nameInput, { target: { value: 'My Test Run' } });

    // Click upload
    const uploadButton = screen.getByRole('button', { name: /^upload$/i });
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalledWith(file, 'My Test Run');
    });
  });

  it('opens rename modal when rename button is clicked', async () => {
    const testRuns = [
      {
        uuid: '123',
        name: 'Test Run 1',
        status: 'completed',
        total_tests: 5,
        passed_tests: 5,
        failed_tests: 0,
        skipped_tests: 0,
        duration_formatted: '1m 0s',
        created_at: '2024-01-01T10:00:00Z',
        created_by: { email: 'user@example.com' }
      }
    ];

    render(<AutomatedTestUpload {...mockProps} testRuns={testRuns} />);
    
    // Find and click the rename button (pencil icon)
    const renameButtons = screen.getAllByRole('button');
    const renameButton = renameButtons.find(btn => btn.querySelector('svg')); // Find button with icon
    fireEvent.click(renameButton);

    await waitFor(() => {
      expect(screen.getByText('Rename Test Run')).toBeInTheDocument();
    });
  });

  it('calls onDelete when delete button is clicked', async () => {
    const mockOnDelete = jest.fn().mockResolvedValue(undefined);
    const testRuns = [
      {
        uuid: '123',
        name: 'Test Run 1',
        status: 'completed',
        total_tests: 5,
        passed_tests: 5,
        failed_tests: 0,
        skipped_tests: 0,
        duration_formatted: '1m 0s',
        created_at: '2024-01-01T10:00:00Z',
        created_by: { email: 'user@example.com' }
      }
    ];

    render(<AutomatedTestUpload {...mockProps} testRuns={testRuns} onDelete={mockOnDelete} />);
    
    // Find all buttons and click the last one (delete button)
    const allButtons = screen.getAllByRole('button');
    const deleteButton = allButtons[allButtons.length - 1]; // Typically the last button in the row
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith('123');
    });
  });

  it('shows correct status badge colors', () => {
    const testRuns = [
      {
        uuid: '1',
        name: 'Pending Run',
        status: 'pending',
        total_tests: 0,
        passed_tests: 0,
        failed_tests: 0,
        skipped_tests: 0,
        duration_formatted: '0s',
        created_at: '2024-01-01T10:00:00Z',
        created_by: { email: 'user@example.com' }
      },
      {
        uuid: '2',
        name: 'Failed Run',
        status: 'failed',
        total_tests: 5,
        passed_tests: 2,
        failed_tests: 3,
        skipped_tests: 0,
        duration_formatted: '30s',
        created_at: '2024-01-01T11:00:00Z',
        created_by: { email: 'user@example.com' }
      }
    ];

    render(<AutomatedTestUpload {...mockProps} testRuns={testRuns} />);
    
    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('failed')).toBeInTheDocument();
  });

  it('disables upload button when no file is selected', async () => {
    render(<AutomatedTestUpload {...mockProps} />);
    
    // Open modal
    fireEvent.click(screen.getByRole('button', { name: /upload test results/i }));
    
    await waitFor(() => {
      const uploadButton = screen.getByRole('button', { name: /^upload$/i });
      expect(uploadButton).toBeDisabled();
    });
  });

  it('enables upload button when file is selected', async () => {
    render(<AutomatedTestUpload {...mockProps} />);
    
    // Open modal
    fireEvent.click(screen.getByRole('button', { name: /upload test results/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Upload Test Results')).toBeInTheDocument();
    });

    // Add file
    const file = createMockFile();
    const fileInput = screen.getByLabelText(/xml file/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Check that upload button is enabled
    const uploadButton = screen.getByRole('button', { name: /^upload$/i });
    expect(uploadButton).not.toBeDisabled();
  });
});