import React, { useState } from "react";
import { Card, Button, Badge } from "flowbite-react";
import { FaCode, FaDesktop, FaMobile, FaCloud } from "react-icons/fa";

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      id: 1,
      title: "Web Development",
      icon: <FaCode className="text-3xl text-blue-600" />,
      description: "Custom web applications built with modern technologies like React and Rails.",
      features: ["React Components", "Rails Backend", "Responsive Design", "API Integration"],
      price: "$5,000 - $20,000"
    },
    {
      id: 2,
      title: "Desktop Applications",
      icon: <FaDesktop className="text-3xl text-green-600" />,
      description: "Native desktop applications for Windows, macOS, and Linux platforms.",
      features: ["Cross-platform", "Native Performance", "Modern UI", "Database Integration"],
      price: "$8,000 - $25,000"
    },
    {
      id: 3,
      title: "Mobile Development",
      icon: <FaMobile className="text-3xl text-purple-600" />,
      description: "iOS and Android applications with native performance and user experience.",
      features: ["React Native", "iOS & Android", "Push Notifications", "App Store Deployment"],
      price: "$10,000 - $30,000"
    },
    {
      id: 4,
      title: "Cloud Solutions",
      icon: <FaCloud className="text-3xl text-orange-600" />,
      description: "Scalable cloud infrastructure and deployment solutions.",
      features: ["AWS/GCP/Azure", "Auto-scaling", "Load Balancing", "Monitoring"],
      price: "$3,000 - $15,000"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Our Services</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We provide comprehensive development services to help your business grow and succeed in the digital world.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {services.map((service) => (
          <Card 
            key={service.id} 
            className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
              selectedService?.id === service.id ? 'ring-2 ring-blue-500 shadow-xl' : ''
            }`}
            onClick={() => setSelectedService(service)}
          >
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {service.description}
              </p>
              <Badge color="info" className="mb-2">
                {service.price}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {selectedService && (
        <Card className="mb-8 border-l-4 border-blue-500">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {selectedService.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3 text-gray-800">
                {selectedService.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {selectedService.description}
              </p>
              
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Features:</h3>
              <ul className="grid grid-cols-2 gap-2 mb-4">
                {selectedService.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-500">Starting from</span>
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedService.price}
                  </div>
                </div>
                <Button color="blue">
                  Get Quote
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Ready to Start Your Project?</h2>
        <p className="text-gray-600 mb-6">
          Contact us today to discuss your requirements and get a personalized quote.
        </p>
        <div className="flex gap-4 justify-center">
          <Button 
            color="blue" 
            onClick={() => window.location.hash = 'contact'}
          >
            Contact Us
          </Button>
          <Button 
            color="gray" 
            onClick={() => window.location.hash = 'about'}
          >
            Learn More
          </Button>
        </div>
      </Card>
    </div>
  );
};

Services.displayName = 'Services';

export default Services;