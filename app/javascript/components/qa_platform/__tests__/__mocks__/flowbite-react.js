// Mock Flowbite React components for testing
export const Sidebar = {
  Items: ({ children }) => <div data-testid="sidebar-items">{children}</div>,
  ItemGroup: ({ children }) => <div data-testid="sidebar-item-group">{children}</div>,
  Item: ({ href, icon, children, className }) => (
    <a href={href} className={className} data-testid="sidebar-item">
      {children}
    </a>
  ),
  Collapse: ({ label, children, open }) => (
    <div data-testid="sidebar-collapse">
      <div data-testid="collapse-label">{label}</div>
      {open && <div data-testid="collapse-content">{children}</div>}
    </div>
  )
};

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

export const Table = {
  Root: ({ children, hoverable }) => <table data-testid="table">{children}</table>,
  Head: ({ children }) => <thead data-testid="table-head">{children}</thead>,
  HeadCell: ({ children }) => <th data-testid="table-head-cell">{children}</th>,
  Body: ({ children }) => <tbody data-testid="table-body">{children}</tbody>,
  Row: ({ children, className }) => <tr className={className} data-testid="table-row">{children}</tr>,
  Cell: ({ children, className }) => <td className={className} data-testid="table-cell">{children}</td>
};

// Make Table callable as a component
Table.displayName = 'Table';
Object.assign(Table, Table.Root);

export const Modal = {
  Root: ({ show, onClose, children }) => 
    show ? <div data-testid="modal" onClose={onClose}>{children}</div> : null,
  Header: ({ children }) => <div data-testid="modal-header">{children}</div>,
  Body: ({ children }) => <div data-testid="modal-body">{children}</div>,
  Footer: ({ children }) => <div data-testid="modal-footer">{children}</div>
};

// Make Modal callable as a component  
Modal.displayName = 'Modal';
Object.assign(Modal, Modal.Root);

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