import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { skillsService, learningPathsService } from '../api';
import type { Skill, LearningPath } from '../api';
import LearningPathCard from '../components/LearningPathCard';

const SkillDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkillData = async () => {
      if (!id) return;

      try {
        // Get all skills and find the current one by ID
        const skills = await skillsService.getAllSkills();
        const currentSkill = skills.find(s => s.id === parseInt(id));
        
        if (!currentSkill) {
          setError('Skill not found');
          setLoading(false);
          return;
        }
        
        setSkill(currentSkill);
        
        // Get all learning paths
        const paths = await learningPathsService.getAllLearningPaths();
        
        // Filter paths for this skill
        const skillPaths = paths.filter(path => path.skill_id === currentSkill.id);
        setLearningPaths(skillPaths);
      } catch (err) {
        setError('Failed to load skill data. Please try again later.');
        console.error('Error fetching skill data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkillData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !skill) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Skill not found'}
        </div>
        <Link to="/skills" className="text-blue-600 hover:underline">
          &larr; Back to Skills
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with navigation */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/skills" className="text-blue-600 hover:underline">
          &larr; Back to Skills
        </Link>
      </div>
      
      {/* Skill header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{skill.name}</h1>
            
            {skill.category && (
              <div className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-3">
                {skill.category}
              </div>
            )}
            
            {skill.description && (
              <p className="text-gray-600 mt-2">{skill.description}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Learning Paths Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Learning Paths for {skill.name}</h2>
        
        {learningPaths.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md">
            <p>No learning paths are available for this skill yet.</p>
            <div className="mt-4">
              <Link 
                to="/paths"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md inline-flex items-center transition-colors"
              >
                Browse All Learning Paths
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPaths.map(path => (
              <LearningPathCard key={path.id} learningPath={path} />
            ))}
          </div>
        )}
      </div>
      
      {/* Call to Action */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6 border border-blue-100">
        <h3 className="text-lg font-semibold mb-2">Create Your Own Learning Path</h3>
        <p className="text-gray-600 mb-4">
          Have your own way of learning {skill.name}? Create a learning path to share with others!
        </p>
        <Link
          to="/paths/create"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md inline-flex items-center transition-colors"
        >
          Create Learning Path
        </Link>
      </div>
    </div>
  );
};

export default SkillDetail;
