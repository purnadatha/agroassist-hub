
import { useState } from 'react';

export interface LoginState {
  isLoading: boolean;
  email: string;
  password: string;
  error: string | null;
}

export const useLoginState = () => {
  const [state, setState] = useState<LoginState>({
    isLoading: false,
    email: "",
    password: "",
    error: null
  });

  const setIsLoading = (isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  };

  const setEmail = (email: string) => {
    setState(prev => ({ ...prev, email }));
    // Clear error when user starts typing
    if (state.error && state.error.includes("email")) {
      clearError();
    }
  };

  const setPassword = (password: string) => {
    setState(prev => ({ ...prev, password }));
    // Clear error when user starts typing
    if (state.error && state.error.includes("password")) {
      clearError();
    }
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    ...state,
    setIsLoading,
    setEmail,
    setPassword,
    setError,
    clearError
  };
};
