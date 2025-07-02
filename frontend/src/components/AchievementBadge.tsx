import React from 'react';

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string; // CSS class name for the icon
  color: string; // CSS color class
  earnedAt?: string; // ISO date string
  progress?: {
    current: number;
    total: number;
  };
}

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ 
  achievement, 
  size = 'md',
  showDetails = false
}) => {
  const { name, description, icon, color, earnedAt, progress } = achievement;
  const earned = !!earnedAt;
  
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-16 h-16 text-base',
    lg: 'w-20 h-20 text-lg'
  };

  const containerClasses = `relative ${size === 'lg' ? 'mb-6' : ''}`;
  
  return (
    <div className={containerClasses}>
      {/* Badge */}
      <div 
        className={`
          ${sizeClasses[size]} 
          rounded-full flex items-center justify-center 
          ${earned ? color : 'bg-gray-200 text-gray-400'}
          ${earned ? 'shadow-md' : ''}
        `}
        title={earned ? `Earned on ${new Date(earnedAt!).toLocaleDateString()}` : 'Not earned yet'}
      >
        <i className={`${icon} ${size === 'lg' ? 'text-2xl' : ''}`}></i>
        
        {/* Progress overlay for incomplete badges */}
        {!earned && progress && (
          <div className="absolute inset-0 rounded-full">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="transparent"
                stroke="#e5e7eb" 
                strokeWidth="8"
              />
              <circle 
                cx="50" 
                cy="50" 
                r="45"
                fill="transparent"
                stroke="#93c5fd"
                strokeWidth="8"
                strokeDasharray={`${progress.current / progress.total * 283} 283`}
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-500">
              {Math.round(progress.current / progress.total * 100)}%
            </div>
          </div>
        )}
      </div>
      
      {/* Details (optional) */}
      {showDetails && (
        <div className={`mt-2 ${size === 'lg' ? 'text-center' : ''}`}>
          <p className={`font-medium ${earned ? 'text-gray-800' : 'text-gray-500'}`}>
            {name}
          </p>
          {size === 'lg' && (
            <p className="text-sm text-gray-500 mt-1">
              {description}
            </p>
          )}
          {size === 'lg' && progress && !earned && (
            <p className="text-xs text-gray-500 mt-1">
              {progress.current} / {progress.total} completed
            </p>
          )}
        </div>
      )}
      
      {/* Earned indicator */}
      {earned && (
        <div className="absolute -top-1 -right-1 bg-green-500 rounded-full w-4 h-4 border-2 border-white">
        </div>
      )}
    </div>
  );
};

export default AchievementBadge;
