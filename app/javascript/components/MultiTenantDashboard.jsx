import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Spinner, Alert } from 'flowbite-react';
import { 
  HiOfficeBuilding, 
  HiClipboardList, 
  HiCheckCircle, 
  HiXCircle,
  HiClock,
  HiTrendingUp,
  HiUserGroup,
  HiPlay
} from 'react-icons/hi';

const MultiTenantDashboard = ({ currentUser, currentOrganization }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isSystemAdmin = currentUser?.role === 'system_admin';
  const canManageUsers = currentUser?.role === 'test_owner' || currentUser?.role === 'test_manager';

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/dashboard/stats', {
        headers: {
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError('Failed to load dashboard statistics');
      }
    } catch {
      setError('An error occurred while loading the dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      'system_admin': 'System Administrator',
      'test_owner': 'Test Owner',
      'test_manager': 'Test Manager',
      'test_runner': 'Test Runner'
    };
    return roleNames[role] || role;
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      'system_admin': 'red',
      'test_owner': 'purple',
      'test_manager': 'blue',
      'test_runner': 'green'
    };
    return colors[role] || 'gray';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  // System Admin Dashboard
  if (isSystemAdmin) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            System Administration Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage organizations, users, and system-wide settings
          </p>
        </div>

        {error && (
          <Alert color="failure" className="mb-6">
            {error}
          </Alert>
        )}

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <HiOfficeBuilding className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Organizations
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalOrganizations}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <HiUserGroup className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalUsers}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <HiClipboardList className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Test Suites
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalTestSuites}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <HiTrendingUp className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Active Organizations
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.activeOrganizations}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button href="/organizations" className="w-full justify-start">
                <HiOfficeBuilding className="mr-2 h-4 w-4" />
                Manage Organizations
              </Button>
              <Button href="/admin/users" color="gray" className="w-full justify-start">
                <HiUserGroup className="mr-2 h-4 w-4" />
                Manage All Users
              </Button>
              <Button href="/admin/system" color="gray" className="w-full justify-start">
                <HiClock className="mr-2 h-4 w-4" />
                System Settings
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3 text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                {stats?.recentOrganizations || 0} new organizations this week
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {stats?.systemAdmins || 0} system administrators
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {stats?.totalTestCases || 0} total test cases across all organizations
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Organization Dashboard
  if (!currentOrganization) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert color="warning">
          <div className="text-center">
            <HiOfficeBuilding className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Organization</h3>
            <p className="mb-4">You need to belong to an organization to access the dashboard.</p>
            <Button href="/organizations">
              Join or Create Organization
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {currentOrganization.name} Dashboard
        </h1>
        <div className="flex items-center mt-2 space-x-4">
          <Badge color={getRoleBadgeColor(currentUser.role)}>
            {getRoleDisplayName(currentUser.role)}
          </Badge>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {currentUser.email}
          </p>
        </div>
      </div>

      {error && (
        <Alert color="failure" className="mb-6">
          {error}
        </Alert>
      )}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <HiClipboardList className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Test Suites
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalTestSuites || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <HiPlay className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Test Cases
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalTestCases || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <HiCheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Success Rate
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.successRate || 0}%
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <HiUserGroup className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Team Members
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalUsers || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Button href="/tests" className="w-full justify-start">
              <HiClipboardList className="mr-2 h-4 w-4" />
              View Test Results
            </Button>
            <Button href="/tests/import" color="gray" className="w-full justify-start">
              <HiTrendingUp className="mr-2 h-4 w-4" />
              Upload JUnit XML
            </Button>
            {canManageUsers && (
              <Button 
                href={`/organizations/${currentOrganization.id}/users`} 
                color="gray" 
                className="w-full justify-start"
              >
                <HiUserGroup className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Passed Tests</span>
              <span className="flex items-center text-green-600">
                <HiCheckCircle className="mr-1 h-4 w-4" />
                {stats?.passedTests || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Failed Tests</span>
              <span className="flex items-center text-red-600">
                <HiXCircle className="mr-1 h-4 w-4" />
                {stats?.failedTests || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Tests This Week</span>
              <span className="text-gray-900 dark:text-white">
                {stats?.testsThisWeek || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Tests This Month</span>
              <span className="text-gray-900 dark:text-white">
                {stats?.testsThisMonth || 0}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MultiTenantDashboard;