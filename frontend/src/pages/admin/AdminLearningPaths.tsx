import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { learningPathsService, skillsService } from '../../api';
import type { LearningPath, Skill } from '../../api';
import { useToast } from '../../context/ToastContext';
import SearchBar from '../../components/SearchBar';

const AdminLearningPaths: React.FC = () => {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [filteredPaths, setFilteredPaths] = useState<LearningPath[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [pathToDelete, setPathToDelete] = useState<number | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [pathsData, skillsData] = await Promise.all([
          learningPathsService.getAllLearningPaths(),
          skillsService.getAllSkills()
        ]);
        
        setLearningPaths(pathsData);
        setFilteredPaths(pathsData);
        setSkills(skillsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        addToast('Failed to load learning paths', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [addToast]);

  useEffect(() => {
    const results = learningPaths.filter(path => 
      path.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (path.description && path.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredPaths(results);
  }, [searchTerm, learningPaths]);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  const confirmDelete = (id: number) => {
    setPathToDelete(id);
    setIsDeleting(true);
  };

  const cancelDelete = () => {
    setPathToDelete(null);
    setIsDeleting(false);
  };

  const handleDelete = async () => {
    if (pathToDelete === null) return;
    
    try {
      // In a real app, this would call an API endpoint to delete the learning path
      // await learningPathsService.deleteLearningPath(pathToDelete);
      
      // For now, we'll just remove it from our local state
      setLearningPaths(learningPaths.filter(path => path.id !== pathToDelete));
      setFilteredPaths(filteredPaths.filter(path => path.id !== pathToDelete));
      
      addToast('Learning path deleted successfully', 'success');
    } catch (err) {
      console.error('Error deleting learning path:', err);
      addToast('Failed to delete learning path', 'error');
    } finally {
      setIsDeleting(false);
      setPathToDelete(null);
    }
  };

  // Helper function to get skill name by ID
  const getSkillName = (skillId: number): string => {
    const skill = skills.find(s => s.id === skillId);
    return skill ? skill.name : 'Unknown Skill';
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Learning Paths</h2>
        <Link
          to="/admin/paths/new"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md inline-flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Path
        </Link>
      </div>

      <div className="mb-6">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search learning paths..."
          className="w-full"
        />
      </div>

      {filteredPaths.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md">
          <p>No learning paths found. {searchTerm ? 'Try a different search term.' : 'Create your first learning path!'}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skill
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Videos
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPaths.map((path) => (
                <tr key={path.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{path.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{getSkillName(path.skill_id)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 truncate max-w-xs">{path.description || 'No description'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{(path as any).videos?.length || 0} videos</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      to={`/paths/${path.id}`} 
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View
                    </Link>
                    <Link 
                      to={`/admin/paths/edit/${path.id}`} 
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => confirmDelete(path.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Confirmation</h3>
            <p className="mb-6">Are you sure you want to delete this learning path? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminLearningPaths;
