import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../Home';

// Mock the TestDashboard component
jest.mock('../tests/TestDashboard', () => {
  return function MockTestDashboard() {
    return <div data-testid="test-dashboard">Test Dashboard</div>;
  };
});

describe('Home', () => {
  test('renders the header and navigation correctly', () => {
    render(<Home />);
    
    expect(screen.getByText('Test App')).toBeInTheDocument();
    expect(screen.getByText('Test application for using React on Rails with automated testing capabilities.')).toBeInTheDocument();
    expect(screen.getByText('Link Test (Rails Route)')).toBeInTheDocument();
    expect(screen.getByText('Flowbite Button')).toBeInTheDocument();
  });

  test('renders the test dashboard', () => {
    render(<Home />);
    
    expect(screen.getByTestId('test-dashboard')).toBeInTheDocument();
  });

  test('link has correct href', () => {
    render(<Home />);
    
    const link = screen.getByText('Link Test (Rails Route)');
    expect(link.closest('a')).toHaveAttribute('href', '/newlink');
  });
});