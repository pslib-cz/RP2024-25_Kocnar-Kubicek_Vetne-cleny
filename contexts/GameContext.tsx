import React, { createContext, useContext, useState } from 'react';
import { GameContextData, GameData } from '../types/GameTypes';
import { useRouter } from 'expo-router';
import { WordSelectionOption } from '@/types/games/SelectionOption';
import { useData } from '@/hooks/useData';
import { GameState } from '@/types/gameState';
import { GameRoute } from '@/constants/gameRoute';
import { useMultiplayerGameContext } from './MultiplayerGameContext';

const GameContext = createContext<GameContextData | undefined>(undefined);

interface GameLevel {
  game: GameRoute,
  WordSelectionOption: WordSelectionOption[],
  result: string
}

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tryStartSession, tryUpdateSession } = useMultiplayerGameContext();

  const navigation = useRouter();
  const allData : WordSelectionOption[][] = useData();

  const [seed, setSeed] = useState(50);

  const [data, setData] = useState<WordSelectionOption[]>(allData[0])
  const [gameData, setGameData] = useState<GameData>({
    totalQuestion : 10, 
    questionsRemaining : 10,
    startTime: undefined,
    endTime: undefined,
  });

  const [generatedGameData, setGeneratedGameData] = useState<GameLevel[]>([]);
  const [state, setGameState] = useState<GameState>(GameState.pending);

  const newGame = (qCount : number) => {
    const newSeed = Math.floor(Math.random() * 1000); // Random seed for the game
    setSeed(newSeed); // Random seed for the game
    
    const gameData_ : GameData = {totalQuestion : qCount, questionsRemaining : qCount, startTime: Date.now()};
    setGameData(gameData_);

    // generate new generatedGameData based on seed
    const newGeneratedGameData = [];
    for (let i = 0; i < qCount; i++) {
      const game = Object.values(GameRoute)[(newSeed + i) % Object.values(GameRoute).length];

      const randomIndex = Math.floor(Math.random() * allData.length);
      newGeneratedGameData.push({ game, WordSelectionOption: allData[randomIndex], result: "" });
    }
    setGeneratedGameData(newGeneratedGameData);

    moveToNextLevelWithValues(qCount, newGeneratedGameData, gameData_); // so the state update is not an issue

    tryStartSession();
  }

  const loadLevel = async (game : GameRoute) => {
    setGameState(GameState.pending)

    console.log("navigating");

    navigation.navigate(game as never)
  }

  const [gameIndex, setGameIndex] = useState(0);

  const moveToNextLevelWithValues = (remainingQuestions: number, levels : GameLevel[], gameData: GameData) => {

    setGameIndex(0)
    setGameData((prev) => ({...prev, questionsRemaining : remainingQuestions - 1}));

    console.log(levels);

    const level = levels[gameData.totalQuestion - remainingQuestions];
  
    console.log("level", level, "level", gameData.totalQuestion - remainingQuestions, "remainingQuestions", remainingQuestions);

    if (remainingQuestions <= 0) {
      setGameData((prev) => ({...prev, endTime: Date.now()}));

      console.log("Game finished");
      navigation.navigate('games/resultScreen' as never);
    }
    else{
      setData(level.WordSelectionOption);
      loadLevel(level.game);
    }
  }

  const moveToNextLevel = async () => {
    moveToNextLevelWithValues(gameData.questionsRemaining, generatedGameData, gameData);
  }  

  const onFinished = (correct : boolean) => {
    setGameState(correct ? GameState.correct : GameState.incorrect)

    const level = generatedGameData[gameData.totalQuestion - gameData.questionsRemaining];

    const updatedLevels = [...generatedGameData];
    updatedLevels[gameData.totalQuestion - gameData.questionsRemaining] = {
      ...level,
      result: correct ? "correct" : "incorrect",
    };
    setGeneratedGameData(updatedLevels);

    const dataUpdate = {
      score: correct ? 1 : 0,
      correctAnswers: correct ? 1 : 0,
      completed: gameData.questionsRemaining === 1,
    };

    tryUpdateSession(dataUpdate);
  }

  const getDuration = () => {
    if (gameData.startTime && gameData.endTime)
      return Math.floor((gameData.endTime - gameData.startTime) / 1000);
    return 0;
  };

  const getSuccessRate = () => {
    const correctAnswers = generatedGameData.filter(level => level.result === "correct").length;
    return (correctAnswers / generatedGameData.length) * 100;
  }

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
        getDuration,
        getSuccessRate,
        gameIndex, 
        setGameIndex
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context)
    throw new Error('useGameContext must be used within a GameProvider');
  return context;
};