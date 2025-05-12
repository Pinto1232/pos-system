'use client';

import React from 'react';
import { Box } from '@mui/material';

const NavbarSpacer: React.FC = () => {
  return (
    <Box
      sx={{
        height: { xs: '56px', sm: '64px' },
        width: '100%',
      }}
    />
  );
};

export default NavbarSpacer;
