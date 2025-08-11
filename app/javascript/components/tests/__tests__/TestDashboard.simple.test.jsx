import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestDashboard from '../TestDashboard';

// Mock all child components
jest.mock('../TestImport', () => {
  return function MockTestImport() {
    return <div data-testid="test-import">Test Import Component</div>;
  };
});

jest.mock('../TestStatistics', () => {
  return function MockTestStatistics() {
    return <div data-testid="test-statistics">Test Statistics Component</div>;
  };
});

// Mock flowbite-react
jest.mock('flowbite-react', () => ({
  Card: ({ children }) => <div data-testid="card">{children}</div>,
  Button: ({ children, onClick }) => (
    <button onClick={onClick} data-testid="button">{children}</button>
  ),
  Tabs: ({ children }) => <div data-testid="tabs">{children}</div>,
}));

describe('TestDashboard', () => {
  test('renders test dashboard', () => {
    render(<TestDashboard />);
    
    expect(screen.getByText('Test Management Dashboard')).toBeInTheDocument();
  });

  test('renders child components', () => {
    render(<TestDashboard />);
    
    expect(screen.getByTestId('test-import')).toBeInTheDocument();
    expect(screen.getByTestId('test-statistics')).toBeInTheDocument();
  });
});