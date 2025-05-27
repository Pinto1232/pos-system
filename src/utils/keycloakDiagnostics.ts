




export interface DiagnosticResult {
  test: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: any;
}

export interface KeycloakDiagnostics {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  results: DiagnosticResult[];
  recommendations: string[];
}

export async function runKeycloakDiagnostics(
  keycloakUrl: string = 'http://localhost:8282',
  realm: string = 'pisval-pos-realm',
  clientId: string = 'pos-backend'
): Promise<KeycloakDiagnostics> {
  const results: DiagnosticResult[] = [];
  const recommendations: string[] = [];

  
  try {
    const serverResponse = await fetch(keycloakUrl, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });

    if (serverResponse.ok) {
      results.push({
        test: 'Keycloak Server Connectivity',
        status: 'success',
        message: 'Keycloak server is accessible',
        details: { status: serverResponse.status },
      });
    } else {
      results.push({
        test: 'Keycloak Server Connectivity',
        status: 'error',
        message: `Keycloak server returned ${serverResponse.status}`,
        details: {
          status: serverResponse.status,
          statusText: serverResponse.statusText,
        },
      });
      recommendations.push(
        'Check if Keycloak server is running on the correct port'
      );
    }
  } catch (error) {
    results.push({
      test: 'Keycloak Server Connectivity',
      status: 'error',
      message: 'Cannot connect to Keycloak server',
      details: {
        error: error instanceof Error ? error.message : String(error),
      },
    });
    recommendations.push(
      'Ensure Keycloak is running and accessible at ' + keycloakUrl
    );
  }

  
  try {
    const realmResponse = await fetch(`${keycloakUrl}/realms/${realm}`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });

    if (realmResponse.status === 405) {
      
      results.push({
        test: 'Realm Existence',
        status: 'success',
        message: 'Realm exists and is accessible',
        details: { realm },
      });
    } else if (realmResponse.status === 404) {
      results.push({
        test: 'Realm Existence',
        status: 'error',
        message: 'Realm not found',
        details: { realm, status: realmResponse.status },
      });
      recommendations.push(
        `Create the realm '${realm}' in Keycloak admin console`
      );
    } else {
      results.push({
        test: 'Realm Existence',
        status: 'warning',
        message: `Unexpected response from realm endpoint: ${realmResponse.status}`,
        details: { realm, status: realmResponse.status },
      });
    }
  } catch (error) {
    results.push({
      test: 'Realm Existence',
      status: 'error',
      message: 'Failed to check realm existence',
      details: {
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }

  
  try {
    const wellKnownResponse = await fetch(
      `${keycloakUrl}/realms/${realm}/.well-known/openid_configuration`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      }
    );

    if (wellKnownResponse.ok) {
      const config = await wellKnownResponse.json();
      results.push({
        test: 'Well-known Configuration',
        status: 'success',
        message: 'OpenID Connect configuration is accessible',
        details: {
          issuer: config.issuer,
          authorizationEndpoint: config.authorization_endpoint,
          tokenEndpoint: config.token_endpoint,
        },
      });
    } else if (wellKnownResponse.status === 404) {
      
      results.push({
        test: 'Well-known Configuration',
        status: 'warning',
        message:
          'OpenID configuration endpoint not found - this is common in development setups',
        details: {
          status: wellKnownResponse.status,
          note: 'Keycloak may still function for basic authentication',
        },
      });
      recommendations.push(
        'Consider configuring the realm properly for production use'
      );
    } else {
      results.push({
        test: 'Well-known Configuration',
        status: 'error',
        message: `Well-known configuration not accessible: ${wellKnownResponse.status}`,
        details: { status: wellKnownResponse.status },
      });
      recommendations.push(
        'Check if the realm is properly configured and enabled'
      );
    }
  } catch (error) {
    results.push({
      test: 'Well-known Configuration',
      status: 'warning',
      message:
        'Failed to fetch well-known configuration - treating as non-critical',
      details: {
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }

  
  try {
    const corsResponse = await fetch(
      `${keycloakUrl}/realms/${realm}/.well-known/openid_configuration`,
      {
        method: 'OPTIONS',
        signal: AbortSignal.timeout(5000),
      }
    );

    const corsHeaders = {
      'access-control-allow-origin': corsResponse.headers.get(
        'access-control-allow-origin'
      ),
      'access-control-allow-methods': corsResponse.headers.get(
        'access-control-allow-methods'
      ),
      'access-control-allow-headers': corsResponse.headers.get(
        'access-control-allow-headers'
      ),
    };

    if (corsHeaders['access-control-allow-origin']) {
      results.push({
        test: 'CORS Configuration',
        status: 'success',
        message: 'CORS headers are present',
        details: corsHeaders,
      });
    } else {
      results.push({
        test: 'CORS Configuration',
        status: 'warning',
        message: 'CORS headers may not be properly configured',
        details: corsHeaders,
      });
      recommendations.push(
        'Configure CORS settings in Keycloak client configuration'
      );
    }
  } catch (error) {
    results.push({
      test: 'CORS Configuration',
      status: 'warning',
      message: 'Could not test CORS configuration',
      details: {
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }

  
  const errorCount = results.filter((r) => r.status === 'error').length;
  const warningCount = results.filter((r) => r.status === 'warning').length;
  const successCount = results.filter((r) => r.status === 'success').length;

  let overall: 'healthy' | 'degraded' | 'unhealthy';
  if (errorCount === 0 && warningCount === 0) {
    overall = 'healthy';
  } else if (errorCount === 0 && successCount >= 2) {
    
    overall = 'healthy';
  } else if (errorCount === 0) {
    overall = 'degraded';
  } else if (errorCount <= 1 && successCount >= 2) {
    
    overall = 'degraded';
  } else {
    overall = 'unhealthy';
  }

  return {
    overall,
    results,
    recommendations,
  };
}

export function logDiagnostics(diagnostics: KeycloakDiagnostics): void {
  console.group('🔍 Keycloak Diagnostics Report');
  console.log(`Overall Status: ${diagnostics.overall.toUpperCase()}`);

  console.group('Test Results:');
  diagnostics.results.forEach((result) => {
    const icon =
      result.status === 'success'
        ? '✅'
        : result.status === 'warning'
          ? '⚠️'
          : '❌';
    console.log(`${icon} ${result.test}: ${result.message}`);
    if (result.details) {
      console.log('  Details:', result.details);
    }
  });
  console.groupEnd();

  if (diagnostics.recommendations.length > 0) {
    console.group('Recommendations:');
    diagnostics.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
    console.groupEnd();
  }

  console.groupEnd();
}
