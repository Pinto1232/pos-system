declare module '@/lib/keycloak' {
    import Keycloak from 'keycloak-js';
    
    class KeycloakService {
      private static instance: Keycloak | null;
      public static getInstance(): Keycloak;
    }
  
    export default KeycloakService;
  }
  
  // Add declarations for other aliases if needed
  declare module '@components/*';
  declare module '@hooks/*';
  declare module '@services/*';
  declare module '*.html' {
    const content: string;
    export default content;
  }