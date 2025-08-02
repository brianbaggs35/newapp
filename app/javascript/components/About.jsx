import React from "react";
import { Button, Card } from "flowbite-react";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">About This Application</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="h-fit">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Technology Stack</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• <strong>Backend:</strong> Ruby on Rails 8.0</li>
              <li>• <strong>Frontend:</strong> React 19 with TypeScript</li>
              <li>• <strong>Styling:</strong> Tailwind CSS + Flowbite React</li>
              <li>• <strong>Build:</strong> ESBuild for JavaScript bundling</li>
              <li>• <strong>Database:</strong> PostgreSQL</li>
              <li>• <strong>Authentication:</strong> Devise</li>
              <li>• <strong>Testing:</strong> Jest + RSpec</li>
            </ul>
          </Card>

          <Card className="h-fit">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Features</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• React integration with Rails</li>
              <li>• Component-based architecture</li>
              <li>• User authentication and authorization</li>
              <li>• Test suite management</li>
              <li>• Responsive design</li>
              <li>• Hot reloading in development</li>
              <li>• Modern JavaScript/TypeScript support</li>
            </ul>
          </Card>
        </div>

        <Card className="mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">React Integration</h2>
          <p className="text-gray-600 mb-4">
            This application demonstrates how to properly integrate React with Ruby on Rails:
          </p>
          <ul className="space-y-2 text-gray-600 mb-4">
            <li>• React components are built using ESBuild and served as Rails assets</li>
            <li>• The main React app is mounted to a div in the Rails view</li>
            <li>• Rails handles routing and authentication</li>
            <li>• React provides the interactive UI components</li>
            <li>• Both Rails and React tests run independently</li>
          </ul>
          <div className="flex gap-4">
            <Button color="blue" onClick={() => window.location.href = '/'}>
              Back to Home
            </Button>
            <Button color="gray" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

About.displayName = 'About';

export default About;