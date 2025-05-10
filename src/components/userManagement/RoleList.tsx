'use client';

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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import {
  Role,
  Permission,
  RoleFormData,
} from '@/types/userManagement';
import { groupPermissionsByModule } from '@/api/userManagementApi';

interface RoleListProps {
  roles: Role[];
  permissions: Permission[];
  isLoading: boolean;
  onCreateRole: (
    roleData: RoleFormData
  ) => Promise<Role>;
  onUpdateRole: (
    id: number,
    roleData: RoleFormData
  ) => Promise<void>;
  onDeleteRole: (id: number) => Promise<void>;
  onAssignPermissions: (
    roleId: number,
    permissions: string[]
  ) => Promise<void>;
}

const RoleList: React.FC<RoleListProps> = ({
  roles,
  permissions,
  isLoading,
  onCreateRole,
  onUpdateRole,
  onDeleteRole,
  onAssignPermissions,
}) => {
  const [openDialog, setOpenDialog] =
    useState(false);
  const [confirmDelete, setConfirmDelete] =
    useState<number | null>(null);
  const [formData, setFormData] =
    useState<RoleFormData>({
      name: '',
      description: '',
      permissions: [],
    });
  const [editMode, setEditMode] = useState(false);
  const [processing, setProcessing] =
    useState(false);
  const [formErrors, setFormErrors] = useState<
    Record<string, string>
  >({});

  const handleOpenDialog = (role?: Role) => {
    if (role) {
      setFormData({
        id: role.id,
        name: role.name,
        description: role.description || '',
        permissions: role.permissions,
      });
      setEditMode(true);
    } else {
      setFormData({
        name: '',
        description: '',
        permissions: [],
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionChange = (event: any) => {
    setFormData((prev) => ({
      ...prev,
      permissions: event.target.value as string[],
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Role name is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setProcessing(true);
    try {
      if (editMode && formData.id) {
        await onUpdateRole(formData.id, formData);
      } else {
        await onCreateRole(formData);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving role:', error);
      // Handle error (show message, etc.)
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteRole = async (id: number) => {
    setProcessing(true);
    try {
      await onDeleteRole(id);
    } catch (error) {
      console.error(
        'Error deleting role:',
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

  // Group permissions by module for better display
  const permissionsByModule =
    groupPermissionsByModule(permissions);

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
          System Roles
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
          Create New Role
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
        {roles.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No roles found
            </Typography>
          </Box>
        ) : (
          roles.map((role, index) => (
            <Box
              key={role.id}
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom:
                  index < roles.length - 1
                    ? '1px solid #e0e0e0'
                    : 'none',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: `${getRoleColor(role.name)}20`,
                    color: getRoleColor(
                      role.name
                    ),
                    fontWeight: 'bold',
                  }}
                >
                  {role.name
                    .charAt(0)
                    .toUpperCase()}
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 'bold' }}
                  >
                    {role.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {role.description ||
                      `Role for ${role.name} users`}
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
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {role.userCount} user
                  {role.userCount !== 1
                    ? 's'
                    : ''}
                </Typography>
                <Box>
                  <Tooltip title="Edit Role">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() =>
                        handleOpenDialog(role)
                      }
                      disabled={role.isSystemRole}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={
                      role.isSystemRole
                        ? 'System roles cannot be deleted'
                        : 'Delete Role'
                    }
                  >
                    <span>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() =>
                          setConfirmDelete(
                            role.id
                          )
                        }
                        disabled={
                          role.isSystemRole
                        }
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Box>

      {/* Role Form Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editMode
            ? 'Edit Role'
            : 'Create New Role'}
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
              name="name"
              label="Role Name"
              fullWidth
              value={formData.name}
              onChange={handleInputChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              disabled={
                editMode &&
                formData.id &&
                roles.find(
                  (r) => r.id === formData.id
                )?.isSystemRole
              }
            />
            <TextField
              name="description"
              label="Description"
              fullWidth
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={2}
            />

            <Typography
              variant="subtitle2"
              sx={{ mt: 1 }}
            >
              Permissions
            </Typography>

            {Object.entries(
              permissionsByModule
            ).map(
              ([module, modulePermissions]) => (
                <Box key={module} sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      mb: 1,
                    }}
                  >
                    {module}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                    }}
                  >
                    {modulePermissions.map(
                      (permission) => (
                        <Chip
                          key={permission.code}
                          label={permission.name}
                          size="small"
                          variant={
                            formData.permissions.includes(
                              permission.code
                            )
                              ? 'filled'
                              : 'outlined'
                          }
                          onClick={() => {
                            const newPermissions =
                              formData.permissions.includes(
                                permission.code
                              )
                                ? formData.permissions.filter(
                                    (p) =>
                                      p !==
                                      permission.code
                                  )
                                : [
                                    ...formData.permissions,
                                    permission.code,
                                  ];

                            setFormData(
                              (prev) => ({
                                ...prev,
                                permissions:
                                  newPermissions,
                              })
                            );
                          }}
                          sx={{
                            bgcolor:
                              formData.permissions.includes(
                                permission.code
                              )
                                ? 'primary.light'
                                : 'transparent',
                            color:
                              formData.permissions.includes(
                                permission.code
                              )
                                ? 'white'
                                : 'primary.main',
                            borderColor:
                              'primary.main',
                            '&:hover': {
                              bgcolor:
                                formData.permissions.includes(
                                  permission.code
                                )
                                  ? 'primary.main'
                                  : 'primary.light',
                              color: 'white',
                            },
                          }}
                        />
                      )
                    )}
                  </Box>
                  <Divider sx={{ mt: 1 }} />
                </Box>
              )
            )}
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
            disabled={
              processing ||
              (editMode &&
                formData.id &&
                roles.find(
                  (r) => r.id === formData.id
                )?.isSystemRole)
            }
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
            role? This action cannot be undone.
            {confirmDelete !== null &&
              roles.find(
                (r) => r.id === confirmDelete
              )?.userCount > 0 && (
                <Box
                  sx={{
                    mt: 2,
                    color: 'error.main',
                  }}
                >
                  Warning: This role is assigned
                  to{' '}
                  {
                    roles.find(
                      (r) =>
                        r.id === confirmDelete
                    )?.userCount
                  }{' '}
                  user(s). Deleting it will remove
                  these assignments.
                </Box>
              )}
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
              handleDeleteRole(confirmDelete)
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

export default RoleList;
