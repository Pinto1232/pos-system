'use client';

import React, {
  useState,
  useEffect,
} from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  CircularProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import { useKeycloakRoles } from '@/contexts/KeycloakRolesContext';
import { useUserManagement } from '@/contexts/UserManagementContext';
import { KeycloakRole } from '@/types/keycloakRoles';
import { Permission } from '@/types/userManagement';
import SyncIcon from '@mui/icons-material/Sync';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';

const KeycloakRoleManagement: React.FC = () => {
  const {
    keycloakRoles,
    isLoadingKeycloakRoles,
    keycloakRolesError,
    syncRoles,
    mapRoleToPermissions,
  } = useKeycloakRoles();

  const { permissions, isLoadingPermissions } =
    useUserManagement();

  const [isSyncing, setIsSyncing] =
    useState(false);
  const [syncSuccess, setSyncSuccess] = useState<
    boolean | null
  >(null);
  const [syncError, setSyncError] = useState<
    string | null
  >(null);

  const [openDialog, setOpenDialog] =
    useState(false);
  const [selectedRole, setSelectedRole] =
    useState<KeycloakRole | null>(null);
  const [
    selectedPermissions,
    setSelectedPermissions,
  ] = useState<string[]>([]);
  const [isSavingMapping, setIsSavingMapping] =
    useState(false);
  const [mappingSuccess, setMappingSuccess] =
    useState<boolean | null>(null);
  const [mappingError, setMappingError] =
    useState<string | null>(null);

  // Group permissions by module for better organization
  const permissionsByModule = permissions.reduce(
    (acc, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = [];
      }
      acc[permission.module].push(permission);
      return acc;
    },
    {} as Record<string, Permission[]>
  );

  const handleSyncRoles = async () => {
    setIsSyncing(true);
    setSyncSuccess(null);
    setSyncError(null);

    try {
      const result = await syncRoles();
      setSyncSuccess(result);
      if (!result) {
        setSyncError(
          'Failed to synchronize roles'
        );
      }
    } catch (error) {
      setSyncSuccess(false);
      setSyncError(
        error instanceof Error
          ? error.message
          : 'An unknown error occurred'
      );
    } finally {
      setIsSyncing(false);
    }
  };

  const handleOpenDialog = (
    role: KeycloakRole
  ) => {
    setSelectedRole(role);
    setSelectedPermissions([]);
    setMappingSuccess(null);
    setMappingError(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRole(null);
  };

  const handlePermissionChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedPermissions(
      event.target.value as string[]
    );
  };

  const handleSaveMapping = async () => {
    if (!selectedRole) return;

    setIsSavingMapping(true);
    setMappingSuccess(null);
    setMappingError(null);

    try {
      const result = await mapRoleToPermissions(
        selectedRole.name,
        selectedPermissions
      );
      setMappingSuccess(result);
      if (!result) {
        setMappingError(
          'Failed to map permissions to role'
        );
      }
    } catch (error) {
      setMappingSuccess(false);
      setMappingError(
        error instanceof Error
          ? error.message
          : 'An unknown error occurred'
      );
    } finally {
      setIsSavingMapping(false);
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 'medium' }}
        >
          Keycloak Roles
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={
            isSyncing ? (
              <CircularProgress
                size={20}
                color="inherit"
              />
            ) : (
              <SyncIcon />
            )
          }
          onClick={handleSyncRoles}
          disabled={isSyncing}
          sx={{ textTransform: 'none' }}
        >
          Sync Roles from Keycloak
        </Button>
      </Box>

      {syncSuccess !== null && (
        <Alert
          severity={
            syncSuccess ? 'success' : 'error'
          }
          sx={{ mb: 2 }}
        >
          {syncSuccess
            ? 'Roles synchronized successfully from Keycloak'
            : `Failed to synchronize roles: ${syncError}`}
        </Alert>
      )}

      <Paper
        sx={{
          flexGrow: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TableContainer
          sx={{ flexGrow: 1, maxHeight: '100%' }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Role Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoadingKeycloakRoles ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                  >
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : keycloakRolesError ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                  >
                    <Alert severity="error">
                      Error loading Keycloak
                      roles. Please try again.
                    </Alert>
                  </TableCell>
                </TableRow>
              ) : keycloakRoles.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                  >
                    No Keycloak roles found. Click
                    "Sync Roles" to fetch roles
                    from Keycloak.
                  </TableCell>
                </TableRow>
              ) : (
                keycloakRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      {role.name}
                    </TableCell>
                    <TableCell>
                      {role.description ||
                        'No description'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          role.clientRole
                            ? 'Client Role'
                            : 'Realm Role'
                        }
                        color={
                          role.clientRole
                            ? 'secondary'
                            : 'primary'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Map to Application Permissions">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            handleOpenDialog(role)
                          }
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Permission Mapping Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Map Role to Permissions:{' '}
          {selectedRole?.name}
        </DialogTitle>
        <DialogContent dividers>
          {mappingSuccess !== null && (
            <Alert
              severity={
                mappingSuccess
                  ? 'success'
                  : 'error'
              }
              sx={{ mb: 2 }}
            >
              {mappingSuccess
                ? 'Permissions mapped successfully to role'
                : `Failed to map permissions: ${mappingError}`}
            </Alert>
          )}

          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <InfoIcon
                fontSize="small"
                sx={{ mr: 1 }}
              />
              Select the permissions that should
              be assigned to users with this
              Keycloak role
            </Typography>
          </Box>

          {isLoadingPermissions ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                p: 3,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            Object.entries(
              permissionsByModule
            ).map(
              ([module, modulePermissions]) => (
                <Box key={module} sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 'medium',
                      mb: 1,
                    }}
                  >
                    {module}
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel
                      id={`permissions-select-label-${module}`}
                    >
                      Permissions
                    </InputLabel>
                    <Select
                      labelId={`permissions-select-label-${module}`}
                      multiple
                      value={selectedPermissions.filter(
                        (p) =>
                          modulePermissions.some(
                            (mp) => mp.code === p
                          )
                      )}
                      onChange={
                        handlePermissionChange
                      }
                      input={
                        <OutlinedInput label="Permissions" />
                      }
                      renderValue={(selected) => (
                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 0.5,
                          }}
                        >
                          {selected.map(
                            (value) => {
                              const permission =
                                permissions.find(
                                  (p) =>
                                    p.code ===
                                    value
                                );
                              return (
                                <Chip
                                  key={value}
                                  label={
                                    permission?.name ||
                                    value
                                  }
                                  size="small"
                                />
                              );
                            }
                          )}
                        </Box>
                      )}
                    >
                      {modulePermissions.map(
                        (permission) => (
                          <MenuItem
                            key={permission.code}
                            value={
                              permission.code
                            }
                          >
                            <Checkbox
                              checked={
                                selectedPermissions.indexOf(
                                  permission.code
                                ) > -1
                              }
                            />
                            <ListItemText
                              primary={
                                permission.name
                              }
                              secondary={
                                permission.description
                              }
                            />
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Box>
              )
            )
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveMapping}
            variant="contained"
            disabled={isSavingMapping}
            startIcon={
              isSavingMapping ? (
                <CircularProgress size={20} />
              ) : null
            }
          >
            Save Mapping
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default KeycloakRoleManagement;
