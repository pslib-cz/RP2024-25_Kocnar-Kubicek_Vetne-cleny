import {
  buildQuestionAnalysis,
  countEnabledQuestionTypes,
  getQuestionSuccessColor,
  getQuestionTypeOptions,
} from './teacherGameDetailStats';

describe('teacher game detail stats', () => {
  it('counts and names enabled question types from the bitfield', () => {
    const options = getQuestionTypeOptions(0b10101101);

    expect(countEnabledQuestionTypes(0b10101101)).toBe(5);
    expect(options.filter((option) => option.enabled).map((option) => option.index)).toEqual([0, 2, 3, 5, 7]);
    expect(options[0].label).toBe('Označování věty členy');
    expect(options[1].enabled).toBe(false);
  });

  it('maps question success rates to clear status colors', () => {
    expect(getQuestionSuccessColor(null)).toBe('#60708F');
    expect(getQuestionSuccessColor(30)).toBe('#EF5350');
    expect(getQuestionSuccessColor(60)).toBe('#F9A825');
    expect(getQuestionSuccessColor(90)).toBe('#4CAF50');
  });

  it('builds compact per-question analysis from completed sessions', () => {
    const sessions = [
      {
        id: 'session-1',
        completed: true,
        player: { name: 'Anna' },
        answers: JSON.stringify([
          { correct: true, userSelections: { selectedWords: [{ word: 'vlak', selectedType: 'po', correctType: 'po' }] } },
          {
            correct: false,
            userSelections: {
              selectedOptions: [
                { text: 'do školy', type: 'pum', selected: true, correct: false },
                { text: 'šel', type: 'př', selected: false, correct: true },
              ],
            },
          },
        ]),
      },
      {
        id: 'session-2',
        completed: true,
        player: { name: 'Boris' },
        answers: JSON.stringify([
          { correct: false, userSelections: { selectedWords: [{ word: 'vlak', selectedType: 'pk', correctType: 'po' }] } },
          {
            correct: false,
            userSelections: {
              selectedOptions: [
                { text: 'do školy', type: 'pum', selected: true, correct: false },
                { text: 'šel', type: 'př', selected: false, correct: true },
              ],
            },
          },
        ]),
      },
      {
        id: 'session-3',
        completed: true,
        player: { name: 'Cyril' },
        answers: JSON.stringify([
          { correct: true, userSelections: { selectedWords: [{ word: 'vlak', selectedType: 'po', correctType: 'po' }] } },
          {
            correct: true,
            userSelections: {
              selectedOptions: [
                { text: 'do školy', type: 'pum', selected: false, correct: false },
                { text: 'šel', type: 'př', selected: true, correct: true },
              ],
            },
          },
        ]),
      },
    ];

    const analysis = buildQuestionAnalysis(1, sessions);

    expect(analysis.attempts).toBe(3);
    expect(analysis.correct).toBe(1);
    expect(analysis.wrong).toBe(2);
    expect(analysis.successRate).toBe(33);
    expect(analysis.wrongPlayers).toEqual(['Anna', 'Boris']);
    expect(analysis.mostCommonMistake).toEqual({
      text: '"do školy" (pum)',
      count: 2,
    });
  });
});
