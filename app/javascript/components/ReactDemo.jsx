import React, { useState } from 'react';
import { Button } from 'flowbite-react';

export default function ReactDemo() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('React is working!');

  const handleIncrement = () => {
    setCount(prev => prev + 1);
    setMessage(`Button clicked ${count + 1} time${count + 1 !== 1 ? 's' : ''}!`);
  };

  const handleReset = () => {
    setCount(0);
    setMessage('React is working!');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        React Integration Demo
      </h2>
      
      <div className="space-y-4">
        <div className="text-lg text-gray-700">
          {message}
        </div>
        
        <div className="text-3xl font-bold text-blue-600">
          Count: {count}
        </div>
        
        <div className="flex gap-3">
          <Button 
            color="blue" 
            onClick={handleIncrement}
          >
            Increment Counter
          </Button>
          
          <Button 
            color="gray" 
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
        
        <div className="text-sm text-gray-500 mt-4">
          This component demonstrates React state management within Rails.
        </div>
      </div>
    </div>
  );
}