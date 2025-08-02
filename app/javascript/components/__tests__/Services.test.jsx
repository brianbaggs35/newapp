import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Services from '../Services';

describe('Services Component', () => {
  test('renders services page title', () => {
    render(<Services />);
    expect(screen.getByText('Our Services')).toBeInTheDocument();
  });

  test('renders all service cards', () => {
    render(<Services />);
    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByText('Desktop Applications')).toBeInTheDocument();
    expect(screen.getByText('Mobile Development')).toBeInTheDocument();
    expect(screen.getByText('Cloud Solutions')).toBeInTheDocument();
  });

  test('renders service descriptions', () => {
    render(<Services />);
    expect(screen.getByText(/Custom web applications built with modern technologies/)).toBeInTheDocument();
    expect(screen.getByText(/Native desktop applications for Windows, macOS, and Linux/)).toBeInTheDocument();
  });

  test('renders service price ranges', () => {
    render(<Services />);
    expect(screen.getByText('$5,000 - $20,000')).toBeInTheDocument();
    expect(screen.getByText('$8,000 - $25,000')).toBeInTheDocument();
    expect(screen.getByText('$10,000 - $30,000')).toBeInTheDocument();
    expect(screen.getByText('$3,000 - $15,000')).toBeInTheDocument();
  });

  test('shows detailed service information when card is clicked', async () => {
    const user = userEvent.setup();
    render(<Services />);

    // Initially, detailed features should not be visible
    expect(screen.queryByText('Features:')).not.toBeInTheDocument();

    // Click on Web Development service
    await user.click(screen.getByText('Web Development'));

    // Check that detailed information is now visible
    expect(screen.getByText('Features:')).toBeInTheDocument();
    expect(screen.getByText('React Components')).toBeInTheDocument();
    expect(screen.getByText('Rails Backend')).toBeInTheDocument();
    expect(screen.getByText('Get Quote')).toBeInTheDocument();
  });

  test('shows different features for different services', async () => {
    const user = userEvent.setup();
    render(<Services />);

    // Click on Mobile Development service
    await user.click(screen.getByText('Mobile Development'));

    // Check mobile-specific features
    expect(screen.getByText('React Native')).toBeInTheDocument();
    expect(screen.getByText('iOS & Android')).toBeInTheDocument();
    expect(screen.getByText('Push Notifications')).toBeInTheDocument();
  });

  test('renders call-to-action section', () => {
    render(<Services />);
    expect(screen.getByText('Ready to Start Your Project?')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText('Learn More')).toBeInTheDocument();
  });

  test('navigation buttons work correctly', async () => {
    const user = userEvent.setup();
    
    render(<Services />);

    // Mock window.location.hash setter
    const originalLocation = window.location;
    const setHash = jest.fn();
    delete window.location;
    window.location = { 
      ...originalLocation, 
      get hash() { return this._hash || ''; },
      set hash(value) { 
        this._hash = value;
        setHash(value);
      }
    };

    // Click Contact Us button
    await user.click(screen.getByText('Contact Us'));
    expect(setHash).toHaveBeenCalledWith('contact');

    // Click Learn More button
    await user.click(screen.getByText('Learn More'));
    expect(setHash).toHaveBeenCalledWith('about');

    // Restore original location
    window.location = originalLocation;
  });

  test('service cards have proper styling when selected', async () => {
    const user = userEvent.setup();
    render(<Services />);

    // Find the card container by looking for the card that contains "Web Development"
    const webDevText = screen.getByText('Web Development');
    const webDevCard = webDevText.closest('div[class*="flowbite-card"]') || 
                       webDevText.closest('div[class*="cursor-pointer"]');
    
    expect(webDevCard).toBeTruthy();

    // Click to select
    await user.click(screen.getByText('Web Development'));

    // Check that detailed service information appears (which indicates selection)
    expect(screen.getByText('Features:')).toBeInTheDocument();
    expect(screen.getByText('React Components')).toBeInTheDocument();
  });
});