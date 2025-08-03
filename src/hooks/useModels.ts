import { useCallback } from 'react';
import { useApp } from '@/contexts/AppContext';
import { modelsAPI, handleAPIError } from '@/lib/api';

export const useModels = () => {
  const { state, dispatch } = useApp();

  const fetchModels = useCallback(async () => {
    dispatch({ type: 'SET_MODELS_LOADING', payload: true });
    try {
      const response = await modelsAPI.list();
      if (response.result === 'ok') {
        dispatch({ type: 'SET_MODELS', payload: response.data.data });
      } else {
        dispatch({ type: 'SET_MODELS_ERROR', payload: 'Failed to fetch models' });
      }
    } catch (error) {
      const errorMessage = handleAPIError(error);
      dispatch({ type: 'SET_MODELS_ERROR', payload: errorMessage });
    }
  }, [dispatch]);

  return {
    models: state.models,
    loading: state.loading.models,
    error: state.error.models,
    fetchModels,
  };
};
