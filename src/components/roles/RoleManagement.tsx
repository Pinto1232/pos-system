import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import BackendStatusChecker from '../ui/BackendStatusChecker';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SecurityIcon from '@mui/icons-material/Security';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import roleService, {
  Role,
  RoleCreateRequest,
  RoleUpdateRequest,
} from '@/api/roleService';
import RolePermissionEditor from './RolePermissionEditor';
import UserRoleAssignment from './UserRoleAssignment';
import CreateRoleModal from '../settings/CreateRoleModal';

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
      id={`role-tabpanel-${index}`}
      aria-labelledby={`role-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>{children}</Box>
      )}
    </div>
  );
}

const RoleManagement: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedRoleId, setSelectedRoleId] =
    useState<number | null>(null);

  const [createRoleModalOpen, setCreateRoleModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [configurePermissionsAfter, setConfigurePermissionsAfter] = useState(true);
  const [roleNameError, setRoleNameError] = useState('');
  const [createRolePending, setCreateRolePending] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] =
    useState(false);
  const [
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
  ] = useState(false);
  const [newRoleName, setNewRoleName] =
    useState('');
  const [
    newRoleDescription,
    setNewRoleDescription,
  ] = useState('');
  const [editRoleName, setEditRoleName] =
    useState('');
  const [
    editRoleDescription,
    setEditRoleDescription,
  ] = useState('');
  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null);
  const [menuRoleId, setMenuRoleId] = useState<
    number | null
  >(null);

  const queryClient = useQueryClient();

  // Fetch all roles
  const {
    data: roles,
    isLoading: isLoadingRoles,
    error: rolesError,
    refetch: refetchRoles,
  } = useQuery<Role[]>({
    queryKey: ['roles'],
    queryFn: roleService.getAllRoles,
    retry: 2,
    retryDelay: 1000,
  });

  // Create role mutation
  const createRoleMutation = useMutation({
    mutationFn: (roleData: RoleCreateRequest) => {
      // Validate role name
      if (!roleData.name.trim()) {
        throw new Error('Role name cannot be empty');
      }

      // Check if role name already exists
      const existingRole = roles?.find(
        r => r.name.toLowerCase() === roleData.name.toLowerCase()
      );
      if (existingRole) {
        throw new Error(`Role with name "${roleData.name}" already exists`);
      }

      return roleService.createRole(roleData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['roles'],
      });
      setNewRoleName('');
      setNewRoleDescription('');

      // Log the role creation for audit purposes
      logRoleChange('create', data.id);
    },
    onError: (error) => {
      console.error('Error creating role:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to create role'}`);
    }
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: RoleUpdateRequest;
    }) => {
      // Validate role name
      if (!data.name.trim()) {
        throw new Error('Role name cannot be empty');
      }

      // Check if this is a system role that should be protected
      const roleToUpdate = roles?.find(r => r.id === id);
      if (roleToUpdate && isSystemRole(roleToUpdate.name) &&
          roleToUpdate.name !== data.name) {
        throw new Error(`Cannot change name of system role: ${roleToUpdate.name}`);
      }

      // Check if new name already exists (excluding this role)
      const existingRole = roles?.find(
        r => r.id !== id && r.name.toLowerCase() === data.name.toLowerCase()
      );
      if (existingRole) {
        throw new Error(`Role with name "${data.name}" already exists`);
      }

      return roleService.updateRole(id, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['roles'],
      });
      setIsEditDialogOpen(false);

      // Log the role update for audit purposes
      logRoleChange('update', variables.id);
    },
    onError: (error) => {
      console.error('Error updating role:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to update role'}`);
    }
  });

  // Delete role mutation
  const deleteRoleMutation = useMutation({
    mutationFn: (roleId: number) => {
      // Check if this is a system role that should be protected
      const roleToDelete = roles?.find(r => r.id === roleId);
      if (roleToDelete && isSystemRole(roleToDelete.name)) {
        throw new Error(`Cannot delete system role: ${roleToDelete.name}`);
      }
      return roleService.deleteRole(roleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['roles'],
      });
      setIsDeleteDialogOpen(false);
      if (selectedRoleId === menuRoleId) {
        setSelectedRoleId(null);
      }

      // Log the role deletion for audit purposes
      logRoleChange('delete', menuRoleId);
    },
    onError: (error) => {
      console.error('Error deleting role:', error);
      // Show error message to user
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to delete role'}`);
    }
  });

  // Function to check if a role is a system role that should be protected
  const isSystemRole = (roleName: string): boolean => {
    const systemRoles = ['Admin', 'User', 'System'];
    return systemRoles.includes(roleName);
  };

  // Function to log role changes for audit purposes
  const logRoleChange = (action: 'create' | 'update' | 'delete', roleId: number | null) => {
    const role = roles?.find(r => r.id === roleId);
    const logData = {
      timestamp: new Date().toISOString(),
      action,
      roleId,
      roleName: role?.name || 'Unknown',
      userId: 'current-user', // In a real implementation, get the current user ID
    };

    console.log('Role change logged:', logData);
    // In a real implementation, send this to the backend
    // Example: apiClient.post('/api/audit/role-changes', logData);
  };

  // Function to get template permissions
  const getTemplatePermissions = (template: string): string[] => {
    switch (template) {
      case 'manager':
        return [
          'users.view',
          'roles.view',
          'reports.view',
          'transactions.view',
          'inventory.view',
          'products.view',
          'products.edit',
          'sales.create',
          'customers.view',
          'customers.create',
          'analytics.view',
        ];
      case 'cashier':
        return [
          'sales.create',
          'customers.view',
          'products.view',
        ];
      case 'inventory':
        return [
          'inventory.view',
          'inventory.edit',
          'products.view',
          'products.edit',
        ];
      default:
        return [];
    }
  };

  // Handle tab change
  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: number
  ) => {
    setTabValue(newValue);
  };

  // Handle role selection
  const handleRoleSelect = (roleId: number) => {
    setSelectedRoleId(roleId);
    setTabValue(1); // Switch to permissions tab
  };



  // Handle create role from modal
  const handleCreateRoleFromModal = () => {
    setCreateRolePending(true);

    try {
      // Validate role name
      if (!newRoleName.trim()) {
        setRoleNameError('Role name cannot be empty');
        setCreateRolePending(false);
        return;
      }

      // Check if role name already exists
      const existingRole = roles?.find(
        r => r.name.toLowerCase() === newRoleName.toLowerCase()
      );
      if (existingRole) {
        setRoleNameError(`Role with name "${newRoleName}" already exists`);
        setCreateRolePending(false);
        return;
      }

      // Prepare permissions based on template
      const permissions = selectedTemplate ? getTemplatePermissions(selectedTemplate) : [];

      // Create the role
      createRoleMutation.mutate({
        name: newRoleName,
        description: newRoleDescription,
        permissions: permissions, // Use the permissions from the template
      }, {
        onSuccess: (data) => {
          // Close the modal and reset form
          setCreateRoleModalOpen(false);
          setNewRoleName('');
          setNewRoleDescription('');
          setSelectedTemplate('');
          setRoleNameError('');
          setCreateRolePending(false);

          // If user wants to configure permissions after creation
          if (configurePermissionsAfter && data.id) {
            setSelectedRoleId(data.id);
            setTabValue(1); // Switch to permissions tab
          }
        },
        onError: (error) => {
          console.error('Error creating role:', error);
          setRoleNameError(error instanceof Error ? error.message : 'Failed to create role');
          setCreateRolePending(false);
        }
      });
    } catch (error) {
      console.error('Error in handleCreateRoleFromModal:', error);
      setRoleNameError('An unexpected error occurred');
      setCreateRolePending(false);
    }
  };

  // Handle edit role
  const handleEditRole = () => {
    if (menuRoleId) {
      updateRoleMutation.mutate({
        id: menuRoleId,
        data: {
          name: editRoleName,
          description: editRoleDescription,
        },
      });
    }
  };

  // Handle delete role
  const handleDeleteRole = () => {
    if (menuRoleId) {
      deleteRoleMutation.mutate(menuRoleId);
    }
  };

  // Open role menu
  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    roleId: number
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuRoleId(roleId);

    // Set edit form values
    const role = roles?.find(
      (r) => r.id === roleId
    );
    if (role) {
      setEditRoleName(role.name);
      setEditRoleDescription(
        role.description || ''
      );
    }
  };

  // Close role menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Check if the current menu role is a system role that should have restricted actions
  const isSystemRoleMenuDisabled = (): boolean => {
    if (!menuRoleId) return false;
    const role = roles?.find(r => r.id === menuRoleId);
    return role ? isSystemRole(role.name) : false;
  };

  // Open edit dialog
  const handleOpenEditDialog = () => {
    setIsEditDialogOpen(true);
    handleCloseMenu();
  };

  // Open delete dialog
  const handleOpenDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
    handleCloseMenu();
  };

  if (isLoadingRoles) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (rolesError) {
    console.error(
      'Role loading error details:',
      rolesError
    );
    return (
      <Box>
        <BackendStatusChecker />
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading roles:{' '}
          {rolesError.message || 'Unknown error'}
        </Alert>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Actions:
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => refetchRoles()}
              sx={{ mr: 2 }}
            >
              Retry Loading Roles
            </Button>
            <Button
              variant="outlined"
              onClick={() =>
                window.location.reload()
              }
            >
              Refresh Page
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <BackendStatusChecker
        showWhenRunning={false}
      />
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="role management tabs"
        >
          <Tab
            label="Roles"
            id="role-tab-0"
            aria-controls="role-tabpanel-0"
          />
          <Tab
            label="Permissions"
            id="role-tab-1"
            aria-controls="role-tabpanel-1"
            disabled={!selectedRoleId}
          />
          <Tab
            label="Users"
            id="role-tab-2"
            aria-controls="role-tabpanel-2"
            disabled={!selectedRoleId}
          />
        </Tabs>
        {tabValue === 0 && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setCreateRoleModalOpen(true)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                mb: 1
              }}
            >
              Create New Role
            </Button>
          </Box>
        )}
      </Box>

      {/* Roles Tab */}
      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Role Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Permissions</TableCell>
                <TableCell align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles?.map((role) => (
                <TableRow key={role.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography
                        variant="body1"
                        fontWeight={
                          role.id === selectedRoleId
                            ? 'bold'
                            : 'normal'
                        }
                      >
                        {role.name}
                      </Typography>
                      {isSystemRole(role.name) && (
                        <Chip
                          label="System"
                          size="small"
                          color="primary"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {role.description || '-'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${role.permissionList?.length || 0} permissions`}
                      size="small"
                      color={
                        role.id === selectedRoleId
                          ? 'primary'
                          : 'default'
                      }
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Manage Permissions">
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleRoleSelect(
                            role.id
                          )
                        }
                      >
                        <SecurityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      size="small"
                      onClick={(e) =>
                        handleOpenMenu(e, role.id)
                      }
                      disabled={isSystemRole(role.name) && role.name === 'Admin'}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Permissions Tab */}
      <TabPanel value={tabValue} index={1}>
        {selectedRoleId ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              Permissions for{' '}
              {
                roles?.find(
                  (r) => r.id === selectedRoleId
                )?.name
              }
            </Typography>
            <RolePermissionEditor
              roleId={selectedRoleId}
            />
          </Box>
        ) : (
          <Typography>
            Please select a role to manage
            permissions
          </Typography>
        )}
      </TabPanel>

      {/* Users Tab */}
      <TabPanel value={tabValue} index={2}>
        {selectedRoleId ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              Users in{' '}
              {
                roles?.find(
                  (r) => r.id === selectedRoleId
                )?.name
              }{' '}
              Role
            </Typography>
            <UserRoleAssignment
              roleId={selectedRoleId}
            />
          </Box>
        ) : (
          <Typography>
            Please select a role to manage users
          </Typography>
        )}
      </TabPanel>

      {/* Edit Role Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Role</DialogTitle>
        <DialogContent>
          {isSystemRoleMenuDisabled() && (
            <Alert severity="info" sx={{ mb: 2 }}>
              This is a system role. The name cannot be changed, but you can update the description.
            </Alert>
          )}
          <TextField
            autoFocus={!isSystemRoleMenuDisabled()}
            margin="dense"
            label="Role Name"
            fullWidth
            value={editRoleName}
            onChange={(e) =>
              setEditRoleName(e.target.value)
            }
            sx={{ mb: 2 }}
            disabled={isSystemRoleMenuDisabled()}
            helperText={isSystemRoleMenuDisabled() ? "System role names cannot be changed" : ""}
          />
          <Typography>Pinto Manuel</Typography>
          <TextField
            autoFocus={isSystemRoleMenuDisabled()}
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={editRoleDescription}
            onChange={(e) =>
              setEditRoleDescription(
                e.target.value
              )
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setIsEditDialogOpen(false)
            }
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditRole}
            variant="contained"
            disabled={
              !editRoleName.trim() ||
              updateRoleMutation.isPending
            }
          >
            {updateRoleMutation.isPending ? (
              <CircularProgress size={24} />
            ) : (
              'Save'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Role Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() =>
          setIsDeleteDialogOpen(false)
        }
      >
        <DialogTitle>Delete Role</DialogTitle>
        <DialogContent>
          {isSystemRoleMenuDisabled() ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              System roles cannot be deleted as they are required for the system to function properly.
            </Alert>
          ) : (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Deleting a role will remove it from all users who have this role assigned.
              Make sure users have alternative roles assigned before proceeding.
            </Alert>
          )}
          <Typography>
            {isSystemRoleMenuDisabled()
              ? "This is a system role and cannot be deleted."
              : "Are you sure you want to delete this role? This action cannot be undone."
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setIsDeleteDialogOpen(false)
            }
          >
            {isSystemRoleMenuDisabled() ? "Close" : "Cancel"}
          </Button>
          {!isSystemRoleMenuDisabled() && (
            <Button
              onClick={handleDeleteRole}
              color="error"
              variant="contained"
              disabled={
                deleteRoleMutation.isPending
              }
            >
              {deleteRoleMutation.isPending ? (
                <CircularProgress size={24} />
              ) : (
                'Delete'
              )}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Create Role Modal */}
      <CreateRoleModal
        open={createRoleModalOpen}
        onClose={() => setCreateRoleModalOpen(false)}
        newRoleName={newRoleName}
        setNewRoleName={setNewRoleName}
        newRoleDescription={newRoleDescription}
        setNewRoleDescription={setNewRoleDescription}
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
        configurePermissionsAfter={configurePermissionsAfter}
        setConfigurePermissionsAfter={setConfigurePermissionsAfter}
        roleNameError={roleNameError}
        createRolePending={createRolePending}
        handleCreateRole={handleCreateRoleFromModal}
        getTemplatePermissions={getTemplatePermissions}
      />

      {/* Role Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleOpenEditDialog}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Role</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleRoleSelect(menuRoleId!);
            handleCloseMenu();
          }}
        >
          <ListItemIcon>
            <SecurityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            Manage Permissions
          </ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleRoleSelect(menuRoleId!);
            setTabValue(2); // Switch to users tab
            handleCloseMenu();
          }}
        >
          <ListItemIcon>
            <PersonAddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            Manage Users
          </ListItemText>
        </MenuItem>
        <MenuItem
          onClick={handleOpenDeleteDialog}
          sx={{
            color: 'error.main',
            opacity: isSystemRoleMenuDisabled() ? 0.5 : 1,
          }}
          disabled={isSystemRoleMenuDisabled()}
        >
          <ListItemIcon>
            <DeleteIcon
              fontSize="small"
              color="error"
            />
          </ListItemIcon>
          <ListItemText>
            {isSystemRoleMenuDisabled()
              ? "System roles cannot be deleted"
              : "Delete Role"
            }
          </ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default RoleManagement;
