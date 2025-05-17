import { useState } from 'react';

export const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', JSON.stringify(error, null, 2));
      setIsLoggingOut(false);
    }
  };

  return { isLoggingOut, logout };
};
