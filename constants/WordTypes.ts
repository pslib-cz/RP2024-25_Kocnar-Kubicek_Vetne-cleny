import { WordType } from "@/types/WordTypes";

interface WordTypeExt{
  name: string;
  abbr: WordType;
  color: string;
}

export function normalizeWordType(type: string): string {
  return type.toLocaleLowerCase('cs-CZ');
}

export function isWordTypeAbbr(type: string): boolean {
  const normalizedType = normalizeWordType(type);
  return WordTypes.some((wordType) => normalizeWordType(wordType.abbr) === normalizedType);
}

export function TranslateWordType(type: string): string {
  const normalizedType = normalizeWordType(type);
  const wordType = WordTypes.find((wordType) => normalizeWordType(wordType.abbr) === normalizedType);
  return wordType ? wordType.name : 'Unknown';
}

export const WordTypes: WordTypeExt[] = [
  {
    name: 'podmět',
    abbr: 'po',
    color: '#4A90E2'  // Soft blue
  },
  {
    name: 'přísudek',
    abbr: 'př',
    color: '#50C878'  // Emerald green
  },
  {
    name: 'předmět',
    abbr: 'pt',
    color: '#6C5CE7'  // Soft purple
  },
  {
    name: 'přívlastek shodný',
    abbr: 'pks',
    color: '#FF9F43'  // Warm orange
  },
  {
    name: 'přívlastek neshodný',
    abbr: 'pkn',
    color: '#FF4B4B'  // Coral red
  },
  {
    name: 'doplněk',
    abbr: 'd',
    color: '#D63031'  // Bright red
  },
  {
    name: 'příslovečné určení místa',
    abbr: 'pum',
    color: '#00B894'  // Mint green
  },
  {
    name: 'příslovečné určení způsobu',
    abbr: 'puz',
    color: '#A29BFE'  // Lavender
  },
  {
    name: 'příslovečné určení času',
    abbr: 'puč',
    color: '#FF4675'  // Soft pink
  },
  {
    name: 'příslovečné určení míry',
    abbr: 'pu míry',
    color: '#5ec9c9'  // Turquoise
  },
  {
    name: 'příslovečné určení příčiny',
    abbr: 'pu příčiny',
    color: '#afb925'  // Cool gray
  },
  {
    name: 'příslovečné určení účelu',
    abbr: 'pu účelu',
    color: '#9e455d'  // Light orange
  },
  {
    name: 'příslovečné určení podmínky',
    abbr: 'pu podmínky',
    color: '#569742'  // Light orange
  },
  {
    name: 'příslovečné určení přípustky',
    abbr: 'pu přípustky',
    color: '#485d96'  // Light orange
  }
]

export function getWordTypeColor(type: string): string {
  const normalizedType = normalizeWordType(type);
  const wordType = WordTypes.find((wordType) => normalizeWordType(wordType.abbr) === normalizedType);
  return wordType ? wordType.color : '#000'; // Default color if not found
}

export function getWordTypesByType(types: WordType[]): WordTypeExt[] {
  const normalizedTypes = types.map(normalizeWordType);
  return WordTypes.filter((wordType) => normalizedTypes.includes(normalizeWordType(wordType.abbr)));
}
