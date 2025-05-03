import { useState } from 'react';

export const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      // Simulate logout process
      await new Promise((resolve) =>
        setTimeout(resolve, 2000)
      );
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  return { isLoggingOut, logout };
};
