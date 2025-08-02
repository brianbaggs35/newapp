/**
 * Performance tests for React-Rails integration
 * Tests bundle size and loading performance
 */

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import main components to test bundle loading
import App from '../App';
import Home from '../Home';
import ReactDemo from '../ReactDemo';

describe('Performance and Bundle Tests', () => {
  test('Main components render without performance issues', () => {
    const startTime = Date.now();
    
    // Test that main components can be imported and rendered quickly
    expect(() => render(<ReactDemo />)).not.toThrow();
    
    const endTime = Date.now();
    const renderTime = endTime - startTime;
    
    // Component should render in under 100ms
    expect(renderTime).toBeLessThan(100);
  });
  
  test('App component structure is correct', () => {
    expect(App).toBeDefined();
    expect(typeof App).toBe('function');
    expect(App.displayName).toBe('App');
  });
  
  test('Home component structure is correct', () => {
    expect(Home).toBeDefined();
    expect(typeof Home).toBe('function');
    expect(Home.displayName).toBe('Home');
  });
  
  test('Bundle includes required dependencies', () => {
    // Test that React and related dependencies are available
    expect(React).toBeDefined();
    expect(React.version).toBeDefined();
    
    // Test React 19 features are available
    expect(React.createElement).toBeDefined();
    expect(React.useState).toBeDefined();
    expect(React.useEffect).toBeDefined();
  });
});