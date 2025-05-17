import React from 'react';

export const AuthContext = React.createContext({
  authenticated: true,
  setAuthenticated: (value: boolean) => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContext.Provider
      value={{
        authenticated: true,
        setAuthenticated: () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
