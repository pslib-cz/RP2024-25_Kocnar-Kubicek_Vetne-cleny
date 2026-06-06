import { COSMIC_BACKGROUND_STRUCTURES, COSMIC_BACKGROUND_STARS } from './cosmicBackground';

describe('cosmic background data', () => {
  it('keeps stars extremely small and subtle', () => {
    expect(COSMIC_BACKGROUND_STARS.length).toBeGreaterThanOrEqual(42);
    expect(COSMIC_BACKGROUND_STARS.every((star) => star.size > 0 && star.size <= 2)).toBe(true);
    expect(COSMIC_BACKGROUND_STARS.every((star) => star.opacity >= 0.16 && star.opacity <= 0.72)).toBe(true);
  });

  it('contains a few faint structures without dominating the background', () => {
    expect(COSMIC_BACKGROUND_STRUCTURES.length).toBeGreaterThanOrEqual(4);
    expect(COSMIC_BACKGROUND_STRUCTURES.every((structure) => structure.opacity <= 0.18)).toBe(true);
  });
});
