import React, { useState } from 'react';
import { Sidebar } from 'flowbite-react';
import { 
  HiChartPie, 
  HiClipboard, 
  HiDocument,
  HiCog,
  HiUsers,
  HiUser,
  HiUpload,
  HiViewGrid,
  HiExclamation,
  HiDocumentReport,
  HiPlusCircle,
  HiPlay
} from 'react-icons/hi';

interface QANavigationProps {
  currentUser: {
    role: 'system_admin' | 'owner' | 'admin' | 'member';
    canSeeOrganizationManagement: boolean;
  };
  currentPath: string;
}

export default function QANavigation({ currentUser, currentPath }: QANavigationProps) {
  const [isAutomatedOpen, setIsAutomatedOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const isActive = (path: string) => currentPath.startsWith(path);

  return (
    <div className="h-full">
      <Sidebar className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            {/* Dashboard */}
            <Sidebar.Item 
              href="/dashboard" 
              icon={HiChartPie}
              className={isActive('/dashboard') ? 'bg-gray-100' : ''}
            >
              Dashboard
            </Sidebar.Item>
            
            {/* Automated Testing Section */}
            <Sidebar.Collapse
              icon={HiUpload}
              label="Automated Testing"
              open={isAutomatedOpen}
            >
              <Sidebar.Item 
                href="/automated_testing/uploads"
                className={isActive('/automated_testing/uploads') ? 'bg-gray-100' : ''}
              >
                Upload
              </Sidebar.Item>
              <Sidebar.Item 
                href="/automated_testing/test_results"
                className={isActive('/automated_testing/test_results') ? 'bg-gray-100' : ''}
              >
                Test Results
              </Sidebar.Item>
              <Sidebar.Item 
                href="/automated_testing/failure_analysis"
                className={isActive('/automated_testing/failure_analysis') ? 'bg-gray-100' : ''}
              >
                Failure Analysis
              </Sidebar.Item>
              <Sidebar.Item 
                href="/automated_testing/reports"
                className={isActive('/automated_testing/reports') ? 'bg-gray-100' : ''}
              >
                Reports
              </Sidebar.Item>
            </Sidebar.Collapse>

            {/* Manual Testing Section */}
            <Sidebar.Collapse
              icon={HiClipboard}
              label="Manual Testing"
              open={isManualOpen}
            >
              <Sidebar.Item 
                href="/manual_testing/test_cases"
                className={isActive('/manual_testing/test_cases') ? 'bg-gray-100' : ''}
              >
                Test Cases
              </Sidebar.Item>
              <Sidebar.Item 
                href="/manual_testing/test_runs"
                className={isActive('/manual_testing/test_runs') ? 'bg-gray-100' : ''}
              >
                Test Runs
              </Sidebar.Item>
              <Sidebar.Item 
                href="/manual_testing/reports"
                className={isActive('/manual_testing/reports') ? 'bg-gray-100' : ''}
              >
                Reports
              </Sidebar.Item>
            </Sidebar.Collapse>

            {/* Settings Section */}
            <Sidebar.Collapse
              icon={HiCog}
              label="Settings"
              open={isSettingsOpen}
            >
              {currentUser.canSeeOrganizationManagement && (
                <Sidebar.Item 
                  href="/settings/organization"
                  className={isActive('/settings/organization') ? 'bg-gray-100' : ''}
                >
                  Organization Management
                </Sidebar.Item>
              )}
              <Sidebar.Item 
                href="/settings/profile"
                className={isActive('/settings/profile') ? 'bg-gray-100' : ''}
              >
                User Settings
              </Sidebar.Item>
            </Sidebar.Collapse>

            {/* System Admin Dashboard */}
            {currentUser.role === 'system_admin' && (
              <Sidebar.Item 
                href="/admin/dashboard"
                icon={HiViewGrid}
                className={isActive('/admin/dashboard') ? 'bg-gray-100' : ''}
              >
                System Admin
              </Sidebar.Item>
            )}
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}