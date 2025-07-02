import { apiClient } from '../client';

/**
 * Service for interacting with videos API endpoints
 */
// Define Video interface for use across the application
export interface Video {
  id: number;
  youtube_id: string;
  title: string;
  description: string;
  duration_seconds?: number;
  published_at?: string;
}

export interface FetchVideoDto {
  youtube_id: string;
}

export const videosService = {
  /**
   * Fetch and store video metadata from YouTube
   */
  fetchVideo: async (youtubeId: string): Promise<Video> => {
    return await apiClient.post<Video>('/videos/fetch', { youtube_id: youtubeId });
  },
};
