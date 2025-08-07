import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TestCaseDetails from '../TestCaseDetails';

describe('TestCaseDetails Component', () => {
  const mockTestSuite = {
    id: 1,
    name: 'Test Suite 1',
    tests: 10,
    passed: 8,
    failed: 2,
    duration: 5.5
  };

  const mockTestCases = [
    {
      id: 1,
      name: 'should pass successfully',
      status: 'passed',
      duration: 1.234,
      classname: 'ExampleTest'
    },
    {
      id: 2,
      name: 'should fail with error',
      status: 'failed',
      duration: 2.567,
      classname: 'ExampleTest',
      failure_message: 'Expected true but got false',
      failure_type: 'AssertionError'
    },
    {
      id: 3,
      name: 'should be skipped',
      status: 'skipped',
      duration: 0,
      classname: 'ExampleTest',
      skip_message: 'Test skipped due to condition'
    },
    {
      id: 4,
      name: 'should have error',
      status: 'error',
      duration: 0.5,
      classname: 'ExampleTest',
      failure_message: 'RuntimeError: Something went wrong',
      failure_type: 'RuntimeError'
    }
  ];

  it('renders test suite information correctly', () => {
    render(<TestCaseDetails testSuite={mockTestSuite} testCases={mockTestCases} />);
    
    expect(screen.getByText('Test Suite 1')).toBeInTheDocument();
    expect(screen.getByText('10 tests')).toBeInTheDocument();
    expect(screen.getByText('8 passed')).toBeInTheDocument();
    expect(screen.getByText('2 failed')).toBeInTheDocument();
    expect(screen.getByText('5.500s')).toBeInTheDocument();
  });

  it('displays status summary correctly', () => {
    render(<TestCaseDetails testSuite={mockTestSuite} testCases={mockTestCases} />);
    
    expect(screen.getByText('1 Passed')).toBeInTheDocument();
    expect(screen.getByText('1 Failed')).toBeInTheDocument();
    expect(screen.getByText('1 Error')).toBeInTheDocument();
    expect(screen.getByText('1 Skipped')).toBeInTheDocument();
  });

  it('renders test cases table with correct data', () => {
    render(<TestCaseDetails testSuite={mockTestSuite} testCases={mockTestCases} />);
    
    expect(screen.getByText('should pass successfully')).toBeInTheDocument();
    expect(screen.getByText('should fail with error')).toBeInTheDocument();
    expect(screen.getByText('should be skipped')).toBeInTheDocument();
    expect(screen.getByText('should have error')).toBeInTheDocument();
    
    expect(screen.getByText('1.234s')).toBeInTheDocument();
    expect(screen.getByText('2.567s')).toBeInTheDocument();
    expect(screen.getByText('0.500s')).toBeInTheDocument();
  });

  it('displays status badges correctly', () => {
    render(<TestCaseDetails testSuite={mockTestSuite} testCases={mockTestCases} />);
    
    expect(screen.getByText('Passed')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Skipped')).toBeInTheDocument();
  });

  it('shows view failure buttons for failed and error tests', () => {
    render(<TestCaseDetails testSuite={mockTestSuite} testCases={mockTestCases} />);
    
    const viewFailureButtons = screen.getAllByText('View Failure');
    expect(viewFailureButtons).toHaveLength(2); // One for failed, one for error
  });

  it('opens failure modal when view failure button is clicked', async () => {
    const user = userEvent.setup();
    render(<TestCaseDetails testSuite={mockTestSuite} testCases={mockTestCases} />);
    
    const viewFailureButtons = screen.getAllByText('View Failure');
    await user.click(viewFailureButtons[0]);
    
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('Test Failure Details')).toBeInTheDocument();
  });

  it('displays failure details in modal', async () => {
    const user = userEvent.setup();
    render(<TestCaseDetails testSuite={mockTestSuite} testCases={mockTestCases} />);
    
    const viewFailureButtons = screen.getAllByText('View Failure');
    await user.click(viewFailureButtons[0]); // Click on failed test
    
    await waitFor(() => {
      expect(screen.getByText('should fail with error')).toBeInTheDocument();
      expect(screen.getByText('AssertionError')).toBeInTheDocument();
      expect(screen.getByText('Expected true but got false')).toBeInTheDocument();
    });
  });

  it('displays appropriate icons for different statuses', () => {
    render(<TestCaseDetails testSuite={mockTestSuite} testCases={mockTestCases} />);
    
    expect(screen.getByTestId('hi-check-circle')).toBeInTheDocument(); // Passed
    expect(screen.getAllByTestId('hi-x-circle')).toHaveLength(2); // Failed and Error
    expect(screen.getByTestId('hi-exclamation')).toBeInTheDocument(); // Skipped
  });

  it('handles empty test cases array', () => {
    render(<TestCaseDetails testSuite={mockTestSuite} testCases={[]} />);
    
    expect(screen.getByText('Test Suite 1')).toBeInTheDocument();
    expect(screen.getByText('No test cases found')).toBeInTheDocument();
  });

  it('handles test cases without failure messages', () => {
    const testCasesWithoutFailure = [
      {
        id: 1,
        name: 'test without failure message',
        status: 'failed',
        duration: 1.0,
        classname: 'TestClass'
      }
    ];
    
    render(<TestCaseDetails testSuite={mockTestSuite} testCases={testCasesWithoutFailure} />);
    
    expect(screen.getByText('test without failure message')).toBeInTheDocument();
    expect(screen.getByText('View Failure')).toBeInTheDocument();
  });

  it('formats duration correctly', () => {
    const testCasesWithDuration = [
      {
        id: 1,
        name: 'test with zero duration',
        status: 'passed',
        duration: 0,
        classname: 'TestClass'
      },
      {
        id: 2,
        name: 'test with long duration',
        status: 'passed',
        duration: 123.456789,
        classname: 'TestClass'
      }
    ];
    
    render(<TestCaseDetails testSuite={mockTestSuite} testCases={testCasesWithDuration} />);
    
    expect(screen.getByText('0.000s')).toBeInTheDocument();
    expect(screen.getByText('123.457s')).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<TestCaseDetails testSuite={mockTestSuite} testCases={mockTestCases} />);
    
    // Open modal
    const viewFailureButtons = screen.getAllByText('View Failure');
    await user.click(viewFailureButtons[0]);
    
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    
    // Close modal
    const closeButton = screen.getByText('Close');
    await user.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  it('handles null or undefined test suite', () => {
    render(<TestCaseDetails testSuite={null} testCases={mockTestCases} />);
    
    // Should still render test cases even without test suite info
    expect(screen.getByText('should pass successfully')).toBeInTheDocument();
  });

  it('displays class names correctly', () => {
    render(<TestCaseDetails testSuite={mockTestSuite} testCases={mockTestCases} />);
    
    expect(screen.getAllByText('ExampleTest')).toHaveLength(4);
  });

  it('shows correct status counts', () => {
    render(<TestCaseDetails testSuite={mockTestSuite} testCases={mockTestCases} />);
    
    // Should show counts based on actual test cases, not just the test suite summary
    expect(screen.getByText('1 Passed')).toBeInTheDocument(); // Only 1 passed in test cases
    expect(screen.getByText('1 Failed')).toBeInTheDocument();
    expect(screen.getByText('1 Error')).toBeInTheDocument();
    expect(screen.getByText('1 Skipped')).toBeInTheDocument();
  });
});