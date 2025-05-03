export interface EnvValidationResult {
  isValid: boolean;
  missingVars: string[];
  loadedVars: Record<string, string | undefined>;
}

export function validateAuthEnvVars(): EnvValidationResult {
  const requiredVars = [
    'NEXT_PUBLIC_KEYCLOAK_URL',
    'NEXT_PUBLIC_KEYCLOAK_REALM',
    'NEXT_PUBLIC_KEYCLOAK_CLIENT_ID',
    'NEXT_PUBLIC_REDIRECT_URI',
  ];

  const loadedVars: Record<
    string,
    string | undefined
  > = {};
  requiredVars.forEach((varName) => {
    loadedVars[varName] = process.env[varName];
    console.log(
      `${varName}: ${process.env[varName] || 'Not loaded'}`
    );
  });

  const missingVars = requiredVars.filter(
    (varName) => !process.env[varName]
  );

  return {
    isValid: missingVars.length === 0,
    missingVars,
    loadedVars,
  };
}
