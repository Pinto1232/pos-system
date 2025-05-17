export interface KeycloakError {
  error?: string;
  error_description?: string;
}

export function isKeycloakError(error: unknown): error is KeycloakError {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('error' in error || 'error_description' in error)
  );
}
