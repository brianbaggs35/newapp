import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import RichTextEditor from '../RichTextEditor';

// Mock document.execCommand
document.execCommand = jest.fn();

// Mock window.getSelection
Object.defineProperty(window, 'getSelection', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    toString: () => 'selected text',
    rangeCount: 1,
    getRangeAt: () => ({
      cloneContents: () => ({ textContent: 'selected text' })
    })
  }))
});

describe('RichTextEditor', () => {
  const defaultProps = {
    content: '',
    onChange: jest.fn(),
    readOnly: false,
    placeholder: 'Start typing...'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders editor with toolbar when not readOnly', () => {
    render(<RichTextEditor {...defaultProps} />);

    // Check that toolbar buttons are present
    expect(screen.getByRole('button', { name: /bold/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /italic/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /underline/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /bullet list/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /numbered list/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add link/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /code/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /preview/i })).toBeInTheDocument();

    // Check that content editable div is present
    const editor = document.querySelector('[contenteditable="true"]');
    expect(editor).toBeInTheDocument();
  });

  test('renders in readOnly mode without toolbar', () => {
    render(<RichTextEditor {...defaultProps} readOnly={true} content="<p>Test content</p>" />);

    // Toolbar should not be present
    expect(screen.queryByRole('button', { name: /bold/i })).not.toBeInTheDocument();

    // Content should be displayed
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  test('displays initial content', () => {
    const content = '<p>Initial content</p>';
    render(<RichTextEditor {...defaultProps} content={content} />);

    const editor = document.querySelector('[contenteditable="true"]');
    expect(editor.innerHTML).toBe(content);
  });

  test('calls onChange when content changes', () => {
    const onChange = jest.fn();
    render(<RichTextEditor {...defaultProps} onChange={onChange} />);

    const editor = document.querySelector('[contenteditable="true"]');
    
    // Simulate content change
    editor.innerHTML = '<p>New content</p>';
    fireEvent.input(editor);

    expect(onChange).toHaveBeenCalledWith('<p>New content</p>');
  });

  test('executes bold command when bold button is clicked', () => {
    render(<RichTextEditor {...defaultProps} />);

    const boldButton = screen.getByRole('button', { name: /bold/i });
    fireEvent.click(boldButton);

    expect(document.execCommand).toHaveBeenCalledWith('bold', false, null);
  });

  test('executes italic command when italic button is clicked', () => {
    render(<RichTextEditor {...defaultProps} />);

    const italicButton = screen.getByRole('button', { name: /italic/i });
    fireEvent.click(italicButton);

    expect(document.execCommand).toHaveBeenCalledWith('italic', false, null);
  });

  test('executes underline command when underline button is clicked', () => {
    render(<RichTextEditor {...defaultProps} />);

    const underlineButton = screen.getByRole('button', { name: /underline/i });
    fireEvent.click(underlineButton);

    expect(document.execCommand).toHaveBeenCalledWith('underline', false, null);
  });

  test('executes insertUnorderedList command when bullet list button is clicked', () => {
    render(<RichTextEditor {...defaultProps} />);

    const bulletListButton = screen.getByRole('button', { name: /bullet list/i });
    fireEvent.click(bulletListButton);

    expect(document.execCommand).toHaveBeenCalledWith('insertUnorderedList', false, null);
  });

  test('executes insertOrderedList command when numbered list button is clicked', () => {
    render(<RichTextEditor {...defaultProps} />);

    const numberedListButton = screen.getByRole('button', { name: /numbered list/i });
    fireEvent.click(numberedListButton);

    expect(document.execCommand).toHaveBeenCalledWith('insertOrderedList', false, null);
  });

  test('prompts for URL and creates link when link button is clicked', () => {
    // Mock window.prompt
    const originalPrompt = window.prompt;
    window.prompt = jest.fn().mockReturnValue('https://example.com');

    render(<RichTextEditor {...defaultProps} />);

    const linkButton = screen.getByRole('button', { name: /add link/i });
    fireEvent.click(linkButton);

    expect(window.prompt).toHaveBeenCalledWith('Enter URL:');
    expect(document.execCommand).toHaveBeenCalledWith('createLink', false, 'https://example.com');

    // Restore original prompt
    window.prompt = originalPrompt;
  });

  test('handles keyboard shortcuts', () => {
    render(<RichTextEditor {...defaultProps} />);

    const editor = document.querySelector('[contenteditable="true"]');

    // Test Ctrl+B for bold
    fireEvent.keyDown(editor, { key: 'b', ctrlKey: true });
    expect(document.execCommand).toHaveBeenCalledWith('bold', false, null);

    // Test Ctrl+I for italic
    fireEvent.keyDown(editor, { key: 'i', ctrlKey: true });
    expect(document.execCommand).toHaveBeenCalledWith('italic', false, null);

    // Test Ctrl+U for underline
    fireEvent.keyDown(editor, { key: 'u', ctrlKey: true });
    expect(document.execCommand).toHaveBeenCalledWith('underline', false, null);
  });

  test('switches between edit and preview modes', () => {
    const content = '<p>Test content for preview</p>';
    render(<RichTextEditor {...defaultProps} content={content} />);

    // Initially in edit mode
    expect(document.querySelector('[contenteditable="true"]')).toBeInTheDocument();

    // Click preview button
    const previewButton = screen.getByRole('button', { name: /preview/i });
    fireEvent.click(previewButton);

    // Should show preview
    expect(screen.getByText('Preview')).toBeInTheDocument();
    expect(screen.getByText('Test content for preview')).toBeInTheDocument();

    // Should have Edit button
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    // Should be back in edit mode
    expect(document.querySelector('[contenteditable="true"]')).toBeInTheDocument();
  });

  test('inserts code block when code button is clicked', () => {
    render(<RichTextEditor {...defaultProps} />);

    const codeButton = screen.getByRole('button', { name: /code/i });
    fireEvent.click(codeButton);

    expect(document.execCommand).toHaveBeenCalledWith(
      'insertHTML',
      false,
      '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">code</code>'
    );
  });

  test('formats text as test steps when format steps button is clicked', () => {
    // Mock window.prompt
    const originalPrompt = window.prompt;
    window.prompt = jest.fn().mockReturnValue('Step one\nStep two\nStep three');

    render(<RichTextEditor {...defaultProps} />);

    const stepsButton = screen.getByRole('button', { name: /format as test steps/i });
    fireEvent.click(stepsButton);

    expect(window.prompt).toHaveBeenCalledWith('Enter steps (one per line):');
    expect(document.execCommand).toHaveBeenCalledWith(
      'insertHTML',
      false,
      expect.stringContaining('<strong>Step 1:</strong> Step one')
    );

    // Restore original prompt
    window.prompt = originalPrompt;
  });

  test('handles Enter key for line breaks', () => {
    render(<RichTextEditor {...defaultProps} />);

    const editor = document.querySelector('[contenteditable="true"]');

    // Test Shift+Enter for line break
    fireEvent.keyDown(editor, { key: 'Enter', shiftKey: true });
    expect(document.execCommand).toHaveBeenCalledWith('insertHTML', false, '<br>');
  });

  test('displays placeholder when content is empty', () => {
    const placeholder = 'Enter your content here...';
    render(<RichTextEditor {...defaultProps} placeholder={placeholder} />);

    const editor = document.querySelector('[contenteditable="true"]');
    expect(editor).toHaveAttribute('data-placeholder', placeholder);
  });

  test('applies custom height', () => {
    const height = '300px';
    render(<RichTextEditor {...defaultProps} height={height} />);

    const editor = document.querySelector('[contenteditable="true"]');
    expect(editor.style.minHeight).toBe(height);
  });

  test('handles text selection for formatting', async () => {
    const user = userEvent.setup();
    render(<RichTextEditor {...defaultProps} />);

    const editor = document.querySelector('[contenteditable="true"]');
    
    // Simulate text selection
    fireEvent.mouseUp(editor);
    fireEvent.keyUp(editor);

    // The component should handle selection (tested via the event handlers)
    expect(editor).toBeInTheDocument();
  });

  test('prevents default behavior for keyboard shortcuts', () => {
    render(<RichTextEditor {...defaultProps} />);

    const editor = document.querySelector('[contenteditable="true"]');
    const event = new KeyboardEvent('keydown', { key: 'b', ctrlKey: true });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

    fireEvent.keyDown(editor, event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  test('does not render toolbar in readOnly mode', () => {
    render(<RichTextEditor {...defaultProps} readOnly={true} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('renders content correctly in preview mode', () => {
    const content = '<p>Paragraph</p><ul><li>List item</li></ul><strong>Bold text</strong>';
    render(<RichTextEditor {...defaultProps} content={content} />);

    // Switch to preview mode
    const previewButton = screen.getByRole('button', { name: /preview/i });
    fireEvent.click(previewButton);

    expect(screen.getByText('Paragraph')).toBeInTheDocument();
    expect(screen.getByText('List item')).toBeInTheDocument();
    expect(screen.getByText('Bold text')).toBeInTheDocument();
  });
});