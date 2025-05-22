import React, { createContext, useContext, useState } from 'react';
import { GameContextData, GameData } from '../types/GameTypes';
import { usePathname, useRouter } from 'expo-router';
import { WordSelectionOption } from '@/types/games/SelectionOption';
import { useData } from '@/hooks/useData';
import { GameState } from '@/types/gameState';
import { GameRoute } from '@/constants/gameRoute';
import { useMultiplayerGameContext } from './MultiplayerGameContext';
import { useLevelContext } from './levelContext';
import { useGalaxyContext } from './GalaxyContext';
import { useCommonMistakesContext } from './CommonMistakesContext';

const GameContext = createContext<GameContextData | undefined>(undefined);

interface GameLevel {
  game: GameRoute,
  WordSelectionOption: WordSelectionOption[],
  result: string
}

export const NEXT_LEVEL_TRESHOLD = 0.75 * 100;
const LEVELS_COUNT = 2;

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tryStartSession, tryUpdateSession } = useMultiplayerGameContext();
  const { resetLevelData } = useLevelContext();
  const { getMistakesAsSentences, updateMistakes, allMistakes } = useCommonMistakesContext();
  const { levelUp } = useGalaxyContext();

  const navigation = useRouter();
  const pathname = usePathname();

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

  const [gameType, setGameType] = useState<GameRoute>(GameRoute.GAME1);

  const [commonMistakes, setCommonMistakes] = useState(false);

  const newGameWithCount = () => {
    newGame(LEVELS_COUNT);
  }

  const newGameWithCount_CommonMistakes = () => {
    if (allMistakes.length === 0) {
      console.error("No common mistakes found");
      return;
    }

    const qCount = Math.min(LEVELS_COUNT, allMistakes.length);
    newGame(qCount, true);
  }

  const newGame = (qCount : number, commonMistakes : boolean = false) => {
    const newSeed = Math.floor(Math.random() * 1000000); // Random seed for the game
    setSeed(newSeed); // Random seed for the game
    
    const gameData_ : GameData = {totalQuestion : qCount, questionsRemaining : qCount, startTime: Date.now()};
    setGameData(gameData_);

    const newGeneratedGameData = generateGameData(qCount, seed, commonMistakes)
    setGeneratedGameData(newGeneratedGameData);

    setCommonMistakes(commonMistakes);
    
    moveToNextLevelWithValues(qCount, newGeneratedGameData, gameData_); // so the state update is not an issue

    tryStartSession();

    navigation.replace("games/game" as never);
  }

  const generateGameData = (count : number, seed : number, commonMistakes : boolean) : GameLevel[] => {
    const data = [];

    const mistakesData = commonMistakes ? getMistakesAsSentences() : [];

    if (commonMistakes && mistakesData.length === 0) {
      console.error("No common mistakes found");
      return [];
    }
    if (commonMistakes && mistakesData.length < count) {
      console.error("Not enough common mistakes found");
      return [];
    }

    for (let i = 0; i < count; i++) {
      const game = Object.values(GameRoute)[(seed + i) % Object.values(GameRoute).length];

      if (commonMistakes){
        const randomIndex = Math.floor(Math.random() * mistakesData.length);
        data.push({ game, WordSelectionOption: mistakesData[randomIndex], result: "" });
        continue;
      }

      const randomIndex = Math.floor(Math.random() * allData.length);
      data.push({ game, WordSelectionOption: allData[randomIndex], result: "" });
    }
    return data;
  }

  const loadLevel = async (game : GameRoute) => {
    resetLevelData();

    setGameState(GameState.pending)

    console.log("gameRoute", pathname);

    setGameType(game);
  }

  const moveToNextLevelWithValues = (remainingQuestions: number, levels : GameLevel[], gameData: GameData) => {
    setGameData((prev) => ({...prev, questionsRemaining : remainingQuestions - 1}));

    console.log(levels);

    const level = levels[gameData.totalQuestion - remainingQuestions];
  
    console.log("level", level, "level", gameData.totalQuestion - remainingQuestions, "remainingQuestions", remainingQuestions);

    if (remainingQuestions <= 0) {
      setGameData((prev) => ({...prev, endTime: Date.now()}));

      if (getSuccessRate() >= NEXT_LEVEL_TRESHOLD && !commonMistakes)
      {
        levelUp();
      }

      console.log("Game finished");
      navigation.replace('games/resultScreen' as never);
    }
    else{
      setData(level.WordSelectionOption);
      loadLevel(level.game);
    }
  }

  const moveToNextLevel = async () => {
    moveToNextLevelWithValues(gameData.questionsRemaining, generatedGameData, gameData);
  }  

  /// on level finished, not limited to the whole game
  const onFinished = (correct : boolean) => {
    updateMistakes(data, !correct);

    setGameState(correct ? GameState.correct : GameState.incorrect)

    const currentLevelId = gameData.totalQuestion - gameData.questionsRemaining - 1;
    const level = generatedGameData[currentLevelId];

    const updatedLevels = [...generatedGameData];
    updatedLevels[currentLevelId] = {
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
        gameType,
        newGameWithCount,
        newGameWithCount_CommonMistakes,
        commonMistakes
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