import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { learningPathsService, skillsService } from '../api';
import type { LearningPath, Skill } from '../api';
import LearningPathCard from '../components/LearningPathCard';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../context/AuthContext';

const LearningPathsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkillId, setSelectedSkillId] = useState<number | 'all'>('all');

  // Filter learning paths based on search and selected skill
  // Always call this hook, even if the data is loading or there's an error
  const filteredLearningPaths = useMemo(() => {
    return learningPaths.filter(path => {
      const matchesSearch = searchTerm === '' ||
        path.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (path.description && path.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSkill = selectedSkillId === 'all' || path.skill_id === selectedSkillId;
      
      return matchesSearch && matchesSkill;
    });
  }, [learningPaths, searchTerm, selectedSkillId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch learning paths and skills in parallel
        const [pathsData, skillsData] = await Promise.all([
          learningPathsService.getAllLearningPaths(),
          skillsService.getAllSkills()
        ]);
        
        setLearningPaths(pathsData);
        setSkills(skillsData);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      </div>
    );
  }
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };
  
  // Handle skill filter change
  const handleSkillFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedSkillId(value === 'all' ? 'all' : parseInt(value));
  };



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Learning Paths</h1>
        
        {isAuthenticated && (
          <Link 
            to="/paths/create" 
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md inline-flex items-center transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Create New Path
          </Link>
        )}
      </div>
      
      {/* Search and filter bar */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search learning paths..."
              className="w-full"
            />
          </div>
          
          {skills.length > 0 && (
            <div className="w-full md:w-64">
              <select
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={selectedSkillId.toString()}
                onChange={handleSkillFilterChange}
              >
                <option value="all">All Skills</option>
                {skills.map(skill => (
                  <option key={skill.id} value={skill.id.toString()}>
                    {skill.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      
      {filteredLearningPaths.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md">
          {learningPaths.length === 0 ? (
            <p>No learning paths available yet. {isAuthenticated ? 'Be the first to create one!' : 'Sign in to create one!'}</p>
          ) : (
            <p>No learning paths match your search criteria. Try a different search or filter.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLearningPaths.map(path => (
            <LearningPathCard key={path.id} learningPath={path} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningPathsPage;
