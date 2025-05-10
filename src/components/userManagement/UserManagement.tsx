'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import { useUserManagement } from '@/contexts/UserManagementContext';
import UserList from './UserList';
import RoleList from './RoleList';
import PermissionManagement from './PermissionManagement';
import SecuritySettings from './SecuritySettings';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } =
    props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-management-tabpanel-${index}`}
      aria-labelledby={`user-management-tab-${index}`}
      {...other}
      style={{ height: '100%' }}
    >
      {value === index && (
        <Box sx={{ p: 3, height: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `user-management-tab-${index}`,
    'aria-controls': `user-management-tabpanel-${index}`,
  };
}

const UserManagement: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const {
    users,
    roles,
    permissions,
    isLoadingUsers,
    isLoadingRoles,
    isLoadingPermissions,
    createUser,
    updateUser,
    deleteUser,
    assignRolesToUser,
    createRole,
    updateRole,
    deleteRole,
    assignPermissionsToRole,
    securitySettings,
    updateSecuritySettings,
  } = useUserManagement();

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '70vh',
        overflow: 'hidden',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          color: '#173A79',
          mb: 2,
        }}
      >
        User & Role Management
      </Typography>

      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="user management tabs"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.9rem',
            },
            '& .Mui-selected': {
              color: '#173A79',
              fontWeight: 600,
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#173A79',
            },
          }}
        >
          <Tab
            label="User Management"
            {...a11yProps(0)}
          />
          <Tab
            label="Role Management"
            {...a11yProps(1)}
          />
          <Tab
            label="Permission Management"
            {...a11yProps(2)}
          />
          <Tab
            label="Security Settings"
            {...a11yProps(3)}
          />
        </Tabs>
      </Box>

      <Box
        sx={{ flexGrow: 1, overflow: 'hidden' }}
      >
        <TabPanel value={tabValue} index={0}>
          <UserList
            users={users}
            roles={roles}
            isLoading={isLoadingUsers}
            onCreateUser={createUser}
            onUpdateUser={updateUser}
            onDeleteUser={deleteUser}
            onAssignRoles={assignRolesToUser}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <RoleList
            roles={roles}
            permissions={permissions}
            isLoading={isLoadingRoles}
            onCreateRole={createRole}
            onUpdateRole={updateRole}
            onDeleteRole={deleteRole}
            onAssignPermissions={
              assignPermissionsToRole
            }
          />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <PermissionManagement
            permissions={permissions}
            isLoading={isLoadingPermissions}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <SecuritySettings
            settings={securitySettings}
            onUpdateSettings={
              updateSecuritySettings
            }
          />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default UserManagement;
