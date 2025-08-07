import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Navigation from '../Navigation';

describe('Navigation Component', () => {
  const mockOnLogout = jest.fn();

  beforeEach(() => {
    mockOnLogout.mockClear();
  });

  it('renders navigation with brand', () => {
    render(<Navigation currentUser={null} onLogout={mockOnLogout} />);
    
    expect(screen.getByText('Newapp')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('shows login and register buttons when user is not logged in', () => {
    render(<Navigation currentUser={null} onLogout={mockOnLogout} />);
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('shows user info and logout when user is logged in', () => {
    const mockUser = { email: 'test@example.com' };
    render(<Navigation currentUser={mockUser} onLogout={mockOnLogout} />);
    
    expect(screen.getByText('Welcome, test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getAllByText('Dashboard')).toHaveLength(2);
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
  });

  it('calls onLogout when logout button is clicked', async () => {
    const user = userEvent.setup();
    const mockUser = { email: 'test@example.com' };
    render(<Navigation currentUser={mockUser} onLogout={mockOnLogout} />);
    
    const logoutButton = screen.getByText('Logout');
    await user.click(logoutButton);
    
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });

  it('renders navigation links', () => {
    render(<Navigation currentUser={null} onLogout={mockOnLogout} />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Tests')).toBeInTheDocument();
  });

  it('shows additional navigation links for logged in users', () => {
    const mockUser = { email: 'test@example.com' };
    render(<Navigation currentUser={mockUser} onLogout={mockOnLogout} />);
    
    expect(screen.getAllByText('Dashboard')).toHaveLength(2); // One in button, one in nav
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });
});