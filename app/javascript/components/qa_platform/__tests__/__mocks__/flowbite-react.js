// Mock Flowbite React components for testing
import React from 'react';

export const Sidebar = ({ children, className }) => (
  <div className={className} data-testid="sidebar">{children}</div>
);
Sidebar.displayName = 'Sidebar';

Sidebar.Items = ({ children }) => <div data-testid="sidebar-items">{children}</div>;
Sidebar.Items.displayName = 'Sidebar.Items';

Sidebar.ItemGroup = ({ children }) => <div data-testid="sidebar-item-group">{children}</div>;
Sidebar.ItemGroup.displayName = 'Sidebar.ItemGroup';

Sidebar.Item = ({ href, icon: Icon, children, className }) => (
  <a href={href} className={className} data-testid="sidebar-item">
    {Icon && <Icon />}
    {children}
  </a>
);
Sidebar.Item.displayName = 'Sidebar.Item';

Sidebar.Collapse = ({ label, children, _open, icon: Icon }) => (
  <div data-testid="sidebar-collapse">
    <div data-testid="collapse-label">
      {Icon && <Icon />}
      {label}
    </div>
    <div data-testid="collapse-content">{children}</div>
  </div>
);
Sidebar.Collapse.displayName = 'Sidebar.Collapse';

export const Card = ({ children, onClick, className }) => (
  <div data-testid="card" className={className} onClick={onClick}>{children}</div>
);
Card.displayName = 'Card';

export const Button = ({ onClick, children, className, disabled, _size, _color, href, ...props }) => {
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
Button.displayName = 'Button';

export const Badge = ({ color, children }) => (
  <span data-testid="badge" data-color={color}>{children}</span>
);
Badge.displayName = 'Badge';

export const Alert = ({ color, children, className }) => (
  <div data-testid="alert" data-color={color} className={className}>{children}</div>
);
Alert.displayName = 'Alert';

export const Spinner = ({ _size, _color }) => (
  <div data-testid="spinner">Loading...</div>
);
Spinner.displayName = 'Spinner';

// Add Navbar components
export const Navbar = ({ _fluid, children }) => (
  <nav data-testid="navbar">{children}</nav>
);
Navbar.displayName = 'Navbar';

Navbar.Brand = ({ href, children }) => (
  <div data-testid="navbar-brand">
    <a href={href}>{children}</a>
  </div>
);
Navbar.Brand.displayName = 'Navbar.Brand';

Navbar.Toggle = () => <button data-testid="navbar-toggle">☰</button>;
Navbar.Toggle.displayName = 'Navbar.Toggle';

Navbar.Collapse = ({ children }) => (
  <div data-testid="navbar-collapse">{children}</div>
);
Navbar.Collapse.displayName = 'Navbar.Collapse';

Navbar.Link = ({ href, active, children }) => (
  <a href={href} data-testid="navbar-link" data-active={active}>{children}</a>
);
Navbar.Link.displayName = 'Navbar.Link';

export const Label = ({ htmlFor, children, className }) => (
  <label htmlFor={htmlFor} className={className} data-testid="label">{children}</label>
);
Label.displayName = 'Label';

export const Textarea = ({ value, onChange, placeholder, rows, className, ...props }) => (
  <textarea 
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    className={className}
    data-testid="textarea"
    {...props}
  />
);
Textarea.displayName = 'Textarea';

export const Checkbox = ({ checked, onChange, className, ...props }) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={onChange}
    className={className}
    data-testid="checkbox"
    {...props}
  />
);
Checkbox.displayName = 'Checkbox';

export const Table = ({ children, _hoverable }) => <table data-testid="table">{children}</table>;
Table.displayName = 'Table';

Table.Head = ({ children }) => <thead data-testid="table-head"><tr>{children}</tr></thead>;
Table.Head.displayName = 'Table.Head';

Table.HeadCell = ({ children }) => <th data-testid="table-head-cell">{children}</th>;
Table.HeadCell.displayName = 'Table.HeadCell';

Table.Body = ({ children }) => <tbody data-testid="table-body">{children}</tbody>;
Table.Body.displayName = 'Table.Body';

Table.Row = ({ children, className }) => <tr className={className} data-testid="table-row">{children}</tr>;
Table.Row.displayName = 'Table.Row';

Table.Cell = ({ children, className }) => <td className={className} data-testid="table-cell">{children}</td>;
Table.Cell.displayName = 'Table.Cell';

export const Modal = ({ show, _onClose, children }) => 
  show ? <div data-testid="modal">{children}</div> : null;
Modal.displayName = 'Modal';

Modal.Header = ({ children }) => <div data-testid="modal-header">{children}</div>;
Modal.Header.displayName = 'Modal.Header';

Modal.Body = ({ children }) => <div data-testid="modal-body">{children}</div>;
Modal.Body.displayName = 'Modal.Body';

Modal.Footer = ({ children }) => <div data-testid="modal-footer">{children}</div>;
Modal.Footer.displayName = 'Modal.Footer';

export const TextInput = ({ placeholder, value, onChange, id, ...props }) => (
  <input
    type="text"
    id={id}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    data-testid="text-input"
    {...props}
  />
);

export const FileInput = ({ accept, onChange, id, ...props }) => (
  <input
    type="file"
    id={id}
    accept={accept}
    onChange={onChange}
    data-testid="file-input"
    {...props}
  />
);
FileInput.displayName = 'FileInput';

export const Progress = ({ progress }) => (
  <div data-testid="progress" data-progress={progress}>
    <div style={{ width: `${progress}%` }} />
  </div>
);
Progress.displayName = 'Progress';

export const Dropdown = ({ label, children, ...props }) => (
  <div data-testid="dropdown" {...props}>
    <div data-testid="dropdown-label">{label}</div>
    <div data-testid="dropdown-menu">{children}</div>
  </div>
);
Dropdown.displayName = 'Dropdown';

Dropdown.Item = ({ href, onClick, children }) => (
  <div data-testid="dropdown-item" onClick={onClick}>
    {href ? <a href={href}>{children}</a> : children}
  </div>
);
Dropdown.Item.displayName = 'Dropdown.Item';

Dropdown.Header = ({ children }) => (
  <div data-testid="dropdown-header">{children}</div>
);
Dropdown.Header.displayName = 'Dropdown.Header';

Dropdown.Divider = () => <div data-testid="dropdown-divider" />;
Dropdown.Divider.displayName = 'Dropdown.Divider';

// Add a test to prevent Jest from treating this as an empty test suite
describe('Flowbite React Mock', () => {
  it('exports all required components', () => {
    expect(Sidebar).toBeDefined();
    expect(Card).toBeDefined();
    expect(Button).toBeDefined();
  });
});