import { WordType } from "@/types/WordTypes";

interface WordTypeExt{
  name: string;
  abbr: WordType;
  color: string;
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
    name: 'předmět',
    abbr: 'pt',
    color: '#6C5CE7'  // Soft purple
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
    color: '#81ECEC'  // Turquoise
  },
  {
    name: 'příslovečné určení příčiny',
    abbr: 'pup',
    color: '#B2BEC3'  // Cool gray
  },
  {
    name: 'doplněk',
    abbr: 'd',
    color: '#D63031'  // Bright red
  },
  {
    name: 'príslovečné určení účelu',
    abbr: 'pu účelu',
    color: '#FFB142'  // Light orange
  },
  {
    name: 'príslovečné určení podmínky',
    abbr: 'pu podmínky',
    color: '#FFB142'  // Light orange
  },
  {
    name: 'príslovečné určení přípustky',
    abbr: 'pu přípustky',
    color: '#FFB142'  // Light orange
  }
]

export function getWordTypeColor(type: string): string {
  const wordType = WordTypes.find((wordType) => wordType.abbr === type);
  return wordType ? wordType.color : '#000'; // Default color if not found
}

export function getWordTypesByType(types: WordType[]): WordTypeExt[] {
  return WordTypes.filter((wordType) => types.includes(wordType.abbr));
}