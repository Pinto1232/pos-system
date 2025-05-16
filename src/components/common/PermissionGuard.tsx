'use client';

import React, { useEffect, useState, useContext, ReactNode } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import permissionService from '@/api/permissionService';
import { CircularProgress, Box, Typography } from '@mui/material';

interface PermissionGuardProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * A component that conditionally renders its children based on whether the user has a specific permission.
 * 
 * @param permission The permission to check for (e.g., "users.view")
 * @param children The content to render if the user has the permission
 * @param fallback Optional content to render if the user does not have the permission
 */
const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  permission, 
  children, 
  fallback = null 
}) => {
  const { authenticated } = useContext(AuthContext);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPermission = async () => {
      if (!authenticated) {
        setHasPermission(false);
        setIsLoading(false);
        return;
      }

      try {
        const result = await permissionService.hasPermission(permission);
        setHasPermission(result);
      } catch (error) {
        console.error(`Error checking permission ${permission}:`, error);
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkPermission();
  }, [permission, authenticated]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (hasPermission) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default PermissionGuard;
