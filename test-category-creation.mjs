import axios from 'axios';

const API_BASE_URL = 'http://localhost:5107';

async function testCategoryCreation() {
  try {
    console.log('Testing category creation...');
    
    const testCategory = {
      name: `Test Category ${Date.now()}`,
      description: 'Test category created by script',
      isVisible: true,
      isActive: true,
      displayOrder: 0,
      color: '#2196F3'
    };

    console.log('Sending data:', JSON.stringify(testCategory, null, 2));

    const response = await axios.post(`${API_BASE_URL}/api/categories`, testCategory, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    console.log('SUCCESS! Category created:', response.data);
    console.log('Response status:', response.status);
    
    return response.data;
  } catch (error) {
    console.error('ERROR creating category:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.message);
    console.error('Response data:', error.response?.data);
    
    throw error;
  }
}

// Run the test
testCategoryCreation()
  .then(() => {
    console.log('Test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Test failed:', error.message);
    process.exit(1);
  });