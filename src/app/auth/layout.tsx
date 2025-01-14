import AuthenticationHeader from '@/components/AuthenticationHeader/AuthenticationHeader';
import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <header><AuthenticationHeader /></header>
      <main>{children}</main>
      <footer>Authentication Footer</footer>
    </div>
  );
};

export default AuthLayout;
