import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Spinner } from 'flowbite-react';
import { HiPlus, HiOfficeBuilding } from 'react-icons/hi';

const OrganizationSelector = ({ currentUser }) => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('/organizations.json', {
        headers: {
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrganizations(data);
      } else {
        setError('Failed to load organizations');
      }
    } catch {
      setError('An error occurred while loading organizations');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrganization = (organizationId) => {
    window.location.href = `/organizations/${organizationId}`;
  };

  const handleCreateOrganization = () => {
    window.location.href = '/organizations/new';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to QA Platform
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {currentUser?.role === 'system_admin' 
              ? 'Select an organization to manage or create a new one'
              : 'Join an organization or create your own to get started'
            }
          </p>
        </div>

        {error && (
          <Alert color="failure" className="mb-6">
            {error}
          </Alert>
        )}

        {currentUser?.role !== 'system_admin' && (
          <div className="mb-8 text-center">
            <Button
              onClick={handleCreateOrganization}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <HiPlus className="mr-2 h-5 w-5" />
              Create New Organization
            </Button>
          </div>
        )}

        {organizations.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {currentUser?.role === 'system_admin' ? 'All Organizations' : 'Available Organizations'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.map((org) => (
                <Card key={org.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <HiOfficeBuilding className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                        {org.name}
                      </h3>
                      {org.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {org.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-500">
                          {org.user_count} users • {org.test_suite_count} test suites
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleSelectOrganization(org.id)}
                        >
                          {currentUser?.role === 'system_admin' ? 'Manage' : 'Enter'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {organizations.length === 0 && !loading && (
          <div className="text-center py-12">
            <HiOfficeBuilding className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No organizations found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first organization.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationSelector;