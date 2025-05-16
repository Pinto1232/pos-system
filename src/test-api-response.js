/**
 * Test utility for simulating and analyzing the concatenated JSON API response
 *
 * This script can be run in the browser console to test how our solution
 * handles the specific concatenated JSON pattern in the API response.
 */

/**
 * Test function to simulate and analyze the API response
 */
function testApiResponse() {
  console.log('=== API Response Test ===');

  // Sample concatenated JSON with authentication error followed by valid pricing data
  const sampleResponse = `{"error": "Authentication failed", "message": "Invalid token"}{"totalItems":10,"data":[{"id":1,"title":"Starter","description":"Select the essential modules and features for your business.;Ideal for small businesses or those new to POS systems.","icon":"MUI:StartIcon","extraDescription":"This package is perfect for startups and small businesses.","price":29.99,"testPeriodDays":14,"type":"starter","descriptionList":["Select the essential modules and features for your business.","Ideal for small businesses or those new to POS systems."],"isCustomizable":false,"currency":"USD","multiCurrencyPrices":"{}"}]}`;

  // Function to extract all valid JSON objects from a string
  function extractJsonObjects(text) {
    if (!text || typeof text !== 'string') {
      return [];
    }

    const results = [];
    let currentPos = 0;

    while (currentPos < text.length) {
      // Find the start of a JSON object
      const startBrace = text.indexOf(
        '{',
        currentPos
      );
      if (startBrace === -1) break;

      // Track nested braces to find the matching closing brace
      let braceCount = 1;
      let endBrace = startBrace + 1;

      while (
        braceCount > 0 &&
        endBrace < text.length
      ) {
        if (text[endBrace] === '{') {
          braceCount++;
        } else if (text[endBrace] === '}') {
          braceCount--;
        }
        endBrace++;
      }

      if (braceCount === 0) {
        // We found a complete JSON object
        const jsonStr = text.substring(
          startBrace,
          endBrace
        );
        try {
          const parsed = JSON.parse(jsonStr);
          results.push(parsed);
        } catch (e) {
          // Skip invalid JSON
          console.warn(
            'Found invalid JSON object:',
            jsonStr.substring(0, 100) + '...'
          );
        }
      }

      // Move past this object
      currentPos = endBrace;
    }

    return results;
  }

  // Function to validate if an object matches the expected pricing packages structure
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

  // Function to validate if an object is an authentication error
  function isAuthError(obj) {
    return (
      obj &&
      typeof obj === 'object' &&
      'error' in obj &&
      obj.error === 'Authentication failed'
    );
  }

  // Enhanced console logging for better debugging
  console.group('API Response Analysis');
  console.log(
    'Raw response first 100 chars:',
    sampleResponse.substring(0, 100) + '...'
  );

  // Extract all JSON objects from the response
  const extractedObjects = extractJsonObjects(
    sampleResponse
  );
  console.log(
    `Found ${extractedObjects.length} JSON objects:`
  );

  // Log each extracted object in a formatted way
  extractedObjects.forEach((obj, index) => {
    console.group(`JSON Object #${index + 1}`);
    console.log(JSON.stringify(obj, null, 2)); // Pretty print with 2-space indentation
    console.groupEnd();
  });

  // Check for authentication errors in the response
  const authErrors =
    extractedObjects.filter(isAuthError);
  if (authErrors.length > 0) {
    console.group('Authentication Errors');
    authErrors.forEach((error, index) => {
      console.log(
        `Error #${index + 1}:`,
        JSON.stringify(error, null, 2)
      );
    });
    console.groupEnd();
    console.warn(
      'Authentication errors found in response, but continuing processing'
    );
  }

  // Log the valid pricing data if found
  const pricingData = extractedObjects.find(
    isPricingPackagesResponse
  );
  if (pricingData) {
    console.group('Valid Pricing Data');
    console.log(
      'Total Items:',
      pricingData.totalItems
    );
    console.log(
      'Data Length:',
      pricingData.data.length
    );
    console.log(
      'First Item:',
      JSON.stringify(pricingData.data[0], null, 2)
    );
    console.groupEnd();
  }

  console.groupEnd(); // End API Response Analysis group

  return {
    extractedObjects,
    authErrors,
    pricingData,
  };
}

// Instructions for running the test
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

// Export the test function
window.testApiResponse = testApiResponse;
