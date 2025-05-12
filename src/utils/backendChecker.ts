/**
 * Utility to check if the backend server is running
 */

import axios from 'axios';

export interface BackendStatus {
  isRunning: boolean;
  url: string;
  error?: string;
  statusCode?: number;
}

/**
 * Checks if the backend server is running
 * @returns Promise<BackendStatus> - Status of the backend server
 */
export const checkBackendStatus =
  async (): Promise<BackendStatus> => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:5107';

    try {
      console.log(
        `Checking backend status at: ${apiUrl}`
      );

      // Try multiple endpoints in sequence to check if the server is running
      const endpointsToCheck = [
        // First try the dedicated health check endpoint
        '/api/Health',
        // Then try Swagger as a fallback
        '/swagger/index.html',
        // Finally try the root as a last resort
        '/',
      ];

      for (const endpoint of endpointsToCheck) {
        try {
          console.log(
            `Trying endpoint: ${apiUrl}${endpoint}`
          );
          // Use GET for health endpoint (to get status) and HEAD for others
          const method =
            endpoint === '/api/Health'
              ? 'get'
              : 'head';
          const response = await (method === 'get'
            ? axios.get(`${apiUrl}${endpoint}`, {
                timeout: 5000,
              })
            : axios.head(`${apiUrl}${endpoint}`, {
                timeout: 5000,
              }));

          console.log(
            `Endpoint ${endpoint} responded with status: ${response.status}`
          );
          return {
            isRunning:
              response.status >= 200 &&
              response.status < 300,
            url: apiUrl,
            statusCode: response.status,
          };
        } catch (error) {
          // Type guard for error object
          const endpointError = error as Error;
          console.log(
            `Endpoint ${endpoint} check failed: ${endpointError.message || 'Unknown error'}`
          );
          // Continue to the next endpoint
        }
      }

      // If we get here, all endpoints failed
      throw new Error(
        'All backend endpoints failed to respond'
      );
    } catch (error) {
      console.error(
        'Backend check failed:',
        error
      );

      // Create a properly typed error response
      const errorResponse: BackendStatus = {
        isRunning: false,
        url: apiUrl,
        error:
          error instanceof Error
            ? error.message
            : String(error),
        statusCode: (
          error as {
            response?: { status?: number };
          }
        )?.response?.status,
      };

      return errorResponse;
    }
  };

/**
 * Gets troubleshooting steps based on the backend status
 * @param status - Backend status
 * @returns Array of troubleshooting steps
 */
export const getTroubleshootingSteps = (
  status: BackendStatus
): string[] => {
  const steps: string[] = [];

  if (!status.isRunning) {
    steps.push(
      `Ensure the backend server is running at ${status.url}`
    );

    if (status.error?.includes('timeout')) {
      steps.push(
        'The server request timed out. The server might be running but responding slowly.'
      );
    }

    if (status.error?.includes('ECONNREFUSED')) {
      steps.push(
        'Connection was refused. Make sure the server is running on the correct port.'
      );
    }

    steps.push(
      'Check network connectivity between frontend and backend'
    );
    steps.push(
      'Verify that the API endpoint is correctly configured in your .env.local file'
    );
    steps.push(
      'Try running the backend server with "dotnet run" in the backend directory'
    );
  }

  return steps;
};
