// Export all API services and utilities
export * from './client';
export * from './config';

// Export all services
export { authService } from './services/auth.service';
export { skillsService } from './services/skills.service';
export { videosService } from './services/videos.service';
export { learningPathsService } from './services/learningPaths.service';

// Export types
export type { UserProfile, LoginCredentials, UserRegistrationDto } from './services/auth.service';
export type { Skill, CreateSkillDto } from './services/skills.service';
export type { Video, FetchVideoDto } from './services/videos.service';
export type { 
  LearningPath, 
  LearningPathVideo, 
  CreateLearningPathDto,
  AddVideoToPathDto,
  ProgressUpdate,
  UserProgress
} from './services/learningPaths.service';
