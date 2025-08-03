// src/lib/api.ts
import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface LoginPayload {
  auth_type: number;
  token: string;
}

export interface LoginResponse {
  result: string;
  data: {
    email: string;
    name: string;
  };
}

export interface Project {
  id: number;
  name: string;
  description: string;
  role: number;
  models: Model[];
}

export interface Model {
  id: number;
  model_name: string;
  provider_id: number;
  provider_name: string;
  description: string;
  temperature_allowed: boolean;
  has_max_token_limit: number;
  top_p_allowed: boolean;
  top_k_allowed: boolean;
  roles_allowed: number[];
  image_input_allowed: boolean;
  audio_input_allowed: boolean;
}

export interface ProjectsResponse {
  result: string;
  data: {
    count: number;
    data: Project[];
  };
}

export interface ModelsResponse {
  result: string;
  data: {
    count: number;
    data: Model[];
  };
}

export interface CreateProjectPayload {
  action: 'new';
  name: string;
  description: string;
  llm_models: number[];
  api_keys?: { [providerId: string]: string };
}

export interface DeleteProjectPayload {
  action: 'delete';
}

// API functions
export const authAPI = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', payload);
    return response.data;
  },

  logout: async (): Promise<{ result: string }> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};

export const projectsAPI = {
  list: async (): Promise<ProjectsResponse> => {
    const response = await apiClient.post<ProjectsResponse>('/api/projects', {
      action: 'list',
    });
    return response.data;
  },

  create: async (payload: CreateProjectPayload): Promise<{ result: string }> => {
    const response = await apiClient.post('/api/projects', payload);
    return response.data;
  },

  delete: async (projectId: number): Promise<{ result: string }> => {
    const response = await apiClient.post(`/api/projects/${projectId}`, {
      action: 'delete',
    });
    return response.data;
  },
};

export const modelsAPI = {
  list: async (): Promise<ModelsResponse> => {
    const response = await apiClient.post<ModelsResponse>('/api/config', {
      class: 'models',
    });
    return response.data;
  },
};

// Error handling
export const handleAPIError = (error: any) => {
  if (error.response) {
    // Server responded with error status
    console.error('API Error:', error.response.data);
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    // Request was made but no response received
    console.error('Network Error:', error.request);
    return 'Network error - please check your connection';
  } else {
    // Something else happened
    console.error('Error:', error.message);
    return error.message;
  }
};
