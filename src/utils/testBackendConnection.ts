import axios from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5107';

export const testBackendConnection = async (): Promise<{
  isConnected: boolean;
  message: string;
  details?: Record<string, unknown>;
}> => {
  try {
    console.log('Testing backend connection to:', API_BASE_URL);

    const healthResponse = await axios.get(`${API_BASE_URL}/api/health`, {
      timeout: 5000,
    });

    console.log('Health check response:', healthResponse.data);

    const categoriesResponse = await axios.get(
      `${API_BASE_URL}/api/categories`,
      {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Categories endpoint response:', categoriesResponse.data);

    return {
      isConnected: true,
      message: 'Backend connection successful!',
      details: {
        health: healthResponse.data,
        categoriesCount: Array.isArray(categoriesResponse.data)
          ? categoriesResponse.data.length
          : 0,
      },
    };
  } catch (error: unknown) {
    console.error('Backend connection test failed:', error);

    let message = 'Backend connection failed';
    let details: Record<string, unknown> = {};

    const err = error as Record<string, unknown>;

    if (err.code === 'ECONNREFUSED' || err.code === 'ECONNABORTED') {
      message = `Cannot connect to backend at ${API_BASE_URL}. Please ensure the backend server is running.`;
    } else if (err.response) {
      const response = err.response as Record<string, unknown>;
      message = `Backend responded with error: ${response.status} ${response.statusText}`;
      details = {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
      };
    } else if (err.request) {
      message = 'No response received from backend server';
    } else {
      message = `Request setup error: ${err.message}`;
    }

    return {
      isConnected: false,
      message,
      details,
    };
  }
};

export const testCategoryCreation = async (
  testData?: Record<string, unknown>
): Promise<{
  success: boolean;
  message: string;
  details?: Record<string, unknown>;
}> => {
  try {
    const testCategory = testData || {
      name: `Test Category ${Date.now()}`,
      description: 'Test category created by frontend test',
      isVisible: true,
      isActive: true,
      displayOrder: 0,
    };

    console.log('Testing category creation with data:', testCategory);

    const response = await axios.post(
      `${API_BASE_URL}/api/categories`,
      testCategory,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    console.log('Category creation test response:', response.data);

    return {
      success: true,
      message: 'Category creation test successful!',
      details: response.data,
    };
  } catch (error: unknown) {
    console.error('Category creation test failed:', error);

    const err = error as Record<string, unknown>;
    const response = err.response as Record<string, unknown> | undefined;

    return {
      success: false,
      message:
        ((response?.data as Record<string, unknown>)?.message as string) ||
        (err.message as string) ||
        'Category creation test failed',
      details: (response?.data as Record<string, unknown>) || err,
    };
  }
};
