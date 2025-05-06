
interface WordType{
  name: string;
  abbr: string;
  color: string;
}

export const WordTypes: WordType[] = [
  {
    name: 'podstatné jméno',
    abbr: 'po',
    color: '#2a9d8f'
  },
  {
    name: 'přídavné jméno',
    abbr: 'př',
    color: '#e9c46a'
  },
  {
    name: 'přívlastek shodný',
    abbr: 'pks',
    color: '#f4a261'
  },
  {
    name: 'přívlastek neshodný',
    abbr: 'pkn',
    color: '#e76f51'
  },
  {
    name: 'předmět',
    abbr: 'pt',
    color: '#264653'
  },
  {
    name: 'příslovečné určení místa',
    abbr: 'pum',
    color: '#2a9d8f'
  },
  {
    name: 'příslovečné určení způsobu',
    abbr: 'puz',
    color: '#e9c46a'
  },
  {
    name: 'příslovečné určení času',
    abbr: 'puč',
    color: '#f4a261'
  },
  {
    name: 'příslovečné určení míry',
    abbr: 'pumíry',
    color: '#e76f51'
  },
  {
    name: 'příslovečné určení příčiny',
    abbr: 'pup',
    color: '#264653'
  }
]

export function getWordTypeColor(type: string): string {
  const wordType = WordTypes.find((wordType) => wordType.abbr === type);
  return wordType ? wordType.color : '#000'; // Default color if not found
}