import React from 'react';

const TestTailwind: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        Tailwind CSS Test Component
      </h1>
      <p className="text-gray-700 mb-4">
        This is a test component to verify Tailwind CSS is working correctly.
      </p>
      <div className="flex space-x-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Button 1
        </button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Button 2
        </button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Button 3
        </button>
      </div>
    </div>
  );
};

export default TestTailwind;
