import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import LoginForm from '../auth/LoginForm';

// Mock fetch globally
global.fetch = jest.fn();

describe('LoginForm Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    // Mock document.querySelector for CSRF token
    document.querySelector = jest.fn(() => ({ content: 'mock-csrf-token' }));
  });

  it('renders login form with email and password fields', () => {
    render(<LoginForm />);
    
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('name@company.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('renders remember me checkbox', () => {
    render(<LoginForm />);
    
    expect(screen.getByText('Remember me')).toBeInTheDocument();
  });

  it('updates form data when inputs change', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    
    const inputs = screen.getAllByTestId('text-input');
    const emailInput = inputs.find(input => input.type === 'email');
    const passwordInput = inputs.find(input => input.type === 'password');
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('shows loading state when form is submitted', async () => {
    const user = userEvent.setup();
    
    // Create a promise that doesn't resolve immediately
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    
    fetch.mockReturnValueOnce(promise);
    
    render(<LoginForm />);
    
    const inputs = screen.getAllByTestId('text-input');
    const emailInput = inputs.find(input => input.type === 'email');
    const passwordInput = inputs.find(input => input.type === 'password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    await act(async () => {
      await user.click(submitButton);
    });
    
    // Check that button is disabled during loading
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Signing in...');
    
    // Clean up by resolving the promise
    resolvePromise({ ok: true });
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('renders forgot password link', () => {
    render(<LoginForm />);
    
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
  });

  it('renders sign up link', () => {
    render(<LoginForm />);
    
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    const user = userEvent.setup();
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });
    
    render(<LoginForm />);
    
    const inputs = screen.getAllByTestId('text-input');
    const emailInput = inputs.find(input => input.type === 'email');
    const passwordInput = inputs.find(input => input.type === 'password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    expect(fetch).toHaveBeenCalledWith('/users/sign_in', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        'Content-Type': 'application/json'
      })
    }));
  });
});