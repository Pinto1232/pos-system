import React from 'react';
import { useAuth } from '@/hooks/useAuth/useAuth';

const AuthenticationHeader: React.FC = () => {
  const { user, login, logout } = useAuth();

  return (
    <header>
      {user ? (
        <div>
          <p>Bem-vindo, {user}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => login('NovoUsuario')}>Login</button>
      )}
    </header>
  );
};

export default AuthenticationHeader;
