import React from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';

import RoleManagement from '../../roles/RoleManagement';
import UserActivityMonitor from '../../roles/UserActivityMonitor';

interface UserRoleContentProps {
  selectedRoleTab: number;
  setSelectedRoleTab: (tab: number) => void;
  setCreateRoleModalOpen: (open: boolean) => void;
}

/**
 * Component for user and role management content
 */
const UserRoleContent: React.FC<UserRoleContentProps> = ({
  selectedRoleTab,
  setSelectedRoleTab,
}) => {
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedRoleTab(newValue);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h6">
          User & Role Management
        </Typography>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Tabs
          value={selectedRoleTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: '1px solid #e0e0e0',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 'medium',
              fontSize: '0.9rem',
            },
          }}
        >
          <Tab label="Role Management" />
          <Tab label="User Activity" />
        </Tabs>

        <Box sx={{ p: 2 }}>
          {selectedRoleTab === 0 && <RoleManagement />}
          {selectedRoleTab === 1 && <UserActivityMonitor />}
        </Box>
      </Paper>
    </Box>
  );
};

export default UserRoleContent;
