import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ForgotPasswordForm from '../ForgotPasswordForm';

// Mock fetch globally
global.fetch = jest.fn();

describe.skip('ForgotPasswordForm Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    // Mock document.querySelector for CSRF token
    document.querySelector = jest.fn(() => ({ content: 'mock-csrf-token' }));
  });

  it('renders forgot password form correctly', () => {
    render(<ForgotPasswordForm />);
    
    expect(screen.getByRole('heading', { name: 'Forgot Password?' })).toBeInTheDocument();
    expect(screen.getByText('Enter your email address and we\'ll send you a reset link')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send Reset Instructions' })).toBeInTheDocument();
    expect(screen.getByText('Back to Sign In')).toBeInTheDocument();
  });

  it('displays email icon', () => {
    render(<ForgotPasswordForm />);
    
    expect(screen.getByTestId('hi-mail')).toBeInTheDocument();
  });

  it('updates form data when email input changes', async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);
    
    const emailInput = screen.getByLabelText('Email');
    await user.type(emailInput, 'test@example.com');
    
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('handles successful form submission', async () => {
    const user = userEvent.setup();
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Reset email sent' })
    });
    
    render(<ForgotPasswordForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: 'Send Reset Instructions' });
    
    await user.type(emailInput, 'test@example.com');
    
    await act(async () => {
      await user.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Password reset instructions have been sent to your email.')).toBeInTheDocument();
    });
    
    expect(fetch).toHaveBeenCalledWith('/users/password', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        'Content-Type': 'application/json',
        'X-CSRF-Token': 'mock-csrf-token'
      }),
      body: JSON.stringify({
        user: { email: 'test@example.com' }
      })
    }));
  });

  it('handles form submission with server error', async () => {
    const user = userEvent.setup();
    
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ 
        error: 'Email not found',
        errors: { email: ['not found'] }
      })
    });
    
    render(<ForgotPasswordForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: 'Send Reset Instructions' });
    
    await user.type(emailInput, 'nonexistent@example.com');
    
    await act(async () => {
      await user.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Email not found')).toBeInTheDocument();
    });
  });

  it('handles network error during form submission', async () => {
    const user = userEvent.setup();
    
    fetch.mockRejectedValueOnce(new Error('Network error'));
    
    render(<ForgotPasswordForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: 'Send Reset Instructions' });
    
    await user.type(emailInput, 'test@example.com');
    
    await act(async () => {
      await user.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument();
    });
  });

  it('shows loading state during form submission', async () => {
    const user = userEvent.setup();
    
    // Create a promise that doesn't resolve immediately
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    fetch.mockReturnValueOnce({
      ok: true,
      json: () => promise
    });
    
    render(<ForgotPasswordForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: 'Send Reset Instructions' });
    
    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);
    
    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Sending...')).toBeInTheDocument();
    
    // Resolve the promise to clean up
    resolvePromise({ message: 'Reset email sent' });
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('requires email input', async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: 'Send Reset Instructions' });
    
    expect(emailInput).toBeRequired();
    
    await act(async () => {
      await user.click(submitButton);
    });
    
    // Form should not be submitted without email
    expect(fetch).not.toHaveBeenCalled();
  });

  it('has correct email input type', () => {
    render(<ForgotPasswordForm />);
    
    const emailInput = screen.getByLabelText('Email');
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('clears error and success messages on new submission', async () => {
    const user = userEvent.setup();
    
    // First submission with error
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'First error' })
    });
    
    render(<ForgotPasswordForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: 'Send Reset Instructions' });
    
    await user.type(emailInput, 'test@example.com');
    
    await act(async () => {
      await user.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('First error')).toBeInTheDocument();
    });
    
    // Second submission should clear previous error
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Success' })
    });
    
    await act(async () => {
      await user.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.queryByText('First error')).not.toBeInTheDocument();
    });
  });
});