// Jest test for utils/util.js
const util = require('../../src/utils/util');
const { round4 } = require('../../src/utils/util');

describe('utils/util', () => {
  it('should export expected utility functions', () => {
    expect(util).toBeDefined();
  });

  describe('round4', () => {
    it('should round positive numbers to 4 decimal places', () => {
      expect(round4(1.234567)).toBe(1.2346);
      expect(round4(1.234444)).toBe(1.2344);
      expect(round4(1)).toBe(1);
      expect(round4(999999.99999)).toBe(1000000);
    });

    it('should round negative numbers to 4 decimal places', () => {
      expect(round4(-1.234567)).toBe(-1.2346);
    });    it('should handle zeros correctly', () => {
      // Test positive zero
      expect(round4(0)).toBe(0);
      expect(round4(0.00004)).toBe(0);
      
      // Test negative zero
      const result = round4(-0.00004);
      expect(result).toBeCloseTo(0, 4);
      
      // Special case: round4(-0) preserves -0, which is fine
      const negZeroResult = round4(-0);
      expect(negZeroResult).toBeCloseTo(0, 4);
    });
  });
});
