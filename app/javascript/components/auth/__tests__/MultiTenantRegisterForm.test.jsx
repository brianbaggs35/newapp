import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MultiTenantRegisterForm from '../MultiTenantRegisterForm';

// Mock fetch globally
global.fetch = jest.fn();

describe('MultiTenantRegisterForm Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    // Mock document.querySelector for CSRF token
    document.querySelector = jest.fn(() => ({ content: 'mock-csrf-token' }));
  });

  it('renders step 1 - user details form correctly', () => {
    render(<MultiTenantRegisterForm />);
    
    expect(screen.getByText('Step 1 of 2: Your Details')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });
});