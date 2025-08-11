import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestImport from '../TestImport';

// Mock flowbite-react
jest.mock('flowbite-react', () => ({
  Card: ({ children }) => <div data-testid="card">{children}</div>,
  Button: ({ children, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled} data-testid="button">{children}</button>
  ),
  Alert: ({ children, color }) => (
    <div data-testid="alert" data-color={color}>{children}</div>
  ),
  Progress: ({ progress }) => (
    <div data-testid="progress" data-progress={progress}></div>
  ),
  FileInput: ({ onChange, accept }) => (
    <input type="file" onChange={onChange} accept={accept} data-testid="file-input" />
  ),
}));

// Mock fetch
global.fetch = jest.fn();

describe('TestImport', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders import form', () => {
    render(<TestImport />);
    
    expect(screen.getByText('Import Test Results')).toBeInTheDocument();
    expect(screen.getByText('Upload JUnit XML file')).toBeInTheDocument();
  });

  test('renders file input', () => {
    render(<TestImport />);
    
    expect(screen.getByTestId('file-input')).toBeInTheDocument();
  });

  test('renders upload button', () => {
    render(<TestImport />);
    
    expect(screen.getByText('Upload Results')).toBeInTheDocument();
  });
});