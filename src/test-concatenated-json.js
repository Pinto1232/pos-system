function testConcatenatedJson() {
  console.log('=== Concatenated JSON Test ===');

  const concatenatedJson = `{"error": "Authentication failed", "message": "Invalid token"}{"totalItems": 5, "data": [{"id": 1, "title": "Starter Plus", "description": "Basic POS functionality", "icon": "MUI:StarIcon", "extraDescription": "Perfect for small businesses", "price": 39.99, "testPeriodDays": 14, "type": "starter-plus", "currency": "USD", "multiCurrencyPrices": "{\"ZAR\": 699.99, \"EUR\": 36.99, \"GBP\": 31.99}"}], "pageSize": 10, "pageNumber": 1}`;

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

  console.log('Extracting JSON objects from concatenated string...');
  const extractedObjects = extractJsonObjects(concatenatedJson);
  console.log(`Found ${extractedObjects.length} JSON objects:`, JSON.stringify(extractedObjects, null, 2));

  const authErrors = extractedObjects.filter(isAuthError);
  if (authErrors.length > 0) {
    console.warn('Authentication errors found:', JSON.stringify(authErrors, null, 2));
  }

  const pricingData = extractedObjects.find(isPricingPackagesResponse);
  if (pricingData) {
    console.log('Found valid pricing packages data:', JSON.stringify(pricingData, null, 2));
  } else {
    console.error('No valid pricing packages data found');
  }

  console.log('\nTesting standard JSON.parse (should fail):');
  try {
    const standardParsed = JSON.parse(concatenatedJson);
    console.log('Standard JSON.parse succeeded (unexpected):', JSON.stringify(standardParsed, null, 2));
  } catch (error) {
    console.log('Standard JSON.parse failed as expected:', JSON.stringify(error.message, null, 2));
  }

  console.log('\n=== Test Complete ===');

  return {
    extractedObjects,
    authErrors,
    pricingData,
  };
}

console.log(`
=== CONCATENATED JSON TEST SCRIPT ===
This script tests the handling of concatenated JSON objects in API responses.

To run the test:
1. Open the browser console (F12 or right-click > Inspect > Console)
2. Call the testConcatenatedJson() function in the console

The test will:
- Extract multiple JSON objects from a concatenated string
- Identify authentication errors
- Find valid pricing packages data
- Show how standard JSON.parse fails with concatenated JSON

Example usage:
const result = testConcatenatedJson();
console.log(result.pricingData); // View the extracted pricing data
`);

window.testConcatenatedJson = testConcatenatedJson;
