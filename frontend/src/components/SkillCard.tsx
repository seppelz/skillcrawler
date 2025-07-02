import React from 'react';
import { Link } from 'react-router-dom';
import type { Skill } from '../api';

interface SkillCardProps {
  skill: Skill;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{skill.name}</h3>
        
        {skill.category && (
          <div className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-3">
            {skill.category}
          </div>
        )}
        
        {skill.description && (
          <p className="text-gray-600 mb-4">{skill.description}</p>
        )}
        
        <Link 
          to={`/skills/${skill.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          <span>View Learning Paths</span>
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default SkillCard;
