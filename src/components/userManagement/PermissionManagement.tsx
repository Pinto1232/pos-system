'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  CircularProgress,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { Permission } from '@/types/userManagement';
import { groupPermissionsByModule } from '@/api/userManagementApi';

interface PermissionManagementProps {
  permissions: Permission[];
  isLoading: boolean;
}

const PermissionManagement: React.FC<
  PermissionManagementProps
> = ({ permissions, isLoading }) => {
  const [expandedModule, setExpandedModule] =
    useState<string | false>(false);

  const handleModuleChange =
    (module: string) =>
    (
      event: React.SyntheticEvent,
      isExpanded: boolean
    ) => {
      setExpandedModule(
        isExpanded ? module : false
      );
    };

  // Group permissions by module
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
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 'bold', mb: 1 }}
        >
          Module Access Control
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          This section shows all available
          permissions grouped by module.
          Permissions define what actions users
          can perform in the system.
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {Object.keys(permissionsByModule)
          .length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No permissions found
            </Typography>
          </Box>
        ) : (
          Object.entries(permissionsByModule).map(
            ([module, modulePermissions]) => (
              <Accordion
                key={module}
                expanded={
                  expandedModule === module
                }
                onChange={handleModuleChange(
                  module
                )}
                sx={{
                  mb: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px !important',
                  '&:before': {
                    display: 'none',
                  },
                  boxShadow: 'none',
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    borderRadius: '8px',
                    '&.Mui-expanded': {
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 'bold' }}
                    >
                      {module}
                    </Typography>
                    <Chip
                      label={`${modulePermissions.length} permission${modulePermissions.length !== 1 ? 's' : ''}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                      border: '1px solid #e0e0e0',
                    }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: 'bold',
                            }}
                          >
                            Permission Name
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 'bold',
                            }}
                          >
                            Code
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 'bold',
                            }}
                          >
                            Description
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {modulePermissions.map(
                          (permission) => (
                            <TableRow
                              key={permission.id}
                            >
                              <TableCell>
                                {permission.name}
                              </TableCell>
                              <TableCell>
                                <code>
                                  {
                                    permission.code
                                  }
                                </code>
                              </TableCell>
                              <TableCell>
                                <Box
                                  sx={{
                                    display:
                                      'flex',
                                    alignItems:
                                      'center',
                                    gap: 1,
                                  }}
                                >
                                  {permission.description ||
                                    'No description available'}
                                  {!permission.isActive && (
                                    <Tooltip title="This permission is currently inactive">
                                      <InfoIcon
                                        fontSize="small"
                                        color="warning"
                                      />
                                    </Tooltip>
                                  )}
                                </Box>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            )
          )
        )}
      </Box>

      <Box
        sx={{
          mt: 3,
          p: 2,
          bgcolor: '#f8f9fa',
          borderRadius: 2,
          border: '1px solid #e0e0e0',
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 'bold', mb: 1 }}
        >
          About Permissions
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
        >
          Permissions are assigned to roles, and
          roles are assigned to users. This
          creates a flexible system where you can
          define what actions different types of
          users can perform.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 'bold' }}
          >
            How to use permissions:
          </Typography>
          <ul
            style={{
              marginTop: 8,
              paddingLeft: 20,
            }}
          >
            <li>
              <Typography variant="body2">
                Create roles with specific sets of
                permissions
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Assign roles to users based on
                their responsibilities
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Users will only be able to perform
                actions allowed by their
                permissions
              </Typography>
            </li>
          </ul>
        </Box>
      </Box>
    </Box>
  );
};

export default PermissionManagement;
