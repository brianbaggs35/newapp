import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavigationMultiTenant from '../NavigationMultiTenant';

describe('NavigationMultiTenant Component', () => {
  const mockOnLogout = jest.fn();

  beforeEach(() => {
    mockOnLogout.mockClear();
    // Mock document.querySelector for CSRF token
    document.querySelector = jest.fn(() => ({ content: 'mock-csrf-token' }));
  });

  it('renders navigation with brand', async () => {
    const mockUser = { email: 'test@example.com', role: 'test_runner' };
    const mockOrganization = { name: 'Test Org' };
    
    await act(async () => {
      render(<NavigationMultiTenant 
        currentUser={mockUser} 
        currentOrganization={mockOrganization}
        onLogout={mockOnLogout} 
      />);
    });
    
    expect(screen.getByText('QA Platform')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('shows organization name when provided', async () => {
    const mockUser = { email: 'test@example.com', role: 'test_runner' };
    const mockOrganization = { name: 'Test Organization' };
    
    await act(async () => {
      render(<NavigationMultiTenant 
        currentUser={mockUser} 
        currentOrganization={mockOrganization}
        onLogout={mockOnLogout} 
      />);
    });
    
    expect(screen.getAllByText(/Test Organization/)[0]).toBeInTheDocument();
  });

  it('shows system admin options for system admin users', async () => {
    const mockUser = { email: 'admin@example.com', role: 'system_admin' };
    const mockOrganization = { name: 'Test Org' };
    
    await act(async () => {
      render(<NavigationMultiTenant 
        currentUser={mockUser} 
        currentOrganization={mockOrganization}
        onLogout={mockOnLogout} 
      />);
    });
    
    expect(screen.getByText('System Admin')).toBeInTheDocument();
  });

  it('shows user management for test owners and managers', async () => {
    const mockUser = { email: 'owner@example.com', role: 'test_owner' };
    const mockOrganization = { name: 'Test Org' };
    
    await act(async () => {
      render(<NavigationMultiTenant 
        currentUser={mockUser} 
        currentOrganization={mockOrganization}
        onLogout={mockOnLogout} 
      />);
    });
    
    expect(screen.getAllByText('Manage Users')[0]).toBeInTheDocument();
  });

  it('renders user email and logout button', async () => {
    const mockUser = { email: 'test@example.com', role: 'test_runner' };
    const mockOrganization = { name: 'Test Org' };
    
    await act(async () => {
      render(<NavigationMultiTenant 
        currentUser={mockUser} 
        currentOrganization={mockOrganization}
        onLogout={mockOnLogout} 
      />);
    });
    
    expect(screen.getAllByText('test@example.com')[0]).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});