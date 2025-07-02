import React from 'react';
import { Link } from 'react-router-dom';
import type { LearningPath } from '../api';

interface LearningPathCardProps {
  learningPath: LearningPath;
}

const LearningPathCard: React.FC<LearningPathCardProps> = ({ learningPath }) => {
  // Format date for display
  const formattedDate = new Date(learningPath.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{learningPath.name}</h3>
        
        {learningPath.description && (
          <p className="text-gray-600 mb-4">{learningPath.description}</p>
        )}
        
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>Created: {formattedDate}</span>
        </div>
        
        <Link 
          to={`/paths/${learningPath.id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md inline-flex items-center transition-colors"
        >
          <span>Start Learning</span>
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default LearningPathCard;
