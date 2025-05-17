import React from 'react';
import { Box, IconButton } from '@mui/material';
import { Facebook, Twitter, LinkedIn, Instagram } from '@mui/icons-material';

const SocialIcons: React.FC = () => {
  return (
    <Box display="flex" gap={2} justifyContent="center" width="100%">
      <IconButton>
        <Facebook style={{ color: 'white' }} />
      </IconButton>
      <IconButton>
        <Twitter style={{ color: 'white' }} />
      </IconButton>
      <IconButton>
        <LinkedIn style={{ color: 'white' }} />
      </IconButton>
      <IconButton>
        <Instagram style={{ color: 'white' }} />
      </IconButton>
    </Box>
  );
};

export default SocialIcons;
