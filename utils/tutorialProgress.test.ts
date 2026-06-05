import {
  findNextTutorialTypeIndex,
  getTutorialProgress,
  getTutorialProgressText,
} from './tutorialProgress';

const tutorialTypesOrder = [
  { type: 'po', explanation: 'Podmet' },
  { type: 'př', explanation: 'Prisudek' },
  { type: 'pt', explanation: 'Predmet' },
  { type: 'pks', explanation: 'Privlastek shodny' },
  { type: 'pkn', explanation: 'Privlastek neshodny' },
  { type: 'puč', explanation: 'Prislovecne urceni casu' },
  { type: 'pum', explanation: 'Prislovecne urceni mista' },
  { type: 'pu příčiny', explanation: 'Prislovecne urceni priciny' },
  { type: 'pu míry', explanation: 'Prislovecne urceni miry' },
  { type: 'puz', explanation: 'Prislovecne urceni zpusobu' },
];

const simpleSentence = [
  { text: 'Bila', type: 'pks' },
  { text: 'kocka', type: 'po' },
  { text: 's flicky', type: 'pkn' },
  { text: 'ulovila', type: 'př' },
  { text: 'mys', type: 'pt' },
];

const advancedSentence = [
  { text: 'Bila', type: 'pks' },
  { text: 'kocka', type: 'po' },
  { text: 's flicky', type: 'pkn' },
  { text: 'vcera', type: 'puč' },
  { text: 'na zahrade', type: 'pum' },
  { text: 'z hladu', type: 'pu příčiny' },
  { text: 'velmi', type: 'pu míry' },
  { text: 'obratne', type: 'puz' },
  { text: 'ulovila', type: 'př' },
  { text: 'mys', type: 'pt' },
];

describe('tutorial progress helpers', () => {
  it('counts only tutorial types present in the selected sentence', () => {
    expect(getTutorialProgressText(simpleSentence, 0, tutorialTypesOrder)).toBe('0/5');
    expect(getTutorialProgressText(simpleSentence, 1, tutorialTypesOrder)).toBe('1/5');
    expect(getTutorialProgressText(simpleSentence, 4, tutorialTypesOrder)).toBe('4/5');
    expect(getTutorialProgressText(simpleSentence, 10, tutorialTypesOrder)).toBe('5/5');
  });

  it('keeps all ten steps for the advanced sentence', () => {
    expect(getTutorialProgress(advancedSentence, 0, tutorialTypesOrder)).toEqual({
      completed: 0,
      total: 10,
    });
    expect(getTutorialProgressText(advancedSentence, 10, tutorialTypesOrder)).toBe('10/10');
  });

  it('skips tutorial types that are not present in the selected sentence', () => {
    expect(findNextTutorialTypeIndex(simpleSentence, 5, tutorialTypesOrder)).toBe(10);
    expect(findNextTutorialTypeIndex(advancedSentence, 5, tutorialTypesOrder)).toBe(5);
  });
});
