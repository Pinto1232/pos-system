export interface KeycloakRole {
  id: string;
  name: string;
  description?: string;
  composite: boolean;
  clientRole: boolean;
  containerId: string;
}

export interface RolePermissionMapping {
  roleName: string;
  permissionCodes: string[];
}

export interface KeycloakUserIdRequest {
  keycloakUserId: string;
}
