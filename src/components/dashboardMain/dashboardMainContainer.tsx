import React, { memo } from 'react';
import DashboardMain from './dashboardMain';
import { Box } from '@mui/material';

interface DashboardMainContainerProps {
  activeSection: string;
}

const DashboardMainContainer: React.FC<DashboardMainContainerProps> = memo(
  ({ activeSection }) => {
    return (
      <Box
        sx={{
          flexGrow: 1,
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden',
          pb: 4,
        }}
      >
        <DashboardMain activeSection={activeSection} />
      </Box>
    );
  }
);

DashboardMainContainer.displayName = 'DashboardMainContainer';

export default DashboardMainContainer;
