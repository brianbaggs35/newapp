import React, { useState } from 'react';
import { Card, Label, TextInput, Textarea, Button, Alert, Checkbox } from 'flowbite-react';
import { HiOfficeBuilding } from 'react-icons/hi';

const OrganizationForm = ({ organization = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: organization?.name || '',
    description: organization?.description || '',
    active: organization?.active !== undefined ? organization.active : true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!organization;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = isEditing ? `/organizations/${organization.id}` : '/organizations';
      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
        },
        body: JSON.stringify({
          organization: formData
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (onSuccess) {
          onSuccess(data);
        } else {
          window.location.href = `/organizations/${data.id}`;
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || `Failed to ${isEditing ? 'update' : 'create'} organization`);
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <HiOfficeBuilding className="mx-auto h-12 w-12 text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {isEditing ? 'Edit Organization' : 'Create Organization'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isEditing 
              ? 'Update your organization details below'
              : 'Set up your organization to start managing tests and team members'
            }
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert color="failure">
                {error}
              </Alert>
            )}

            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Organization Name *" />
              </div>
              <TextInput
                id="name"
                name="name"
                type="text"
                placeholder="Enter organization name"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="description" value="Description" />
              </div>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your organization (optional)"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="active"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                disabled={loading}
              />
              <Label htmlFor="active">
                Active organization (users can access and perform tests)
              </Label>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              {onCancel && (
                <Button
                  type="button"
                  color="gray"
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading 
                  ? (isEditing ? 'Updating...' : 'Creating...') 
                  : (isEditing ? 'Update Organization' : 'Create Organization')
                }
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationForm;