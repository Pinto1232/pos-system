import Keycloak from 'keycloak-js';

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
      const response = await fetch(`${this.keycloak.authServerUrl}/realms/${this.keycloak.realm}/protocol/openid-connect/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:uma-ticket',
          ticket: ticket,
          client_id: this.keycloak.clientId,
          client_secret: '', // Add client secret if needed
          submit_request: 'true',
          audience: this.keycloak.clientId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Authorization request failed: ${response.status}`);
      }

      const data = await response.json();
      this.rpt = data.access_token;
      return this.rpt;
    } catch (error) {
      console.error('Error during authorization request:', JSON.stringify(error, null, 2));
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
      const body: Record<string, any> = {
        grant_type: 'urn:ietf:params:oauth:grant-type:uma-ticket',
        audience: resourceServerId,
        response_include_resource_name: true,
      };

      if (permissions && permissions.length > 0) {
        body.permission = permissions.map((p) => {
          if (p.scopes && p.scopes.length > 0) {
            return `${p.id}#${p.scopes.join(' ')}`;
          }
          return p.id;
        });
      }

      const response = await fetch(`${this.keycloak.authServerUrl}/realms/${this.keycloak.realm}/protocol/openid-connect/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${this.keycloak.token}`,
        },
        body: new URLSearchParams(body),
      });

      if (!response.ok) {
        throw new Error(`Permission request failed: ${response.status}`);
      }

      const data = await response.json();
      this.rpt = data.access_token;
      return this.rpt;
    } catch (error) {
      console.error('Error during permission request:', JSON.stringify(error, null, 2));
      throw error;
    }
  }

  async hasPermission(resource: string, scope?: string): Promise<boolean> {
    try {
      if (!this.rpt) {
        await this.getPermissions(this.keycloak.clientId);
      }

      const tokenParts = this.rpt!.split('.');
      if (tokenParts.length !== 3) {
        return false;
      }

      const payload = JSON.parse(atob(tokenParts[1]));

      if (!payload.authorization || !payload.authorization.permissions) {
        return false;
      }

      return payload.authorization.permissions.some((permission: any) => {
        const resourceMatch = permission.resource_set_name === resource || permission.resource_set_id === resource;

        if (!scope) {
          return resourceMatch;
        }

        return resourceMatch && permission.scopes && permission.scopes.includes(scope);
      });
    } catch (error) {
      console.error('Error checking permission:', JSON.stringify(error, null, 2));
      return false;
    }
  }

  getRPT(): string | null {
    return this.rpt;
  }
}

export default function createKeycloakAuthzClient(keycloak: Keycloak): KeycloakAuthzClient {
  return new KeycloakAuthzClient(keycloak);
}
