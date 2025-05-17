'use client';

import { useEffect } from 'react';
import { handleRegistrationRedirect } from '@/utils/authUtils';

export const RegistrationHandler: React.FC = () => {
  useEffect(() => {
    handleRegistrationRedirect();
  }, []);

  return null;
};

export default RegistrationHandler;
