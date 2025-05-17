'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/ui/navbar/Navbar';
import Drawer from '@mui/material/Drawer';
import { Box } from '@mui/material';

const NavbarContainer: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setIsDrawerOpen(open);
  };

  return (
    <Box component="nav" role="navigation">
      <Navbar
        title="Pisval Tech"
        menuItems={['Home', 'About', 'Contact']}
        isDrawerOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
      />
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        ModalProps={{
          keepMounted: true,
          disableEnforceFocus: false,
          disableAutoFocus: false,
        }}
        slotProps={{
          backdrop: {
            'aria-hidden': 'true',
          },
        }}
      >
        <Box role="presentation" tabIndex={-1}>
          {}
        </Box>
      </Drawer>
    </Box>
  );
};

export default NavbarContainer;
