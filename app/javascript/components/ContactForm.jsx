import React, { useState } from "react";
import { Button, Card, Alert } from "flowbite-react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Contact Us</h1>
        
        {submitted && (
          <Alert color="success" className="mb-6">
            <span className="font-medium">Thank you!</span> Your message has been received (demo only).
          </Alert>
        )}

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your message..."
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" color="blue" className="flex-1">
                Send Message
              </Button>
              <Button 
                type="button" 
                color="gray" 
                onClick={() => window.location.href = '/'}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>

        <Card className="mt-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Demo Information</h2>
          <p className="text-gray-600 mb-2">
            This is a demonstration contact form showing React state management and form handling.
          </p>
          <p className="text-gray-600">
            In a real application, this would integrate with Rails controllers to process the form submission.
          </p>
        </Card>
      </div>
    </div>
  );
};

ContactForm.displayName = 'ContactForm';

export default ContactForm;