function testJsonParsing() {
  console.log('=== JSON Parsing Test ===');

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

  function cleanJsonText(text) {
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
  }

  // Function to safely parse JSON
  function safeJsonParse(text) {
    if (!text || typeof text !== 'string') {
      console.warn('Input is not a string');
      return null;
    }

    try {
      return JSON.parse(text);
    } catch (error) {
      console.warn(
        'Standard JSON parsing failed, trying cleanup methods',
        JSON.stringify(error, null, 2)
      );

      try {
        const cleanedText = cleanJsonText(text);
        return JSON.parse(cleanedText);
      } catch (cleanError) {
        console.warn(
          'Cleaned JSON parsing failed, trying regex extraction',
          JSON.stringify(cleanError, null, 2)
        );

        try {
          const jsonMatch = text.match(/\{.*\}/s);
          if (jsonMatch && jsonMatch[0]) {
            return JSON.parse(jsonMatch[0]);
          }
        } catch (regexError) {
          console.error(
            'All JSON parsing methods failed',
            JSON.stringify(regexError, null, 2)
          );
        }

        return null;
      }
    }
  }

  testCases.forEach((testCase) => {
    console.group(`Test: ${testCase.name}`);
    console.log('Input:', JSON.stringify(testCase.input, null, 2));

    try {
      const standardResult = JSON.parse(testCase.input);
      console.log(
        'Standard JSON.parse succeeded:',
        JSON.stringify(standardResult, null, 2)
      );
    } catch (error) {
      console.log(
        'Standard JSON.parse failed:',
        JSON.stringify(error.message, null, 2)
      );

      const safeResult = safeJsonParse(testCase.input);
      if (safeResult) {
        console.log(
          'Safe JSON parsing succeeded:',
          JSON.stringify(safeResult, null, 2)
        );
      } else {
        console.log('Safe JSON parsing also failed');
      }
    }

    console.groupEnd();
  });

  console.log('=== Test Complete ===');
}

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

window.testJsonParsing = testJsonParsing;
