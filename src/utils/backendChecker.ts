import axios from 'axios';

export interface BackendStatus {
  isRunning: boolean;
  url: string;
  error?: string;
  statusCode?: number;
}

export const checkBackendStatus = async (): Promise<BackendStatus> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5107';

  try {
    console.log(`Checking backend status at: ${apiUrl}`);

    const endpointsToCheck = ['/api/Health', '/swagger/index.html', '/'];

    for (const endpoint of endpointsToCheck) {
      try {
        console.log(`Trying endpoint: ${apiUrl}${endpoint}`);

        const method = endpoint === '/api/Health' ? 'get' : 'head';
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
          isRunning: response.status >= 200 && response.status < 300,
          url: apiUrl,
          statusCode: response.status,
        };
      } catch (error) {
        const endpointError = error as Error;
        console.log(
          `Endpoint ${endpoint} check failed: ${endpointError.message || 'Unknown error'}`
        );
      }
    }

    throw new Error('All backend endpoints failed to respond');
  } catch (error) {
    console.error('Backend check failed:', JSON.stringify(error, null, 2));

    const errorResponse: BackendStatus = {
      isRunning: false,
      url: apiUrl,
      error: error instanceof Error ? error.message : String(error),
      statusCode: (
        error as {
          response?: { status?: number };
        }
      )?.response?.status,
    };

    return errorResponse;
  }
};

export const getTroubleshootingSteps = (status: BackendStatus): string[] => {
  const steps: string[] = [];

  if (!status.isRunning) {
    steps.push(`Ensure the backend server is running at ${status.url}`);

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

    steps.push('Check network connectivity between frontend and backend');
    steps.push(
      'Verify that the API endpoint is correctly configured in your .env.local file'
    );
    steps.push(
      'Try running the backend server with "dotnet run" in the backend directory'
    );
  }

  return steps;
};
