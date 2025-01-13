import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <header>Authentication Header</header>
      <main>{children}</main>
      <footer>Authentication Footer</footer>
    </div>
  );
};

export default AuthLayout;
