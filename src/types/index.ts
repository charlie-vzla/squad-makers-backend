export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  services: {
    database: 'connected' | 'disconnected';
    elasticsearch: 'connected' | 'disconnected';
  };
  version: string;
}

// Re-export joke types from models
export type { JokeDTO, ChuckNorrisJokeDTO, DadJokeDTO, UserDTO } from '../models/Joke.model';

// Legacy alias for backwards compatibility
export type JokeResponse = import('../models/Joke.model').JokeDTO;
