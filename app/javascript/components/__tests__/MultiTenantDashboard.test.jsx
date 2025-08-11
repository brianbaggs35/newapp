import React from 'react';
import { render, screen } from '@testing-library/react';
import MultiTenantDashboard from '../MultiTenantDashboard';

// Mock fetch globally
global.fetch = jest.fn();

describe('MultiTenantDashboard', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    fetch.mockClear();
  });

  const mockCurrentUser = {
    id: 1,
    email: 'test@example.com',
    role: 'test_runner'
  };

  const mockCurrentOrganization = {
    id: 1,
    name: 'Test Organization'
  };

  it('renders dashboard with organization name', () => {
    // Mock successful stats fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        totalTestSuites: 10,
        totalTestCases: 50,
        successRate: 85,
        totalUsers: 5
      })
    });

    render(
      <MultiTenantDashboard 
        currentUser={mockCurrentUser} 
        currentOrganization={mockCurrentOrganization} 
      />
    );

    expect(screen.getByText('Test Organization Dashboard')).toBeInTheDocument();
  });

  it('renders system admin dashboard for system admin users', () => {
    const adminUser = { ...mockCurrentUser, role: 'system_admin' };
    
    // Mock successful stats fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        totalOrganizations: 5,
        totalUsers: 25,
        totalTestSuites: 100,
        activeOrganizations: 4
      })
    });

    render(
      <MultiTenantDashboard 
        currentUser={adminUser} 
        currentOrganization={null} 
      />
    );

    expect(screen.getByText('System Administration Dashboard')).toBeInTheDocument();
  });

  it('renders organization dashboard for regular users', async () => {
    // Mock successful stats fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        totalTestSuites: 10,
        totalTestCases: 50,
        successRate: 85,
        totalUsers: 5
      })
    });

    render(
      <MultiTenantDashboard 
        currentUser={mockCurrentUser} 
        currentOrganization={mockCurrentOrganization} 
      />
    );

    expect(screen.getByText('Test Organization Dashboard')).toBeInTheDocument();
  });

  it('shows no organization message when user has no organization', () => {
    render(
      <MultiTenantDashboard 
        currentUser={mockCurrentUser} 
        currentOrganization={null} 
      />
    );

    expect(screen.getByText('No Organization')).toBeInTheDocument();
    expect(screen.getByText('Join or Create Organization')).toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <MultiTenantDashboard 
        currentUser={mockCurrentUser} 
        currentOrganization={mockOrganization} 
      />
    );

    await waitFor(() => {
      expect(screen.getByText('An error occurred while loading the dashboard')).toBeInTheDocument();
    });
  });

  it('handles API response error gracefully', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    render(
      <MultiTenantDashboard 
        currentUser={mockCurrentUser} 
        currentOrganization={mockOrganization} 
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load dashboard statistics')).toBeInTheDocument();
    });
  });
});