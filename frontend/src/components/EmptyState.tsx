import React from 'react';
import { BrainCircuit } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-12 text-center">
      <div className="bg-primary-100 p-4 rounded-full text-primary-700 mb-6">
        <BrainCircuit size={40} />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Welcome to EduCrawlGen
      </h2>
      <p className="text-gray-600 max-w-md mb-6">
        Ask me any computer science related questions and I'll provide intelligent, well-researched answers to help you learn.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
        {[
          {
            title: "Learn CS Concepts",
            description: "Ask about data structures, algorithms, networking, and more"
          },
          {
            title: "Get Code Examples",
            description: "Request sample code in various programming languages"
          },
          {
            title: "Debug Issues",
            description: "Share errors and get help solving programming problems"
          },
          {
            title: "Understand Theory",
            description: "Explore foundational computer science principles"
          }
        ].map((item, index) => (
          <div 
            key={index} 
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;