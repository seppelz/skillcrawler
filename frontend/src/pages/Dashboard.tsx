import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { learningPathsService } from '../api';
import type { LearningPath, UserProgress } from '../api';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [userProgress, setUserProgress] = useState<Map<number, UserProgress[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch all learning paths
        const paths = await learningPathsService.getAllLearningPaths();
        setLearningPaths(paths);

        // Fetch progress for each learning path
        const progressData = new Map<number, UserProgress[]>();
        
        for (const path of paths) {
          try {
            const pathProgress = await learningPathsService.getProgress(path.id);
            if (pathProgress.length > 0) {
              progressData.set(path.id, pathProgress);
            }
          } catch (err) {
            console.error(`Error fetching progress for path ${path.id}:`, err);
          }
        }
        
        setUserProgress(progressData);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Calculate overall progress across all learning paths
  const calculateOverallProgress = () => {
    let totalVideos = 0;
    let completedVideos = 0;

    userProgress.forEach((progressItems) => {
      totalVideos += progressItems.length;
      completedVideos += progressItems.filter(item => item.completed).length;
    });

    return {
      totalVideos,
      completedVideos,
      percentage: totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0
    };
  };

  // Get in-progress learning paths (paths with some but not all videos completed)
  const getInProgressPaths = () => {
    return Array.from(userProgress.entries())
      .filter(([_, progressItems]) => {
        const completedCount = progressItems.filter(item => item.completed).length;
        return completedCount > 0 && completedCount < progressItems.length;
      })
      .map(([pathId]) => learningPaths.find(path => path.id === pathId))
      .filter(Boolean) as LearningPath[];
  };

  // Get completed learning paths (all videos completed)
  const getCompletedPaths = () => {
    return Array.from(userProgress.entries())
      .filter(([_, progressItems]) => {
        const completedCount = progressItems.filter(item => item.completed).length;
        return completedCount > 0 && completedCount === progressItems.length;
      })
      .map(([pathId]) => learningPaths.find(path => path.id === pathId))
      .filter(Boolean) as LearningPath[];
  };

  // Calculate progress percentage for a specific path
  const calculatePathProgress = (pathId: number) => {
    const progressItems = userProgress.get(pathId);
    if (!progressItems || progressItems.length === 0) return 0;
    
    const completedCount = progressItems.filter(item => item.completed).length;
    return Math.round((completedCount / progressItems.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      </div>
    );
  }

  const overallProgress = calculateOverallProgress();
  const inProgressPaths = getInProgressPaths();
  const completedPaths = getCompletedPaths();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Learning Dashboard</h1>
      
      {/* User welcome */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Welcome back, {user?.name || 'Learner'}!</h2>
        
        {/* Overall progress section */}
        <div className="mb-4">
          <h3 className="font-medium text-gray-700 mb-2">Your Overall Progress</h3>
          <div className="flex items-center">
            <div className="flex-1 mr-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${overallProgress.percentage}%` }}
                ></div>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {overallProgress.completedVideos} of {overallProgress.totalVideos} videos completed ({overallProgress.percentage}%)
            </span>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">Learning Paths</p>
            <p className="text-2xl font-bold">{learningPaths.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-800">In Progress</p>
            <p className="text-2xl font-bold">{inProgressPaths.length}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-800">Completed</p>
            <p className="text-2xl font-bold">{completedPaths.length}</p>
          </div>
        </div>
      </div>
      
      {/* In Progress Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Continue Learning</h2>
          <Link to="/paths" className="text-blue-600 hover:text-blue-800 text-sm">
            View all learning paths
          </Link>
        </div>
        
        {inProgressPaths.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md">
            <p>You don't have any learning paths in progress. Start one now!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressPaths.map(path => (
              <div key={path.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{path.name}</h3>
                  
                  {path.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{path.description}</p>
                  )}
                  
                  <div className="mb-3">
                    <div className="flex items-center">
                      <div className="flex-1 mr-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${calculatePathProgress(path.id)}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        {calculatePathProgress(path.id)}%
                      </span>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/paths/${path.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md inline-flex items-center transition-colors"
                  >
                    <span>Continue</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Completed Paths Section */}
      {completedPaths.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Completed Learning Paths</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedPaths.map(path => (
              <div key={path.id} className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-green-500">
                <div className="p-5">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-800">{path.name}</h3>
                  </div>
                  
                  <Link 
                    to={`/paths/${path.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center mt-3"
                  >
                    <span>View Again</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Recommended Paths */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
        
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 text-center">
          <p className="text-gray-600 mb-4">
            We're working on personalized recommendations based on your learning history.
          </p>
          <Link
            to="/skills"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md inline-flex items-center transition-colors"
          >
            Explore Skills
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
