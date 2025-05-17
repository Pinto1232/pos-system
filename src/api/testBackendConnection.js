const axios = require('axios');

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5107';

async function testConnection() {
  try {
    console.log(`Testing connection to: ${API_URL}/api/Roles`);
    const response = await axios.get(`${API_URL}/api/Roles`);
    console.log('Connection successful!');
    console.log('Response status:', JSON.stringify(response.status, null, 2));
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('Connection failed!');
    if (error.response) {
      console.error('Response status:', JSON.stringify(error.response.status, null, 2));
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('No response received from server');
    } else {
      console.error('Error message:', JSON.stringify(error.message, null, 2));
    }
    return false;
  }
}

testConnection();
