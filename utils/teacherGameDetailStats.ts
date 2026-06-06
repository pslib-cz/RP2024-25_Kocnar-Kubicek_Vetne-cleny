export const QUESTION_TYPE_LABELS = [
  'Označování věty členy',
  'Označování členů větou',
  'Označování věty (jedno slovo)',
  'Označování věty (všechny členy)',
  'Vybírání bez věty',
  'Vybírání s větou (více možností)',
  'Vybírání s větou (jedna možnost)',
  'Vybírání členu',
] as const;

export const QUESTION_TYPE_SHORT_LABELS = [
  'Označ slova',
  'Označ typy',
  'Typ slova',
  'Všechny členy',
  'Výběr bez věty',
  'Výběr ve větě',
  'Jedno slovo',
  'Výběr členu',
] as const;

export type QuestionTypeOption = {
  index: number;
  label: string;
  enabled: boolean;
};

type SessionLike = {
  id?: string;
  playerId?: string;
  completed?: boolean;
  answers?: string;
  player?: {
    name?: string;
  };
};

type SelectedWord = {
  word?: string;
  selectedType?: string;
  correctType?: string;
};

type SelectedOption = {
  text?: string;
  type?: string;
  selected?: boolean;
  correct?: boolean;
};

type StoredAnswer = {
  correct?: boolean;
  userSelections?: {
    selectedWords?: SelectedWord[];
    selectedOptions?: SelectedOption[];
  };
};

export type CountedAnswer = {
  text: string;
  count: number;
} | null;

export type QuestionAnalysis = {
  attempts: number;
  correct: number;
  wrong: number;
  successRate: number | null;
  mostCommonAnswer: CountedAnswer;
  mostCommonMistake: CountedAnswer;
  wrongPlayers: string[];
  wrongDetails: Array<{
    playerName: string;
    answer: string;
  }>;
};

export const getQuestionTypeOptions = (bitfield: number): QuestionTypeOption[] =>
  QUESTION_TYPE_LABELS.map((label, index) => ({
    index,
    label,
    enabled: (bitfield & (1 << index)) !== 0,
  }));

export const countEnabledQuestionTypes = (bitfield: number) =>
  getQuestionTypeOptions(bitfield).filter((option) => option.enabled).length;

export const getQuestionTypeLabel = (questionType: number) =>
  QUESTION_TYPE_SHORT_LABELS[questionType] ?? 'Neznámý typ';

export const getQuestionSuccessColor = (successRate: number | null) => {
  if (successRate === null) return '#60708F';
  if (successRate >= 80) return '#4CAF50';
  if (successRate >= 50) return '#F9A825';
  return '#EF5350';
};

const parseAnswers = (answersJson?: string): StoredAnswer[] => {
  if (!answersJson) return [];

  try {
    const parsed = JSON.parse(answersJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const normalizeText = (value?: string) => {
  const text = value?.trim();
  return text || 'bez údaje';
};

const getPlayerName = (session: SessionLike) =>
  session.player?.name?.trim() || session.playerId || session.id || 'Neznámý hráč';

const formatSelectedOption = (option: SelectedOption) =>
  `"${normalizeText(option.text)}" (${normalizeText(option.type)})`;

const summarizeSelectedWords = (selectedWords: SelectedWord[], correct: boolean) => {
  const mistakes = selectedWords.filter((word) => word.selectedType !== word.correctType);
  const wordsToShow = !correct && mistakes.length > 0 ? mistakes : selectedWords;

  return wordsToShow
    .slice(0, 3)
    .map((word) => {
      const text = `"${normalizeText(word.word)}"`;
      if (!correct && word.selectedType !== word.correctType) {
        return `${text}: ${normalizeText(word.selectedType)} místo ${normalizeText(word.correctType)}`;
      }
      return `${text} (${normalizeText(word.selectedType)})`;
    })
    .join(', ');
};

const summarizeSelectedOptions = (selectedOptions: SelectedOption[]) => {
  const selected = selectedOptions.filter((option) => option.selected);
  if (selected.length === 0) return 'Bez výběru';

  return selected.slice(0, 3).map(formatSelectedOption).join(', ');
};

export const summarizeStoredAnswer = (answer: StoredAnswer) => {
  const selections = answer.userSelections;

  if (selections?.selectedWords?.length) {
    return summarizeSelectedWords(selections.selectedWords, answer.correct === true);
  }

  if (selections?.selectedOptions?.length) {
    return summarizeSelectedOptions(selections.selectedOptions);
  }

  return answer.correct ? 'Správně bez detailu' : 'Bez odpovědi';
};

const getMostCommon = (values: string[]): CountedAnswer => {
  if (values.length === 0) return null;

  const counts = values.reduce<Record<string, number>>((accumulator, value) => {
    accumulator[value] = (accumulator[value] ?? 0) + 1;
    return accumulator;
  }, {});

  const [text, count] = Object.entries(counts).sort((first, second) => second[1] - first[1])[0];
  return { text, count };
};

export const buildQuestionAnalysis = (
  questionIndex: number,
  sessions: SessionLike[],
): QuestionAnalysis => {
  const responses = sessions
    .filter((session) => session.completed !== false)
    .map((session) => {
      const answer = parseAnswers(session.answers)[questionIndex];
      if (!answer) return null;

      return {
        playerName: getPlayerName(session),
        correct: answer.correct === true,
        summary: summarizeStoredAnswer(answer),
      };
    })
    .filter((response): response is { playerName: string; correct: boolean; summary: string } => response !== null);

  const attempts = responses.length;
  const correct = responses.filter((response) => response.correct).length;
  const wrongResponses = responses.filter((response) => !response.correct);
  const wrong = wrongResponses.length;
  const successRate = attempts > 0 ? Math.round((correct / attempts) * 100) : null;

  return {
    attempts,
    correct,
    wrong,
    successRate,
    mostCommonAnswer: getMostCommon(responses.map((response) => response.summary)),
    mostCommonMistake: getMostCommon(wrongResponses.map((response) => response.summary)),
    wrongPlayers: wrongResponses.map((response) => response.playerName),
    wrongDetails: wrongResponses.slice(0, 4).map((response) => ({
      playerName: response.playerName,
      answer: response.summary,
    })),
  };
};
