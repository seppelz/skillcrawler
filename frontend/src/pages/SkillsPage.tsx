import React, { useEffect, useState, useMemo } from 'react';
import { skillsService } from '../api';
import type { Skill } from '../api';
import SkillCard from '../components/SkillCard';
import SearchBar from '../components/SearchBar';

const SkillsPage: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Extract unique categories from skills
  // Always call hooks, even if they return empty arrays when loading
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    skills.forEach(skill => {
      if (skill.category) {
        uniqueCategories.add(skill.category);
      }
    });
    return ['all', ...Array.from(uniqueCategories)];
  }, [skills]);
  
  // Filter skills based on search term and selected category
  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      const matchesSearch = searchTerm === '' ||
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (skill.description && skill.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || 
        skill.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [skills, searchTerm, selectedCategory]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await skillsService.getAllSkills();
        setSkills(data);
      } catch (err) {
        setError('Failed to load skills. Please try again later.');
        console.error('Error fetching skills:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
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
  
  // Handle category filter change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Skills to Master</h1>
      
      {/* Search and filter bar */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search skills..."
              className="w-full"
            />
          </div>
          
          <div className="w-full md:w-64">
            <select
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {filteredSkills.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md">
          {skills.length === 0 ? (
            <p>No skills available yet. Be the first to add one!</p>
          ) : (
            <p>No skills match your search criteria. Try a different search or filter.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map(skill => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillsPage;
