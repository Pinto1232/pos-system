// src/hooks/UseOut.tsx
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

// Hook personalizado para acessar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
