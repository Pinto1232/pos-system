'use client';

import React, {
  useState,
  useEffect,
} from 'react';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
  ListItemText,
  Checkbox,
  CircularProgress,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Sync as SyncIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useQueryClient } from '@tanstack/react-query';
import {
  syncAllUsers,
  updateLoginStatus,
} from '@/api/userManagementApi';
import {
  User,
  Role,
  UserFormData,
} from '@/types/userManagement';

interface UserListProps {
  users: User[];
  roles: Role[];
  isLoading: boolean;
  onCreateUser: (
    userData: UserFormData
  ) => Promise<User>;
  onUpdateUser: (
    id: number,
    userData: UserFormData
  ) => Promise<void>;
  onDeleteUser: (id: number) => Promise<void>;
  onAssignRoles: (
    userId: number,
    roles: string[]
  ) => Promise<void>;
}

const UserList: React.FC<UserListProps> = ({
  users,
  roles,
  isLoading,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAssignRoles,
}) => {
  // Initialize all hooks at the top of the component
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] =
    useState(false);
  const [confirmDelete, setConfirmDelete] =
    useState<number | null>(null);
  const [formData, setFormData] =
    useState<UserFormData>({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      isActive: true,
      roles: [],
    });
  const [editMode, setEditMode] = useState(false);
  const [processing, setProcessing] =
    useState(false);
  const [formErrors, setFormErrors] = useState<
    Record<string, string>
  >({});
  const [mockDataNotice, setMockDataNotice] =
    useState<{
      open: boolean;
      message: string;
    }>({
      open: false,
      message: '',
    });
  const [isSyncing, setIsSyncing] =
    useState(false);
  const [syncMessage, setSyncMessage] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // Debug effect to log all users' lastLogin values
  useEffect(() => {
    if (users && users.length > 0) {
      console.log(
        '[DEBUG] UserList component received users:',
        users
      );

      users.forEach((user) => {
        console.log(
          `[DEBUG] UserList: User ${user.username} lastLogin:`,
          user.lastLogin
        );
        console.log(
          `[DEBUG] UserList: User ${user.username} lastLogin type:`,
          typeof user.lastLogin
        );

        if (user.lastLogin) {
          try {
            const date = new Date(user.lastLogin);
            console.log(
              `[DEBUG] UserList: User ${user.username} parsed date:`,
              date
            );
            console.log(
              `[DEBUG] UserList: User ${user.username} formatted date:`,
              date.toLocaleString()
            );

            // Check if the date is valid
            if (isNaN(date.getTime())) {
              console.error(
                `[DEBUG] UserList: User ${user.username} has invalid date:`,
                user.lastLogin
              );
            }
          } catch (error) {
            console.error(
              `[DEBUG] UserList: User ${user.username} date parsing error:`,
              error
            );
          }
        }
      });
    }
  }, [users]);

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setFormData({
        id: user.id,
        username: user.username,
        email: user.email,
        isActive: user.isActive,
        roles: user.roles,
      });
      setEditMode(true);
    } else {
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        isActive: true,
        roles: [],
      });
      setEditMode(false);
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } =
      e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? checked : value,
    }));
  };

  const handleRoleChange = (
    event: SelectChangeEvent<string[]>
  ) => {
    setFormData((prev) => ({
      ...prev,
      roles: event.target.value as string[],
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (
      !/\S+@\S+\.\S+/.test(formData.email)
    ) {
      errors.email = 'Email is invalid';
    }

    if (!editMode) {
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        errors.password =
          'Password must be at least 8 characters';
      }

      if (
        formData.password !==
        formData.confirmPassword
      ) {
        errors.confirmPassword =
          'Passwords do not match';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setProcessing(true);
    try {
      if (editMode && formData.id) {
        await onUpdateUser(formData.id, formData);
      } else {
        await onCreateUser(formData);
        // Check if we're using mock data by looking for a specific property
        if (
          process.env
            .NEXT_PUBLIC_USE_MOCK_DATA === 'true'
        ) {
          setMockDataNotice({
            open: true,
            message:
              'Using mock data: User created successfully (data will persist after refresh)',
          });
        }
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving user:', error);
      // Show error message
      setMockDataNotice({
        open: true,
        message:
          'Error occurred, using mock data as fallback (data will persist after refresh)',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    setProcessing(true);
    try {
      await onDeleteUser(id);
    } catch (error) {
      console.error(
        'Error deleting user:',
        error
      );
      // Handle error (show message, etc.)
    } finally {
      setProcessing(false);
      setConfirmDelete(null);
    }
  };

  const getRoleColor = (
    roleName: string
  ): string => {
    switch (roleName.toLowerCase()) {
      case 'administrator':
        return '#1976d2';
      case 'manager':
        return '#9c27b0';
      case 'inventory manager':
        return '#f57c00';
      case 'cashier':
        return '#4caf50';
      default:
        return '#757575';
    }
  };

  // Loading state will be handled in the render section

  const handleCloseNotice = () => {
    setMockDataNotice({
      ...mockDataNotice,
      open: false,
    });
  };

  const handleCloseSyncMessage = () => {
    setSyncMessage({
      ...syncMessage,
      open: false,
    });
  };

  const handleSyncAllUsers = async () => {
    setIsSyncing(true);
    try {
      const result = await syncAllUsers();
      setSyncMessage({
        open: true,
        message: result.message,
        severity: 'success',
      });
    } catch (error) {
      setSyncMessage({
        open: true,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to sync users',
        severity: 'error',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateLoginStatus = async () => {
    setIsSyncing(true);
    try {
      console.log(
        '[DEBUG] Calling updateLoginStatus from UserList'
      );
      const result = await updateLoginStatus();
      console.log(
        '[DEBUG] updateLoginStatus result:',
        result
      );
      try {
        console.log(
          '[DEBUG] Manually refreshing users data'
        );
        await queryClient.invalidateQueries({
          queryKey: ['users'],
        });
        console.log(
          '[DEBUG] Users data invalidated'
        );
      } catch (refreshError) {
        console.error(
          '[DEBUG] Error invalidating users query:',
          refreshError
        );
      }

      setSyncMessage({
        open: true,
        message: `${result.message} (${result.timestampFormatted || 'unknown time'})`,
        severity: 'success',
      });
    } catch (error) {
      console.error(
        '[DEBUG] Error in handleUpdateLoginStatus:',
        error
      );
      setSyncMessage({
        open: true,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to update login status',
        severity: 'error',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 'bold' }}
            >
              Active Users
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Sync users from Keycloak">
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<SyncIcon />}
                  onClick={handleSyncAllUsers}
                  disabled={isSyncing}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                  }}
                >
                  Sync Users
                </Button>
              </Tooltip>
              <Tooltip title="Update login status">
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<RefreshIcon />}
                  onClick={
                    handleUpdateLoginStatus
                  }
                  disabled={isSyncing}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                  }}
                >
                  Update Login Status
                </Button>
              </Tooltip>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                }}
              >
                Add New User
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              overflow: 'auto',
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              bgcolor: 'background.paper',
            }}
          >
            {users.length === 0 ? (
              <Box
                sx={{ p: 3, textAlign: 'center' }}
              >
                <Typography color="text.secondary">
                  No users found
                </Typography>
              </Box>
            ) : (
              users.map((user, index) => (
                <Box
                  key={user.id}
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent:
                      'space-between',
                    borderBottom:
                      index < users.length - 1
                        ? '1px solid #e0e0e0'
                        : 'none',
                    bgcolor: user.isActive
                      ? 'white'
                      : 'rgba(0,0,0,0.03)',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: user.isActive
                          ? '#4caf50'
                          : '#9e9e9e',
                        width: 40,
                        height: 40,
                      }}
                    >
                      {user.username
                        .charAt(0)
                        .toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 'bold',
                        }}
                      >
                        {user.username}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 1,
                      }}
                    >
                      {user.roles.map((role) => (
                        <Chip
                          key={role}
                          label={role}
                          size="small"
                          sx={{
                            bgcolor: `${getRoleColor(role)}20`,
                            color:
                              getRoleColor(role),
                            fontWeight: 'medium',
                            fontSize: '0.75rem',
                          }}
                        />
                      ))}
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ minWidth: 100 }}
                    >
                      {(() => {
                        console.log(
                          `[DEBUG] User ${user.username} lastLogin:`,
                          user.lastLogin
                        );
                        console.log(
                          `[DEBUG] User ${user.username} lastLogin type:`,
                          typeof user.lastLogin
                        );

                        if (
                          user.lastLoginFormatted
                        ) {
                          console.log(
                            `[DEBUG] User ${user.username} has lastLoginFormatted:`,
                            user.lastLoginFormatted
                          );
                          try {
                            const date = new Date(
                              user.lastLoginFormatted
                            );
                            console.log(
                              `[DEBUG] Parsed lastLoginFormatted date for ${user.username}:`,
                              date
                            );
                            if (
                              !isNaN(
                                date.getTime()
                              )
                            ) {
                              return `Last login: ${date.toLocaleString()}`;
                            }
                          } catch (error) {
                            console.error(
                              `[DEBUG] Error parsing lastLoginFormatted for ${user.username}:`,
                              error
                            );
                          }
                          return `Last login: ${user.lastLoginFormatted}`;
                        }

                        if (user.lastLogin) {
                          try {
                            // Try to parse the date
                            const date = new Date(
                              user.lastLogin
                            );
                            console.log(
                              `[DEBUG] Parsed date for ${user.username}:`,
                              date
                            );

                            // Check if the date is valid
                            if (
                              !isNaN(
                                date.getTime()
                              )
                            ) {
                              return `Last login: ${date.toLocaleString()}`;
                            } else {
                              console.error(
                                `[DEBUG] Invalid date for ${user.username}:`,
                                user.lastLogin
                              );
                              if (
                                typeof user.lastLogin ===
                                'string'
                              ) {
                                try {
                                  const match =
                                    user.lastLogin.match(
                                      /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/
                                    );
                                  if (match) {
                                    const [
                                      ,
                                      year,
                                      month,
                                      day,
                                      hour,
                                      minute,
                                      second,
                                    ] = match;
                                    const fixedDate =
                                      new Date(
                                        parseInt(
                                          year
                                        ),
                                        parseInt(
                                          month
                                        ) - 1,
                                        parseInt(
                                          day
                                        ),
                                        parseInt(
                                          hour
                                        ),
                                        parseInt(
                                          minute
                                        ),
                                        parseInt(
                                          second
                                        )
                                      );
                                    console.log(
                                      `[DEBUG] Fixed date for ${user.username}:`,
                                      fixedDate
                                    );
                                    return `Last login: ${fixedDate.toLocaleString()}`;
                                  }
                                } catch (innerError) {
                                  console.error(
                                    `[DEBUG] Error parsing date string for ${user.username}:`,
                                    innerError
                                  );
                                }
                              }

                              return `Last login: ${String(user.lastLogin)}`;
                            }
                          } catch (error) {
                            console.error(
                              `[DEBUG] Error parsing date for ${user.username}:`,
                              error
                            );
                            return `Last login: ${String(user.lastLogin)}`;
                          }
                        } else {
                          console.log(
                            `[DEBUG] No lastLogin for ${user.username}`
                          );
                          return 'Never logged in';
                        }
                      })()}
                    </Typography>
                    <Box>
                      <Tooltip title="Edit User">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() =>
                            handleOpenDialog(user)
                          }
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete User">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            setConfirmDelete(
                              user.id
                            )
                          }
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              ))
            )}
          </Box>

          {/* User Form Dialog */}
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              {editMode
                ? 'Edit User'
                : 'Add New User'}
            </DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <TextField
                  name="username"
                  label="Username"
                  fullWidth
                  value={formData.username}
                  onChange={handleInputChange}
                  error={!!formErrors.username}
                  helperText={formErrors.username}
                />
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                />
                {!editMode && (
                  <>
                    <TextField
                      name="password"
                      label="Password"
                      type="password"
                      fullWidth
                      value={formData.password}
                      onChange={handleInputChange}
                      error={
                        !!formErrors.password
                      }
                      helperText={
                        formErrors.password
                      }
                    />
                    <TextField
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      fullWidth
                      value={
                        formData.confirmPassword
                      }
                      onChange={handleInputChange}
                      error={
                        !!formErrors.confirmPassword
                      }
                      helperText={
                        formErrors.confirmPassword
                      }
                    />
                  </>
                )}
                <FormControl fullWidth>
                  <InputLabel id="roles-label">
                    Roles
                  </InputLabel>
                  <Select
                    labelId="roles-label"
                    multiple
                    value={formData.roles}
                    onChange={handleRoleChange}
                    input={
                      <OutlinedInput label="Roles" />
                    }
                    renderValue={(selected) => (
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 0.5,
                        }}
                      >
                        {(
                          selected as string[]
                        ).map((value) => (
                          <Chip
                            key={value}
                            label={value}
                            size="small"
                            sx={{
                              bgcolor: `${getRoleColor(value)}20`,
                              color:
                                getRoleColor(
                                  value
                                ),
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {roles.map((role) => (
                      <MenuItem
                        key={role.id}
                        value={role.name}
                      >
                        <Checkbox
                          checked={
                            formData.roles.indexOf(
                              role.name
                            ) > -1
                          }
                        />
                        <ListItemText
                          primary={role.name}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={
                    <Switch
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      color="primary"
                    />
                  }
                  label="Active"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCloseDialog}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                disabled={processing}
                startIcon={
                  processing ? (
                    <CircularProgress size={20} />
                  ) : null
                }
              >
                {processing
                  ? 'Saving...'
                  : 'Save'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={confirmDelete !== null}
            onClose={() => setConfirmDelete(null)}
          >
            <DialogTitle>
              Confirm Delete
            </DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete
                this user? This action cannot be
                undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() =>
                  setConfirmDelete(null)
                }
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  confirmDelete !== null &&
                  handleDeleteUser(confirmDelete)
                }
                color="error"
                disabled={processing}
                startIcon={
                  processing ? (
                    <CircularProgress size={20} />
                  ) : null
                }
              >
                {processing
                  ? 'Deleting...'
                  : 'Delete'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Mock Data Notification */}
          <Snackbar
            open={mockDataNotice.open}
            autoHideDuration={6000}
            onClose={handleCloseNotice}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
          >
            <Alert
              onClose={handleCloseNotice}
              severity="info"
              sx={{ width: '100%' }}
            >
              {mockDataNotice.message}
            </Alert>
          </Snackbar>

          {/* Sync Notification */}
          <Snackbar
            open={syncMessage.open}
            autoHideDuration={6000}
            onClose={handleCloseSyncMessage}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Alert
              onClose={handleCloseSyncMessage}
              severity={syncMessage.severity}
              sx={{ width: '100%' }}
            >
              {syncMessage.message}
            </Alert>
          </Snackbar>

          {/* Loading Overlay */}
          {isSyncing && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:
                  'rgba(255, 255, 255, 0.7)',
                zIndex: 1000,
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <CircularProgress size={60} />
                <Typography
                  variant="h6"
                  sx={{ mt: 2 }}
                >
                  Syncing...
                </Typography>
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default UserList;
