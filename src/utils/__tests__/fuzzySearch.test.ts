import {
  levenshteinDistance,
  fuzzyScore,
  fuzzySearchMultipleFields,
  fuzzySearchAndSort,
} from '../fuzzySearch';

describe('fuzzySearch', () => {
  describe('levenshteinDistance', () => {
    it('should return 0 for identical strings', () => {
      expect(levenshteinDistance('hello', 'hello')).toBe(0);
    });

    it('should calculate distance correctly', () => {
      expect(levenshteinDistance('cat', 'bat')).toBe(1);
      expect(levenshteinDistance('hello', 'world')).toBe(4);
      expect(levenshteinDistance('', 'hello')).toBe(5);
    });
  });

  describe('fuzzyScore', () => {
    it('should return 1 for exact matches', () => {
      expect(fuzzyScore('hello', 'hello')).toBe(1);
      expect(fuzzyScore('HELLO', 'hello')).toBe(1);
    });

    it('should return high score for startsWith matches', () => {
      expect(fuzzyScore('hel', 'hello')).toBe(0.9);
    });

    it('should return medium score for contains matches', () => {
      expect(fuzzyScore('ell', 'hello')).toBe(0.8);
    });

    it('should return 0 for empty query or target', () => {
      expect(fuzzyScore('', 'hello')).toBe(0);
      expect(fuzzyScore('hello', '')).toBe(0);
    });
  });

  describe('fuzzySearchMultipleFields', () => {
    it('should return highest score across fields', () => {
      const fields = ['apple', 'banana', 'cherry'];
      expect(fuzzySearchMultipleFields('apple', fields)).toBe(1);
      expect(fuzzySearchMultipleFields('ban', fields)).toBe(0.9);
    });
  });

  describe('fuzzySearchAndSort', () => {
    const testItems = [
      { id: 1, name: 'iPhone 12', barcode: '123456789' },
      { id: 2, name: 'Samsung Galaxy', barcode: '987654321' },
      { id: 3, name: 'iPad Pro', barcode: '456789123' },
    ];

    it('should return all items when no query', () => {
      const result = fuzzySearchAndSort(testItems, '', (item) => [
        item.name,
        item.barcode,
      ]);
      expect(result).toHaveLength(3);
      expect(result[0].searchScore).toBe(1);
    });

    it('should filter and sort by relevance', () => {
      const result = fuzzySearchAndSort(testItems, 'iPhone', (item) => [
        item.name,
        item.barcode,
      ]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('iPhone 12');
      expect(result[0].searchScore).toBe(0.9); // startsWith match
    });

    it('should search in multiple fields', () => {
      const result = fuzzySearchAndSort(
        testItems,
        '123456789',
        (item) => [item.name, item.barcode],
        0.5 // Higher threshold to get exact match only
      );
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('iPhone 12');
    });
  });
});
