import { apiClient } from '../client';

/**
 * Service for interacting with skills API endpoints
 */
export interface Skill {
  id: number;
  name: string;
  category?: string;
  description?: string;
}

export interface CreateSkillDto {
  name: string;
  category?: string;
  description?: string;
}

export const skillsService = {
  /**
   * Get all available skills
   */
  getAllSkills: async (): Promise<Skill[]> => {
    return await apiClient.get<Skill[]>('/skills');
  },

  /**
   * Get a specific skill by ID
   */
  getSkillById: async (id: number): Promise<Skill> => {
    return await apiClient.get<Skill>(`/skills/${id}`);
  },

  /**
   * Create a new skill
   */
  createSkill: async (skillData: CreateSkillDto): Promise<Skill> => {
    return await apiClient.post<Skill>('/skills', skillData);
  },
};
