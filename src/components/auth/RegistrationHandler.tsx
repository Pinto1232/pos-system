'use client';

import { useEffect } from 'react';
import { handleRegistrationRedirect } from '@/utils/authUtils';

/**
 * Component that handles registration redirects
 * This is a client-side component that should be included on pages
 * that might receive redirects from Keycloak registration
 */
export const RegistrationHandler: React.FC =
  () => {
    useEffect(() => {
      // Handle registration redirects when the component mounts
      handleRegistrationRedirect();
    }, []);

    // This component doesn't render anything
    return null;
  };

export default RegistrationHandler;
