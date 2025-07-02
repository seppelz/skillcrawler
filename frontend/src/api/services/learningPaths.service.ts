import { apiClient } from '../client';
// Import Video interface directly with type import syntax
import type { Video } from './videos.service';

/**
 * Service for interacting with learning paths API endpoints
 */
export interface LearningPath {
  id: number;
  name: string;
  description?: string;
  skill_id: number;
  created_by: number;
  created_at: string;
}

export interface CreateLearningPathDto {
  name: string;
  description?: string;
  skill_id: number;
}

export interface LearningPathVideo {
  id: number;
  learning_path_id: number;
  video_id: number;
  order: number;
  video: Video;
}

export interface AddVideoToPathDto {
  video_id: number;
  order: number;
}

export interface ProgressUpdate {
  video_id: number;
  completed: boolean;
}

export interface UserProgress {
  id: number;
  user_id: number;
  learning_path_id: number;
  video_id: number;
  completed: boolean;
  completed_at?: string;
}

export const learningPathsService = {
  /**
   * Get all learning paths
   */
  getAllLearningPaths: async (): Promise<LearningPath[]> => {
    return await apiClient.get<LearningPath[]>('/learning-paths');
  },

  /**
   * Create a new learning path
   */
  createLearningPath: async (pathData: CreateLearningPathDto): Promise<LearningPath> => {
    return await apiClient.post<LearningPath>('/learning-paths', pathData);
  },

  /**
   * Add a video to a learning path
   */
  addVideoToPath: async (pathId: number, videoData: AddVideoToPathDto): Promise<LearningPathVideo> => {
    return await apiClient.post<LearningPathVideo>(`/learning-paths/${pathId}/videos`, videoData);
  },

  /**
   * Get all videos in a learning path
   */
  getPathVideos: async (pathId: number): Promise<LearningPathVideo[]> => {
    return await apiClient.get<LearningPathVideo[]>(`/learning-paths/${pathId}/videos`);
  },

  /**
   * Update progress for a video in a learning path
   */
  updateProgress: async (learningPathId: number, progressData: ProgressUpdate): Promise<UserProgress> => {
    return await apiClient.post<UserProgress>(`/progress?learning_path_id=${learningPathId}`, progressData);
  },

  /**
   * Get user progress for a learning path
   */
  getProgress: async (learningPathId: number): Promise<UserProgress[]> => {
    return await apiClient.get<UserProgress[]>(`/progress/${learningPathId}`);
  },
};
