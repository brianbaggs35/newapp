import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import UserManagement from '../UserManagement';

// Mock fetch globally
global.fetch = jest.fn();

describe('UserManagement Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    // Mock document.querySelector for CSRF token
    document.querySelector = jest.fn(() => ({ content: 'mock-csrf-token' }));
  });

  it('renders user management page with loading spinner initially', async () => {
    // Create a promise that doesn't resolve immediately
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    fetch.mockReturnValueOnce({
      ok: true,
      json: () => promise
    });

    render(<UserManagement />);
    
    // Check that spinner is shown initially
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    
    // Now resolve the promise to clean up
    resolvePromise([]);
    
    await waitFor(async () => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });
  });

  it('renders user management title', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([])
    });

    await act(async () => {
      render(<UserManagement />);
    });
    
    expect(screen.getByText('User Management')).toBeInTheDocument();
  });

  it('renders add user button', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([])
    });

    await act(async () => {
      render(<UserManagement />);
    });
    
    await waitFor(async () => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Add User')).toBeInTheDocument();
  });

  it('displays users in table when data is loaded', async () => {
    const mockUsers = [
      {
        id: 1,
        email: 'user1@example.com',
        role: 'admin',
        created_at: '2023-01-01T00:00:00Z'
      },
      {
        id: 2,
        email: 'user2@example.com',
        role: 'user',
        created_at: '2023-01-02T00:00:00Z'
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUsers)
    });

    await act(async () => {
      render(<UserManagement />);
    });
    
    await waitFor(async () => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    expect(screen.getByText('user2@example.com')).toBeInTheDocument();
  });

  it('opens modal when add user button is clicked', async () => {
    const user = userEvent.setup();
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([])
    });

    await act(async () => {
      render(<UserManagement />);
    });
    
    await waitFor(async () => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    const addButton = screen.getByText('Add User');
    
    await act(async () => {
      await user.click(addButton);
    });

    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('handles fetch error gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      render(<UserManagement />);
    });
    
    await waitFor(async () => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    expect(screen.getByText('User Management')).toBeInTheDocument();
  });

  it('shows table headers correctly', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([])
    });

    await act(async () => {
      render(<UserManagement />);
    });
    
    await waitFor(async () => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Joined')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('handles empty users list', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([])
    });

    await act(async () => {
      render(<UserManagement />);
    });
    
    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    // Should show table headers even when no users
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('handles fetch error gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      render(<UserManagement />);
    });
    
    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    // Should still show the basic structure
    expect(screen.getByText('User Management')).toBeInTheDocument();
  });
});