import Keycloak from 'keycloak-js';

interface AuthorizationPermission {
  resource_set_name?: string;
  resource_set_id?: string;
  scopes?: string[];
}

interface TokenPayload {
  authorization?: {
    permissions?: AuthorizationPermission[];
  };
}

interface TokenResponse {
  access_token: string;
}

export class KeycloakAuthzClient {
  private keycloak: Keycloak;
  private rpt: string | null = null;

  constructor(keycloak: Keycloak) {
    this.keycloak = keycloak;
  }

  async authorize(ticket: string): Promise<string> {
    if (!this.keycloak.token) {
      throw new Error('Not authenticated');
    }

    try {
      const clientId = this.keycloak.clientId;
      if (!clientId) {
        throw new Error('Keycloak client ID is not configured');
      }

      const response = await fetch(
        `${this.keycloak.authServerUrl}/realms/${this.keycloak.realm}/protocol/openid-connect/token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:uma-ticket',
            ticket: ticket,
            client_id: clientId,
            client_secret: '', // Add client secret if needed
            submit_request: 'true',
            audience: clientId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Authorization request failed: ${response.status}`);
      }

      const data = (await response.json()) as TokenResponse;
      this.rpt = data.access_token;
      return this.rpt;
    } catch (error) {
      console.error(
        'Error during authorization request:',
        JSON.stringify(error, null, 2)
      );
      throw error;
    }
  }

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
      const bodyParams = new URLSearchParams();
      bodyParams.append(
        'grant_type',
        'urn:ietf:params:oauth:grant-type:uma-ticket'
      );
      bodyParams.append('audience', resourceServerId);
      bodyParams.append('response_include_resource_name', 'true');

      if (permissions && permissions.length > 0) {
        permissions.forEach((p) => {
          if (p.scopes && p.scopes.length > 0) {
            bodyParams.append('permission', `${p.id}#${p.scopes.join(' ')}`);
          } else {
            bodyParams.append('permission', p.id);
          }
        });
      }

      const response = await fetch(
        `${this.keycloak.authServerUrl}/realms/${this.keycloak.realm}/protocol/openid-connect/token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${this.keycloak.token}`,
          },
          body: bodyParams,
        }
      );

      if (!response.ok) {
        throw new Error(`Permission request failed: ${response.status}`);
      }

      const data = (await response.json()) as TokenResponse;
      this.rpt = data.access_token;
      return this.rpt;
    } catch (error) {
      console.error(
        'Error during permission request:',
        JSON.stringify(error, null, 2)
      );
      throw error;
    }
  }

  async hasPermission(resource: string, scope?: string): Promise<boolean> {
    try {
      if (!this.rpt) {
        const clientId = this.keycloak.clientId;
        if (!clientId) {
          throw new Error('Keycloak client ID is not configured');
        }
        await this.getPermissions(clientId);
      }

      if (!this.rpt) {
        return false;
      }

      const tokenParts = this.rpt.split('.');
      if (tokenParts.length !== 3) {
        return false;
      }

      const payload = JSON.parse(atob(tokenParts[1])) as TokenPayload;

      if (!payload.authorization || !payload.authorization.permissions) {
        return false;
      }

      return payload.authorization.permissions.some(
        (permission: AuthorizationPermission) => {
          const resourceMatch =
            permission.resource_set_name === resource ||
            permission.resource_set_id === resource;

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
        JSON.stringify(error, null, 2)
      );
      return false;
    }
  }

  getRPT(): string | null {
    return this.rpt;
  }
}

export default function createKeycloakAuthzClient(
  keycloak: Keycloak
): KeycloakAuthzClient {
  return new KeycloakAuthzClient(keycloak);
}
