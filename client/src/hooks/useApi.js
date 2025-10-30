import { useState, useCallback } from 'react';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall, onSuccess, onError) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      if (onSuccess) onSuccess(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Something went wrong';
      setError(errorMsg);
      if (onError) onError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, execute, setError };
};