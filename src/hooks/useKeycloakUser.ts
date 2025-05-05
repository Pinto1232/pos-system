'use client';

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

interface UserInfo {
  name: string;
  email: string;
  preferred_username: string;
  given_name?: string;
  family_name?: string;
  sub: string;
}

export const useKeycloakUser = () => {
  const { token, authenticated } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const extractUserInfo = () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!token || !authenticated) {
          setUserInfo(null);
          setIsLoading(false);
          return;
        }

        // Parse the JWT token to get user information
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          throw new Error('Invalid token format');
        }

        // Decode the payload (second part of the token)
        const payload = JSON.parse(atob(tokenParts[1]));
        
        // Extract user information
        const extractedUserInfo: UserInfo = {
          name: payload.name || 'Unknown User',
          email: payload.email || '',
          preferred_username: payload.preferred_username || '',
          given_name: payload.given_name,
          family_name: payload.family_name,
          sub: payload.sub
        };

        setUserInfo(extractedUserInfo);
      } catch (err) {
        console.error('Error extracting user info from token:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    extractUserInfo();
  }, [token, authenticated]);

  return { userInfo, isLoading, error };
};

export default useKeycloakUser;
