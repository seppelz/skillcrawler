import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { learningPathsService } from '../api';
import type { LearningPath, LearningPathVideo, UserProgress } from '../api';
import { useAuth } from '../context/AuthContext';
import VideoPlayer from '../components/VideoPlayer';

const LearningPathDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [videos, setVideos] = useState<LearningPathVideo[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<LearningPathVideo | null>(null);

  // Fetch learning path details and videos
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        // Fetch learning paths to find the current one by id
        const paths = await learningPathsService.getAllLearningPaths();
        const currentPath = paths.find(path => path.id === parseInt(id));
        if (currentPath) {
          setLearningPath(currentPath);
        } else {
          setError('Learning path not found');
          return;
        }
        
        // Fetch videos for this learning path
        const pathVideos = await learningPathsService.getPathVideos(parseInt(id));
        setVideos(pathVideos);
        
        // Select the first video by default or the first uncompleted video
        if (pathVideos.length > 0) {
          pathVideos.sort((a, b) => a.order - b.order);
          setSelectedVideo(pathVideos[0]);
        }
        
        // Fetch user progress if authenticated
        if (isAuthenticated) {
          const userProgress = await learningPathsService.getProgress(parseInt(id));
          setProgress(userProgress);
          
          // If user has progress, select first uncompleted video
          if (userProgress.length > 0 && pathVideos.length > 0) {
            const uncompleted = pathVideos.find(video => 
              !userProgress.some(p => p.video_id === video.video_id && p.completed)
            );
            if (uncompleted) setSelectedVideo(uncompleted);
          }
        }
      } catch (err) {
        setError('Failed to load learning path data. Please try again.');
        console.error('Error fetching learning path data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isAuthenticated]);

  // Handle marking a video as completed or not completed
  const handleProgressUpdate = async (videoId: number, completed: boolean) => {
    if (!id || !isAuthenticated) return;
    
    try {
      await learningPathsService.updateProgress(parseInt(id), {
        video_id: videoId,
        completed
      });
      
      // Update local progress state
      const updatedProgress = progress.map(p => 
        p.video_id === videoId ? { ...p, completed } : p
      );
      
      // If no existing progress entry was found, add a new one
      if (!progress.some(p => p.video_id === videoId)) {
        updatedProgress.push({
          id: 0, // Will be assigned by backend
          user_id: user?.id || 0,
          learning_path_id: parseInt(id),
          video_id: videoId,
          completed,
          completed_at: completed ? new Date().toISOString() : undefined
        });
      }
      
      setProgress(updatedProgress);
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  // Check if a video is marked as completed
  const isVideoCompleted = (videoId: number) => {
    return progress.some(p => p.video_id === videoId && p.completed);
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
        <Link to="/paths" className="text-blue-600 hover:underline">
          &larr; Back to Learning Paths
        </Link>
      </div>
    );
  }

  // Calculate progress percentage
  const completedVideos = progress.filter(p => p.completed).length;
  const totalVideos = videos.length;
  const progressPercentage = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/paths" className="text-blue-600 hover:underline">
          &larr; Back to Learning Paths
        </Link>
      </div>
      
      {/* Path title and progress */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">{learningPath?.name}</h1>
        {learningPath?.description && (
          <p className="text-gray-600 mb-4">{learningPath.description}</p>
        )}
        
        {isAuthenticated && (
          <div className="mt-4">
            <div className="flex items-center">
              <div className="flex-1 mr-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {completedVideos} of {totalVideos} completed ({Math.round(progressPercentage)}%)
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Main content - Video player and playlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video player section */}
        <div className="lg:col-span-2">
          {selectedVideo ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
              <VideoPlayer 
                video={selectedVideo.video}
                onComplete={isAuthenticated ? 
                  () => handleProgressUpdate(selectedVideo.video_id, true) : 
                  undefined
                }
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-64">
              <p className="text-gray-500">No videos available in this learning path.</p>
            </div>
          )}
        </div>
        
        {/* Videos playlist */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl font-semibold p-4 border-b">Videos in this Learning Path</h2>
          
          {videos.length === 0 ? (
            <p className="p-4 text-gray-500">No videos have been added to this learning path yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {videos
                .sort((a, b) => a.order - b.order)
                .map(video => {
                  const isCompleted = isVideoCompleted(video.video_id);
                  const isSelected = selectedVideo?.id === video.id;
                  
                  return (
                    <li 
                      key={video.id} 
                      className={`p-4 cursor-pointer ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'} ${isCompleted ? 'border-l-4 border-green-500' : ''}`}
                      onClick={() => setSelectedVideo(video)}
                    >
                      <div className="flex items-start">
                        {/* Thumbnail */}
                        <div className="flex-shrink-0 bg-gray-200 w-24 h-16 rounded overflow-hidden mr-4">
                          <img 
                            src={`https://img.youtube.com/vi/${video.video.youtube_id}/mqdefault.jpg`}
                            alt={video.video.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-lg font-medium ${isSelected ? 'text-blue-700' : 'text-gray-900'} truncate`}>
                            {video.video.title}
                          </h3>
                          
                          {/* Duration */}
                          {video.video.duration_seconds && (
                            <p className="text-xs text-gray-500 mt-1">
                              Duration: {Math.floor(video.video.duration_seconds / 60)}:{(video.video.duration_seconds % 60).toString().padStart(2, '0')}
                            </p>
                          )}
                          
                          {/* Status indicator */}
                          <div className="flex items-center mt-1">
                            {isCompleted ? (
                              <span className="inline-flex items-center text-xs text-green-600">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Completed
                              </span>
                            ) : isSelected ? (
                              <span className="inline-flex items-center text-xs text-blue-600">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 3.5a1.5 1.5 0 013 0V9h5.5a1.5 1.5 0 010 3H13v5.5a1.5 1.5 0 01-3 0V12H4.5a1.5 1.5 0 010-3H10V3.5z" />
                                </svg>
                                Now Playing
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-xs text-gray-500">
                                Click to play
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Completion checkbox */}
                        {isAuthenticated && (
                          <div className="ml-2">
                            <label className="inline-flex items-center cursor-pointer" onClick={e => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={isCompleted}
                                onChange={e => handleProgressUpdate(video.video_id, e.target.checked)}
                                className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningPathDetail;
