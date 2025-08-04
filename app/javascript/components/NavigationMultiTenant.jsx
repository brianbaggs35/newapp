import React from 'react';
import { Navbar, Button, Dropdown } from 'flowbite-react';
import { 
  HiUser, 
  HiLogout, 
  HiOfficeBuilding, 
  HiCog,
  HiClipboardList,
  HiPlay,
  HiUsers,
  HiChevronDown
} from 'react-icons/hi';

const Navigation = ({ currentUser, currentOrganization, onLogout }) => {
  const isSystemAdmin = currentUser?.role === 'system_admin';
  const canManageOrganization = currentUser?.role === 'test_owner' || currentUser?.role === 'test_manager';
  const canManageUsers = canManageOrganization;

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Default logout behavior
      fetch('/users/sign_out', {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
        }
      }).then(() => {
        window.location.href = '/';
      });
    }
  };

  const NavSection = ({ title, icon: Icon, children }) => (
    <div className="px-4 py-2">
      <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white mb-2">
        <Icon className="mr-2 h-4 w-4" />
        {title}
      </div>
      <div className="ml-6 space-y-1">
        {children}
      </div>
    </div>
  );

  const NavLink = ({ href, children, onClick }) => (
    <a
      href={href}
      onClick={onClick}
      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white rounded-md"
    >
      {children}
    </a>
  );

  return (
    <Navbar fluid className="border-b border-gray-200 dark:border-gray-700">
      <Navbar.Brand href={isSystemAdmin ? "/organizations" : "/dashboard"}>
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          QA Platform
        </span>
        {currentOrganization && !isSystemAdmin && (
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            • {currentOrganization.name}
          </span>
        )}
      </Navbar.Brand>
      
      <div className="flex md:order-2 items-center space-x-2">
        {currentUser ? (
          <>
            <span className="hidden md:block text-sm text-gray-700 dark:text-gray-300">
              {currentUser.email}
              {currentUser.role && (
                <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded">
                  {currentUser.role.replace('_', ' ')}
                </span>
              )}
            </span>
            
            {/* User Dropdown */}
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <div className="flex items-center">
                  <HiUser className="h-5 w-5" />
                  <HiChevronDown className="ml-1 h-3 w-3" />
                </div>
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">{currentUser.email}</span>
                <span className="block truncate text-sm font-medium">
                  {currentUser.role?.replace('_', ' ')} 
                  {currentOrganization && ` @ ${currentOrganization.name}`}
                </span>
              </Dropdown.Header>
              
              <Dropdown.Item href="/users/edit">
                <HiUser className="mr-2 h-4 w-4" />
                Profile Settings
              </Dropdown.Item>
              
              {canManageOrganization && currentOrganization && (
                <Dropdown.Item href={`/organizations/${currentOrganization.id}/edit`}>
                  <HiOfficeBuilding className="mr-2 h-4 w-4" />
                  Organization Settings
                </Dropdown.Item>
              )}
              
              {isSystemAdmin && (
                <Dropdown.Item href="/admin">
                  <HiCog className="mr-2 h-4 w-4" />
                  System Admin
                </Dropdown.Item>
              )}
              
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>
                <HiLogout className="mr-2 h-4 w-4" />
                Sign out
              </Dropdown.Item>
            </Dropdown>
          </>
        ) : (
          <>
            <Button size="sm" color="gray" href="/users/sign_in" className="mr-2">
              Login
            </Button>
            <Button size="sm" color="blue" href="/users/sign_up">
              Register
            </Button>
          </>
        )}
        <Navbar.Toggle />
      </div>
      
      {currentUser && !isSystemAdmin && currentOrganization && (
        <Navbar.Collapse>
          {/* Dashboard */}
          <Navbar.Link href="/dashboard" className="md:hidden">
            Dashboard
          </Navbar.Link>
          
          {/* Automated Testing Section */}
          <div className="md:hidden">
            <NavSection title="Automated Testing" icon={HiClipboardList}>
              <NavLink href="/tests">View Test Results</NavLink>
              <NavLink href="/tests/import">Upload JUnit XML</NavLink>
              <NavLink href="/tests/statistics">Test Statistics</NavLink>
            </NavSection>
          </div>

          {/* Manual Testing Section */}
          <div className="md:hidden">
            <NavSection title="Manual Testing" icon={HiPlay}>
              <NavLink href="/manual-tests">Test Cases</NavLink>
              <NavLink href="/manual-tests/runs">Test Runs</NavLink>
              <NavLink href="/manual-tests/reports">Reports</NavLink>
            </NavSection>
          </div>

          {/* Settings Section */}
          {(canManageOrganization || canManageUsers) && (
            <div className="md:hidden">
              <NavSection title="Settings" icon={HiCog}>
                {canManageUsers && (
                  <NavLink href={`/organizations/${currentOrganization.id}/users`}>
                    Manage Users
                  </NavLink>
                )}
                {canManageOrganization && (
                  <NavLink href={`/organizations/${currentOrganization.id}/edit`}>
                    Organization Settings
                  </NavLink>
                )}
                <NavLink href="/users/edit">Individual Settings</NavLink>
              </NavSection>
            </div>
          )}
        </Navbar.Collapse>
      )}

      {/* Desktop Navigation Menu */}
      {currentUser && !isSystemAdmin && currentOrganization && (
        <div className="hidden md:flex md:order-1 md:ml-8 md:space-x-8">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <span className="flex items-center text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                <HiClipboardList className="mr-1 h-4 w-4" />
                Automated Testing
                <HiChevronDown className="ml-1 h-3 w-3" />
              </span>
            }
          >
            <Dropdown.Item href="/tests">View Test Results</Dropdown.Item>
            <Dropdown.Item href="/tests/import">Upload JUnit XML</Dropdown.Item>
            <Dropdown.Item href="/tests/statistics">Test Statistics</Dropdown.Item>
          </Dropdown>

          <Dropdown
            arrowIcon={false}
            inline
            label={
              <span className="flex items-center text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                <HiPlay className="mr-1 h-4 w-4" />
                Manual Testing
                <HiChevronDown className="ml-1 h-3 w-3" />
              </span>
            }
          >
            <Dropdown.Item href="/manual-tests">Test Cases</Dropdown.Item>
            <Dropdown.Item href="/manual-tests/runs">Test Runs</Dropdown.Item>
            <Dropdown.Item href="/manual-tests/reports">Reports</Dropdown.Item>
          </Dropdown>

          {(canManageOrganization || canManageUsers) && (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <span className="flex items-center text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  <HiCog className="mr-1 h-4 w-4" />
                  Settings
                  <HiChevronDown className="ml-1 h-3 w-3" />
                </span>
              }
            >
              {canManageUsers && (
                <Dropdown.Item href={`/organizations/${currentOrganization.id}/users`}>
                  <HiUsers className="mr-2 h-4 w-4" />
                  Manage Users
                </Dropdown.Item>
              )}
              {canManageOrganization && (
                <Dropdown.Item href={`/organizations/${currentOrganization.id}/edit`}>
                  <HiOfficeBuilding className="mr-2 h-4 w-4" />
                  Organization Settings
                </Dropdown.Item>
              )}
              <Dropdown.Item href="/users/edit">
                <HiUser className="mr-2 h-4 w-4" />
                Individual Settings
              </Dropdown.Item>
            </Dropdown>
          )}
        </div>
      )}

      {/* System Admin Navigation */}
      {isSystemAdmin && (
        <div className="hidden md:flex md:order-1 md:ml-8 md:space-x-8">
          <Navbar.Link href="/organizations">Organizations</Navbar.Link>
          <Navbar.Link href="/admin/users">All Users</Navbar.Link>
          <Navbar.Link href="/admin/system">System Settings</Navbar.Link>
        </div>
      )}
    </Navbar>
  );
};

export default Navigation;