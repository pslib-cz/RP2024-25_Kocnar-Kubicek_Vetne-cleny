import React, { createContext, useContext, useState } from 'react';
import { GameContextData, GameData } from '../types/GameTypes';
import { useRouter } from 'expo-router';
import { WordSelectionOption } from '@/types/games/SelectionOption';
import { useData } from '@/hooks/useData';
import { GameState } from '@/types/gameState';
import { GameRoutes } from '@/constants/gameRoutes';

const GameContext = createContext<GameContextData | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [seed, setSeed] = useState(50);

  const navigation = useRouter();

  const allData : WordSelectionOption[][] = useData();

  // this initialization is temporary and hopefully will be updated
  const [data, setData] = useState<WordSelectionOption[]>(allData[0])

  const [gameData, setGameData] = useState<GameData>({totalQuestion : 10, questionsRemaining : 10});

  const newGame = (qCount : number) => {
    const newSeed = Math.floor(Math.random() * 1000); // Random seed for the game

    setSeed(newSeed); // Random seed for the game
    
    setGameData({totalQuestion : qCount, questionsRemaining : qCount});

    moveToNextLevelWithValues(newSeed, qCount); // so the state update is not an issue
  }

  const loadLevel = async (game : GameRoutes) => {
    const randomIndex = Math.floor(Math.random() * allData.length);
    setData(allData[randomIndex]);

    setGameState(GameState.pending)

    console.log("navigating");

    navigation.navigate(game as never)
  }

  const moveToNextLevelWithValues = (currentSeed: number, remainingQuestions: number) => {
    setGameData((prev) => ({...prev, questionsRemaining : remainingQuestions - 1}));
  
    const levels = Object.values(GameRoutes);
    const randomLevelIndex = (currentSeed + remainingQuestions) % levels.length;
    const randomLevel = levels[randomLevelIndex];
  
    console.log("randomLevel", randomLevel, "seed", currentSeed, "questionsRemaining", remainingQuestions);
  
    loadLevel(randomLevel);
  
    if (remainingQuestions <= 0) {
      console.log("Game finished");
      navigation.navigate('games/resultScreen' as never);
    }
  }

  const moveToNextLevel = async () => {
    moveToNextLevelWithValues(seed, gameData.questionsRemaining);
  }  

  const onFinished = (correct : boolean) => {
    setGameState(correct ? GameState.correct : GameState.incorrect)
  }

  const [state, setGameState] = useState<GameState>(GameState.pending); 

  return (
    <GameContext.Provider
      value={{
        seed,
        setSeed,
        moveToNextLevel,
        data,
        loadLevel,
        onFinished,
        state,
        newGame,
        gameData,
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