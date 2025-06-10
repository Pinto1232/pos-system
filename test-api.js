// Simple test script to check the API response
import fetch from 'node-fetch';

async function testAPI() {
  try {
    console.log('Testing pricing packages API...');
    const response = await fetch('http://localhost:3000/api/pricing-packages');

    console.log('Response status:', response.status);
    console.log(
      'Response headers:',
      Object.fromEntries(response.headers.entries())
    );

    const data = await response.json();
    console.log('Response data structure:');
    console.log('- totalItems:', data.totalItems);
    console.log('- data length:', data.data?.length);
    console.log(
      '- package titles:',
      data.data?.map((p) => p.title)
    );

    console.log('\nFirst package details:');
    console.log(JSON.stringify(data.data?.[0], null, 2));
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testAPI();
