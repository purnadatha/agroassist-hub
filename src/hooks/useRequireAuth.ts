
import { useEffect } from 'react';

export const useRequireAuth = () => {
  // This hook now does nothing - authentication is bypassed
  useEffect(() => {
    // No authentication check
  }, []);
};
