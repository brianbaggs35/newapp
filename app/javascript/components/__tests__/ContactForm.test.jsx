import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ContactForm from '../ContactForm';

describe('ContactForm Component', () => {
  test('renders contact form title', () => {
    render(<ContactForm />);
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  test('renders all form fields', () => {
    render(<ContactForm />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
  });

  test('renders form fields with correct placeholders', () => {
    render(<ContactForm />);
    expect(screen.getByPlaceholderText('Your full name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('your.email@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your message...')).toBeInTheDocument();
  });

  test('renders submit and cancel buttons', () => {
    render(<ContactForm />);
    expect(screen.getByText('Send Message')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('updates input values when typed', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const messageInput = screen.getByLabelText('Message');

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'Test message');

    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(messageInput).toHaveValue('Test message');
  });

  test('shows success message after form submission', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    // Fill out the form
    await user.type(screen.getByLabelText('Name'), 'John Doe');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.type(screen.getByLabelText('Message'), 'Test message');

    // Submit the form
    await user.click(screen.getByText('Send Message'));

    // Check for success message
    expect(screen.getByText(/Thank you!/)).toBeInTheDocument();
    expect(screen.getByText(/Your message has been received/)).toBeInTheDocument();
  });

  test('clears form after submission', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const messageInput = screen.getByLabelText('Message');

    // Fill out the form
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'Test message');

    // Submit the form
    await user.click(screen.getByText('Send Message'));

    // Check that form is cleared
    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(messageInput).toHaveValue('');
  });

  test('renders demo information section', () => {
    render(<ContactForm />);
    expect(screen.getByText('Demo Information')).toBeInTheDocument();
    expect(screen.getByText(/demonstration contact form/)).toBeInTheDocument();
    expect(screen.getByText(/integrate with Rails controllers/)).toBeInTheDocument();
  });
});