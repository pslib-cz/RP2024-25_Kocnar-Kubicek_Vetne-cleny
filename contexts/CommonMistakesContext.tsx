import { WordSelectionOption } from '@/types/games/SelectionOption';
import React, { createContext, useContext, ReactNode, use, useEffect, useState } from 'react';
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

  const [allMistakes, setAllMistakes] = useState<MistakeSaveData[]>([]);

  // on mount, load all mistakes from the local file
  // when new mistake is added, add it to the list and save it to the local file

  const file = FileSystem.documentDirectory + 'mistakes.json'; 

  useEffect(() => {
    const loadMistakes = async () => {
      try {
        const [mistakesStr] = await Promise.all([
          FileSystem.readAsStringAsync(file),
        ]);

        setAllMistakes(JSON.parse(mistakesStr));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadMistakes();
  }, []);

  const updateMistakes = async (newMistake: WordSelectionOption[], correct : boolean) => {

    console.log('Updating mistakes:', newMistake, correct);

    setAllMistakes(prevMistakes => {
      const updatedMistakes = [...prevMistakes];
      const idx = updatedMistakes.findIndex(
      (m) =>
        m.sentence.length === newMistake.length &&
        m.sentence.every((word, i) => word.text === newMistake[i].text)
      );

      if (idx !== -1) {
      if (correct)
        updatedMistakes[idx] = {
        ...updatedMistakes[idx],
        correctCount: updatedMistakes[idx].correctCount + 1,
        };
      else
        updatedMistakes[idx] = {
        ...updatedMistakes[idx],
        mistakeCount: updatedMistakes[idx].mistakeCount + 1,
        };

      if (updatedMistakes[idx].correctCount > 3) {
        updatedMistakes.splice(idx, 1);
      }
      } else {
      if (!correct)
        updatedMistakes.push({
        sentence: newMistake,
        mistakeCount: 1,
        correctCount: 0,
        });
      }

      // Save to file
      (async () => {
      try {
        await FileSystem.writeAsStringAsync(
        file,
        JSON.stringify(updatedMistakes)
        );
      } catch (error) {
        console.error('Error saving mistakes:', error);
      }
      })();

      return updatedMistakes;
    });

    try {
      //await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
      await FileSystem.writeAsStringAsync(
        file,
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