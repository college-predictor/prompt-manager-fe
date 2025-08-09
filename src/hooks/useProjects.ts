import { useCallback } from 'react';
import { useApp } from '@/contexts/AppContext';
import { projectsAPI, handleAPIError, CreateProjectPayload } from '@/lib/api';

export const useProjects = () => {
  const { state, dispatch } = useApp();

  const fetchProjects = useCallback(async () => {
    dispatch({ type: 'SET_PROJECTS_LOADING', payload: true });
    try {
      const response = await projectsAPI.list();
      if (response.result === 'ok') {
        dispatch({ type: 'SET_PROJECTS', payload: response.data.data });
      } else {
        dispatch({ type: 'SET_PROJECTS_ERROR', payload: 'Failed to fetch projects' });
      }
    } catch (error) {
      const errorMessage = handleAPIError(error);
      dispatch({ type: 'SET_PROJECTS_ERROR', payload: errorMessage });
    }
  }, [dispatch]);

  const createProject = useCallback(async (payload: Omit<CreateProjectPayload, 'action'>) => {
    try {
      const response = await projectsAPI.create({ ...payload, action: 'new' });
      if (response.result === 'ok') {
        // Refresh projects list
        await fetchProjects();
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage = handleAPIError(error);
      dispatch({ type: 'SET_PROJECTS_ERROR', payload: errorMessage });
      return false;
    }
  }, [dispatch, fetchProjects]);

  const deleteProject = useCallback(async (projectId: number) => {
    try {
      const response = await projectsAPI.delete(projectId);
      if (response.result === 'ok') {
        dispatch({ type: 'REMOVE_PROJECT', payload: projectId });
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage = handleAPIError(error);
      dispatch({ type: 'SET_PROJECTS_ERROR', payload: errorMessage });
      return false;
    }
  }, [dispatch]);

  return {
    projects: state.projects,
    loading: state.loading.projects,
    error: state.error.projects,
    fetchProjects,
    createProject,
    deleteProject,
  };
};
