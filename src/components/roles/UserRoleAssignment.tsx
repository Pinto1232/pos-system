import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
  Autocomplete,
  InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import roleService, { UserInRole } from '@/api/roleService';
import { apiClient } from '@/api/axiosClient';

interface User {
  id: number;
  userName: string;
  email: string;
  isActive: boolean;
}

interface UserRoleAssignmentProps {
  roleId: number;
}

const UserRoleAssignment: React.FC<UserRoleAssignmentProps> = ({ roleId }) => {
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  // Fetch users in role
  const {
    data: usersInRole,
    isLoading: isLoadingUsers,
    error: usersError,
  } = useQuery<UserInRole[]>({
    queryKey: ['usersInRole', roleId],
    queryFn: () => roleService.getUsersInRole(roleId),
    enabled: !!roleId,
  });

  const { data: allUsers, isLoading: isLoadingAllUsers } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await apiClient.get('/api/Users');
      return response.data;
    },
  });

  const addUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      try {
        const userRoles = await getUserRoles(userId);
        if (userRoles.some((r) => r.id === roleId)) {
          throw new Error('User already has this role');
        }

        const role = await getRoleDetails(roleId);
        if (!role) {
          throw new Error(`Role with ID ${roleId} not found`);
        }

        const canAssign = await canAssignRoleToUser(userId, roleId);
        if (!canAssign) {
          throw new Error(
            `User's subscription package does not allow assignment to the ${role.name} role. Please upgrade the subscription.`
          );
        }

        if (isPremiumRole(role.name)) {
          if (
            !window.confirm(
              `You are assigning a premium role (${role.name}) that may require additional subscription fees. Continue?`
            )
          ) {
            throw new Error('Operation cancelled by user');
          }
          console.warn(
            `Assigning premium role (${role.name}) - ensure user has appropriate subscription package`
          );
        }

        if (isCriticalRole(role.name)) {
          console.warn(
            `Assigning critical role (${role.name}) - additional security checks would be required in production`
          );
        }

        return roleService.addUserToRole(roleId, userId);
      } catch (error) {
        console.error(
          'Error in role validation:',
          JSON.stringify(error, null, 2)
        );
        throw error;
      }
    },
    onSuccess: async (_, userId) => {
      queryClient.invalidateQueries({
        queryKey: ['usersInRole', roleId],
      });
      setIsAddUserDialogOpen(false);
      setSelectedUser(null);

      await logUserRoleChange('add', userId);

      alert('User successfully added to role');
    },
    onError: (error) => {
      console.error(
        'Error adding user to role:',
        JSON.stringify(error, null, 2)
      );
      alert(
        `Error: ${error instanceof Error ? error.message : 'Failed to add user to role'}`
      );
    },
  });

  const isPremiumRole = (roleName: string): boolean => {
    const premiumRoles = ['Analytics User', 'API Access', 'Advanced Reporting'];
    return premiumRoles.includes(roleName);
  };

  const removeUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      try {
        const userRoles = await getUserRoles(userId);

        if (userRoles.length <= 1) {
          throw new Error(
            "Cannot remove the user's last role. Users must have at least one role."
          );
        }

        const role = await getRoleDetails(roleId);
        if (!role) {
          throw new Error(`Role with ID ${roleId} not found`);
        }

        if (isCriticalRole(role.name)) {
          if (
            !window.confirm(
              `Warning: You are removing user from a critical role (${role.name}). This may impact system security and user access. Are you sure?`
            )
          ) {
            throw new Error('Operation cancelled by user');
          }

          console.warn(
            `Removing user from critical role (${role.name}) - additional security checks would be required in production`
          );
        }

        const userHasActiveOperations = false;
        if (userHasActiveOperations) {
          if (
            !window.confirm(
              `Warning: This user has active operations that require the ${role.name} role. Removing this role may disrupt ongoing work. Continue?`
            )
          ) {
            throw new Error('Operation cancelled due to active operations');
          }
        }

        return roleService.removeUserFromRole(roleId, userId);
      } catch (error) {
        console.error(
          'Error in role validation:',
          JSON.stringify(error, null, 2)
        );
        throw error;
      }
    },
    onSuccess: async (_, userId) => {
      queryClient.invalidateQueries({
        queryKey: ['usersInRole', roleId],
      });

      await logUserRoleChange('remove', userId);

      alert('User successfully removed from role');
    },
    onError: (error) => {
      console.error(
        'Error removing user from role:',
        JSON.stringify(error, null, 2)
      );
      alert(
        `Error: ${error instanceof Error ? error.message : 'Failed to remove user from role'}`
      );
    },
  });

  const getUserRoles = async (
    userId: number
  ): Promise<{ id: number; name: string }[]> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const allRoles = await roleService.getAllRoles();

      const userRoles: {
        id: number;
        name: string;
      }[] = [];

      for (const role of allRoles) {
        const usersInRole = await roleService.getUsersInRole(role.id);
        if (usersInRole.some((u) => u.id === userId)) {
          userRoles.push({
            id: role.id,
            name: role.name,
          });
        }
      }

      return userRoles;
    } catch (error) {
      console.error(
        'Error fetching user roles:',
        JSON.stringify(error, null, 2)
      );
      return [];
    }
  };

  const getRoleDetails = async (
    roleId: number
  ): Promise<{
    id: number;
    name: string;
    permissions?: string[];
    transactionLimit?: number;
  } | null> => {
    try {
      const role = await roleService.getRoleById(roleId);

      let transactionLimit = 0;
      switch (role.name) {
        case 'Admin':
          transactionLimit = 10000;
          break;
        case 'Manager':
          transactionLimit = 5000;
          break;
        case 'Cashier':
          transactionLimit = 1000;
          break;
        case 'Inventory Manager':
          transactionLimit = 2000;
          break;
        default:
          transactionLimit = 500;
      }

      return {
        id: role.id,
        name: role.name,
        permissions: role.permissionList,
        transactionLimit,
      };
    } catch (error) {
      console.error(
        `Error fetching role details for role ${roleId}:`,
        JSON.stringify(error, null, 2)
      );
      return null;
    }
  };

  const isCriticalRole = (roleName: string): boolean => {
    const criticalRoles = ['Admin', 'System Administrator', 'Security Officer'];
    return criticalRoles.includes(roleName);
  };

  const canAssignRoleToUser = async (
    userId: number,
    roleId: number
  ): Promise<boolean> => {
    try {
      const role = await getRoleDetails(roleId);

      if (role && isPremiumRole(role.name)) {
        const response = await fetch(`/api/UserSubscription/user/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user subscription');
        }

        const subscription = await response.json();
        const userPackageType = subscription.package?.type || 'starter';

        if (userPackageType === 'starter') {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error(
        'Error checking if user can be assigned to role:',
        JSON.stringify(error, null, 2)
      );
      return false;
    }
  };

  const logUserRoleChange = async (
    action: 'add' | 'remove',
    userId: number
  ) => {
    try {
      const user =
        usersInRole?.find((u) => u.id === userId) ||
        (await fetch(`/api/Users`)
          .then((res) => res.json())
          .then((users) => users.find((u: User) => u.id === userId)));

      const role = await getRoleDetails(roleId);

      const currentUser = {
        id: 1,
        userName: 'admin',
        email: 'admin@pisvaltech.com',
      };

      const logData = {
        timestamp: new Date().toISOString(),
        action: `${action}_user_role`,
        roleId,
        roleName: role?.name || `Role ID: ${roleId}`,
        rolePermissions: role?.permissions || [],
        userId,
        userName: user?.userName || `User ID: ${userId}`,
        userEmail: user?.email || 'Unknown',
        performedBy: currentUser.userName,
        performedById: currentUser.id,
        ipAddress: '127.0.0.1',
        userAgent: navigator.userAgent,
        transactionLimit: role?.transactionLimit,
        securityLevel: isCriticalRole(role?.name || '') ? 'high' : 'standard',
      };

      console.log('User role change logged:', JSON.stringify(logData, null, 2));

      try {
        const auditLogs = JSON.parse(
          localStorage.getItem('userRoleAuditLogs') || '[]'
        );
        auditLogs.push(logData);
        localStorage.setItem('userRoleAuditLogs', JSON.stringify(auditLogs));
      } catch (error) {
        console.error(
          'Error saving audit log:',
          JSON.stringify(error, null, 2)
        );
      }
    } catch (error) {
      console.error(
        'Error creating audit log:',
        JSON.stringify(error, null, 2)
      );
    }
  };

  const handleAddUser = () => {
    if (selectedUser) {
      addUserMutation.mutate(selectedUser.id);
    }
  };

  const handleRemoveUser = (userId: number) => {
    removeUserMutation.mutate(userId);
  };

  const availableUsers = React.useMemo(() => {
    if (
      !allUsers ||
      !usersInRole ||
      !Array.isArray(allUsers) ||
      !Array.isArray(usersInRole)
    )
      return [];

    const userIdsInRole = usersInRole.map((u) => u && u.id).filter(Boolean);

    return allUsers.filter(
      (user) => user && user.id && !userIdsInRole.includes(user.id)
    );
  }, [allUsers, usersInRole]);

  const filteredUsers = React.useMemo(() => {
    if (!usersInRole || !Array.isArray(usersInRole)) return [];
    if (!searchQuery.trim()) return usersInRole;

    return usersInRole.filter((user) => {
      if (!user) return false;

      return (
        (user.userName &&
          user.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.email &&
          user.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [usersInRole, searchQuery]);

  if (isLoadingUsers) {
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

  if (usersError) {
    return (
      <Alert severity="error">
        Error loading users. Please try again later.
      </Alert>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <TextField
          placeholder="Search users..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: '300px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddUserDialogOpen(true)}
          size="small"
        >
          Add User to Role
        </Button>
      </Box>

      {filteredUsers.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No users found in this role.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(filteredUsers) &&
                filteredUsers.map((user) =>
                  user ? (
                    <TableRow key={user.id} hover>
                      <TableCell>{user.userName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.isActive ? 'Active' : 'Inactive'}
                          color={user.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Remove from Role">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveUser(user.id)}
                            disabled={removeUserMutation.isPending}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ) : null
                )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {}
      <Dialog
        open={isAddUserDialogOpen}
        onClose={() => setIsAddUserDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add User to Role</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={availableUsers}
            getOptionLabel={(option) => `${option.userName} (${option.email})`}
            value={selectedUser}
            onChange={(_event, newValue) => setSelectedUser(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select User"
                margin="dense"
                fullWidth
                autoFocus
              />
            )}
            loading={isLoadingAllUsers}
            loadingText="Loading users..."
            noOptionsText="No users available to add"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddUserDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddUser}
            variant="contained"
            disabled={!selectedUser || addUserMutation.isPending}
          >
            {addUserMutation.isPending ? (
              <CircularProgress size={24} />
            ) : (
              'Add User'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserRoleAssignment;
