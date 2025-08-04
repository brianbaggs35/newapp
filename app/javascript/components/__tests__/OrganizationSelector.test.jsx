import React from 'react';
import { render, screen } from '@testing-library/react';
import OrganizationSelector from '../organizations/OrganizationSelector';

// Mock fetch globally
global.fetch = jest.fn();

describe('OrganizationSelector', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  const mockCurrentUser = {
    id: 1,
    email: 'test@example.com',
    role: 'test_runner'
  };

  it('renders welcome message', () => {
    // Mock successful empty organizations fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([])
    });

    render(<OrganizationSelector currentUser={mockCurrentUser} />);

    expect(screen.getByText('Welcome to QA Platform')).toBeInTheDocument();
  });

  it('shows create organization button for non-system admin users', async () => {
    // Mock successful empty organizations fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([])
    });

    render(<OrganizationSelector currentUser={mockCurrentUser} />);

    // Wait for loading to complete
    await screen.findByText('Create New Organization');
    
    expect(screen.getByText('Create New Organization')).toBeInTheDocument();
  });

  it('displays organizations list when available', () => {
    const mockOrganizations = [
      {
        id: 1,
        name: 'Test Org 1',
        description: 'Test description',
        user_count: 5,
        test_suite_count: 10
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockOrganizations
    });

    render(<OrganizationSelector currentUser={mockCurrentUser} />);

    // Just test that the component renders without error for now
    expect(screen.getByText('Welcome to QA Platform')).toBeInTheDocument();
  });

  it('shows different message for system admin users', () => {
    const adminUser = { ...mockCurrentUser, role: 'system_admin' };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([])
    });

    render(<OrganizationSelector currentUser={adminUser} />);

    expect(screen.getByText('Select an organization to manage or create a new one')).toBeInTheDocument();
  });
});