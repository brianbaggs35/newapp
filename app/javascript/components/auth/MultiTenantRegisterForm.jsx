import React, { useState, useEffect } from 'react';
import { Card, Label, TextInput, Button, Alert, Select, Textarea, Radio } from 'flowbite-react';
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiOfficeBuilding, HiArrowLeft, HiArrowRight } from 'react-icons/hi';

const MultiTenantRegisterForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirmation: '',
    registration_type: 'join_existing', // 'join_existing' or 'create_new'
    organization_id: '',
    organization_name: '',
    organization_description: '',
    role: 'test_runner' // Default role for joining existing org
  });
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingOrgs, setLoadingOrgs] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  useEffect(() => {
    if (step === 2) {
      fetchOrganizations();
    }
  }, [step]);

  const fetchOrganizations = async () => {
    setLoadingOrgs(true);
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
      setLoadingOrgs(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegistrationTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      registration_type: type,
      role: type === 'create_new' ? 'test_owner' : 'test_runner'
    }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      // Validate step 1
      if (!formData.email || !formData.password || !formData.password_confirmation) {
        setError('Please fill in all required fields');
        return;
      }
      if (formData.password !== formData.password_confirmation) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }

    setError('');
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate final step
    if (formData.registration_type === 'join_existing' && !formData.organization_id) {
      setError('Please select an organization to join');
      setLoading(false);
      return;
    }

    if (formData.registration_type === 'create_new' && !formData.organization_name) {
      setError('Please provide an organization name');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
        },
        body: JSON.stringify({
          user: {
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.password_confirmation,
            role: formData.role
          },
          registration_type: formData.registration_type,
          organization_id: formData.organization_id,
          organization: {
            name: formData.organization_name,
            description: formData.organization_description
          }
        })
      });

      if (response.ok) {
        setSuccess('Registration successful! Please check your email to confirm your account.');
        // Reset form
        setFormData({
          email: '',
          password: '',
          password_confirmation: '',
          registration_type: 'join_existing',
          organization_id: '',
          organization_name: '',
          organization_description: '',
          role: 'test_runner'
        });
        setStep(1);
      } else {
        const data = await response.json();
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create Account
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Step 1 of 3: Account Information
        </p>
      </div>

      <div>
        <div className="mb-2 block">
          <Label htmlFor="email" value="Email Address *" />
        </div>
        <TextInput
          id="email"
          name="email"
          type="email"
          icon={HiMail}
          placeholder="name@company.com"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <div className="mb-2 block">
          <Label htmlFor="password" value="Password *" />
        </div>
        <div className="relative">
          <TextInput
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            icon={HiLockClosed}
            placeholder="••••••••"
            required
            value={formData.password}
            onChange={handleChange}
            minLength="6"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <HiEyeOff className="h-5 w-5 text-gray-400" /> : <HiEye className="h-5 w-5 text-gray-400" />}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
      </div>

      <div>
        <div className="mb-2 block">
          <Label htmlFor="password_confirmation" value="Confirm Password *" />
        </div>
        <div className="relative">
          <TextInput
            id="password_confirmation"
            name="password_confirmation"
            type={showPasswordConfirmation ? 'text' : 'password'}
            icon={HiLockClosed}
            placeholder="••••••••"
            required
            value={formData.password_confirmation}
            onChange={handleChange}
            minLength="6"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
          >
            {showPasswordConfirmation ? <HiEyeOff className="h-5 w-5 text-gray-400" /> : <HiEye className="h-5 w-5 text-gray-400" />}
          </button>
        </div>
      </div>

      <Button type="button" onClick={handleNextStep} className="w-full">
        Next Step
        <HiArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Organization Setup
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Step 2 of 3: Choose your organization
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Radio
            id="join_existing"
            name="registration_type"
            value="join_existing"
            checked={formData.registration_type === 'join_existing'}
            onChange={() => handleRegistrationTypeChange('join_existing')}
          />
          <Label htmlFor="join_existing">
            Join an existing organization
          </Label>
        </div>

        {formData.registration_type === 'join_existing' && (
          <div className="ml-6">
            {loadingOrgs ? (
              <p className="text-gray-500">Loading organizations...</p>
            ) : (
              <Select
                name="organization_id"
                value={formData.organization_id}
                onChange={handleChange}
                required={formData.registration_type === 'join_existing'}
              >
                <option value="">Select an organization</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} ({org.user_count} members)
                  </option>
                ))}
              </Select>
            )}
          </div>
        )}

        <div className="flex items-center space-x-3">
          <Radio
            id="create_new"
            name="registration_type"
            value="create_new"
            checked={formData.registration_type === 'create_new'}
            onChange={() => handleRegistrationTypeChange('create_new')}
          />
          <Label htmlFor="create_new">
            Create a new organization
          </Label>
        </div>

        {formData.registration_type === 'create_new' && (
          <div className="ml-6 space-y-4">
            <div>
              <Label htmlFor="organization_name" value="Organization Name *" />
              <TextInput
                id="organization_name"
                name="organization_name"
                type="text"
                icon={HiOfficeBuilding}
                placeholder="Your Company Name"
                required={formData.registration_type === 'create_new'}
                value={formData.organization_name}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="organization_description" value="Description (Optional)" />
              <Textarea
                id="organization_description"
                name="organization_description"
                placeholder="Brief description of your organization"
                rows={3}
                value={formData.organization_description}
                onChange={handleChange}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-3">
        <Button type="button" color="gray" onClick={handlePrevStep} className="flex-1">
          <HiArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button type="button" onClick={handleNextStep} className="flex-1">
          Next Step
          <HiArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Review & Confirm
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Step 3 of 3: Confirm your registration details
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
          <span className="ml-2 text-gray-900 dark:text-white">{formData.email}</span>
        </div>
        
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">Organization:</span>
          <span className="ml-2 text-gray-900 dark:text-white">
            {formData.registration_type === 'join_existing' 
              ? organizations.find(org => org.id === parseInt(formData.organization_id))?.name || 'Selected organization'
              : formData.organization_name
            }
          </span>
        </div>

        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">Role:</span>
          <span className="ml-2 text-gray-900 dark:text-white">
            {formData.role === 'test_owner' ? 'Organization Owner' : 'Team Member'}
          </span>
        </div>

        {formData.registration_type === 'create_new' && (
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Action:</span>
            <span className="ml-2 text-gray-900 dark:text-white">Create new organization</span>
          </div>
        )}
      </div>

      <div className="flex space-x-3">
        <Button type="button" color="gray" onClick={handlePrevStep} className="flex-1">
          <HiArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <Card className="w-full max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <Alert color="failure">
              {error}
            </Alert>
          )}

          {success && (
            <Alert color="success">
              {success}
            </Alert>
          )}

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          <div className="text-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <a
                href="/users/sign_in"
                className="text-blue-600 hover:underline dark:text-blue-500"
              >
                Sign in
              </a>
            </span>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default MultiTenantRegisterForm;