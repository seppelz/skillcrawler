import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { skillsService } from '../../api';
import type { Skill } from '../../api';

// Extended Skill type with optional icon_url for the form
interface SkillFormData extends Partial<Skill> {
  icon_url?: string;
}
import { useToast } from '../../context/ToastContext';

// Sample categories - in a real app, these would be fetched from an API
const sampleCategories = [
  'Programming',
  'Data Science',
  'Design',
  'Marketing',
  'Business',
  'Personal Development'
];

const SkillForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState<SkillFormData>({
    name: '',
    category: '',
    description: '',
    icon_url: ''
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchSkill = async () => {
      if (!isEditMode) return;
      
      try {
        setLoading(true);
        // In a real app, this would fetch skill data from an API
        const skillData = await skillsService.getSkillById(parseInt(id));
        
        if (skillData) {
          setFormData({
            name: skillData.name || '',
            category: skillData.category || '',
            description: skillData.description || '',
            icon_url: (skillData as any).icon_url || ''
          });
        } else {
          addToast('Skill not found', 'error');
          navigate('/admin/skills');
        }
      } catch (err) {
        console.error('Error fetching skill:', err);
        addToast('Failed to load skill data', 'error');
        navigate('/admin/skills');
      } finally {
        setLoading(false);
      }
    };

    fetchSkill();
  }, [id, isEditMode, navigate, addToast]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (!formData.name?.trim()) {
      setError('Skill name is required');
      return;
    }
    
    try {
      setSubmitting(true);
      
      if (isEditMode && id) {
        // Update existing skill
        // await skillsService.updateSkill(parseInt(id), formData);
        // For now, we'll just simulate an API call with a delay
        await new Promise(resolve => setTimeout(resolve, 800));
        addToast('Skill updated successfully', 'success');
      } else {
        // Create new skill
        // await skillsService.createSkill(formData);
        // For now, we'll just simulate an API call with a delay
        await new Promise(resolve => setTimeout(resolve, 800));
        addToast('Skill created successfully', 'success');
      }
      
      // Redirect back to skills list
      navigate('/admin/skills');
    } catch (err) {
      console.error('Error saving skill:', err);
      setError('Failed to save skill. Please try again.');
    } finally {
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
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          {isEditMode ? 'Edit Skill' : 'Add New Skill'}
        </h2>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Skill Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. JavaScript, Python, UI Design"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            {sampleCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a detailed description of this skill..."
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="icon_url" className="block text-sm font-medium text-gray-700 mb-1">
            Icon URL
          </label>
          <input
            id="icon_url"
            name="icon_url"
            type="text"
            value={formData.icon_url || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/icons/skill.svg"
          />
          {formData.icon_url && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-1">Icon Preview:</p>
              <img 
                src={formData.icon_url} 
                alt="Skill Icon Preview" 
                className="h-10 w-10 object-contain border border-gray-200 rounded p-1"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=Error';
                }}
              />
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate('/admin/skills')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
              submitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={submitting}
          >
            {submitting ? 'Saving...' : isEditMode ? 'Update Skill' : 'Create Skill'}
          </button>
        </div>
      </form>
    </>
  );
};

export default SkillForm;
