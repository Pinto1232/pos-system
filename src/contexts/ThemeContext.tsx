'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<
  ThemeContextType | undefined
>(undefined);

export const ThemeProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [theme, setTheme] =
    useState<ThemeMode>('light');

  useEffect(() => {
    // Load theme from localStorage on component mount
    const savedTheme = localStorage.getItem(
      'theme'
    ) as ThemeMode;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute(
        'data-theme',
        savedTheme
      );
    }
  }, []);

  const toggleTheme = () => {
    const newTheme =
      theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute(
      'data-theme',
      newTheme
    );
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(
      'useTheme must be used within a ThemeProvider'
    );
  }
  return context;
};
