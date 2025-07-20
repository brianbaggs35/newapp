import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestImport from '../TestImport';

// Mock fetch
global.fetch = jest.fn();

// Mock file reading
Object.defineProperty(window, 'FileReader', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    readAsText: jest.fn(),
    onload: null,
    result: '<testsuite><testcase name="test1"/></testsuite>'
  }))
});

describe('TestImport', () => {
  beforeEach(() => {
    fetch.mockClear();
    // Mock CSRF token
    document.head.innerHTML = '<meta name="csrf-token" content="test-token" />';
  });

  test('renders import form correctly', () => {
    render(<TestImport />);
    
    expect(screen.getByText('Import JUnit XML Test Results')).toBeInTheDocument();
    expect(screen.getByLabelText('Select JUnit XML file')).toBeInTheDocument();
    expect(screen.getByText('Import Test Results')).toBeInTheDocument();
  });

  test('disables import button when no file is selected', () => {
    render(<TestImport />);
    
    const importButton = screen.getByText('Import Test Results');
    expect(importButton).toBeDisabled();
  });

  test('enables import button when file is selected', () => {
    render(<TestImport />);
    
    const fileInput = screen.getByLabelText('Select JUnit XML file');
    const file = new File(['<testsuite><testcase name="test1"/></testsuite>'], 'test.xml', { type: 'text/xml' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    const importButton = screen.getByText('Import Test Results');
    expect(importButton).not.toBeDisabled();
  });

  test('displays success message on successful import', async () => {
    const mockOnImportSuccess = jest.fn();
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        message: 'Successfully imported 1 test suite(s)',
        test_suites: [{ id: 1, name: 'Test Suite' }]
      })
    });

    render(<TestImport onImportSuccess={mockOnImportSuccess} />);
    
    const fileInput = screen.getByLabelText('Select JUnit XML file');
    const file = new File(['<testsuite><testcase name="test1"/></testsuite>'], 'test.xml', { type: 'text/xml' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    const importButton = screen.getByText('Import Test Results');
    fireEvent.click(importButton);
    
    await waitFor(() => {
      expect(screen.getByText('Successfully imported 1 test suite(s)')).toBeInTheDocument();
    });
    
    expect(mockOnImportSuccess).toHaveBeenCalledWith([{ id: 1, name: 'Test Suite' }]);
  });

  test('displays error message on failed import', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({
        error: 'Invalid XML format'
      })
    });

    render(<TestImport />);
    
    const fileInput = screen.getByLabelText('Select JUnit XML file');
    const file = new File(['invalid xml'], 'test.xml', { type: 'text/xml' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    const importButton = screen.getByText('Import Test Results');
    fireEvent.click(importButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid XML format')).toBeInTheDocument();
    });
  });

  test('shows loading state during import', async () => {
    fetch.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<TestImport />);
    
    const fileInput = screen.getByLabelText('Select JUnit XML file');
    const file = new File(['<testsuite><testcase name="test1"/></testsuite>'], 'test.xml', { type: 'text/xml' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    const importButton = screen.getByText('Import Test Results');
    fireEvent.click(importButton);
    
    expect(screen.getByText('Importing...')).toBeInTheDocument();
  });
});