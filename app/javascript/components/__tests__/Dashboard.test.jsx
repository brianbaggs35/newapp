import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../Dashboard';

// Mock fetch globally
global.fetch = jest.fn();

describe('Dashboard Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    // Mock document.querySelector for CSRF token
    document.querySelector = jest.fn(() => ({ content: 'mock-csrf-token' }));
  });

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    created_at: '2023-01-01T00:00:00Z',
    confirmed_at: '2023-01-01T00:00:00Z'
  };

  it('renders dashboard with loading state', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({})
    });

    render(<Dashboard currentUser={mockUser} />);
    
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders user info after loading', async () => {
    const mockStats = {
      totalTests: 100,
      passedTests: 85,
      failedTests: 15
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockStats)
    });

    await act(async () => {
      render(<Dashboard currentUser={mockUser} />);
    });
    
    await waitFor(async () => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('handles fetch error gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      render(<Dashboard currentUser={mockUser} />);
    });
    
    await waitFor(async () => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('displays dashboard title', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({})
    });

    await act(async () => {
      render(<Dashboard currentUser={mockUser} />);
    });
    
    await waitFor(async () => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Welcome to your personal dashboard')).toBeInTheDocument();
  });
});