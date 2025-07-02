import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { learningPathsService, skillsService } from '../../api';
import type { LearningPath, Skill } from '../../api';
import { useToast } from '../../context/ToastContext';

interface VideoInput {
  id?: number;
  title: string;
  url: string;
  duration?: number;
  description?: string;
  isNew?: boolean;
}

const LearningPathForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState<Partial<LearningPath>>({
    name: '',
    description: '',
    skill_id: 0,
  });
  
  const [videos, setVideos] = useState<VideoInput[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all skills for the dropdown
        const skillsData = await skillsService.getAllSkills();
        setSkills(skillsData);
        
        // If in edit mode, fetch the learning path data
        if (isEditMode) {
          // In a real application, we would have a getLearningPathById method
          // For now, let's simulate getting a specific path
          const paths = await learningPathsService.getAllLearningPaths();
          const path = paths.find(p => p.id === parseInt(id!));
          
          if (path) {
            setFormData({
              name: path.name,
              description: path.description,
              skill_id: path.skill_id
            });
            
            // Set videos from the path
            if ((path as any).videos && Array.isArray((path as any).videos)) {
              setVideos((path as any).videos.map((video: any) => ({
                id: video.id,
                title: video.title,
                url: video.url,
                duration: video.duration,
                description: video.description
              })));
            }
          } else {
            addToast('Learning path not found', 'error');
            navigate('/admin/paths');
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        addToast('Failed to load necessary data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode, navigate, addToast]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'skill_id' ? parseInt(value) : value
    }));
  };
  
  const handleVideoChange = (index: number, field: keyof VideoInput, value: string | number) => {
    const updatedVideos = [...videos];
    updatedVideos[index] = { ...updatedVideos[index], [field]: value };
    setVideos(updatedVideos);
  };
  
  const addVideo = () => {
    setVideos([...videos, { title: '', url: '', description: '', isNew: true }]);
  };
  
  const removeVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (!formData.name?.trim()) {
      setError('Learning path name is required');
      return;
    }
    
    if (!formData.skill_id) {
      setError('Please select a skill for this learning path');
      return;
    }
    
    // Validate videos
    if (videos.length === 0) {
      setError('At least one video is required');
      return;
    }
    
    for (const video of videos) {
      if (!video.title.trim() || !video.url.trim()) {
        setError('All videos must have both title and URL');
        return;
      }
    }
    
    try {
      setSubmitting(true);
      
      // Prepare data for API (we're using this for form validation but not sending it now)
      const videoData = videos.map(v => ({
        id: v.id,
        title: v.title,
        url: v.url,
        duration: v.duration || 0,
        description: v.description || ''
      }));
      
      if (isEditMode && id) {
        // Update existing path
        // In a real app, we would call an update API
        // await learningPathsService.updateLearningPath(parseInt(id), { ...formData, videos: videoData });
        // For now, we'll just simulate an API call with a delay
        await new Promise(resolve => setTimeout(resolve, 800));
        addToast('Learning path updated successfully', 'success');
      } else {
        // Create new path
        // await learningPathsService.createLearningPath({ ...formData, videos: videoData });
        // For now, we'll just simulate an API call with a delay
        await new Promise(resolve => setTimeout(resolve, 800));
        addToast('Learning path created successfully', 'success');
      }
      
      // Redirect back to paths list
      navigate('/admin/paths');
    } catch (err) {
      console.error('Error saving learning path:', err);
      setError('Failed to save learning path. Please try again.');
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
          {isEditMode ? 'Edit Learning Path' : 'Add New Learning Path'}
        </h2>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-medium text-lg mb-4">Basic Information</h3>
          
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Path Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Introduction to JavaScript, Python Mastery"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="skill_id" className="block text-sm font-medium text-gray-700 mb-1">
              Related Skill *
            </label>
            <select
              id="skill_id"
              name="skill_id"
              value={formData.skill_id || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a skill</option>
              {skills.map(skill => (
                <option key={skill.id} value={skill.id}>{skill.name}</option>
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
              placeholder="Enter a detailed description of this learning path..."
            />
          </div>
        </div>
        
        {/* Videos Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-lg">Video Content</h3>
            <button
              type="button"
              onClick={addVideo}
              className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Video
            </button>
          </div>
          
          {videos.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-md">
              <p className="text-gray-500">No videos added yet. Click "Add Video" to get started.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {videos.map((video, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4 relative">
                  <button
                    type="button"
                    onClick={() => removeVideo(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    aria-label="Remove video"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={video.title}
                        onChange={(e) => handleVideoChange(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Video title"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL *
                      </label>
                      <input
                        type="text"
                        value={video.url}
                        onChange={(e) => handleVideoChange(index, 'url', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://youtube.com/watch?v=..."
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={video.description || ''}
                      onChange={(e) => handleVideoChange(index, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Brief description of the video content"
                    />
                  </div>
                  
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={video.duration || ''}
                      onChange={(e) => handleVideoChange(index, 'duration', parseInt(e.target.value) || 0)}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. 15"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate('/admin/paths')}
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
            {submitting ? 'Saving...' : isEditMode ? 'Update Learning Path' : 'Create Learning Path'}
          </button>
        </div>
      </form>
    </>
  );
};

export default LearningPathForm;
