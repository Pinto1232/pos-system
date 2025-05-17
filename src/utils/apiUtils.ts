export function analyzeResponseText(responseText: string): {
  hasLeadingCharacters: boolean;
  hasTrailingCharacters: boolean;
  hasBOM: boolean;
  firstJsonChar: number;
  lastJsonChar: number;
  totalLength: number;
  firstFewChars: string;
  lastFewChars: string;
  charCodes: number[];
} {
  if (!responseText) {
    return {
      hasLeadingCharacters: false,
      hasTrailingCharacters: false,
      hasBOM: false,
      firstJsonChar: -1,
      lastJsonChar: -1,
      totalLength: 0,
      firstFewChars: '',
      lastFewChars: '',
      charCodes: [],
    };
  }

  // Check for BOM (Byte Order Mark)
  const hasBOM = responseText.charCodeAt(0) === 0xfeff;

  // Find the first JSON character ('{' or '[')
  const firstBrace = responseText.indexOf('{');
  const firstBracket = responseText.indexOf('[');

  let firstJsonChar = -1;
  if (firstBrace !== -1 && firstBracket !== -1) {
    firstJsonChar = Math.min(firstBrace, firstBracket);
  } else if (firstBrace !== -1) {
    firstJsonChar = firstBrace;
  } else if (firstBracket !== -1) {
    firstJsonChar = firstBracket;
  }

  // Find the last JSON character ('}' or ']')
  const lastBrace = responseText.lastIndexOf('}');
  const lastBracket = responseText.lastIndexOf(']');

  let lastJsonChar = -1;
  if (lastBrace !== -1 && lastBracket !== -1) {
    lastJsonChar = Math.max(lastBrace, lastBracket);
  } else if (lastBrace !== -1) {
    lastJsonChar = lastBrace;
  } else if (lastBracket !== -1) {
    lastJsonChar = lastBracket;
  }

  // Check if there are characters before or after the JSON
  const hasLeadingCharacters = firstJsonChar > 0;
  const hasTrailingCharacters = lastJsonChar !== -1 && lastJsonChar < responseText.length - 1;

  // Get the first and last few characters for debugging
  const firstFewChars = responseText.substring(0, Math.min(20, responseText.length));
  const lastFewChars = responseText.substring(Math.max(0, responseText.length - 20), responseText.length);

  // Get character codes for the first few characters
  const charCodes = Array.from(firstFewChars).map((char) => char.charCodeAt(0));

  return {
    hasLeadingCharacters,
    hasTrailingCharacters,
    hasBOM,
    firstJsonChar,
    lastJsonChar,
    totalLength: responseText.length,
    firstFewChars,
    lastFewChars,
    charCodes,
  };
}

/**
 * Logs detailed information about a fetch response for debugging
 *
 * @param response - The fetch Response object
 * @param responseText - The response text (if already available)
 * @param label - Optional label for the log
 */
export async function logResponseDetails(response: Response, responseText?: string, label = 'API Response'): Promise<void> {
  try {
    const text = responseText || (await response.clone().text());
    const analysis = analyzeResponseText(text);

    console.group(`${label} Details`);
    console.log('Status:', response.status, response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    console.log('Content-Type:', response.headers.get('content-type'));
    console.log('Response Length:', text.length);
    console.log('First 100 chars:', text.substring(0, 100));
    console.log('Analysis:', analysis);
    console.groupEnd();

    return;
  } catch (error) {
    console.error('Error logging response details:', error);
  }
}

const apiUtils = {
  analyzeResponseText,
  logResponseDetails,
};

export default apiUtils;
