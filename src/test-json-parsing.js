/**
 * Test script for JSON parsing issues
 *
 * This script can be run in the browser console to test the JSON parsing
 * functionality and identify issues with malformed JSON responses.
 */

/**
 * Test function to simulate and fix JSON parsing issues
 */
function testJsonParsing() {
  console.log('=== JSON Parsing Test ===');

  // Test cases with various JSON issues
  const testCases = [
    {
      name: 'Valid JSON',
      input: '{"name":"John","age":30}',
      shouldPass: true,
    },
    {
      name: 'JSON with BOM',
      input: '\uFEFF{"name":"John","age":30}',
      shouldPass: true,
    },
    {
      name: 'JSON with leading characters',
      input: '123{"name":"John","age":30}',
      shouldPass: true,
    },
    {
      name: 'JSON with trailing characters',
      input: '{"name":"John","age":30}ABC',
      shouldPass: true,
    },
    {
      name: 'JSON with both leading and trailing characters',
      input: '123{"name":"John","age":30}ABC',
      shouldPass: true,
    },
    {
      name: 'Malformed JSON (missing closing brace)',
      input: '{"name":"John","age":30',
      shouldPass: false,
    },
  ];

  // Function to clean JSON text
  function cleanJsonText(text) {
    // Remove BOM (Byte Order Mark) if present
    let cleaned = text.replace(/^\uFEFF/, '');

    // Find the first JSON character ('{' or '[')
    const firstBrace = cleaned.indexOf('{');
    const firstBracket = cleaned.indexOf('[');

    let startIndex = -1;
    if (
      firstBrace !== -1 &&
      firstBracket !== -1
    ) {
      startIndex = Math.min(
        firstBrace,
        firstBracket
      );
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
      cleaned = cleaned.substring(
        0,
        endIndex + 1
      );
    }

    return cleaned;
  }

  // Function to safely parse JSON
  function safeJsonParse(text) {
    if (!text || typeof text !== 'string') {
      console.warn('Input is not a string');
      return null;
    }

    try {
      // First try standard parsing
      return JSON.parse(text);
    } catch (error) {
      console.warn(
        'Standard JSON parsing failed, trying cleanup methods',
        error
      );

      try {
        // Clean the text before parsing
        const cleanedText = cleanJsonText(text);
        return JSON.parse(cleanedText);
      } catch (cleanError) {
        console.warn(
          'Cleaned JSON parsing failed, trying regex extraction',
          cleanError
        );

        try {
          // Try to extract JSON using regex
          const jsonMatch = text.match(/\{.*\}/s);
          if (jsonMatch && jsonMatch[0]) {
            return JSON.parse(jsonMatch[0]);
          }
        } catch (regexError) {
          console.error(
            'All JSON parsing methods failed',
            regexError
          );
        }

        return null;
      }
    }
  }

  // Run the tests
  testCases.forEach((testCase) => {
    console.group(`Test: ${testCase.name}`);
    console.log('Input:', testCase.input);

    try {
      // Try standard JSON.parse
      const standardResult = JSON.parse(
        testCase.input
      );
      console.log(
        'Standard JSON.parse succeeded:',
        standardResult
      );
    } catch (error) {
      console.log(
        'Standard JSON.parse failed:',
        error.message
      );

      // Try our safe parsing method
      const safeResult = safeJsonParse(
        testCase.input
      );
      if (safeResult) {
        console.log(
          'Safe JSON parsing succeeded:',
          safeResult
        );
      } else {
        console.log(
          'Safe JSON parsing also failed'
        );
      }
    }

    console.groupEnd();
  });

  console.log('=== Test Complete ===');
}

// Instructions for running the test
console.log(`
=== JSON PARSING TEST SCRIPT ===
This script tests the JSON parsing functionality and identifies issues with malformed JSON responses.

To run the test:
1. Open the browser console (F12 or right-click > Inspect > Console)
2. Call the testJsonParsing() function in the console

The test will:
- Try parsing various JSON strings with common issues
- Show which parsing methods succeed or fail
- Demonstrate how our safe parsing method handles problematic JSON
`);

// Export the test function
window.testJsonParsing = testJsonParsing;
