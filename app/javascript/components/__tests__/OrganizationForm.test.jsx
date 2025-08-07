import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import OrganizationForm from '../organizations/OrganizationForm';

// Mock fetch globally
global.fetch = jest.fn();

describe('OrganizationForm Component', () => {
  const mockOnSuccess = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    fetch.mockClear();
    mockOnSuccess.mockClear();
    mockOnCancel.mockClear();
    // Mock document.querySelector for CSRF token
    document.querySelector = jest.fn(() => ({ content: 'mock-csrf-token' }));
  });

  it('renders create organization form', () => {
    render(<OrganizationForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
    
    expect(screen.getByText('Create Organization')).toBeInTheDocument();
    expect(screen.getByTestId('text-input')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('renders edit organization form when organization is provided', () => {
    const mockOrganization = {
      id: 1,
      name: 'Test Org',
      description: 'Test Description',
      active: true
    };

    render(<OrganizationForm organization={mockOrganization} onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
    
    expect(screen.getByText('Edit Organization')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  it('updates form data when inputs change', async () => {
    const user = userEvent.setup();
    render(<OrganizationForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
    
    const inputs = screen.getAllByTestId('text-input');
    const nameInput = inputs.find(input => input.name === 'name');
    
    await user.type(nameInput, 'New Organization');
    expect(nameInput).toHaveValue('New Organization');
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<OrganizationForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
    
    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('handles form submission for new organization', async () => {
    const user = userEvent.setup();
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 1, name: 'New Org' })
    });
    
    render(<OrganizationForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
    
    const inputs = screen.getAllByTestId('text-input');
    const nameInput = inputs.find(input => input.name === 'name');
    const submitButton = screen.getByText('Create');
    
    await user.type(nameInput, 'New Organization');
    await user.click(submitButton);
    
    expect(fetch).toHaveBeenCalledWith('/organizations', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        'Content-Type': 'application/json'
      })
    }));
  });

  it('displays organization icon', () => {
    render(<OrganizationForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
    
    expect(screen.getByTestId('hi-office-building')).toBeInTheDocument();
  });
});