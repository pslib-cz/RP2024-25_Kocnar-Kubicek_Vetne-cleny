import { generateRandomGameLevels, generateRandomMistakesLevels } from '../GameDataGenerator';
import { GameRoute } from '@/constants/gameRoute';
import { WordSelectionOption } from '@/types/games/SelectionOption';

describe('GameDataGenerator', () => {
  const mockData: WordSelectionOption[][] = [
    [{ text: 'A', type: 'po' }],
    [{ text: 'B', type: 'př' }],
    [{ text: 'C', type: 'pum' }],
  ];

  it('generateRandomGameLevels returns correct number of levels', () => {
    const levels = generateRandomGameLevels(2, 42, mockData);
    expect(levels).toHaveLength(2);
    levels.forEach(level => {
      expect(Object.values(GameRoute)).toContain(level.game);
      expect(mockData).toContainEqual(level.WordSelectionOption);
      expect(level.result).toBe("");
    });
  });

  it('generateRandomMistakesLevels returns correct number of levels', () => {
    const levels = generateRandomMistakesLevels(2, 42, mockData);
    expect(levels).toHaveLength(2);
    levels.forEach(level => {
      expect(Object.values(GameRoute)).toContain(level.game);
      expect(mockData).toContainEqual(level.WordSelectionOption);
      expect(level.result).toBe("");
    });
  });

  it('generateRandomMistakesLevels returns [] if not enough mistakes', () => {
    const levels = generateRandomMistakesLevels(4, 42, mockData);
    expect(levels).toEqual([]);
  });

  it('generateRandomMistakesLevels returns [] if mistakes is empty', () => {
    const levels = generateRandomMistakesLevels(2, 42, []);
    expect(levels).toEqual([]);
  });
});
