import React, { useState } from 'react';
import type { Video } from '../api';

interface VideoPlayerProps {
  video: Video;
  onComplete?: () => void;
  autoplay?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  video, 
  onComplete,
  autoplay = false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // YouTube video embed URL
  const videoEmbedUrl = `https://www.youtube.com/embed/${video.youtube_id}?autoplay=${autoplay ? 1 : 0}&rel=0`;

  // Handle iframe onload event
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Handle error
  const handleIframeError = () => {
    setError('Failed to load video. Please try again later.');
    setIsLoading(false);
  };

  return (
    <div className="w-full">
      {/* Video title and info */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{video.title}</h2>
        {video.duration_seconds && (
          <p className="text-sm text-gray-600">
            Duration: {Math.floor(video.duration_seconds / 60)}:{(video.duration_seconds % 60).toString().padStart(2, '0')}
          </p>
        )}
      </div>

      {/* Video player */}
      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}
        
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white p-4">
            <div>
              <p>{error}</p>
              <button 
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                }}
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <iframe
            src={videoEmbedUrl}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          ></iframe>
        )}
      </div>

      {/* Video description */}
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Description</h3>
        <p className="text-gray-600 whitespace-pre-line">{video.description}</p>
      </div>

      {/* Mark as completed button */}
      {onComplete && (
        <div className="mt-4">
          <button
            onClick={onComplete}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md inline-flex items-center transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Mark as Completed
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
