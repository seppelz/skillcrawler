import React, { useState, useEffect } from 'react';
import { skillsService, learningPathsService } from '../../api';
import { useToast } from '../../context/ToastContext';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalSkills: 0,
    totalLearningPaths: 0,
    totalUsers: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch stats from multiple endpoints in parallel
        const [skills, paths] = await Promise.all([
          skillsService.getAllSkills(),
          learningPathsService.getAllLearningPaths()
        ]);
        
        // In a real application, we would have an admin API to get these statistics
        // For now, we'll just use the data we have
        setStats({
          totalSkills: skills.length,
          totalLearningPaths: paths.length,
          totalUsers: 0, // This would come from an admin API
          recentActivity: [] // This would come from an admin API
        });
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        addToast('Failed to load admin statistics', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [addToast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Admin Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Total Skills</h3>
              <p className="font-semibold text-xl">{stats.totalSkills}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Learning Paths</h3>
              <p className="font-semibold text-xl">{stats.totalLearningPaths}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Users</h3>
              <p className="font-semibold text-xl">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <a 
              href="/admin/skills/new" 
              className="block w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md text-gray-700 transition-colors"
            >
              Add New Skill
            </a>
            <a 
              href="/admin/paths/new" 
              className="block w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md text-gray-700 transition-colors"
            >
              Create Learning Path
            </a>
            <a 
              href="/admin/users" 
              className="block w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md text-gray-700 transition-colors"
            >
              Manage User Accounts
            </a>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
          
          {stats.recentActivity.length === 0 ? (
            <p className="text-gray-500 italic">No recent activity to display.</p>
          ) : (
            <div className="space-y-3">
              {/* This would render recent activity items from the admin API */}
              <p className="text-gray-500 italic">Activity log would appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
