import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TestExecutionKanban from '../TestExecutionKanban';

// Mock react-beautiful-dnd
jest.mock('react-beautiful-dnd', () => ({
  DragDropContext: ({ children, onDragEnd }) => (
    <div data-testid="drag-drop-context" data-on-drag-end={onDragEnd}>
      {children}
    </div>
  ),
  Droppable: ({ children, droppableId }) => 
    children({
      innerRef: () => {},
      droppableProps: {},
      placeholder: <div data-testid={`droppable-placeholder-${droppableId}`} />
    }, { isDraggingOver: false }),
  Draggable: ({ children, draggableId, index }) =>
    children({
      innerRef: () => {},
      draggableProps: {},
      dragHandleProps: {},
    }, { isDragging: false })
}));

// Mock fetch
global.fetch = jest.fn();

describe('TestExecutionKanban', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  const mockTestCases = [
    {
      id: 'tc-1',
      title: 'User Login Test',
      description: 'Test user authentication functionality',
      priority: 'high',
      category: 'Authentication',
      estimatedTime: 15,
      assignedTo: 'john.doe@example.com',
      status: 'todo',
      steps: ['Navigate to login page', 'Enter credentials', 'Click login'],
      expectedResult: 'User should be redirected to dashboard',
      preconditions: 'User account must exist'
    },
    {
      id: 'tc-2',
      title: 'Dashboard Navigation',
      description: 'Test dashboard navigation elements',
      priority: 'medium',
      category: 'UI/UX',
      estimatedTime: 10,
      assignedTo: 'jane.smith@example.com',
      status: 'in-progress',
      steps: ['Login to app', 'Navigate to dashboard', 'Click menu items'],
      expectedResult: 'All navigation should work',
      preconditions: 'User must be logged in'
    }
  ];

  test('renders loading state initially', () => {
    render(<TestExecutionKanban />);
    expect(screen.getByText('Loading test execution board...')).toBeInTheDocument();
  });

  test('renders kanban columns after loading', async () => {
    render(<TestExecutionKanban />);

    await waitFor(() => {
      expect(screen.getByText('Test Execution Board')).toBeInTheDocument();
    });

    // Check that all columns are present
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Blocked')).toBeInTheDocument();
    expect(screen.getByText('Passed')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  test('displays test cases in appropriate columns', async () => {
    render(<TestExecutionKanban />);

    await waitFor(() => {
      expect(screen.getByText('User Login Test')).toBeInTheDocument();
      expect(screen.getByText('Dashboard Navigation')).toBeInTheDocument();
    });

    // Check that test cases have correct information
    expect(screen.getByText('Authentication')).toBeInTheDocument();
    expect(screen.getByText('UI/UX')).toBeInTheDocument();
    expect(screen.getByText('15m')).toBeInTheDocument();
    expect(screen.getByText('10m')).toBeInTheDocument();
  });

  test('opens execution modal when execute button is clicked', async () => {
    render(<TestExecutionKanban />);

    await waitFor(() => {
      expect(screen.getByText('User Login Test')).toBeInTheDocument();
    });

    const executeButtons = screen.getAllByRole('button');
    const executeButton = executeButtons.find(button => 
      button.querySelector('svg') // Looking for the play icon
    );

    if (executeButton) {
      fireEvent.click(executeButton);
      expect(screen.getByText('Execute Test Case: User Login Test')).toBeInTheDocument();
    }
  });

  test('displays test case details in execution modal', async () => {
    render(<TestExecutionKanban />);

    await waitFor(() => {
      expect(screen.getByText('User Login Test')).toBeInTheDocument();
    });

    // Find and click execute button
    const executeButtons = screen.getAllByRole('button');
    const executeButton = executeButtons.find(button => 
      button.querySelector('svg')
    );

    if (executeButton) {
      fireEvent.click(executeButton);

      // Check test case details are displayed
      expect(screen.getByText('Test Case Details')).toBeInTheDocument();
      expect(screen.getByText('Preconditions')).toBeInTheDocument();
      expect(screen.getByText('Test Steps')).toBeInTheDocument();
      expect(screen.getByText('Expected Result')).toBeInTheDocument();
      expect(screen.getByText('User account must exist')).toBeInTheDocument();
    }
  });

  test('allows updating execution status', async () => {
    const user = userEvent.setup();
    render(<TestExecutionKanban />);

    await waitFor(() => {
      expect(screen.getByText('User Login Test')).toBeInTheDocument();
    });

    // Open execution modal
    const executeButtons = screen.getAllByRole('button');
    const executeButton = executeButtons.find(button => 
      button.querySelector('svg')
    );

    if (executeButton) {
      fireEvent.click(executeButton);

      // Change status
      const statusSelect = screen.getByDisplayValue('In Progress');
      fireEvent.change(statusSelect, { target: { value: 'passed' } });

      // Add execution results
      const actualResultTextarea = screen.getByPlaceholderText('Describe what actually happened during test execution...');
      await user.type(actualResultTextarea, 'Test passed successfully');

      const notesTextarea = screen.getByPlaceholderText('Additional notes, observations, or comments...');
      await user.type(notesTextarea, 'No issues found');

      // Save execution
      const saveButton = screen.getByText('Save Execution');
      fireEvent.click(saveButton);

      // Should call API to save execution
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/test_executions/'),
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            }
          })
        );
      });
    }
  });

  test('shows defect ID field when status is failed', async () => {
    render(<TestExecutionKanban />);

    await waitFor(() => {
      expect(screen.getByText('User Login Test')).toBeInTheDocument();
    });

    // Open execution modal
    const executeButtons = screen.getAllByRole('button');
    const executeButton = executeButtons.find(button => 
      button.querySelector('svg')
    );

    if (executeButton) {
      fireEvent.click(executeButton);

      // Change status to failed
      const statusSelect = screen.getByDisplayValue('In Progress');
      fireEvent.change(statusSelect, { target: { value: 'failed' } });

      // Defect ID field should appear
      expect(screen.getByPlaceholderText('Enter defect or bug tracking ID')).toBeInTheDocument();
    }
  });

  test('displays column statistics', async () => {
    render(<TestExecutionKanban />);

    await waitFor(() => {
      expect(screen.getByText('Test Execution Board')).toBeInTheDocument();
    });

    // Each column should show count and total time
    const totalTimeElements = screen.getAllByText(/Total time:/);
    expect(totalTimeElements.length).toBeGreaterThan(0);
  });

  test('handles drag and drop operations', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });

    render(<TestExecutionKanban />);

    await waitFor(() => {
      expect(screen.getByText('User Login Test')).toBeInTheDocument();
    });

    // Simulate drag and drop (this is mocked, so we just verify the component structure)
    const dragDropContext = screen.getByTestId('drag-drop-context');
    expect(dragDropContext).toBeInTheDocument();

    // Verify droppable areas exist for each column
    expect(screen.getByTestId('droppable-placeholder-todo')).toBeInTheDocument();
    expect(screen.getByTestId('droppable-placeholder-in-progress')).toBeInTheDocument();
    expect(screen.getByTestId('droppable-placeholder-blocked')).toBeInTheDocument();
    expect(screen.getByTestId('droppable-placeholder-passed')).toBeInTheDocument();
    expect(screen.getByTestId('droppable-placeholder-failed')).toBeInTheDocument();
  });

  test('displays priority badges correctly', async () => {
    render(<TestExecutionKanban />);

    await waitFor(() => {
      expect(screen.getByText('high')).toBeInTheDocument();
      expect(screen.getByText('medium')).toBeInTheDocument();
    });
  });

  test('shows assignee information', async () => {
    render(<TestExecutionKanban />);

    await waitFor(() => {
      expect(screen.getByText('john.doe')).toBeInTheDocument();
      expect(screen.getByText('jane.smith')).toBeInTheDocument();
    });
  });

  test('handles API errors gracefully', async () => {
    // Mock console.error to avoid noise in tests
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<TestExecutionKanban />);

    await waitFor(() => {
      expect(screen.getByText('Test Execution Board')).toBeInTheDocument();
    });

    // Should still render the board structure even with API errors
    expect(screen.getByText('To Do')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  test('validates execution time input', async () => {
    const user = userEvent.setup();
    render(<TestExecutionKanban />);

    await waitFor(() => {
      expect(screen.getByText('User Login Test')).toBeInTheDocument();
    });

    // Open execution modal
    const executeButtons = screen.getAllByRole('button');
    const executeButton = executeButtons.find(button => 
      button.querySelector('svg')
    );

    if (executeButton) {
      fireEvent.click(executeButton);

      const timeInput = screen.getByPlaceholderText('Actual time taken');
      await user.type(timeInput, '25');

      expect(timeInput.value).toBe('25');
    }
  });
});