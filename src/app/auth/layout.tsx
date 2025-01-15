"use client";

import AuthenticationHeader from '@/components/AuthenticationHeader/AuthenticationHeader';
import React from 'react';
import { AuthProvider } from '@/context/AuthContext'; // Ensure correct import path

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <div>
        <header>
          <AuthenticationHeader />
        </header>
        <main>{children}</main>
        <footer>Authentication Footer</footer>
      </div>
    </AuthProvider>
  );
};

export default AuthLayout;
