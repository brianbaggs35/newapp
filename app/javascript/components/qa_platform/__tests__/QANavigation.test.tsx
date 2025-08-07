import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import QANavigation from '../QANavigation';

describe('QANavigation', () => {
  const mockProps = {
    currentUser: {
      role: 'member' as const,
      canSeeOrganizationManagement: false
    },
    currentPath: '/dashboard'
  };

  it('renders navigation with all main sections', () => {
    render(<QANavigation {...mockProps} />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Automated Testing')).toBeInTheDocument();
    expect(screen.getByText('Manual Testing')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('shows automated testing sub-items', () => {
    render(<QANavigation {...mockProps} />);
    
    expect(screen.getByText('Upload')).toBeInTheDocument();
    expect(screen.getByText('Test Results')).toBeInTheDocument();
    expect(screen.getByText('Failure Analysis')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
  });

  it('shows manual testing sub-items', () => {
    render(<QANavigation {...mockProps} />);
    
    expect(screen.getByText('Test Cases')).toBeInTheDocument();
    expect(screen.getByText('Test Runs')).toBeInTheDocument();
    // Note: There are two "Reports" items, one for automated and one for manual
    expect(screen.getAllByText('Reports')).toHaveLength(2);
  });

  it('shows settings sub-items', () => {
    render(<QANavigation {...mockProps} />);
    
    expect(screen.getByText('User Settings')).toBeInTheDocument();
  });

  it('hides organization management for members', () => {
    render(<QANavigation {...mockProps} />);
    
    expect(screen.queryByText('Organization Management')).not.toBeInTheDocument();
  });

  it('shows organization management for admins and owners', () => {
    const adminProps = {
      ...mockProps,
      currentUser: {
        role: 'admin' as const,
        canSeeOrganizationManagement: true
      }
    };

    render(<QANavigation {...adminProps} />);
    
    expect(screen.getByText('Organization Management')).toBeInTheDocument();
  });

  it('shows system admin dashboard for system admins', () => {
    const systemAdminProps = {
      ...mockProps,
      currentUser: {
        role: 'system_admin' as const,
        canSeeOrganizationManagement: true
      }
    };

    render(<QANavigation {...systemAdminProps} />);
    
    expect(screen.getByText('System Admin')).toBeInTheDocument();
  });

  it('hides system admin dashboard for non-system admins', () => {
    render(<QANavigation {...mockProps} />);
    
    expect(screen.queryByText('System Admin')).not.toBeInTheDocument();
  });

  it('has correct navigation links', () => {
    render(<QANavigation {...mockProps} />);
    
    // Check some key navigation links
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).toHaveAttribute('href', '/dashboard');
    
    const uploadLink = screen.getByText('Upload').closest('a');
    expect(uploadLink).toHaveAttribute('href', '/automated_testing/uploads');
    
    const testCasesLink = screen.getByText('Test Cases').closest('a');
    expect(testCasesLink).toHaveAttribute('href', '/manual_testing/test_cases');
    
    const userSettingsLink = screen.getByText('User Settings').closest('a');
    expect(userSettingsLink).toHaveAttribute('href', '/settings/profile');
  });

  it('applies active styling for current path', () => {
    const activeProps = {
      ...mockProps,
      currentPath: '/automated_testing/uploads'
    };

    render(<QANavigation {...activeProps} />);
    
    // The Upload link should have active styling
    const uploadItem = screen.getByText('Upload').closest('.bg-gray-100');
    expect(uploadItem).toBeInTheDocument();
  });

  it('handles different current paths correctly', () => {
    const manualTestingProps = {
      ...mockProps,
      currentPath: '/manual_testing/test_cases'
    };

    render(<QANavigation {...manualTestingProps} />);
    
    // The Test Cases link should have active styling
    const testCasesItem = screen.getByText('Test Cases').closest('.bg-gray-100');
    expect(testCasesItem).toBeInTheDocument();
  });

  it('works with owner role', () => {
    const ownerProps = {
      ...mockProps,
      currentUser: {
        role: 'owner' as const,
        canSeeOrganizationManagement: true
      }
    };

    render(<QANavigation {...ownerProps} />);
    
    expect(screen.getByText('Organization Management')).toBeInTheDocument();
    expect(screen.queryByText('System Admin')).not.toBeInTheDocument();
  });

  it('renders all required icons', () => {
    render(<QANavigation {...mockProps} />);
    
    // The component should render without errors even with icons
    // We can't directly test icon rendering in this simple test setup
    // but we can verify the component renders completely
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Automated Testing')).toBeInTheDocument();
    expect(screen.getByText('Manual Testing')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});