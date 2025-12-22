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

export interface JokeResponse {
  id: string;
  text: string;
  source?: string;
  number: number;
  user?: {
    id: string;
    name: string;
  };
  topics?: string[];
  createdAt: Date;
  updatedAt: Date;
}
