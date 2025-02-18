import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api',
  withCredentials: true,
  timeout: 10000, 
});

axiosClient.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving access token:', error);
    }
    console.log('Request URL:', config.url); // Debug: log the request URL
    console.log('Request headers:', config.headers); // Debug: log the headers
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);


// Handle API Errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('Network Error or Server Unreachable:', error.message);
      return Promise.reject(new Error('Network error. Please try again.'));
    }

    const { status, data } = error.response;

    switch (status) {
      case 400:
        console.error('Bad Request:', data);
        return Promise.reject(new Error(data?.message || 'Bad request.'));
      case 401:
        console.warn('Unauthorized: Token may be expired.');
        localStorage.removeItem('accessToken');
        return Promise.reject(new Error('Unauthorized. Please log in again.'));
      case 403:
        console.warn('Forbidden: You do not have permission to access this resource.');
        return Promise.reject(new Error('Forbidden. You do not have access.'));
      case 404:
        console.warn('Not Found:', data);
        return Promise.reject(new Error('Requested resource not found.'));
      case 500:
        console.error('Server Error:', data);
        return Promise.reject(new Error('Internal server error. Try again later.'));
      default:
        console.error('API Error:', data);
        return Promise.reject(new Error(data?.message || 'An unknown error occurred.'));
    }
  }
);

export default axiosClient;
