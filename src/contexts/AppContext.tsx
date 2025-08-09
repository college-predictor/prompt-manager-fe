"use client";
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Project, Model } from '@/lib/api';

interface AppState {
  projects: Project[];
  models: Model[];
  loading: {
    projects: boolean;
    models: boolean;
  };
  error: {
    projects: string | null;
    models: string | null;
  };
}

type AppAction =
  | { type: 'SET_PROJECTS_LOADING'; payload: boolean }
  | { type: 'SET_MODELS_LOADING'; payload: boolean }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'SET_MODELS'; payload: Model[] }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'REMOVE_PROJECT'; payload: number }
  | { type: 'SET_PROJECTS_ERROR'; payload: string | null }
  | { type: 'SET_MODELS_ERROR'; payload: string | null };

const initialState: AppState = {
  projects: [],
  models: [],
  loading: {
    projects: false,
    models: false,
  },
  error: {
    projects: null,
    models: null,
  },
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_PROJECTS_LOADING':
      return {
        ...state,
        loading: { ...state.loading, projects: action.payload },
      };
    case 'SET_MODELS_LOADING':
      return {
        ...state,
        loading: { ...state.loading, models: action.payload },
      };
    case 'SET_PROJECTS':
      return {
        ...state,
        projects: action.payload,
        loading: { ...state.loading, projects: false },
        error: { ...state.error, projects: null },
      };
    case 'SET_MODELS':
      return {
        ...state,
        models: action.payload,
        loading: { ...state.loading, models: false },
        error: { ...state.error, models: null },
      };
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload],
      };
    case 'REMOVE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload),
      };
    case 'SET_PROJECTS_ERROR':
      return {
        ...state,
        loading: { ...state.loading, projects: false },
        error: { ...state.error, projects: action.payload },
      };
    case 'SET_MODELS_ERROR':
      return {
        ...state,
        loading: { ...state.loading, models: false },
        error: { ...state.error, models: action.payload },
      };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value: AppContextType = {
    state,
    dispatch,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
