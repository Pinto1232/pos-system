function testJsonScenarios() {
  console.log('=== JSON Parsing Scenarios Test ===');

  const { extractJsonObjects, safeJsonParse, cleanJsonText } = window.jsonUtils || {
    extractJsonObjects: function (text) {
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
    },

    cleanJsonText: function (text) {
      let cleaned = text.replace(/^\uFEFF/, '');

      // Find the first JSON character ('{' or '[')
      const firstBrace = cleaned.indexOf('{');
      const firstBracket = cleaned.indexOf('[');

      let startIndex = -1;
      if (firstBrace !== -1 && firstBracket !== -1) {
        startIndex = Math.min(firstBrace, firstBracket);
      } else if (firstBrace !== -1) {
        startIndex = firstBrace;
      } else if (firstBracket !== -1) {
        startIndex = firstBracket;
      }

      if (startIndex !== -1) {
        cleaned = cleaned.substring(startIndex);
      }

      // Find the last JSON character ('}' or ']')
      const lastBrace = cleaned.lastIndexOf('}');
      const lastBracket = cleaned.lastIndexOf(']');

      let endIndex = -1;
      if (lastBrace !== -1 && lastBracket !== -1) {
        endIndex = Math.max(lastBrace, lastBracket);
      } else if (lastBrace !== -1) {
        endIndex = lastBrace;
      } else if (lastBracket !== -1) {
        endIndex = lastBracket;
      }

      if (endIndex !== -1) {
        cleaned = cleaned.substring(0, endIndex + 1);
      }

      return cleaned;
    },

    safeJsonParse: function (text, validator, fallback) {
      if (!text || typeof text !== 'string') {
        console.warn('Input is not a string');
        return fallback || null;
      }

      try {
        const parsed = JSON.parse(text);
        if (!validator || validator(parsed)) {
          return parsed;
        }
      } catch (error) {
        console.warn('Standard JSON parsing failed, trying cleanup methods');
      }

      try {
        const cleanedText = this.cleanJsonText(text);
        const parsed = JSON.parse(cleanedText);
        if (!validator || validator(parsed)) {
          return parsed;
        }
      } catch (cleanError) {
        console.warn('Cleaned JSON parsing failed, trying multiple JSON extraction');
      }

      const jsonObjects = this.extractJsonObjects(text);

      if (validator && jsonObjects.length > 0) {
        for (const obj of jsonObjects) {
          if (validator(obj)) {
            return obj;
          }
        }
      }

      if (jsonObjects.length > 0) {
        return jsonObjects[jsonObjects.length - 1];
      }

      return fallback || null;
    },
  };

  const testScenarios = [
    {
      name: 'Standard valid JSON',
      input: '{"totalItems": 5, "data": [{"id": 1, "title": "Starter Plus"}]}',
      expectedType: 'pricing',
    },
    {
      name: 'JSON with BOM character',
      input: '\uFEFF{"totalItems": 5, "data": [{"id": 1, "title": "Starter Plus"}]}',
      expectedType: 'pricing',
    },
    {
      name: 'JSON with leading characters',
      input: '123{"totalItems": 5, "data": [{"id": 1, "title": "Starter Plus"}]}',
      expectedType: 'pricing',
    },
    {
      name: 'JSON with trailing characters',
      input: '{"totalItems": 5, "data": [{"id": 1, "title": "Starter Plus"}]}ABC',
      expectedType: 'pricing',
    },
    {
      name: 'Authentication error followed by valid data',
      input:
        '{"error": "Authentication failed", "message": "Invalid token"}{"totalItems": 5, "data": [{"id": 1, "title": "Starter Plus"}]}',
      expectedType: 'pricing',
      shouldHaveAuthError: true,
    },
    {
      name: 'Valid data followed by authentication error',
      input:
        '{"totalItems": 5, "data": [{"id": 1, "title": "Starter Plus"}]}{"error": "Authentication failed", "message": "Invalid token"}',
      expectedType: 'pricing',
      shouldHaveAuthError: true,
    },
    {
      name: 'Multiple valid JSON objects',
      input: '{"name": "Test"}{"totalItems": 5, "data": [{"id": 1, "title": "Starter Plus"}]}{"other": "data"}',
      expectedType: 'pricing',
    },
    {
      name: 'Malformed JSON',
      input: '{"totalItems": 5, "data": [{"id": 1, "title": "Starter Plus"',
      expectedType: 'fallback',
    },
  ];

  const isPricingPackagesResponse = (obj) => {
    return (
      obj &&
      typeof obj === 'object' &&
      'data' in obj &&
      Array.isArray(obj.data) &&
      'totalItems' in obj &&
      typeof obj.totalItems === 'number'
    );
  };

  const isAuthError = (obj) => {
    return obj && typeof obj === 'object' && 'error' in obj && obj.error === 'Authentication failed';
  };

  const fallbackData = {
    totalItems: 0,
    data: [],
    pageSize: 10,
    pageNumber: 1,
  };

  const results = testScenarios.map((scenario) => {
    console.group(`Test: ${scenario.name}`);
    console.log('Input:', scenario.input.substring(0, 100) + (scenario.input.length > 100 ? '...' : ''));

    // Extract all JSON objects
    const extractedObjects = extractJsonObjects(scenario.input);
    console.log(`Found ${extractedObjects.length} JSON objects`);

    // Check for auth errors
    const authErrors = extractedObjects.filter(isAuthError);
    console.log(`Found ${authErrors.length} authentication errors`);

    // Parse with validation
    const parsedData = safeJsonParse(scenario.input, isPricingPackagesResponse, fallbackData);
    console.log('Parsed data:', JSON.stringify(parsedData, null, 2));

    // Determine result type
    let resultType = 'unknown';
    if (isPricingPackagesResponse(parsedData)) {
      resultType = 'pricing';
    } else if (parsedData === fallbackData) {
      resultType = 'fallback';
    }

    const success = resultType === scenario.expectedType && (!scenario.shouldHaveAuthError || authErrors.length > 0);

    console.log(`Test ${success ? 'PASSED' : 'FAILED'}`);
    console.groupEnd();

    return {
      scenario: scenario.name,
      success,
      resultType,
      authErrors: authErrors.length,
      extractedObjects: extractedObjects.length,
    };
  });

  console.log('\n=== Test Summary ===');
  const passedTests = results.filter((r) => r.success).length;
  console.log(`Passed: ${passedTests}/${testScenarios.length} (${Math.round((passedTests / testScenarios.length) * 100)}%)`);

  return {
    results,
    passedTests,
    totalTests: testScenarios.length,
  };
}

console.log(`
=== JSON PARSING SCENARIOS TEST ===
This script tests various JSON parsing scenarios to ensure our solution is robust.

To run the test:
1. Open the browser console (F12 or right-click > Inspect > Console)
2. Call the testJsonScenarios() function in the console

The test will run through various scenarios including:
- Standard valid JSON
- JSON with BOM characters
- JSON with leading/trailing characters
- Concatenated JSON objects
- Authentication errors mixed with valid data
- Malformed JSON

Example usage:
const results = testJsonScenarios();
console.table(results.results); // View detailed test results
`);

window.testJsonScenarios = testJsonScenarios;

window.jsonUtils = {
  extractJsonObjects: function (text) {
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
  },
};
