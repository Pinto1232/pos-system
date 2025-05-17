function testApiResponse() {
  console.log('=== API Response Test ===');

  const sampleResponse = `{"error": "Authentication failed", "message": "Invalid token"}{"totalItems":10,"data":[{"id":1,"title":"Starter","description":"Select the essential modules and features for your business.;Ideal for small businesses or those new to POS systems.","icon":"MUI:StartIcon","extraDescription":"This package is perfect for startups and small businesses.","price":29.99,"testPeriodDays":14,"type":"starter","descriptionList":["Select the essential modules and features for your business.","Ideal for small businesses or those new to POS systems."],"isCustomizable":false,"currency":"USD","multiCurrencyPrices":"{}"}]}`;

  function extractJsonObjects(text) {
    if (!text || typeof text !== 'string') {
      return [];
    }

    const results = [];
    let currentPos = 0;

    while (currentPos < text.length) {
      const startBrace = text.indexOf('{', currentPos);
      if (startBrace === -1) break;

      let braceCount = 1;
      let endBrace = startBrace + 1;

      while (braceCount > 0 && endBrace < text.length) {
        if (text[endBrace] === '{') {
          braceCount++;
        } else if (text[endBrace] === '}') {
          braceCount--;
        }
        endBrace++;
      }

      if (braceCount === 0) {
        const jsonStr = text.substring(startBrace, endBrace);
        try {
          const parsed = JSON.parse(jsonStr);
          results.push(parsed);
        } catch (e) {
          console.warn('Found invalid JSON object:', jsonStr.substring(0, 100) + '...');
        }
      }

      currentPos = endBrace;
    }

    return results;
  }

  function isPricingPackagesResponse(obj) {
    return (
      obj &&
      typeof obj === 'object' &&
      'data' in obj &&
      Array.isArray(obj.data) &&
      obj.data.length > 0 &&
      'totalItems' in obj &&
      typeof obj.totalItems === 'number'
    );
  }

  function isAuthError(obj) {
    return obj && typeof obj === 'object' && 'error' in obj && obj.error === 'Authentication failed';
  }

  console.group('API Response Analysis');
  console.log('Raw response first 100 chars:', sampleResponse.substring(0, 100) + '...');

  const extractedObjects = extractJsonObjects(sampleResponse);
  console.log(`Found ${extractedObjects.length} JSON objects:`);

  extractedObjects.forEach((obj, index) => {
    console.group(`JSON Object #${index + 1}`);
    console.log(JSON.stringify(obj, null, 2));
    console.groupEnd();
  });

  const authErrors = extractedObjects.filter(isAuthError);
  if (authErrors.length > 0) {
    console.group('Authentication Errors');
    authErrors.forEach((error, index) => {
      console.log(`Error #${index + 1}:`, JSON.stringify(error, null, 2));
    });
    console.groupEnd();
    console.warn('Authentication errors found in response, but continuing processing');
  }

  const pricingData = extractedObjects.find(isPricingPackagesResponse);
  if (pricingData) {
    console.group('Valid Pricing Data');
    console.log('Total Items:', JSON.stringify(pricingData.totalItems, null, 2));
    console.log('Data Length:', JSON.stringify(pricingData.data.length, null, 2));
    console.log('First Item:', JSON.stringify(pricingData.data[0], null, 2));
    console.groupEnd();
  }

  console.groupEnd();

  return {
    extractedObjects,
    authErrors,
    pricingData,
  };
}

console.log(`
=== API RESPONSE TEST UTILITY ===
This script tests how our solution handles the specific concatenated JSON pattern in the API response.

To run the test:
1. Open the browser console (F12 or right-click > Inspect > Console)
2. Call the testApiResponse() function in the console

The test will:
- Simulate the exact API response with concatenated JSON objects
- Extract and display each JSON object in a formatted way
- Identify authentication errors
- Find and display the valid pricing data

Example usage:
const result = testApiResponse();
console.log(result.pricingData); // View the extracted pricing data
`);

window.testApiResponse = testApiResponse;
