'use client';

import React, {
  createContext,
  useContext,
  ReactNode,
} from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { KeycloakRole } from '@/types/keycloakRoles';
import * as api from '@/api/keycloakRolesApi';
import { Permission } from '@/types/userManagement';

interface KeycloakRolesContextType {
  // Data
  keycloakRoles: KeycloakRole[];
  currentUserRoles: string[];

  // Loading states
  isLoadingKeycloakRoles: boolean;
  isLoadingCurrentUserRoles: boolean;

  // Error states
  keycloakRolesError: Error | null;
  currentUserRolesError: Error | null;

  // Operations
  syncRoles: () => Promise<boolean>;
  mapRoleToPermissions: (
    roleName: string,
    permissionCodes: string[]
  ) => Promise<boolean>;
  syncUserRoles: (
    userId: number,
    keycloakUserId: string
  ) => Promise<boolean>;
  assignRoleToUser: (
    userId: string,
    roleName: string
  ) => Promise<boolean>;
  fetchUserRoles: (
    userId: string
  ) => Promise<KeycloakRole[]>;
}

const KeycloakRolesContext = createContext<
  KeycloakRolesContextType | undefined
>(undefined);

export const KeycloakRolesProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const queryClient = useQueryClient();

  // Fetch Keycloak roles
  const {
    data: keycloakRoles = [],
    isLoading: isLoadingKeycloakRoles,
    error: keycloakRolesError,
  } = useQuery<KeycloakRole[], Error>({
    queryKey: ['keycloakRoles'],
    queryFn: api.fetchKeycloakRoles,
    retry: false,
  });

  // Fetch current user roles
  const {
    data: currentUserRoles = [],
    isLoading: isLoadingCurrentUserRoles,
    error: currentUserRolesError,
  } = useQuery<string[], Error>({
    queryKey: ['currentUserRoles'],
    queryFn: api.fetchCurrentUserRoles,
    retry: false,
  });

  // Mutations
  const syncRolesMutation = useMutation({
    mutationFn: api.syncRoles,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['keycloakRoles'],
      });
      queryClient.invalidateQueries({
        queryKey: ['roles'],
      });
    },
  });

  const mapRoleToPermissionsMutation =
    useMutation({
      mutationFn: ({
        roleName,
        permissionCodes,
      }: {
        roleName: string;
        permissionCodes: string[];
      }) =>
        api.mapRoleToPermissions(
          roleName,
          permissionCodes
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['roles'],
        });
      },
    });

  const syncUserRolesMutation = useMutation({
    mutationFn: ({
      userId,
      keycloakUserId,
    }: {
      userId: number;
      keycloakUserId: string;
    }) =>
      api.syncUserRoles(userId, keycloakUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
  });

  const assignRoleToUserMutation = useMutation({
    mutationFn: ({
      userId,
      roleName,
    }: {
      userId: string;
      roleName: string;
    }) => api.assignRoleToUser(userId, roleName),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['keycloakRoles'],
      });
    },
  });

  // Wrapper functions for mutations
  const syncRoles =
    async (): Promise<boolean> => {
      return await syncRolesMutation.mutateAsync();
    };

  const mapRoleToPermissions = async (
    roleName: string,
    permissionCodes: string[]
  ): Promise<boolean> => {
    return await mapRoleToPermissionsMutation.mutateAsync(
      { roleName, permissionCodes }
    );
  };

  const syncUserRoles = async (
    userId: number,
    keycloakUserId: string
  ): Promise<boolean> => {
    return await syncUserRolesMutation.mutateAsync(
      { userId, keycloakUserId }
    );
  };

  const assignRoleToUser = async (
    userId: string,
    roleName: string
  ): Promise<boolean> => {
    return await assignRoleToUserMutation.mutateAsync(
      { userId, roleName }
    );
  };

  const fetchUserRoles = async (
    userId: string
  ): Promise<KeycloakRole[]> => {
    return await api.fetchUserRoles(userId);
  };

  return (
    <KeycloakRolesContext.Provider
      value={{
        keycloakRoles,
        currentUserRoles,
        isLoadingKeycloakRoles,
        isLoadingCurrentUserRoles,
        keycloakRolesError,
        currentUserRolesError,
        syncRoles,
        mapRoleToPermissions,
        syncUserRoles,
        assignRoleToUser,
        fetchUserRoles,
      }}
    >
      {children}
    </KeycloakRolesContext.Provider>
  );
};

export const useKeycloakRoles =
  (): KeycloakRolesContextType => {
    const context = useContext(
      KeycloakRolesContext
    );
    if (context === undefined) {
      throw new Error(
        'useKeycloakRoles must be used within a KeycloakRolesProvider'
      );
    }
    return context;
  };
