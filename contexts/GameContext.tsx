import React, { createContext, useContext, useState } from 'react';
import { Question, GameContextData } from '../types/GameTypes';
import { useNavigation } from 'expo-router';
import { WordSelectionOption } from '@/types/games/SelectionOption';
import { useData } from '@/hooks/useData';

const GameContext = createContext<GameContextData | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [seed, setSeed] = useState(50);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const setUserAnswer = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const navigation = useNavigation();

  const allData : WordSelectionOption[][] = useData();

  // this initialization is temporary and hopefully will be updated
  const [data, setData] = useState<WordSelectionOption[]>(allData[0])

  const moveToNextLevel = async () => {

    const randomIndex = Math.floor(Math.random() * allData.length);
    setData(allData[randomIndex]);

    // generate next level based on seed and question types - no api call, just navigate to next level
   
    console.log("navigating");

    navigation.navigate('games/game1' as never); // Navigate to the selected game
  }

  return (
    <GameContext.Provider
      value={{
        seed,
        questions,
        userAnswers,
        activeQuestionIndex,
        setSeed,
        setQuestions,
        setUserAnswer,
        setActiveQuestionIndex,
        moveToNextLevel,
        data,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};