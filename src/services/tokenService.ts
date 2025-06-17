export interface TokenResponse {
  success: boolean;
  token?: string;
  error?: string;
}

export class TokenService {
  private static readonly BASE_URL = '/api/auth-token';

  static async setToken(token: string): Promise<TokenResponse> {
    try {
      if (!token || token.trim() === '') {
        throw new Error('Token cannot be empty');
      }

      const response = await fetch(`${this.BASE_URL}/set-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to set token');
      }

      console.log('🔒 Token stored securely in HttpOnly cookie');
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to set token:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static async getToken(): Promise<TokenResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/get-token`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve token');
      }

      const data = await response.json();
      return {
        success: true,
        token: data.token,
      };
    } catch (error) {
      console.error('❌ Failed to get token:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static async clearToken(): Promise<TokenResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/clear-token`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to clear token');
      }

      console.log('🧹 Token cleared from HttpOnly cookie');
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to clear token:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static async healthCheck(): Promise<TokenResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/check`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Health check failed');
      }

      const data = await response.json();
      return {
        success: true,
        token: data.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static isValidTokenFormat(token: string): boolean {
    if (!token || typeof token !== 'string') {
      return false;
    }

    const parts = token.split('.');
    return parts.length === 3;
  }

  static getTokenExpiration(token: string): number | null {
    try {
      if (!this.isValidTokenFormat(token)) {
        return null;
      }

      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp ? payload.exp * 1000 : null;
    } catch {
      return null;
    }
  }

  static isTokenExpired(token: string): boolean {
    const expiration = this.getTokenExpiration(token);
    if (!expiration) {
      return true;
    }

    return Date.now() >= expiration;
  }
}

export default TokenService;
