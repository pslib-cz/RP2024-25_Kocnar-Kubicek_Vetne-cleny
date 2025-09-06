import { seededShuffle, processSeed } from './questionGeneratorUtils';

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

describe('processSeed', () => {
  describe('Numeric seeds', () => {
    it('should return the same number for numeric input', () => {
      expect(processSeed(12345)).toBe(12345);
      expect(processSeed(0)).toBe(0);
      expect(processSeed(-12345)).toBe(-12345);
    });

    it('should handle very large numbers', () => {
      const largeNumber = 999999999999;
      expect(processSeed(largeNumber)).toBe(largeNumber);
    });
  });

  describe('String seeds', () => {
    it('should convert string to consistent numeric value', () => {
      const seed = 'test-seed';
      const result1 = processSeed(seed);
      const result2 = processSeed(seed);
      
      expect(result1).toBe(result2);
      expect(typeof result1).toBe('number');
    });

    it('should produce different values for different strings', () => {
      const seed1 = 'hello';
      const seed2 = 'world';
      
      expect(processSeed(seed1)).not.toBe(processSeed(seed2));
    });

    it('should handle empty string', () => {
      const result = processSeed('');
      expect(typeof result).toBe('number');
      expect(result).toBe(0);
    });

    it('should handle special characters', () => {
      const specialChars = '!@#$%^&*()';
      const result = processSeed(specialChars);
      expect(typeof result).toBe('number');
    });

    it('should handle unicode characters', () => {
      const unicode = 'café';
      const result = processSeed(unicode);
      expect(typeof result).toBe('number');
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle NaN input gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      // @ts-ignore - intentionally passing invalid input
      const result = processSeed(NaN);
      
      expect(result).toBe(123);
      expect(consoleSpy).toHaveBeenCalledWith('Invalid seed provided to processSeed: NaN. Falling back to default seed.');
      
      consoleSpy.mockRestore();
    });

    it('should handle undefined input gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      // @ts-ignore - intentionally passing invalid input
      const result = processSeed(undefined);
      
      expect(result).toBe(123);
      expect(consoleSpy).toHaveBeenCalledWith('Invalid seed provided to processSeed: undefined. Falling back to default seed.');
      
      consoleSpy.mockRestore();
    });

    it('should handle null input gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      // @ts-ignore - intentionally passing invalid input
      const result = processSeed(null);
      
      expect(result).toBe(123);
      expect(consoleSpy).toHaveBeenCalledWith('Invalid seed provided to processSeed: null. Falling back to default seed.');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Consistency', () => {
    it('should produce consistent results for the same input', () => {
      const testCases = [
        12345,
        'test-string',
        'another-test',
        0,
        -1,
        'special!@#$%'
      ];

      testCases.forEach(seed => {
        const result1 = processSeed(seed);
        const result2 = processSeed(seed);
        expect(result1).toBe(result2);
      });
    });

    it('should produce different results for different inputs', () => {
      const seeds = [1, 2, 3, 'a', 'b', 'c'];
      const results = seeds.map(seed => processSeed(seed));
      
      // All results should be different
      for (let i = 0; i < results.length; i++) {
        for (let j = i + 1; j < results.length; j++) {
          expect(results[i]).not.toBe(results[j]);
        }
      }
    });
  });
});
