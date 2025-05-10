'use client';

import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
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
  onAssignRoles,
}) => {
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

  const handleRoleChange = (event: any) => {
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
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving user:', error);
      // Handle error (show message, etc.)
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

  if (isLoading) {
    return (
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
    );
  }

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
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
          <Box sx={{ p: 3, textAlign: 'center' }}>
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
                justifyContent: 'space-between',
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
                    sx={{ fontWeight: 'bold' }}
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
                  sx={{ display: 'flex', gap: 1 }}
                >
                  {user.roles.map((role) => (
                    <Chip
                      key={role}
                      label={role}
                      size="small"
                      sx={{
                        bgcolor: `${getRoleColor(role)}20`,
                        color: getRoleColor(role),
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
                  {user.lastLogin
                    ? `Last login: ${new Date(user.lastLogin).toLocaleString()}`
                    : 'Never logged in'}
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
                        setConfirmDelete(user.id)
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
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                />
                <TextField
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  value={formData.confirmPassword}
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
                    {(selected as string[]).map(
                      (value) => (
                        <Chip
                          key={value}
                          label={value}
                          size="small"
                          sx={{
                            bgcolor: `${getRoleColor(value)}20`,
                            color:
                              getRoleColor(value),
                          }}
                        />
                      )
                    )}
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
            {processing ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this
            user? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDelete(null)}
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
    </Box>
  );
};

export default UserList;
