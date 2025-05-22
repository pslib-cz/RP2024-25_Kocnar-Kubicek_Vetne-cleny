import { WordSelectionOption } from '@/types/games/SelectionOption';
import React, { createContext, useContext, ReactNode, use, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';

interface CommonMistakesContextValue {
  allMistakes: MistakeSaveData[];
  updateMistakes: (newMistake: WordSelectionOption[], correct: boolean) => Promise<void>;
  getMistakesAsSentences: () => WordSelectionOption[][];
}

interface MistakeSaveData {
  sentence: WordSelectionOption[],
  mistakeCount: number,
  correctCount: number,
}

const CommonMistakesContext = createContext<CommonMistakesContextValue | undefined>(undefined);

export const CommonMistakesProvider = ({ children }: { children: ReactNode }) => {

  let allMistakes : MistakeSaveData[] = [];

  // on mount, load all mistakes from the local file
  // when new mistake is added, add it to the list and save it to the local file

  const dir = FileSystem.documentDirectory + 'mistakes/'; 

  useEffect(() => {
    const loadMistakes = async () => {
      try {
        const [mistakesStr] = await Promise.all([
          FileSystem.readAsStringAsync(dir + 'mistakes.json'),
        ]);

        allMistakes = JSON.parse(mistakesStr);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadMistakes();
  }, []);

  const updateMistakes = async (newMistake: WordSelectionOption[], correct : boolean) => {
    const index = allMistakes.findIndex(
      (m) =>
        m.sentence.length === newMistake.length &&
        m.sentence.every((word, i) => word.text === newMistake[i].text)
    );

    if (index !== -1) {
      if (correct)
        allMistakes[index].correctCount += 1;
      else
        allMistakes[index].mistakeCount += 1;

      if (allMistakes[index].correctCount > 3) {
        allMistakes.splice(index, 1);
      }

    } else {
      if (!correct)
        allMistakes.push({
          sentence: newMistake,
          mistakeCount: 1,
          correctCount: 0,
        });
    }

    try {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
      await FileSystem.writeAsStringAsync(
        dir + 'mistakes.json',
        JSON.stringify(allMistakes)
      );
    } catch (error) {
      console.error('Error saving mistakes:', error);
    }

  };

  const getMistakesAsSentences = () : WordSelectionOption[][] => {
    return allMistakes.map((m) => m.sentence);
  };

  return (
    <CommonMistakesContext.Provider value={{ allMistakes, updateMistakes, getMistakesAsSentences }}>
      {children}
    </CommonMistakesContext.Provider>
  );
};

export function useCommonMistakesContext() {
  const ctx = useContext(CommonMistakesContext);
  if (!ctx) throw new Error('useCommonMistakesContext must be used within a CommonMistakesProvider');
  return ctx;
}