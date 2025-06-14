export function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];
  const len1 = str1.length;
  const len2 = str2.length;

  for (let i = 0; i <= len2; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len1; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[len2][len1];
}

export function fuzzyScore(query: string, target: string): number {
  if (!query || !target) return 0;

  const queryLower = query.toLowerCase().trim();
  const targetLower = target.toLowerCase().trim();

  if (queryLower === targetLower) return 1;

  if (targetLower.startsWith(queryLower)) return 0.9;

  if (targetLower.includes(queryLower)) return 0.8;

  const distance = levenshteinDistance(queryLower, targetLower);
  const maxLength = Math.max(queryLower.length, targetLower.length);

  if (maxLength === 0) return 0;

  const similarity = 1 - distance / maxLength;

  return similarity >= 0.3 ? similarity * 0.7 : 0;
}

export function fuzzySearchMultipleFields(
  query: string,
  fields: string[]
): number {
  if (!query || fields.length === 0) return 0;

  let maxScore = 0;

  for (const field of fields) {
    if (field) {
      const score = fuzzyScore(query, field);
      maxScore = Math.max(maxScore, score);
    }
  }

  return maxScore;
}

export function fuzzySearchAndSort<T>(
  items: T[],
  query: string,
  getSearchFields: (item: T) => string[],
  minScore: number = 0.1
): Array<T & { searchScore: number }> {
  if (!query || query.trim().length === 0) {
    return items.map((item) => ({ ...item, searchScore: 1 }));
  }

  const itemsWithScores = items
    .map((item) => {
      const searchFields = getSearchFields(item);
      const score = fuzzySearchMultipleFields(query, searchFields);
      return { ...item, searchScore: score };
    })
    .filter((item) => item.searchScore >= minScore)
    .sort((a, b) => b.searchScore - a.searchScore);

  return itemsWithScores;
}
