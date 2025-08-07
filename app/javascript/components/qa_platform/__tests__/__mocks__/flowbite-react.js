// Mock Flowbite React components for testing
import React from 'react';

export const Sidebar = ({ children, className }) => (
  <div className={className} data-testid="sidebar">{children}</div>
);

Sidebar.Items = ({ children }) => <div data-testid="sidebar-items">{children}</div>;
Sidebar.ItemGroup = ({ children }) => <div data-testid="sidebar-item-group">{children}</div>;
Sidebar.Item = ({ href, icon: Icon, children, className }) => (
  <a href={href} className={className} data-testid="sidebar-item">
    {Icon && <Icon />}
    {children}
  </a>
);
Sidebar.Collapse = ({ label, children, open, icon: Icon }) => (
  <div data-testid="sidebar-collapse">
    <div data-testid="collapse-label">
      {Icon && <Icon />}
      {label}
    </div>
    <div data-testid="collapse-content">{children}</div>
  </div>
);

export const Card = ({ children }) => <div data-testid="card">{children}</div>;

export const Button = ({ onClick, children, className, disabled, size, color, href, ...props }) => {
  if (href) {
    return <a href={href} className={className} data-testid="button">{children}</a>;
  }
  return (
    <button 
      onClick={onClick} 
      className={className} 
      disabled={disabled}
      data-testid="button"
      {...props}
    >
      {children}
    </button>
  );
};

export const Badge = ({ color, children }) => (
  <span data-testid="badge" data-color={color}>{children}</span>
);

export const Table = ({ children, hoverable }) => <table data-testid="table">{children}</table>;

Table.Head = ({ children }) => <thead data-testid="table-head">{children}</thead>;
Table.HeadCell = ({ children }) => <th data-testid="table-head-cell">{children}</th>;
Table.Body = ({ children }) => <tbody data-testid="table-body">{children}</tbody>;
Table.Row = ({ children, className }) => <tr className={className} data-testid="table-row">{children}</tr>;
Table.Cell = ({ children, className }) => <td className={className} data-testid="table-cell">{children}</td>;

export const Modal = ({ show, onClose, children }) => 
  show ? <div data-testid="modal" onClose={onClose}>{children}</div> : null;

Modal.Header = ({ children }) => <div data-testid="modal-header">{children}</div>;
Modal.Body = ({ children }) => <div data-testid="modal-body">{children}</div>;
Modal.Footer = ({ children }) => <div data-testid="modal-footer">{children}</div>;

export const TextInput = ({ placeholder, value, onChange, ...props }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    data-testid="text-input"
    {...props}
  />
);

export const FileInput = ({ accept, onChange, ...props }) => (
  <input
    type="file"
    accept={accept}
    onChange={onChange}
    data-testid="file-input"
    {...props}
  />
);

export const Progress = ({ progress }) => (
  <div data-testid="progress" data-progress={progress}>
    <div style={{ width: `${progress}%` }} />
  </div>
);

// Add a test to prevent Jest from treating this as an empty test suite
describe('Flowbite React Mock', () => {
  it('exports all required components', () => {
    expect(Sidebar).toBeDefined();
    expect(Card).toBeDefined();
    expect(Button).toBeDefined();
  });
});