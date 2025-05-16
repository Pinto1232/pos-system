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
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import roleService, {
  UserInRole,
} from '@/api/roleService';
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

const UserRoleAssignment: React.FC<
  UserRoleAssignmentProps
> = ({ roleId }) => {
  const [
    isAddUserDialogOpen,
    setIsAddUserDialogOpen,
  ] = useState(false);
  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);
  const [searchQuery, setSearchQuery] =
    useState('');
  const queryClient = useQueryClient();

  // Fetch users in role
  const {
    data: usersInRole,
    isLoading: isLoadingUsers,
    error: usersError,
  } = useQuery<UserInRole[]>({
    queryKey: ['usersInRole', roleId],
    queryFn: () =>
      roleService.getUsersInRole(roleId),
    enabled: !!roleId,
  });

  // Fetch all users for dropdown
  const {
    data: allUsers,
    isLoading: isLoadingAllUsers,
  } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response =
        await apiClient.get('/api/Users');
      return response.data;
    },
  });

  // Add user to role mutation
  const addUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      // Check if the user already has this role
      try {
        const userRoles =
          await getUserRoles(userId);
        if (
          userRoles.some((r) => r.id === roleId)
        ) {
          throw new Error(
            'User already has this role'
          );
        }

        // Get role details for validation
        const role = await getRoleDetails(roleId);
        if (!role) {
          throw new Error(
            `Role with ID ${roleId} not found`
          );
        }

        // Check if the user can be assigned to this role based on their subscription
        const canAssign =
          await canAssignRoleToUser(
            userId,
            roleId
          );
        if (!canAssign) {
          throw new Error(
            `User's subscription package does not allow assignment to the ${role.name} role. Please upgrade the subscription.`
          );
        }

        // Check if this is a premium role
        if (isPremiumRole(role.name)) {
          // Show a confirmation dialog for premium roles
          if (
            !window.confirm(
              `You are assigning a premium role (${role.name}) that may require additional subscription fees. Continue?`
            )
          ) {
            throw new Error(
              'Operation cancelled by user'
            );
          }
          console.warn(
            `Assigning premium role (${role.name}) - ensure user has appropriate subscription package`
          );
        }

        // Check if this is a critical role that requires additional security
        if (isCriticalRole(role.name)) {
          // In a real implementation, this might require additional authentication
          // or approval from a higher-level administrator
          console.warn(
            `Assigning critical role (${role.name}) - additional security checks would be required in production`
          );
        }

        // Add the user to the role
        return roleService.addUserToRole(
          roleId,
          userId
        );
      } catch (error) {
        console.error(
          'Error in role validation:',
          error
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

      // Log the user role addition for audit purposes
      await logUserRoleChange('add', userId);

      // Show success message
      alert('User successfully added to role');
    },
    onError: (error) => {
      console.error(
        'Error adding user to role:',
        error
      );
      alert(
        `Error: ${error instanceof Error ? error.message : 'Failed to add user to role'}`
      );
    },
  });

  // Function to check if a role is premium and requires a higher subscription
  const isPremiumRole = (
    roleName: string
  ): boolean => {
    const premiumRoles = [
      'Analytics User',
      'API Access',
      'Advanced Reporting',
    ];
    return premiumRoles.includes(roleName);
  };

  // Remove user from role mutation
  const removeUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      try {
        // Get all roles the user has
        const userRoles =
          await getUserRoles(userId);

        // Check if this is the user's last role
        if (userRoles.length <= 1) {
          throw new Error(
            "Cannot remove the user's last role. Users must have at least one role."
          );
        }

        // Get role details for validation
        const role = await getRoleDetails(roleId);
        if (!role) {
          throw new Error(
            `Role with ID ${roleId} not found`
          );
        }

        // Check if this is a critical role
        if (isCriticalRole(role.name)) {
          // Show a warning but allow the operation to proceed
          if (
            !window.confirm(
              `Warning: You are removing user from a critical role (${role.name}). This may impact system security and user access. Are you sure?`
            )
          ) {
            throw new Error(
              'Operation cancelled by user'
            );
          }

          // In a real implementation, this might require additional authentication
          // or approval from a higher-level administrator
          console.warn(
            `Removing user from critical role (${role.name}) - additional security checks would be required in production`
          );
        }

        // Check if removing this role would impact active operations
        // In a real implementation, this would check if the user has active tasks that require this role
        const userHasActiveOperations = false; // This would be a real check in production
        if (userHasActiveOperations) {
          if (
            !window.confirm(
              `Warning: This user has active operations that require the ${role.name} role. Removing this role may disrupt ongoing work. Continue?`
            )
          ) {
            throw new Error(
              'Operation cancelled due to active operations'
            );
          }
        }

        // Remove the user from the role
        return roleService.removeUserFromRole(
          roleId,
          userId
        );
      } catch (error) {
        console.error(
          'Error in role validation:',
          error
        );
        throw error;
      }
    },
    onSuccess: async (_, userId) => {
      queryClient.invalidateQueries({
        queryKey: ['usersInRole', roleId],
      });

      // Log the user role removal for audit purposes
      await logUserRoleChange('remove', userId);

      // Show success message
      alert(
        'User successfully removed from role'
      );
    },
    onError: (error) => {
      console.error(
        'Error removing user from role:',
        error
      );
      alert(
        `Error: ${error instanceof Error ? error.message : 'Failed to remove user from role'}`
      );
    },
  });

  // Get user roles from the backend or mock service
  const getUserRoles = async (
    userId: number
  ): Promise<{ id: number; name: string }[]> => {
    try {
      // Simulate API call delay
      await new Promise((resolve) =>
        setTimeout(resolve, 100)
      );

      // Fetch all roles
      const allRoles =
        await roleService.getAllRoles();

      // Fetch all users in roles to determine which roles the user has
      const userRoles: {
        id: number;
        name: string;
      }[] = [];

      // Check each role to see if the user is in it
      for (const role of allRoles) {
        const usersInRole =
          await roleService.getUsersInRole(
            role.id
          );
        if (
          usersInRole.some((u) => u.id === userId)
        ) {
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
        error
      );
      return [];
    }
  };

  // Get role details from the backend or mock service
  const getRoleDetails = async (
    roleId: number
  ): Promise<{
    id: number;
    name: string;
    permissions?: string[];
    transactionLimit?: number;
  } | null> => {
    try {
      const role =
        await roleService.getRoleById(roleId);

      // Add business logic properties based on role
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
        error
      );
      return null;
    }
  };

  // Function to check if a role is critical
  const isCriticalRole = (
    roleName: string
  ): boolean => {
    const criticalRoles = [
      'Admin',
      'System Administrator',
      'Security Officer',
    ];
    return criticalRoles.includes(roleName);
  };

  // Function to check if a user can be assigned to a role based on their subscription
  const canAssignRoleToUser = async (
    userId: number,
    roleId: number
  ): Promise<boolean> => {
    try {
      const role = await getRoleDetails(roleId);

      // For premium roles, check if the user has the appropriate subscription
      if (role && isPremiumRole(role.name)) {
        // In a real implementation, this would check the user's subscription package
        // For now, we'll simulate this check
        const response = await fetch(
          `/api/UserSubscription/user/${userId}`
        );
        if (!response.ok) {
          throw new Error(
            'Failed to fetch user subscription'
          );
        }

        const subscription =
          await response.json();
        const userPackageType =
          subscription.package?.type || 'starter';

        // Premium roles require at least a 'professional' package
        if (userPackageType === 'starter') {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error(
        'Error checking if user can be assigned to role:',
        error
      );
      return false;
    }
  };

  // Function to log user role changes for audit purposes
  const logUserRoleChange = async (
    action: 'add' | 'remove',
    userId: number
  ) => {
    try {
      // Get user details
      const user =
        usersInRole?.find(
          (u) => u.id === userId
        ) ||
        (await fetch(`/api/Users`)
          .then((res) => res.json())
          .then((users) =>
            users.find(
              (u: any) => u.id === userId
            )
          ));

      // Get role details
      const role = await getRoleDetails(roleId);

      // Get current user (the admin performing the action)
      // In a real implementation, this would come from an auth context
      const currentUser = {
        id: 1,
        userName: 'admin',
        email: 'admin@pisvaltech.com',
      };

      // Create detailed audit log
      const logData = {
        timestamp: new Date().toISOString(),
        action: `${action}_user_role`,
        roleId,
        roleName:
          role?.name || `Role ID: ${roleId}`,
        rolePermissions: role?.permissions || [],
        userId,
        userName:
          user?.userName || `User ID: ${userId}`,
        userEmail: user?.email || 'Unknown',
        performedBy: currentUser.userName,
        performedById: currentUser.id,
        ipAddress: '127.0.0.1', // In a real implementation, get the client IP
        userAgent: navigator.userAgent,
        transactionLimit: role?.transactionLimit,
        securityLevel: isCriticalRole(
          role?.name || ''
        )
          ? 'high'
          : 'standard',
      };

      console.log(
        'User role change logged:',
        logData
      );

      // In a real implementation, send this to the backend
      // For now, we'll simulate this with a mock API call
      try {
        // This would be a real API call in production
        // await apiClient.post('/api/audit/user-role-changes', logData);

        // Store in localStorage for demonstration purposes
        const auditLogs = JSON.parse(
          localStorage.getItem(
            'userRoleAuditLogs'
          ) || '[]'
        );
        auditLogs.push(logData);
        localStorage.setItem(
          'userRoleAuditLogs',
          JSON.stringify(auditLogs)
        );
      } catch (error) {
        console.error(
          'Error saving audit log:',
          error
        );
      }
    } catch (error) {
      console.error(
        'Error creating audit log:',
        error
      );
    }
  };

  // Handle add user to role
  const handleAddUser = () => {
    if (selectedUser) {
      addUserMutation.mutate(selectedUser.id);
    }
  };

  // Handle remove user from role
  const handleRemoveUser = (userId: number) => {
    removeUserMutation.mutate(userId);
  };

  // Filter users that are not already in the role
  const availableUsers = React.useMemo(() => {
    if (
      !allUsers ||
      !usersInRole ||
      !Array.isArray(allUsers) ||
      !Array.isArray(usersInRole)
    )
      return [];

    const userIdsInRole = usersInRole
      .map((u) => u && u.id)
      .filter(Boolean);

    return allUsers.filter(
      (user) =>
        user &&
        user.id &&
        !userIdsInRole.includes(user.id)
    );
  }, [allUsers, usersInRole]);

  // Filter users based on search query
  const filteredUsers = React.useMemo(() => {
    if (
      !usersInRole ||
      !Array.isArray(usersInRole)
    )
      return [];
    if (!searchQuery.trim()) return usersInRole;

    return usersInRole.filter((user) => {
      if (!user) return false;

      return (
        (user.userName &&
          user.userName
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            )) ||
        (user.email &&
          user.email
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))
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
        Error loading users. Please try again
        later.
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
          onChange={(e) =>
            setSearchQuery(e.target.value)
          }
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
          onClick={() =>
            setIsAddUserDialogOpen(true)
          }
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
                <TableCell align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(filteredUsers) &&
                filteredUsers.map((user) =>
                  user ? (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        {user.userName}
                      </TableCell>
                      <TableCell>
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            user.isActive
                              ? 'Active'
                              : 'Inactive'
                          }
                          color={
                            user.isActive
                              ? 'success'
                              : 'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Remove from Role">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              handleRemoveUser(
                                user.id
                              )
                            }
                            disabled={
                              removeUserMutation.isPending
                            }
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

      {/* Add User Dialog */}
      <Dialog
        open={isAddUserDialogOpen}
        onClose={() =>
          setIsAddUserDialogOpen(false)
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Add User to Role
        </DialogTitle>
        <DialogContent>
          <Autocomplete
            options={availableUsers}
            getOptionLabel={(option) =>
              `${option.userName} (${option.email})`
            }
            value={selectedUser}
            onChange={(_event, newValue) =>
              setSelectedUser(newValue)
            }
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
          <Button
            onClick={() =>
              setIsAddUserDialogOpen(false)
            }
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddUser}
            variant="contained"
            disabled={
              !selectedUser ||
              addUserMutation.isPending
            }
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
