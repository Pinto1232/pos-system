export function extractJsonObjects(text: string): unknown[] {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const results: any[] = [];
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

export function safeJsonParse<T>(text: string, validator?: (obj: unknown) => obj is T, fallback?: T): T | null | undefined {
  if (!text || typeof text !== 'string') {
    console.warn('safeJsonParse: Input is not a string');
    return fallback ?? null;
  }

  try {
    const parsed = JSON.parse(text);
    if (!validator || validator(parsed)) {
      return parsed;
    }

    console.warn('Standard JSON parse succeeded but validation failed');
  } catch (error) {
    console.warn('Standard JSON parsing failed, trying cleanup methods', JSON.stringify(error, null, 2));
  }

  try {
    const cleanedText = cleanJsonText(text);
    const parsed = JSON.parse(cleanedText);
    if (!validator || validator(parsed)) {
      return parsed;
    }
    console.warn('Cleaned JSON parse succeeded but validation failed');
  } catch (cleanError) {
    console.warn('Cleaned JSON parsing failed, trying multiple JSON extraction', JSON.stringify(cleanError, null, 2));
  }

  const jsonObjects = extractJsonObjects(text);
  console.log(`Found ${jsonObjects.length} potential JSON objects in the response`);

  jsonObjects.forEach((obj, index) => {
    console.log(`JSON object #${index + 1}:`, JSON.stringify(obj, null, 2));
    if (validator) {
      console.log(`Validation result for object #${index + 1}:`, JSON.stringify(validator(obj, null, 2)));
    }
  });

  if (validator && jsonObjects.length > 0) {
    for (const obj of jsonObjects) {
      if (validator(obj)) {
        console.log('Found valid object that matches expected structure:', JSON.stringify(obj, null, 2));
        return obj;
      }
    }
  }

  if (jsonObjects.length > 0) {
    const lastObject = jsonObjects[jsonObjects.length - 1];

    return lastObject as unknown as T;
  }

  return fallback ?? null;
}

export function cleanJsonText(text: string): string {
  let cleaned = text.replace(/^\uFEFF/, '');

  // Remove any leading or trailing non-JSON characters
  // Look for the first '{' or '[' character
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

  // Find the last '}' or ']' character
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

/**
 * Stringifies a value to JSON with error handling
 *
 * @param value - The value to stringify
 * @param space - Optional number of spaces for indentation
 * @returns The JSON string or null if stringification fails
 */
export function safeJsonStringify(value: any, space?: number): string | null {
  try {
    return JSON.stringify(value, null, space);
  } catch (error) {
    console.error('Error stringifying JSON:', JSON.stringify(error, null, 2));
    return null;
  }
}

/**
 * Checks if a string is valid JSON
 *
 * @param text - The text to check
 * @returns True if the text is valid JSON, false otherwise
 */
export function isValidJson(text: string): boolean {
  if (!text || typeof text !== 'string') {
    return false;
  }

  try {
    JSON.parse(text);
    return true;
  } catch (error) {
    return false;
  }
}

export default {
  safeJsonParse,
  cleanJsonText,
  safeJsonStringify,
  isValidJson,
};
