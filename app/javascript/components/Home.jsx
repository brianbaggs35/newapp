import React from "react";
import { Button } from "flowbite-react";
import TestDashboard from "./tests/TestDashboard";
import ReactDemo from "./ReactDemo";
import Navigation from "./Navigation";

export default () => {
  const currentUser = window.currentUser || null;

  const handleLogout = async () => {
    try {
      const response = await fetch('/users/sign_out', {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
        }
      });

      if (response.ok) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-gray-50 flex flex-col">
      <Navigation currentUser={currentUser} onLogout={handleLogout} />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-5xl font-bold mb-4 text-gray-800">Test App</h1>
          <p className="text-xl mb-4 text-gray-600">
            Test application for using React on Rails with automated testing capabilities and secure authentication.
          </p>
          <hr className="my-4 border-t border-gray-300" />
          <div className="flex flex-wrap gap-4">
            <a
              href="/newlink"
              className="btn btn-lg bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition inline-block"
              role="button"
            >
              Link Test (Rails Route)
            </a>
            <Button className="bg-gray-600 hover:bg-gray-700" color="light">
              Flowbite Button
            </Button>
            {currentUser && (
              <Button className="bg-green-600 hover:bg-green-700" color="light" href="/dashboard">
                Dashboard
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <ReactDemo />
          <TestDashboard />
        </div>
      </div>
    </div>
  );
};