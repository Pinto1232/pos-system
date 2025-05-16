import Keycloak from 'keycloak-js';

/**
 * Keycloak Authorization Services client for managing permissions and policies
 * This class provides methods to interact with Keycloak's Authorization Services
 */
export class KeycloakAuthzClient {
  private keycloak: Keycloak;
  private rpt: string | null = null;

  constructor(keycloak: Keycloak) {
    this.keycloak = keycloak;
  }

  /**
   * Authorize a request using a permission ticket
   * This is used in the UMA flow when a resource server returns a 401 with a permission ticket
   *
   * @param ticket The permission ticket from the WWW-Authenticate header
   * @returns Promise resolving to the RPT token
   */
  async authorize(
    ticket: string
  ): Promise<string> {
    if (!this.keycloak.token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(
        `${this.keycloak.authServerUrl}/realms/${this.keycloak.realm}/protocol/openid-connect/token`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type:
              'urn:ietf:params:oauth:grant-type:uma-ticket',
            ticket: ticket,
            client_id: this.keycloak.clientId,
            client_secret: '', // Add client secret if needed
            submit_request: 'true',
            audience: this.keycloak.clientId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Authorization request failed: ${response.status}`
        );
      }

      const data = await response.json();
      this.rpt = data.access_token;
      return this.rpt;
    } catch (error) {
      console.error(
        'Error during authorization request:',
        error
      );
      throw error;
    }
  }

  /**
   * Get permissions for specific resources
   *
   * @param resourceServerId The client ID of the resource server
   * @param permissions Optional array of resources and scopes to request
   * @returns Promise resolving to the RPT token
   */
  async getPermissions(
    resourceServerId: string,
    permissions?: Array<{
      id: string;
      scopes?: string[];
    }>
  ): Promise<string> {
    if (!this.keycloak.token) {
      throw new Error('Not authenticated');
    }

    try {
      const body: Record<string, any> = {
        grant_type:
          'urn:ietf:params:oauth:grant-type:uma-ticket',
        audience: resourceServerId,
        response_include_resource_name: true,
      };

      // If specific permissions are requested, include them
      if (permissions && permissions.length > 0) {
        body.permission = permissions.map((p) => {
          if (p.scopes && p.scopes.length > 0) {
            return `${p.id}#${p.scopes.join(' ')}`;
          }
          return p.id;
        });
      }

      const response = await fetch(
        `${this.keycloak.authServerUrl}/realms/${this.keycloak.realm}/protocol/openid-connect/token`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/x-www-form-urlencoded',
            Authorization: `Bearer ${this.keycloak.token}`,
          },
          body: new URLSearchParams(body),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Permission request failed: ${response.status}`
        );
      }

      const data = await response.json();
      this.rpt = data.access_token;
      return this.rpt;
    } catch (error) {
      console.error(
        'Error during permission request:',
        error
      );
      throw error;
    }
  }

  /**
   * Check if the user has a specific permission
   *
   * @param resource The resource to check
   * @param scope Optional scope to check
   * @returns Promise resolving to boolean indicating if permission is granted
   */
  async hasPermission(
    resource: string,
    scope?: string
  ): Promise<boolean> {
    try {
      if (!this.rpt) {
        // Get permissions for all resources if we don't have an RPT yet
        await this.getPermissions(
          this.keycloak.clientId
        );
      }

      // Decode the RPT to check permissions
      const tokenParts = this.rpt!.split('.');
      if (tokenParts.length !== 3) {
        return false;
      }

      const payload = JSON.parse(
        atob(tokenParts[1])
      );

      if (
        !payload.authorization ||
        !payload.authorization.permissions
      ) {
        return false;
      }

      // Check if the user has permission for the resource and scope
      return payload.authorization.permissions.some(
        (permission: any) => {
          const resourceMatch =
            permission.resource_set_name ===
              resource ||
            permission.resource_set_id ===
              resource;

          if (!scope) {
            return resourceMatch;
          }

          return (
            resourceMatch &&
            permission.scopes &&
            permission.scopes.includes(scope)
          );
        }
      );
    } catch (error) {
      console.error(
        'Error checking permission:',
        error
      );
      return false;
    }
  }

  /**
   * Get the current RPT token
   */
  getRPT(): string | null {
    return this.rpt;
  }
}

export default function createKeycloakAuthzClient(
  keycloak: Keycloak
): KeycloakAuthzClient {
  return new KeycloakAuthzClient(keycloak);
}
