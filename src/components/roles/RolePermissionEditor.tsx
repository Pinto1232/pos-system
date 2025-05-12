import React, {
  useState,
  useEffect,
} from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Tooltip,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import ClearIcon from '@mui/icons-material/Clear';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import permissionService, {
  PermissionInfo,
} from '@/api/permissionService';
import roleService from '@/api/roleService';

interface RolePermissionEditorProps {
  roleId: number;
  onPermissionsUpdated?: () => void;
}

const RolePermissionEditor: React.FC<
  RolePermissionEditorProps
> = ({ roleId, onPermissionsUpdated }) => {
  const [
    selectedPermissions,
    setSelectedPermissions,
  ] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] =
    useState('');
  const [
    expandedCategories,
    setExpandedCategories,
  ] = useState<Record<string, boolean>>({});
  const queryClient = useQueryClient();

  // Fetch all available permissions
  const {
    data: allPermissions,
    isLoading: isLoadingPermissions,
    error: permissionsError,
  } = useQuery<PermissionInfo[]>({
    queryKey: ['permissions'],
    queryFn: permissionService.getAllPermissions,
  });

  // Fetch role permissions
  const {
    data: rolePermissions,
    isLoading: isLoadingRolePermissions,
    error: rolePermissionsError,
  } = useQuery<string[]>({
    queryKey: ['rolePermissions', roleId],
    queryFn: () =>
      permissionService.getRolePermissions(
        roleId
      ),
    enabled: !!roleId,
  });

  // Update role permissions mutation
  const updatePermissionsMutation = useMutation({
    mutationFn: (permissions: string[]) =>
      roleService.updateRolePermissions(
        roleId,
        permissions
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['rolePermissions', roleId],
      });
      if (onPermissionsUpdated) {
        onPermissionsUpdated();
      }
    },
  });

  // Update selected permissions when role permissions are loaded
  useEffect(() => {
    if (rolePermissions) {
      setSelectedPermissions(rolePermissions);
    }
  }, [rolePermissions]);

  // Group permissions by category
  const permissionsByCategory =
    React.useMemo(() => {
      if (!allPermissions) return {};

      const filtered = searchQuery
        ? allPermissions.filter(
            (p) =>
              p.name
                .toLowerCase()
                .includes(
                  searchQuery.toLowerCase()
                ) ||
              p.displayName
                .toLowerCase()
                .includes(
                  searchQuery.toLowerCase()
                ) ||
              p.category
                .toLowerCase()
                .includes(
                  searchQuery.toLowerCase()
                ) ||
              (p.description &&
                p.description
                  .toLowerCase()
                  .includes(
                    searchQuery.toLowerCase()
                  ))
          )
        : allPermissions;

      return filtered.reduce<
        Record<string, PermissionInfo[]>
      >((acc, permission) => {
        if (!acc[permission.category]) {
          acc[permission.category] = [];
        }
        acc[permission.category].push(permission);
        return acc;
      }, {});
    }, [allPermissions, searchQuery]);

  // Handle permission toggle
  const handlePermissionToggle = (
    permissionName: string
  ) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(permissionName)) {
        return prev.filter(
          (p) => p !== permissionName
        );
      } else {
        return [...prev, permissionName];
      }
    });
  };

  // Handle category toggle (select/deselect all permissions in a category)
  const handleCategoryToggle = (
    category: string,
    permissions: PermissionInfo[]
  ) => {
    const permissionNames = permissions.map(
      (p) => p.name
    );
    const allSelected = permissionNames.every(
      (p) => selectedPermissions.includes(p)
    );

    if (allSelected) {
      // Deselect all permissions in this category
      setSelectedPermissions((prev) =>
        prev.filter(
          (p) => !permissionNames.includes(p)
        )
      );
    } else {
      // Select all permissions in this category
      setSelectedPermissions((prev) => {
        const newPermissions = [...prev];
        permissionNames.forEach((p) => {
          if (!newPermissions.includes(p)) {
            newPermissions.push(p);
          }
        });
        return newPermissions;
      });
    }
  };

  // Handle save permissions
  const handleSavePermissions = () => {
    updatePermissionsMutation.mutate(
      selectedPermissions
    );
  };

  // Handle reset permissions
  const handleResetPermissions = () => {
    if (rolePermissions) {
      setSelectedPermissions(rolePermissions);
    }
  };

  // Handle search clear
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Toggle category expansion
  const toggleCategoryExpansion = (
    category: string
  ) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Check if category is expanded
  const isCategoryExpanded = (
    category: string
  ) => {
    return expandedCategories[category] ?? false;
  };

  // Calculate if all permissions in a category are selected
  const isCategoryFullySelected = (
    permissions: PermissionInfo[]
  ) => {
    return permissions.every((p) =>
      selectedPermissions.includes(p.name)
    );
  };

  // Calculate if some permissions in a category are selected
  const isCategoryPartiallySelected = (
    permissions: PermissionInfo[]
  ) => {
    return (
      permissions.some((p) =>
        selectedPermissions.includes(p.name)
      ) &&
      !permissions.every((p) =>
        selectedPermissions.includes(p.name)
      )
    );
  };

  if (
    isLoadingPermissions ||
    isLoadingRolePermissions
  ) {
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

  if (permissionsError || rolePermissionsError) {
    return (
      <Alert severity="error">
        Error loading permissions. Please try
        again later.
      </Alert>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search permissions..."
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(e.target.value)
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleClearSearch}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          size="small"
          sx={{ mb: 2 }}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography variant="body2">
            {selectedPermissions.length} of{' '}
            {allPermissions?.length || 0}{' '}
            permissions selected
          </Typography>
          <Box>
            <Button
              variant="outlined"
              size="small"
              onClick={handleResetPermissions}
              sx={{ mr: 1 }}
              disabled={
                updatePermissionsMutation.isPending
              }
            >
              Reset
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleSavePermissions}
              disabled={
                updatePermissionsMutation.isPending
              }
            >
              {updatePermissionsMutation.isPending ? (
                <CircularProgress
                  size={20}
                  sx={{ mr: 1 }}
                />
              ) : null}
              Save Permissions
            </Button>
          </Box>
        </Box>

        {updatePermissionsMutation.isSuccess && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
          >
            Permissions updated successfully!
          </Alert>
        )}

        {updatePermissionsMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error updating permissions. Please try
            again.
          </Alert>
        )}
      </Box>

      {Object.entries(permissionsByCategory).map(
        ([category, permissions]) => (
          <Accordion
            key={category}
            expanded={isCategoryExpanded(
              category
            )}
            onChange={() =>
              toggleCategoryExpansion(category)
            }
            sx={{ mb: 1 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isCategoryFullySelected(
                        permissions
                      )}
                      indeterminate={isCategoryPartiallySelected(
                        permissions
                      )}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleCategoryToggle(
                          category,
                          permissions
                        );
                      }}
                    />
                  }
                  label={
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="subtitle1">
                        {category}
                      </Typography>
                      <Chip
                        label={`${permissions.filter((p) => selectedPermissions.includes(p.name)).length}/${
                          permissions.length
                        }`}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  }
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  ml: 3,
                }}
              >
                {permissions.map((permission) => (
                  <Box
                    key={permission.name}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1,
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedPermissions.includes(
                            permission.name
                          )}
                          onChange={() =>
                            handlePermissionToggle(
                              permission.name
                            )
                          }
                        />
                      }
                      label={
                        permission.displayName
                      }
                    />
                    {permission.description && (
                      <Tooltip
                        title={
                          permission.description
                        }
                      >
                        <InfoIcon
                          fontSize="small"
                          sx={{
                            ml: 1,
                            color:
                              'text.secondary',
                          }}
                        />
                      </Tooltip>
                    )}
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        )
      )}
    </Box>
  );
};

export default RolePermissionEditor;
