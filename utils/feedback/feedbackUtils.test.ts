import {
  buildDatasetSentenceIndex,
  buildDiscordFeedbackPayload,
  searchDatasetEntries,
} from './feedbackUtils';
import type { LoadedSets } from './feedbackUtils';

const loadedSets: LoadedSets = [
  [
    [
      ['Na nebi', 'pum'],
      ['se hemžily', 'př'],
      ['hvězdy.', 'po'],
    ],
    [
      ['Bílá kočka', 'po'],
      ['spala', 'př'],
    ],
  ],
  [
    [
      ['krásná', 'pks'],
      ['zahrada', 'po'],
    ],
  ],
  [],
];

describe('feedback dataset helpers', () => {
  it('builds stable entries from nested loaded sentence sets', () => {
    const entries = buildDatasetSentenceIndex(loadedSets);

    expect(entries).toHaveLength(3);
    expect(entries[0]).toEqual({
      id: 'area-0-sentence-0',
      areaIndex: 0,
      areaName: 'Všechny členy',
      sentenceIndex: 0,
      sentenceText: 'Na nebi se hemžily hvězdy.',
      words: [
        { text: 'Na nebi', type: 'pum', index: 0 },
        { text: 'se hemžily', type: 'př', index: 1 },
        { text: 'hvězdy.', type: 'po', index: 2 },
      ],
    });
  });

  it('searches by sentence text, word text, type, and area label', () => {
    const entries = buildDatasetSentenceIndex(loadedSets);

    expect(searchDatasetEntries(entries, 'hvězdy').map((entry) => entry.id)).toEqual(['area-0-sentence-0']);
    expect(searchDatasetEntries(entries, 'pks').map((entry) => entry.id)).toEqual(['area-1-sentence-0']);
    expect(searchDatasetEntries(entries, 'základní').map((entry) => entry.id)).toEqual(['area-1-sentence-0']);
  });
});

describe('Discord feedback payload', () => {
  it('formats category, message, app metadata, and selected dataset context', () => {
    const entry = buildDatasetSentenceIndex(loadedSets)[0];
    const payload = buildDiscordFeedbackPayload({
      categoryLabel: 'Chyba v zadání nebo označení větného členu',
      message: 'Slovo má špatný typ.',
      contact: 'student@example.com',
      appVersion: '1.1.1',
      datasetVersion: 'v0',
      createdAt: '2026-06-05T10:00:00.000Z',
      datasetSelection: {
        entry,
        word: entry.words[2],
      },
    });

    expect(payload.username).toBe('Větná dráha feedback');
    expect(payload.embeds[0].title).toBe('Chyba v zadání nebo označení větného členu');
    expect(payload.embeds[0].description).toBe('Slovo má špatný typ.');
    expect(payload.embeds[0].timestamp).toBe('2026-06-05T10:00:00.000Z');
    expect(payload.embeds[0].fields).toEqual(
      expect.arrayContaining([
        { name: 'Kontakt', value: 'student@example.com', inline: false },
        { name: 'Verze aplikace', value: '1.1.1', inline: true },
        { name: 'Verze dat', value: 'v0', inline: true },
        { name: 'Část hry', value: 'Všechny členy', inline: true },
        { name: 'Věta', value: 'Na nebi se hemžily hvězdy.', inline: false },
        { name: 'Vybrané slovo', value: 'hvězdy. (po)', inline: true },
      ])
    );
  });
});
