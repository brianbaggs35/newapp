import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavigationMultiTenant from '../NavigationMultiTenant';

describe('NavigationMultiTenant Component', () => {
  const mockOnLogout = jest.fn();

  beforeEach(() => {
    mockOnLogout.mockClear();
    // Mock document.querySelector for CSRF token
    document.querySelector = jest.fn(() => ({ content: 'mock-csrf-token' }));
  });

  it('renders navigation with brand', () => {
    const mockUser = { email: 'test@example.com', role: 'test_runner' };
    const mockOrganization = { name: 'Test Org' };
    
    render(<NavigationMultiTenant 
      currentUser={mockUser} 
      currentOrganization={mockOrganization}
      onLogout={mockOnLogout} 
    />);
    
    expect(screen.getByText('QA Platform')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('shows organization name when provided', () => {
    const mockUser = { email: 'test@example.com', role: 'test_runner' };
    const mockOrganization = { name: 'Test Organization' };
    
    render(<NavigationMultiTenant 
      currentUser={mockUser} 
      currentOrganization={mockOrganization}
      onLogout={mockOnLogout} 
    />);
    
    expect(screen.getByText('Test Organization')).toBeInTheDocument();
  });

  it('shows system admin options for system admin users', () => {
    const mockUser = { email: 'admin@example.com', role: 'system_admin' };
    const mockOrganization = { name: 'Test Org' };
    
    render(<NavigationMultiTenant 
      currentUser={mockUser} 
      currentOrganization={mockOrganization}
      onLogout={mockOnLogout} 
    />);
    
    expect(screen.getByText('System Admin')).toBeInTheDocument();
  });

  it('shows user management for test owners and managers', () => {
    const mockUser = { email: 'owner@example.com', role: 'test_owner' };
    const mockOrganization = { name: 'Test Org' };
    
    render(<NavigationMultiTenant 
      currentUser={mockUser} 
      currentOrganization={mockOrganization}
      onLogout={mockOnLogout} 
    />);
    
    expect(screen.getByText('Manage Users')).toBeInTheDocument();
  });

  it('renders user email and logout button', () => {
    const mockUser = { email: 'test@example.com', role: 'test_runner' };
    const mockOrganization = { name: 'Test Org' };
    
    render(<NavigationMultiTenant 
      currentUser={mockUser} 
      currentOrganization={mockOrganization}
      onLogout={mockOnLogout} 
    />);
    
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});