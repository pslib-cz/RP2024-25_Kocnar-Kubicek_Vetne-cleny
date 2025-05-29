import { WordSelectionOption } from '@/types/games/SelectionOption';
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { CommonMistake } from '@/types/CommonMistake';
import { Question } from '@/hooks/QuestionsGenerator/useQuestionGenerator';

interface CommonMistakesContextValue {
  allMistakes: CommonMistake[];
  updateMistakes: (newMistake: Question, correct: boolean) => Promise<void>;
}

const CommonMistakesContext = createContext<CommonMistakesContextValue | undefined>(undefined);

export const CommonMistakesProvider = ({ children }: { children: ReactNode }) => {
  const [allMistakes, setAllMistakes] = useState<CommonMistake[]>([]);

  const file = FileSystem.documentDirectory + 'mistakesData.json';

  useEffect(() => {
    const loadMistakes = async () => {
      try {
        const [mistakesStr] = await Promise.all([
          FileSystem.readAsStringAsync(file),
        ]);

        setAllMistakes(JSON.parse(mistakesStr));
      } catch (error) {
        console.warn('Error loading data:', error);
      }
    };

    loadMistakes();
  }, []);

  const updateMistakes = async (newMistake: Question, correct: boolean) => {
    console.log('Updating mistakes:', newMistake, correct);

    setAllMistakes(prevMistakes => {
      const updatedMistakes = [...prevMistakes];
      const idx = updatedMistakes.findIndex(
        (m) =>
          m.question.SOURCE.length === newMistake.SOURCE.length &&
          m.question.SOURCE.every((word, i) => word.text === newMistake.SOURCE[i].text)
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
            question: newMistake,
            mistakeCount: 1,
            correctCount: 0,
          });
      }

      (async () => {
        try {
          await FileSystem.writeAsStringAsync(
            file,
            JSON.stringify(updatedMistakes)
          );
        } catch (error) {
          console.warn('Error saving mistakes:', error);
        }
      })();

      return updatedMistakes;
    });

    try {
      await FileSystem.writeAsStringAsync(
        file,
        JSON.stringify(allMistakes)
      );
    } catch (error) {
      console.warn('Error saving mistakes:', error);
    }

  };

  // const getMistakesAsSentences = (): WordSelectionOption[][] => {
  //   return allMistakes.map((m) => m.question.SOURCE);
  // };

  return (
    <CommonMistakesContext.Provider value={{ allMistakes, updateMistakes }}>
      {children}
    </CommonMistakesContext.Provider>
  );
};

export function useCommonMistakesContext() {
  const ctx = useContext(CommonMistakesContext);
  if (!ctx) throw new Error('useCommonMistakesContext must be used within a CommonMistakesProvider');
  return ctx;
}