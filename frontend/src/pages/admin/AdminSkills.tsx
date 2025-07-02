import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { skillsService } from '../../api';
import type { Skill } from '../../api';
import { useToast } from '../../context/ToastContext';
import SearchBar from '../../components/SearchBar';

const AdminSkills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<number | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const data = await skillsService.getAllSkills();
        setSkills(data);
        setFilteredSkills(data);
      } catch (err) {
        console.error('Error fetching skills:', err);
        addToast('Failed to load skills', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [addToast]);

  useEffect(() => {
    const results = skills.filter(skill => 
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (skill.description && skill.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (skill.category && skill.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredSkills(results);
  }, [searchTerm, skills]);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  const confirmDelete = (id: number) => {
    setSkillToDelete(id);
    setIsDeleting(true);
  };

  const cancelDelete = () => {
    setSkillToDelete(null);
    setIsDeleting(false);
  };

  const handleDelete = async () => {
    if (skillToDelete === null) return;
    
    try {
      // In a real app, this would call an API endpoint to delete the skill
      // await skillsService.deleteSkill(skillToDelete);
      
      // For now, we'll just remove it from our local state
      setSkills(skills.filter(skill => skill.id !== skillToDelete));
      setFilteredSkills(filteredSkills.filter(skill => skill.id !== skillToDelete));
      
      addToast('Skill deleted successfully', 'success');
    } catch (err) {
      console.error('Error deleting skill:', err);
      addToast('Failed to delete skill', 'error');
    } finally {
      setIsDeleting(false);
      setSkillToDelete(null);
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Skills</h2>
        <Link
          to="/admin/skills/new"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md inline-flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Skill
        </Link>
      </div>

      <div className="mb-6">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search skills..."
          className="w-full"
        />
      </div>

      {filteredSkills.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md">
          <p>No skills found. {searchTerm ? 'Try a different search term.' : 'Create your first skill!'}</p>
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
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSkills.map((skill) => (
                <tr key={skill.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{skill.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{skill.category || 'Uncategorized'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 truncate max-w-xs">{skill.description || 'No description'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      to={`/admin/skills/edit/${skill.id}`} 
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => confirmDelete(skill.id)}
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
            <p className="mb-6">Are you sure you want to delete this skill? This action cannot be undone.</p>
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

export default AdminSkills;
