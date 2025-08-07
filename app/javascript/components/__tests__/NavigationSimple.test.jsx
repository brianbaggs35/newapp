import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import NavigationSimple from '../NavigationSimple';

describe('NavigationSimple Component', () => {
  const mockOnLogout = jest.fn();

  beforeEach(() => {
    mockOnLogout.mockClear();
  });

  it('renders simple navigation with brand', () => {
    render(<NavigationSimple currentUser={null} onLogout={mockOnLogout} />);
    
    expect(screen.getByText('Newapp')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('shows login and register buttons when user is not logged in', () => {
    render(<NavigationSimple currentUser={null} onLogout={mockOnLogout} />);
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('shows user info and logout when user is logged in', () => {
    const mockUser = { email: 'test@example.com' };
    render(<NavigationSimple currentUser={mockUser} onLogout={mockOnLogout} />);
    
    expect(screen.getByText('Welcome, test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getAllByText('Dashboard')).toHaveLength(2);
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
  });

  it('calls onLogout when logout button is clicked', async () => {
    const user = userEvent.setup();
    const mockUser = { email: 'test@example.com' };
    render(<NavigationSimple currentUser={mockUser} onLogout={mockOnLogout} />);
    
    const logoutButton = screen.getByText('Logout');
    await user.click(logoutButton);
    
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });

  it('renders navigation menu links', () => {
    render(<NavigationSimple currentUser={null} onLogout={mockOnLogout} />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Tests')).toBeInTheDocument();
  });

  it('shows additional navigation links for logged in users', () => {
    const mockUser = { email: 'test@example.com' };
    render(<NavigationSimple currentUser={mockUser} onLogout={mockOnLogout} />);
    
    expect(screen.getAllByText('Dashboard')).toHaveLength(2); // One in button, one in nav
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('has proper link structure with href attributes', () => {
    const mockUser = { email: 'test@example.com' };
    render(<NavigationSimple currentUser={mockUser} onLogout={mockOnLogout} />);
    
    const brandLink = screen.getByRole('link', { name: 'Newapp' });
    expect(brandLink).toHaveAttribute('href', '/');
  });
});