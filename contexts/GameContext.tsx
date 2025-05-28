import React, { act, createContext, useContext, useEffect, useState } from 'react';
import { ActiveGameInfo, GameContextData } from '../types/GameTypes';
import { usePathname, useRouter } from 'expo-router';
import { WordSelectionOption } from '@/types/games/SelectionOption';
import { useData } from '@/hooks/useData';
import { GameState } from '@/types/gameState';
import { GameRoute } from '@/constants/gameRoute';
import { useMultiplayerGameContext } from './MultiplayerGameContext';
import { useLevelContext } from './levelContext';
import { useGalaxyContext } from './GalaxyContext';
import { useCommonMistakesContext } from './CommonMistakesContext';
import { generateRandomGameLevels, generateRandomMistakesLevels } from './utils/GameDataGenerator';
import { GameLevel } from '@/types/games/GameLevel';
import { Question, useQuestionGenerator } from '@/hooks/QuestionsGenerator/useQuestionGenerator';
import { Galaxy, GeneratorParam, QuestionType } from '@/constants/questionGeneratorParams';

const GameContext = createContext<GameContextData | undefined>(undefined);

export const NEXT_LEVEL_TRESHOLD = 0.75 * 100;
const LEVELS_COUNT = 2;
const questionTypeOptions = Object.entries(QuestionType).filter(([k, v]) => typeof v === 'number');

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tryStartSession, tryUpdateSession } = useMultiplayerGameContext();
  const { resetLevelData } = useLevelContext();
  const { getMistakesAsSentences, updateMistakes, allMistakes } = useCommonMistakesContext();
  const { levelUp } = useGalaxyContext();
  const navigation = useRouter();
  const pathname = usePathname();

  const { selectedGalaxy, activePlanets, activeLevelIndex } = useGalaxyContext();

  const [gameConfig, setGameConfig] = useState({
    galaxy: Galaxy.ALL,
    difficulty: 0,
    seed: 0,
    count: 0,
    questionTypesBitfield: (1 << questionTypeOptions.length) - 1,
  });

  const [gameInfo, setGameInfo] = useState<ActiveGameInfo>({
    activeQuestionIndex: 0,
    startTime: undefined,
    endTime: undefined,
    answers: [],
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<Question | undefined>(undefined);

  const [gameState, setGameState] = useState<GameState>(GameState.pending);


  //   const newGameWithCount_CommonMistakes = () => {
  //     if (allMistakes.length === 0) {
  //       console.warn("No common mistakes found");
  //       return;
  //     }

  //     const qCount = Math.min(LEVELS_COUNT, allMistakes.length);
  //     newGame(qCount, true);
  //   }

  const newGameInArena = () => {
    newGame({
      galaxy: selectedGalaxy,
      difficulty: .1,
      count: LEVELS_COUNT,
      seed: Math.floor(Math.random() * 1000000),
      questionTypesBitfield: (1 << questionTypeOptions.length) - 1,
    });
  }

  const newGame = (config: typeof gameConfig) => {
    if (!config.seed) config.seed = Math.floor(Math.random() * 1000000);
    if (!config.questionTypesBitfield) config.questionTypesBitfield = (1 << questionTypeOptions.length) - 1;

    // reset game info
    setGameInfo({
      activeQuestionIndex: 0,
      startTime: Date.now(),
      answers: [],
    });

    // set game state
    setGameState(GameState.pending);

    // set game config
    setGameConfig(config);

    // generate questions

    const dfsdfsdf = useQuestionGenerator(config)

    setQuestions(dfsdfsdf);

    nextQuestionWithValues(dfsdfsdf);

    tryStartSession();

    navigation.replace("games/game" as never);
  }

  //   const generateGameData = (count : number, seed : number, commonMistakes : boolean) : GameLevel[] => {
  //     if (commonMistakes)
  //     {
  //       const mistakesData = commonMistakes ? getMistakesAsSentences() : [];
  //       if (mistakesData.length === 0) {
  //         console.warn("No common mistakes found");
  //         return [];
  //       }
  //       if (mistakesData.length < count) {
  //         console.warn("Not enough common mistakes found");
  //         return [];
  //       }
  //       return generateRandomMistakesLevels(count, seed, mistakesData);
  //     }

  //     return generateRandomGameLevels(count, seed, allData);
  //   }

  const nextQuestionWithValues = (questions: Question[]) => {
    setGameInfo((prev) => ({ ...prev, activeQuestionIndex: prev.activeQuestionIndex + 1 })); // Increment the active question index
    setActiveQuestion(questions[gameInfo.activeQuestionIndex]);

    if (gameInfo.activeQuestionIndex >= questions.length) {
      setGameInfo((prev) => ({ ...prev, endTime: Date.now() })); // Set the end time

      if (getSuccessRate() >= NEXT_LEVEL_TRESHOLD) {
        levelUp();
      }

      console.log("Game finished");
      navigation.replace('games/resultScreen' as never);
    }
  }
  
  const nextQuestion = () => {
    nextQuestionWithValues(questions);
  }

  //   const moveToNextLevel = async () => {
  //     moveToNextLevelWithValues(gameData.questionsRemaining, generatedGameData, gameData);
  //   }  

  /// on level finished, not limited to the whole game
  const onFinished = (isCorrect: boolean) => {
    resetLevelData();

    if (!activeQuestion) return;
    updateMistakes(activeQuestion?.SOURCE, isCorrect);
    setGameState(isCorrect ? GameState.correct : GameState.incorrect)

    const dataUpdate = {
      score: isCorrect ? 1 : 0,
      correctAnswers: isCorrect ? 1 : 0,
      completed: questions.length === 1,
    };

    tryUpdateSession(dataUpdate);
  }

  const getDuration = () => {
    if (gameInfo.startTime && gameInfo.endTime)
      return Math.floor((gameInfo.endTime - gameInfo.startTime) / 1000);
    return 0;
  };

  const getSuccessRate = () => {
    const correctAnswers = gameInfo.answers.filter(answer => answer.correct).length;
    return (correctAnswers / gameInfo.answers.length) * 100;
  }

  return (
    <GameContext.Provider
      value={{
        newGame,
        newGameInArena,
        onFinished,
        getDuration,
        getSuccessRate,
        gameState,
        gameConfig,
        questions,
        activeQuestion,
        gameInfo,
        nextQuestion,
        setGameInfo,
        setGameConfig,
        setQuestions,
        setActiveQuestion,
        data: activeQuestion?.SOURCE as WordSelectionOption[] | undefined,
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