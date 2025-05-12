// Simple script to test backend connection
const axios = require('axios');

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5107';

async function testConnection() {
  try {
    console.log(
      `Testing connection to: ${API_URL}/api/Roles`
    );
    const response = await axios.get(
      `${API_URL}/api/Roles`
    );
    console.log('Connection successful!');
    console.log(
      'Response status:',
      response.status
    );
    console.log('Response data:', response.data);
    return true;
  } catch (error) {
    console.error('Connection failed!');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(
        'Response status:',
        error.response.status
      );
      console.error(
        'Response data:',
        error.response.data
      );
    } else if (error.request) {
      // The request was made but no response was received
      console.error(
        'No response received from server'
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error(
        'Error message:',
        error.message
      );
    }
    return false;
  }
}

testConnection();
