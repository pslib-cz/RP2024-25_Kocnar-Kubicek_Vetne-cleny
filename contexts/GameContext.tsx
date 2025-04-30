import React, { createContext, useContext, useState } from 'react';
import { Question, GameContextData } from '../types/GameTypes';
import { useNavigation } from 'expo-router';
import { WordSelectionOption } from '@/types/games/SelectionOption';
import { useData } from '@/hooks/useData';
import { GameState } from '@/types/gameState';
import { GameRoutes } from '@/constants/gameRoutes';

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

  const loadLevel = async (game : GameRoutes) => {

    const randomIndex = Math.floor(Math.random() * allData.length);
    setData(allData[randomIndex]);

    setGameState(GameState.pending)

    console.log("navigating");

    navigation.navigate(game as never)
  }

  const moveToNextLevel = async () => {

    // some logic to choose desired level

    loadLevel(GameRoutes.GAME1)
  }  

  const onFinished = (correct : boolean) => {

    setGameState(correct ? GameState.correct : GameState.incorrect)

  }

  const [state, setGameState] = useState<GameState>(GameState.pending); 

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
        loadLevel,
        onFinished,
        state
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