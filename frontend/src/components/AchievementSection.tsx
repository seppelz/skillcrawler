import React, { useState, useEffect } from 'react';
import AchievementBadge from './AchievementBadge';
import type { Achievement } from './AchievementBadge';

// Sample achievements - in a real app, these would come from an API
const sampleAchievements: Achievement[] = [
  {
    id: 1,
    name: 'First Steps',
    description: 'Completed your first learning path',
    icon: 'fas fa-shoe-prints',
    color: 'bg-blue-500 text-white',
    earnedAt: '2023-04-15T12:30:00Z',
  },
  {
    id: 2,
    name: 'Skill Master',
    description: 'Completed 5 learning paths for a single skill',
    icon: 'fas fa-award',
    color: 'bg-yellow-500 text-white',
    earnedAt: '2023-05-20T09:45:00Z',
  },
  {
    id: 3,
    name: 'Learning Explorer',
    description: 'Explored learning paths across 3 different skills',
    icon: 'fas fa-compass',
    color: 'bg-green-600 text-white',
    earnedAt: '2023-06-10T15:20:00Z',
  },
  {
    id: 4,
    name: 'Persistent Learner',
    description: 'Completed learning activities for 7 consecutive days',
    icon: 'fas fa-calendar-check',
    color: 'bg-purple-600 text-white',
    progress: {
      current: 4,
      total: 7
    }
  },
  {
    id: 5,
    name: 'Video Marathon',
    description: 'Watched 20 educational videos',
    icon: 'fas fa-film',
    color: 'bg-red-500 text-white',
    progress: {
      current: 12,
      total: 20
    }
  },
  {
    id: 6,
    name: 'Rising Star',
    description: 'Achieved 80% or higher in 3 skill assessments',
    icon: 'fas fa-star',
    color: 'bg-amber-400 text-white',
    progress: {
      current: 1,
      total: 3
    }
  }
];

interface AchievementSectionProps {
  userId?: number;
  className?: string;
}

const AchievementSection: React.FC<AchievementSectionProps> = ({ userId, className = '' }) => {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>(sampleAchievements);

  useEffect(() => {
    // In a real app, we would fetch achievements from an API based on userId
    const fetchUserAchievements = async () => {
      try {
        // This is where we would make an API call using the userId
        // const response = await achievementsService.getUserAchievements(userId);
        // setAchievements(response.data);
        console.log(`Fetching achievements for user ${userId}`);
        // For now, we're using the sample data
      } catch (error) {
        console.error('Error fetching user achievements:', error);
      }
    };

    if (userId) {
      fetchUserAchievements();
    }
  }, [userId]);
  
  const earnedAchievements = achievements.filter(a => a.earnedAt);
  const inProgressAchievements = achievements.filter(a => !a.earnedAt);

  const openAchievementDetail = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAchievement(null);
  };

  return (
    <div className={`${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Earned Achievements ({earnedAchievements.length})</h3>
        
        {earnedAchievements.length === 0 ? (
          <p className="text-gray-500 italic">No achievements earned yet. Keep learning!</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {earnedAchievements.map(achievement => (
              <div 
                key={achievement.id} 
                className="flex flex-col items-center cursor-pointer"
                onClick={() => openAchievementDetail(achievement)}
              >
                <AchievementBadge 
                  achievement={achievement} 
                  size="md" 
                  showDetails={true} 
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">In Progress ({inProgressAchievements.length})</h3>
        
        {inProgressAchievements.length === 0 ? (
          <p className="text-gray-500 italic">You've earned all available achievements. Great job!</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {inProgressAchievements.map(achievement => (
              <div 
                key={achievement.id} 
                className="flex flex-col items-center cursor-pointer"
                onClick={() => openAchievementDetail(achievement)}
              >
                <AchievementBadge 
                  achievement={achievement} 
                  size="md" 
                  showDetails={true} 
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Achievement Detail Modal */}
      {isModalOpen && selectedAchievement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex flex-col items-center mb-4">
              <AchievementBadge 
                achievement={selectedAchievement} 
                size="lg" 
                showDetails={true} 
              />
            </div>
            
            <p className="text-gray-600 text-center mb-6">
              {selectedAchievement.description}
            </p>
            
            {selectedAchievement.earnedAt ? (
              <p className="text-sm text-gray-500 text-center">
                Earned on {new Date(selectedAchievement.earnedAt).toLocaleDateString()}
              </p>
            ) : selectedAchievement.progress ? (
              <div className="mb-6">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${(selectedAchievement.progress.current / selectedAchievement.progress.total) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 text-center mt-2">
                  {selectedAchievement.progress.current} of {selectedAchievement.progress.total} completed
                </p>
              </div>
            ) : null}
            
            <div className="flex justify-center">
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementSection;
