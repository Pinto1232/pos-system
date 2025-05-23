import React from 'react';

export interface AuthContextProps {
  token: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  authenticated: boolean;
  error: string | null;
  isInitialized: boolean;
}

export const AuthContext = React.createContext<AuthContextProps>({
  token: 'mock-token',
  login: async () => {},
  logout: async () => {},
  authenticated: true,
  error: null,
  isInitialized: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContext.Provider
      value={{
        token: 'mock-token',
        login: async () => {},
        logout: async () => {},
        authenticated: true,
        error: null,
        isInitialized: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
