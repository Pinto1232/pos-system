// components/globalLayout/Layout.tsx
"use client";

import React, { ReactNode } from 'react';
import MainHeader from '@components/navbar/MainHeader';
import { Box } from '@mui/material';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const handleMenuClick = () => {
    console.log("Menu icon clicked");
  };

  console.log("Layout rendered");

  return (
    <>
      <MainHeader testPeriod="12 days remaining" onMenuClick={handleMenuClick} />
      <Box>{children}</Box>
    </>
  );
};

export default Layout;