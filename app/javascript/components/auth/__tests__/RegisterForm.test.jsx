import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import RegisterForm from '../RegisterForm';

// Mock fetch globally
global.fetch = jest.fn();

describe.skip('RegisterForm Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    // Mock document.querySelector for CSRF token
    document.querySelector = jest.fn(() => ({ content: 'mock-csrf-token' }));
  });

  it('renders register form correctly', () => {
    render(<RegisterForm />);
    
    expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByText('Join us today! Create your account to get started.')).toBeInTheDocument();
    expect(screen.getByTestId('text-input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByText('Already have an account? Sign in')).toBeInTheDocument();
  });

  it('displays required icons', () => {
    render(<RegisterForm />);
    
    expect(screen.getByTestId('hi-mail')).toBeInTheDocument();
    expect(screen.getAllByTestId('hi-lock-closed')).toHaveLength(2);
    expect(screen.getAllByTestId('hi-eye')).toHaveLength(2);
  });

  it('updates form data when inputs change', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('password_confirmation');
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
    expect(confirmPasswordInput).toHaveValue('password123');
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);
    
    const passwordInput = screen.getByLabelText('Password');
    const passwordToggle = screen.getAllByTestId('hi-eye')[0].closest('button');
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    await user.click(passwordToggle);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    await user.click(passwordToggle);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('toggles password confirmation visibility', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);
    
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const confirmPasswordToggle = screen.getAllByTestId('hi-eye')[1].closest('button');
    
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    
    await user.click(confirmPasswordToggle);
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
    
    await user.click(confirmPasswordToggle);
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  it('handles successful form submission', async () => {
    const user = userEvent.setup();
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Account created successfully' })
    });
    
    render(<RegisterForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    
    await act(async () => {
      await user.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Registration successful! Please check your email to confirm your account.')).toBeInTheDocument();
    });
    
    expect(fetch).toHaveBeenCalledWith('/users', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        'Content-Type': 'application/json',
        'X-CSRF-Token': 'mock-csrf-token'
      }),
      body: JSON.stringify({
        user: { 
          email: 'test@example.com',
          password: 'password123',
          password_confirmation: 'password123'
        }
      })
    }));
  });

  it('handles form submission with server validation errors', async () => {
    const user = userEvent.setup();
    
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ 
        error: 'Validation failed',
        errors: { 
          email: ['has already been taken'],
          password: ['is too short']
        }
      })
    });
    
    render(<RegisterForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    
    await user.type(emailInput, 'existing@example.com');
    await user.type(passwordInput, '123');
    await user.type(confirmPasswordInput, '123');
    
    await act(async () => {
      await user.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Email has already been taken')).toBeInTheDocument();
      expect(screen.getByText('Password is too short')).toBeInTheDocument();
    });
  });

  it('handles network error during form submission', async () => {
    const user = userEvent.setup();
    
    fetch.mockRejectedValueOnce(new Error('Network error'));
    
    render(<RegisterForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    
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
    
    render(<RegisterForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    
    await user.click(submitButton);
    
    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Creating account...')).toBeInTheDocument();
    
    // Resolve the promise to clean up
    resolvePromise({ message: 'Account created' });
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('validates required fields', () => {
    render(<RegisterForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    
    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
    expect(confirmPasswordInput).toBeRequired();
  });

  it('has correct input types', () => {
    render(<RegisterForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  it('has proper placeholders', () => {
    render(<RegisterForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    
    expect(emailInput).toHaveAttribute('placeholder', 'name@company.com');
    expect(passwordInput).toHaveAttribute('placeholder', 'Enter your password');
    expect(confirmPasswordInput).toHaveAttribute('placeholder', 'Confirm your password');
  });

  it('shows proper minimum password length', () => {
    render(<RegisterForm />);
    
    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('minLength', '6');
  });

  it('clears error and success messages on new submission', async () => {
    const user = userEvent.setup();
    
    // First submission with error
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'First error' })
    });
    
    render(<RegisterForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    
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