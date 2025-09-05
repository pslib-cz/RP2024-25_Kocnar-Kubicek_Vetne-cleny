import { seededShuffle } from './questionGeneratorUtils';

describe('seededShuffle', () => {
  const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const shortArray = [1, 2, 3];
  const stringArray = ['apple', 'banana', 'cherry', 'date', 'elderberry'];

  describe('Deterministic behavior', () => {
    it('should produce the same result for the same seed', () => {
      const seed = 12345;
      const result1 = seededShuffle(testArray, seed);
      const result2 = seededShuffle(testArray, seed);
      
      expect(result1).toEqual(result2);
    });

    it('should produce the same result for the same string seed', () => {
      const seed = 'test-seed';
      const result1 = seededShuffle(testArray, seed);
      const result2 = seededShuffle(testArray, seed);
      
      expect(result1).toEqual(result2);
    });
  });

  describe('Different seeds produce different results', () => {
    it('should produce different results for different numeric seeds', () => {
      const seed1 = 12345;
      const seed2 = 54321;
      const result1 = seededShuffle(testArray, seed1);
      const result2 = seededShuffle(testArray, seed2);
      
      expect(result1).not.toEqual(result2);
    });

    it('should produce different results for different string seeds', () => {
      const seed1 = 'seed-one';
      const seed2 = 'seed-two';
      const result1 = seededShuffle(testArray, seed1);
      const result2 = seededShuffle(testArray, seed2);
      
      expect(result1).not.toEqual(result2);
    });
  });

  describe('Array integrity', () => {
    it('should return an array with the same length', () => {
      const result = seededShuffle(testArray, 12345);
      expect(result.length).toBe(testArray.length);
    });

    it('should contain all original elements', () => {
      const result = seededShuffle(testArray, 12345);
      
      testArray.forEach(element => {
        expect(result).toContain(element);
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty arrays', () => {
      const emptyArray: number[] = [];
      const result = seededShuffle(emptyArray, 12345);
      
      expect(result).toEqual([]);
    });

    it('should handle single-element arrays', () => {
      const singleElement = [42];
      const result = seededShuffle(singleElement, 12345);
      
      expect(result).toEqual([42]);
    });

    it('should handle zero seed', () => {
      const result1 = seededShuffle(testArray, 0);
      const result2 = seededShuffle(testArray, 0);
      
      expect(result1).toEqual(result2);
    });

    it('should handle negative seeds', () => {
      const result1 = seededShuffle(testArray, -12345);
      const result2 = seededShuffle(testArray, -12345);
      
      expect(result1).toEqual(result2);
    });

    it('should handle very large seeds', () => {
      const largeSeed = 999999999999;
      const result1 = seededShuffle(testArray, largeSeed);
      const result2 = seededShuffle(testArray, largeSeed);
      
      expect(result1).toEqual(result2);
    });
  });
});
