import { KeycloakRole } from '@/types/keycloakRoles';

// Mock Keycloak roles for development and fallback
export const mockKeycloakRoles: KeycloakRole[] = [
  {
    id: '1',
    name: 'admin',
    description:
      'Administrator role with full access',
    composite: false,
    clientRole: false,
    containerId: 'pisval-pos-realm',
  },
  {
    id: '2',
    name: 'manager',
    description:
      'Manager role with access to most features',
    composite: false,
    clientRole: false,
    containerId: 'pisval-pos-realm',
  },
  {
    id: '3',
    name: 'cashier',
    description:
      'Cashier role with limited access',
    composite: false,
    clientRole: false,
    containerId: 'pisval-pos-realm',
  },
  {
    id: '4',
    name: 'inventory',
    description: 'Inventory management role',
    composite: false,
    clientRole: false,
    containerId: 'pisval-pos-realm',
  },
  {
    id: '5',
    name: 'reports',
    description: 'Role for accessing reports',
    composite: false,
    clientRole: false,
    containerId: 'pisval-pos-realm',
  },
];

// Mock user roles for development and fallback
export const mockUserRoles: string[] = [
  'cashier',
  'inventory',
];
