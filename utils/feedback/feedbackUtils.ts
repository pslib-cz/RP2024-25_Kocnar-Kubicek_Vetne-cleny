export type LoadedSetItem = [string, string, ...string[]];
export type LoadedSets = LoadedSetItem[][][];

export type FeedbackCategoryId =
  | 'dataset-content'
  | 'exercise-evaluation'
  | 'tests-sharing'
  | 'learning-text'
  | 'technical-bug'
  | 'other';

export interface FeedbackCategory {
  id: FeedbackCategoryId;
  label: string;
  description: string;
  icon: string;
  needsDatasetSelection?: boolean;
}

export interface DatasetArea {
  index: number;
  name: string;
}

export interface DatasetWordEntry {
  text: string;
  type: string;
  index: number;
}

export interface DatasetSentenceEntry {
  id: string;
  areaIndex: number;
  areaName: string;
  sentenceIndex: number;
  sentenceText: string;
  words: DatasetWordEntry[];
}

export interface FeedbackDatasetSelection {
  entry: DatasetSentenceEntry;
  word?: DatasetWordEntry | null;
}

export interface FeedbackReport {
  categoryLabel: string;
  message: string;
  contact?: string;
  appVersion: string;
  datasetVersion: string;
  createdAt?: string;
  datasetSelection?: FeedbackDatasetSelection | null;
}

interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordWebhookPayload {
  username: string;
  content: string;
  embeds: Array<{
    title: string;
    description: string;
    color: number;
    timestamp: string;
    fields: DiscordEmbedField[];
  }>;
}

export const FEEDBACK_CATEGORIES: FeedbackCategory[] = [
  {
    id: 'dataset-content',
    label: 'Chyba v zadání nebo označení větného členu',
    description: 'Špatné slovo, věta, zkratka nebo správný typ odpovědi.',
    icon: 'fact-check',
    needsDatasetSelection: true,
  },
  {
    id: 'exercise-evaluation',
    label: 'Problém se cvičením nebo vyhodnocením',
    description: 'Cvičení se chová divně, neuzná správnou odpověď nebo ukáže špatný výsledek.',
    icon: 'sports-esports',
  },
  {
    id: 'tests-sharing',
    label: 'Testy a sdílená hra',
    description: 'Vytvoření, připojení, historie nebo sdílení testu nefunguje správně.',
    icon: 'quiz',
  },
  {
    id: 'learning-text',
    label: 'Překlep nebo špatný text v aplikaci',
    description: 'Chyba v nápovědě, výuce, zkratkách, zásadách nebo jiném textu.',
    icon: 'spellcheck',
  },
  {
    id: 'technical-bug',
    label: 'Technická chyba aplikace',
    description: 'Pád aplikace, zamrznutí, problém s načítáním nebo ovládáním.',
    icon: 'bug-report',
  },
  {
    id: 'other',
    label: 'Jiná připomínka nebo návrh',
    description: 'Nápad, nejasnost nebo problém, který nespadá do ostatních kategorií.',
    icon: 'chat-bubble-outline',
  },
];

export const DATASET_AREAS: DatasetArea[] = [
  { index: 0, name: 'Všechny členy' },
  { index: 1, name: 'Základní členy' },
  { index: 2, name: 'Přívlastky' },
  { index: 3, name: 'Příslovečná určení' },
  { index: 4, name: 'Doplňky' },
];

const getDatasetAreaName = (areaIndex: number): string =>
  DATASET_AREAS.find((area) => area.index === areaIndex)?.name ?? `Sada ${areaIndex + 1}`;

const normalizeSearchText = (value: string): string =>
  value
    .toLocaleLowerCase('cs-CZ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const truncateDiscordValue = (value: string, maxLength = 1000): string => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1)}…`;
};

const field = (name: string, value: string | undefined, inline = false): DiscordEmbedField | null => {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  return {
    name,
    value: truncateDiscordValue(trimmed),
    inline,
  };
};

export const buildDatasetSentenceIndex = (loadedSets: LoadedSets): DatasetSentenceEntry[] => {
  return loadedSets.flatMap((area, areaIndex) =>
    area.map((sentence, sentenceIndex) => {
      const words = sentence.map((item, index) => ({
        text: item[0],
        type: item[1],
        index,
      }));

      return {
        id: `area-${areaIndex}-sentence-${sentenceIndex}`,
        areaIndex,
        areaName: getDatasetAreaName(areaIndex),
        sentenceIndex,
        sentenceText: words.map((word) => word.text).join(' '),
        words,
      };
    })
  );
};

export const searchDatasetEntries = (
  entries: DatasetSentenceEntry[],
  query: string,
  limit = 30
): DatasetSentenceEntry[] => {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];

  return entries
    .map((entry) => {
      const areaName = normalizeSearchText(entry.areaName);
      const sentenceText = normalizeSearchText(entry.sentenceText);
      const wordsText = normalizeSearchText(entry.words.map((word) => `${word.text} ${word.type}`).join(' '));

      let score = 0;
      if (sentenceText.includes(normalizedQuery)) score += 4;
      if (wordsText.includes(normalizedQuery)) score += 3;
      if (areaName.includes(normalizedQuery)) score += 2;
      if (entry.words.some((word) => normalizeSearchText(word.type) === normalizedQuery)) score += 3;
      if (entry.words.some((word) => normalizeSearchText(word.text).startsWith(normalizedQuery))) score += 1;

      return { entry, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.entry.areaIndex - b.entry.areaIndex || a.entry.sentenceIndex - b.entry.sentenceIndex)
    .slice(0, limit)
    .map(({ entry }) => entry);
};

export const buildDiscordFeedbackPayload = (report: FeedbackReport): DiscordWebhookPayload => {
  const createdAt = report.createdAt ?? new Date().toISOString();
  const datasetSelection = report.datasetSelection;
  const selectedWord = datasetSelection?.word;
  const fields = [
    field('Kontakt', report.contact, false),
    field('Verze aplikace', report.appVersion, true),
    field('Verze dat', report.datasetVersion, true),
    field('Část hry', datasetSelection?.entry.areaName, true),
    field('ID věty', datasetSelection?.entry.id, true),
    field('Věta', datasetSelection?.entry.sentenceText, false),
    field('Vybrané slovo', selectedWord ? `${selectedWord.text} (${selectedWord.type})` : undefined, true),
  ].filter((item): item is DiscordEmbedField => item !== null);

  return {
    username: 'Větná dráha feedback',
    content: 'Nové hlášení z aplikace Větná dráha',
    embeds: [
      {
        title: report.categoryLabel,
        description: truncateDiscordValue(report.message.trim() || 'Bez popisu', 4000),
        color: 0x5865f2,
        timestamp: createdAt,
        fields,
      },
    ],
  };
};

export const sendFeedbackReport = async (webhookUrl: string | undefined, report: FeedbackReport): Promise<void> => {
  if (!webhookUrl) {
    throw new Error('Chybí konfigurace pro odesílání hlášení.');
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(buildDiscordFeedbackPayload(report)),
  });

  if (!response.ok) {
    throw new Error(`Hlášení se nepodařilo odeslat (${response.status}).`);
  }
};
