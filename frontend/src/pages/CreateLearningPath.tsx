import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { skillsService, learningPathsService } from '../api';
import type { Skill, CreateLearningPathDto } from '../api';

const CreateLearningPath: React.FC = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<CreateLearningPathDto>({
    name: '',
    description: '',
    skill_id: 0
  });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await skillsService.getAllSkills();
        setSkills(data);
        // Set default skill if any exists
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, skill_id: data[0].id }));
        }
      } catch (err) {
        setError('Failed to load skills. Please try again later.');
        console.error('Error fetching skills:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'skill_id' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      // Validate form
      if (!formData.name) {
        setError('Learning path name is required');
        setSubmitting(false);
        return;
      }
      
      if (formData.skill_id <= 0) {
        setError('Please select a skill for this learning path');
        setSubmitting(false);
        return;
      }

      // Create learning path
      const createdPath = await learningPathsService.createLearningPath(formData);
      
      // Navigate to the newly created learning path
      navigate(`/paths/${createdPath.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create learning path. Please try again.');
      console.error('Error creating learning path:', err);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create Learning Path</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {/* Learning Path Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              Learning Path Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="e.g., Web Development for Beginners"
              required
            />
          </div>
          
          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Describe what learners will achieve by following this path"
              rows={4}
            />
          </div>
          
          {/* Skill Selection */}
          <div className="mb-6">
            <label htmlFor="skill_id" className="block text-gray-700 text-sm font-bold mb-2">
              Related Skill *
            </label>
            <select
              id="skill_id"
              name="skill_id"
              value={formData.skill_id}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select a skill</option>
              {skills.map(skill => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>
            {skills.length === 0 && (
              <p className="mt-2 text-sm text-yellow-600">
                No skills available. Please create a skill first.
              </p>
            )}
          </div>
          
          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || skills.length === 0}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                (submitting || skills.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Creating...' : 'Create Learning Path'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLearningPath;
