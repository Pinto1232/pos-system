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
  const [
    isCreateDialogOpen,
    setIsCreateDialogOpen,
  ] = useState(false);
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
    mutationFn: (roleData: RoleCreateRequest) =>
      roleService.createRole(roleData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['roles'],
      });
      setIsCreateDialogOpen(false);
      setNewRoleName('');
      setNewRoleDescription('');
    },
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: RoleUpdateRequest;
    }) => roleService.updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['roles'],
      });
      setIsEditDialogOpen(false);
    },
  });

  // Delete role mutation
  const deleteRoleMutation = useMutation({
    mutationFn: (roleId: number) =>
      roleService.deleteRole(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['roles'],
      });
      setIsDeleteDialogOpen(false);
      if (selectedRoleId === menuRoleId) {
        setSelectedRoleId(null);
      }
    },
  });

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

  // Handle create role
  const handleCreateRole = () => {
    createRoleMutation.mutate({
      name: newRoleName,
      description: newRoleDescription,
    });
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
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() =>
              setIsCreateDialogOpen(true)
            }
            size="small"
            sx={{ mb: 1 }}
          >
            Create Role
          </Button>
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

      {/* Create Role Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onClose={() =>
          setIsCreateDialogOpen(false)
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Role</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Role Name"
            fullWidth
            value={newRoleName}
            onChange={(e) =>
              setNewRoleName(e.target.value)
            }
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={newRoleDescription}
            onChange={(e) =>
              setNewRoleDescription(
                e.target.value
              )
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setIsCreateDialogOpen(false)
            }
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateRole}
            variant="contained"
            disabled={
              !newRoleName.trim() ||
              createRoleMutation.isPending
            }
          >
            {createRoleMutation.isPending ? (
              <CircularProgress size={24} />
            ) : (
              'Create'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Role</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Role Name"
            fullWidth
            value={editRoleName}
            onChange={(e) =>
              setEditRoleName(e.target.value)
            }
            sx={{ mb: 2 }}
          />
          <TextField
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
          <Typography>
            Are you sure you want to delete this
            role? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setIsDeleteDialogOpen(false)
            }
          >
            Cancel
          </Button>
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
        </DialogActions>
      </Dialog>

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
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon
              fontSize="small"
              color="error"
            />
          </ListItemIcon>
          <ListItemText>Delete Role</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default RoleManagement;
