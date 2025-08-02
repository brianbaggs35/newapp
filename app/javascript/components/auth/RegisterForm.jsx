import React, { useState } from 'react';
import { Card, Label, TextInput, Button, Alert } from 'flowbite-react';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
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
          user: formData
        })
      });

      if (response.ok) {
        setSuccess('Registration successful! Please check your email to confirm your account.');
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create Account
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Join us today! Create your account to get started.
            </p>
          </div>

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

          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Email" />
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
              <Label htmlFor="password" value="Password" />
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
              <Label htmlFor="password_confirmation" value="Confirm Password" />
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

          <Button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>

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

export default RegisterForm;