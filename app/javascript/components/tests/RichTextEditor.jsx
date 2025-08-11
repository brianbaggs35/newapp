import React, { useState, useEffect, useRef } from 'react';
import { Button, Tooltip } from 'flowbite-react';
import { 
  HiBold, 
  HiOutlineItalic, 
  HiOutlineCode, 
  HiOutlineLink,
  HiOutlineListBullet,
  HiOutlineDocumentText,
  HiOutlineEye
} from 'react-icons/hi2';

const RichTextEditor = ({ 
  content = '', 
  onChange, 
  readOnly = false, 
  placeholder = 'Start typing...',
  height = '200px'
}) => {
  const [editorContent, setEditorContent] = useState(content);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    setEditorContent(content);
  }, [content]);

  useEffect(() => {
    if (onChange) {
      onChange(editorContent);
    }
  }, [editorContent, onChange]);

  const handleContentChange = (e) => {
    const newContent = e.target.innerHTML;
    setEditorContent(newContent);
  };

  const handleKeyDown = (e) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
        default:
          break;
      }
    }

    // Handle Enter key for creating new lines
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift+Enter creates a line break
        e.preventDefault();
        execCommand('insertHTML', '<br>');
      }
      // Regular Enter creates a new paragraph (default behavior)
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
    handleContentChange({ target: contentRef.current });
  };

  const insertOrderedList = () => {
    execCommand('insertOrderedList');
  };

  const insertUnorderedList = () => {
    execCommand('insertUnorderedList');
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertCodeBlock = () => {
    const selection = window.getSelection();
    if (selection.toString()) {
      execCommand('insertHTML', `<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">${selection.toString()}</code>`);
    } else {
      execCommand('insertHTML', '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">code</code>');
    }
  };

  const formatAsSteps = () => {
    const steps = prompt('Enter steps (one per line):');
    if (steps) {
      const stepsList = steps.split('\n')
        .filter(step => step.trim())
        .map((step, index) => `<div class="mb-2"><strong>Step ${index + 1}:</strong> ${step.trim()}</div>`)
        .join('');
      execCommand('insertHTML', stepsList);
    }
  };

  const renderPreview = () => {
    // Convert HTML to a more readable format for preview
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = editorContent;
    
    // Add some styling for preview
    const styledContent = editorContent
      .replace(/<div>/g, '<div class="mb-2">')
      .replace(/<p>/g, '<p class="mb-2">')
      .replace(/<ul>/g, '<ul class="list-disc list-inside mb-2">')
      .replace(/<ol>/g, '<ol class="list-decimal list-inside mb-2">')
      .replace(/<li>/g, '<li class="mb-1">')
      .replace(/<code>/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">')
      .replace(/<strong>/g, '<strong class="font-bold">')
      .replace(/<em>/g, '<em class="italic">');

    return (
      <div 
        className="prose prose-sm max-w-none p-3 border border-gray-300 rounded-lg bg-white"
        style={{ minHeight: height }}
        dangerouslySetInnerHTML={{ __html: styledContent }}
      />
    );
  };

  if (readOnly) {
    return (
      <div className="border border-gray-300 rounded-lg">
        {renderPreview()}
      </div>
    );
  }

  if (isPreviewMode) {
    return (
      <div className="border border-gray-300 rounded-lg">
        <div className="flex justify-between items-center p-2 border-b border-gray-200 bg-gray-50">
          <span className="text-sm font-medium text-gray-700">Preview</span>
          <Button
            size="xs"
            color="gray"
            onClick={() => setIsPreviewMode(false)}
          >
            Edit
          </Button>
        </div>
        {renderPreview()}
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <Tooltip content="Bold (Ctrl+B)">
          <Button
            size="xs"
            color="gray"
            onClick={() => execCommand('bold')}
            className="!p-2"
          >
            <HiBold className="w-4 h-4" />
          </Button>
        </Tooltip>

        <Tooltip content="Italic (Ctrl+I)">
          <Button
            size="xs"
            color="gray"
            onClick={() => execCommand('italic')}
            className="!p-2"
          >
            <HiOutlineItalic className="w-4 h-4" />
          </Button>
        </Tooltip>

        <Tooltip content="Underline (Ctrl+U)">
          <Button
            size="xs"
            color="gray"
            onClick={() => execCommand('underline')}
            className="!p-2"
          >
            <span className="underline font-bold">U</span>
          </Button>
        </Tooltip>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Tooltip content="Bullet List">
          <Button
            size="xs"
            color="gray"
            onClick={insertUnorderedList}
            className="!p-2"
          >
            <HiOutlineListBullet className="w-4 h-4" />
          </Button>
        </Tooltip>

        <Tooltip content="Numbered List">
          <Button
            size="xs"
            color="gray"
            onClick={insertOrderedList}
            className="!p-2"
          >
            <span className="text-xs font-bold">1.</span>
          </Button>
        </Tooltip>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Tooltip content="Add Link">
          <Button
            size="xs"
            color="gray"
            onClick={insertLink}
            className="!p-2"
          >
            <HiOutlineLink className="w-4 h-4" />
          </Button>
        </Tooltip>

        <Tooltip content="Code">
          <Button
            size="xs"
            color="gray"
            onClick={insertCodeBlock}
            className="!p-2"
          >
            <HiOutlineCode className="w-4 h-4" />
          </Button>
        </Tooltip>

        <Tooltip content="Format as Test Steps">
          <Button
            size="xs"
            color="gray"
            onClick={formatAsSteps}
            className="!p-2"
          >
            <HiOutlineDocumentText className="w-4 h-4" />
          </Button>
        </Tooltip>

        <div className="flex-1" />

        <Tooltip content="Preview">
          <Button
            size="xs"
            color="gray"
            onClick={() => setIsPreviewMode(true)}
            className="!p-2"
          >
            <HiOutlineEye className="w-4 h-4" />
          </Button>
        </Tooltip>
      </div>

      {/* Editor Content */}
      <div
        ref={contentRef}
        contentEditable
        className="p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
        style={{ minHeight: height }}
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        dangerouslySetInnerHTML={{ __html: editorContent }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />


    </div>
  );
};

export default RichTextEditor;