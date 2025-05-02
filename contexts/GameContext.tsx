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

    setSeed(Math.floor(Math.random() * 1000)); // Random seed for the game
    
    setGameData({totalQuestion : qCount, questionsRemaining : qCount});

    moveToNextLevel()
  }

  const loadLevel = async (game : GameRoutes) => {

    const randomIndex = Math.floor(Math.random() * allData.length);
    setData(allData[randomIndex]);

    setGameState(GameState.pending)

    console.log("navigating");

    navigation.navigate(game as never)
  }

  const moveToNextLevel = async () => {

    // some logic to choose desired level

    setGameData((prev) => ({...prev, questionsRemaining : prev.questionsRemaining - 1}))

    loadLevel(GameRoutes.GAME1)

    if (gameData.questionsRemaining <= 0) {
      console.log("Game finished")
      
      navigation.navigate(GameRoutes.RESULTS as never)
    }
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