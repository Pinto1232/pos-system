// src/context/AuthContext.tsx
import React, { createContext, ReactNode, useState, FC } from 'react';

// Define o tipo do contexto
interface AuthContextType {
  user: string | null; // Representa o usuário autenticado
  login: (user: string) => void; // Função para autenticar
  logout: () => void; // Função para sair
}

// Criação do contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Tipo das props para o AuthProvider
interface AuthProviderProps {
  children: ReactNode; // Elementos filhos que o provider envolve
}

// AuthProvider: Provedor do contexto
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  const login = (newUser: string) => setUser(newUser);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
