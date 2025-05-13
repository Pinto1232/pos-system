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
    mutationFn: (userId: number) =>
      roleService.addUserToRole(roleId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['usersInRole', roleId],
      });
      setIsAddUserDialogOpen(false);
      setSelectedUser(null);
    },
  });

  // Remove user from role mutation
  const removeUserMutation = useMutation({
    mutationFn: (userId: number) =>
      roleService.removeUserFromRole(
        roleId,
        userId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['usersInRole', roleId],
      });
    },
  });

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
    if (!allUsers || !usersInRole) return [];

    const userIdsInRole = usersInRole.map(
      (u) => u.id
    );
    return allUsers.filter(
      (user) => !userIdsInRole.includes(user.id)
    );
  }, [allUsers, usersInRole]);

  // Filter users based on search query
  const filteredUsers = React.useMemo(() => {
    if (!usersInRole) return [];
    if (!searchQuery.trim()) return usersInRole;

    return usersInRole.filter(
      (user) =>
        user.userName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        user.email
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
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
              {filteredUsers.map((user) => (
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
              ))}
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
