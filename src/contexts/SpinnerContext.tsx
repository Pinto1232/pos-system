'use client';

import React, { createContext, useState, ReactNode, useContext } from 'react';
import './Spinner.css'; 
import ErrorModal from '@/components/ui/errorModal/ErrorModal';


export interface SpinnerContextProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const SpinnerContext = createContext<SpinnerContextProps | undefined>(undefined);

export const SpinnerProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <SpinnerContext.Provider value={{ loading, setLoading, error, setError }}>
      {loading && (
        <div className="spinner">
          <span>Loading...</span>
        </div>
      )}
      {error && (
        <ErrorModal message={error} onClose={() => setError(null)} />
      )}
      {children}
    </SpinnerContext.Provider>
  );
};

export const useSpinner = () => {
  const context = useContext(SpinnerContext);
  if (!context) {
    throw new Error('useSpinner must be used within a SpinnerProvider');
  }
  return context;
};

export { SpinnerContext };
