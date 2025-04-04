'use client';

import React, { useState } from 'react';
// Import the memoized Navbar instead of the default LazyNavbar
import { Navbar } from '@/components/ui/navbar/Navbar';
import Drawer from '@mui/material/Drawer';

const NavbarContainer: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setIsDrawerOpen(open);
  };

  return (
    <>
      <Navbar
        title="Pisval Tech POS"
        menuItems={['Home', 'About', 'Contact']}
        isDrawerOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
      />
      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        {/* Drawer content */}
      </Drawer>
    </>
  );
};

export default NavbarContainer;
