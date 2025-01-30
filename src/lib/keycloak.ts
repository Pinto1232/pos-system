import Keycloak from "keycloak-js";

class KeycloakService {
  private static instance: Keycloak;

  private constructor() {}

  private static getConfig() {
    return {
      url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "",
      realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "",
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "",
    };
  }

  public static getInstance(): Keycloak {
    if (!KeycloakService.instance) {
      KeycloakService.instance = new Keycloak(KeycloakService.getConfig());
    }
    return KeycloakService.instance;
  }

  public static async init(): Promise<boolean> {
    try {
      const keycloak = this.getInstance();
      const authenticated = await keycloak.init({
        onLoad: "check-sso",
        pkceMethod: "S256",
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
      });

      console.log("Keycloak initialized. Authenticated:", authenticated);
      return authenticated;
    } catch (error) {
      console.error("Keycloak initialization failed:", error);
      return false;
    }
  }
}

export default KeycloakService;
