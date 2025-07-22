import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReactDemo from '../ReactDemo';

describe('ReactDemo', () => {
  test('renders initial state correctly', () => {
    render(<ReactDemo />);
    
    expect(screen.getByText('React Integration Demo')).toBeInTheDocument();
    expect(screen.getByText('React is working!')).toBeInTheDocument();
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
    expect(screen.getByText('Increment Counter')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  test('increments counter when button is clicked', () => {
    render(<ReactDemo />);
    
    const incrementButton = screen.getByText('Increment Counter');
    
    fireEvent.click(incrementButton);
    
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
    expect(screen.getByText('Button clicked 1 time!')).toBeInTheDocument();
  });

  test('handles multiple increments correctly', () => {
    render(<ReactDemo />);
    
    const incrementButton = screen.getByText('Increment Counter');
    
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    
    expect(screen.getByText('Count: 3')).toBeInTheDocument();
    expect(screen.getByText('Button clicked 3 times!')).toBeInTheDocument();
  });

  test('resets counter when reset button is clicked', () => {
    render(<ReactDemo />);
    
    const incrementButton = screen.getByText('Increment Counter');
    const resetButton = screen.getByText('Reset');
    
    // Increment a few times
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    
    // Reset
    fireEvent.click(resetButton);
    
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
    expect(screen.getByText('React is working!')).toBeInTheDocument();
  });

  test('shows correct message for single vs multiple clicks', () => {
    render(<ReactDemo />);
    
    const incrementButton = screen.getByText('Increment Counter');
    
    // Single click
    fireEvent.click(incrementButton);
    expect(screen.getByText('Button clicked 1 time!')).toBeInTheDocument();
    
    // Multiple clicks  
    fireEvent.click(incrementButton);
    expect(screen.getByText('Button clicked 2 times!')).toBeInTheDocument();
  });
});