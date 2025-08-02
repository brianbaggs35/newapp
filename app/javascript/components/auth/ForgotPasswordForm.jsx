import React, { useState } from 'react';
import { Card, Label, TextInput, Button, Alert } from 'flowbite-react';
import { HiMail } from 'react-icons/hi';

const ForgotPasswordForm = () => {
  const [formData, setFormData] = useState({
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

    try {
      const response = await fetch('/users/password', {
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
        setSuccess('Password reset instructions have been sent to your email.');
        setFormData({ email: '' });
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to send reset instructions. Please try again.');
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
              Forgot Password?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Enter your email address and we&apos;ll send you a link to reset your password.
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

          <Button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Instructions'}
          </Button>

          <div className="text-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Remember your password?{' '}
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

export default ForgotPasswordForm;