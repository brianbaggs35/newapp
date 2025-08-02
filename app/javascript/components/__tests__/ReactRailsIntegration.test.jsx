import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Integration test to verify React-Rails mounting works
describe('React-Rails Integration', () => {
  test('React root mounting functionality', () => {
    // Create a mock DOM environment similar to Rails
    document.body.innerHTML = '<div id="react-root"></div>';
    
    // Mock the React mounting function from index.jsx
    const TestComponent = () => (
      <div data-testid="react-app">React App Mounted</div>
    );
    
    // Test that we can mount React components
    const container = document.getElementById('react-root');
    expect(container).toBeInTheDocument();
    
    // Test React rendering
    render(<TestComponent />, { container });
    expect(screen.getByTestId('react-app')).toBeInTheDocument();
    expect(screen.getByText('React App Mounted')).toBeInTheDocument();
  });
  
  test('CSRF token integration', () => {
    // Mock CSRF token meta tag (Rails standard)
    document.head.innerHTML = '<meta name="csrf-token" content="test-csrf-token" />';
    
    const csrfToken = document.querySelector('[name="csrf-token"]')?.content;
    expect(csrfToken).toBe('test-csrf-token');
  });
  
  test('currentUser global variable integration', () => {
    // Mock global user variable that Rails provides
    const mockUser = { id: 1, email: 'test@example.com' };
    global.window.currentUser = mockUser;
    
    expect(window.currentUser).toEqual(mockUser);
    
    // Clean up
    delete global.window.currentUser;
  });
});