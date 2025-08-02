import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import About from '../About';

describe('About Component', () => {
  test('renders about page title', () => {
    render(<About />);
    expect(screen.getByText('About This Application')).toBeInTheDocument();
  });

  test('renders technology stack section', () => {
    render(<About />);
    expect(screen.getByText('Technology Stack')).toBeInTheDocument();
    expect(screen.getByText(/Ruby on Rails 8.0/)).toBeInTheDocument();
    expect(screen.getByText(/React 19 with TypeScript/)).toBeInTheDocument();
    expect(screen.getByText(/Tailwind CSS \+ Flowbite React/)).toBeInTheDocument();
  });

  test('renders features section', () => {
    render(<About />);
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText(/React integration with Rails/)).toBeInTheDocument();
    expect(screen.getByText(/Component-based architecture/)).toBeInTheDocument();
  });

  test('renders react integration section', () => {
    render(<About />);
    expect(screen.getByText('React Integration')).toBeInTheDocument();
    expect(screen.getByText(/properly integrate React with Ruby on Rails/)).toBeInTheDocument();
  });

  test('renders navigation buttons', () => {
    render(<About />);
    expect(screen.getByText('Back to Home')).toBeInTheDocument();
    expect(screen.getByText('Go Back')).toBeInTheDocument();
  });

  test('back to home button has correct href', () => {
    render(<About />);
    const backButton = screen.getByText('Back to Home');
    expect(backButton).toBeInTheDocument();
  });
});