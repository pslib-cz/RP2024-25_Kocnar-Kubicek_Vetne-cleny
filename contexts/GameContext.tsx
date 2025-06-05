import React, { createContext, useContext, useState } from 'react';
import { ActiveGameInfo, GameContextData } from '../types/GameTypes';
import { useRouter } from 'expo-router';
import { WordSelectionOption } from '@/types/games/SelectionOption';
import { GameState } from '@/types/gameState';
import { useMultiplayerGameContext } from './MultiplayerGameContext';
import { useLevelContext } from './levelContext';
import { useGalaxyContext } from './GalaxyContext';
import { useCommonMistakesContext } from './CommonMistakesContext';
import { Galaxy, QuestionType } from '@/constants/questionGeneratorParams';
import { questionGenerator } from '@/utils/QuestionsGenerator/questionGenerator';
import { Question } from '@/types/Question';
import { GameType } from '@/types/GameType';

const GameContext = createContext<GameContextData | undefined>(undefined);

export const NEXT_LEVEL_TRESHOLD = 0.75 * 100;
const LEVELS_COUNT = 8;
const questionTypeOptions = Object.entries(QuestionType).filter(([k, v]) => typeof v === 'number');

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tryStartSession, tryUpdateSession } = useMultiplayerGameContext();
  const { resetLevelData } = useLevelContext();
  const { updateMistakes, allMistakes } = useCommonMistakesContext();
  const { levelUp } = useGalaxyContext();
  const { selectedGalaxy } = useGalaxyContext();

  const [gameType, setGameType] = useState<GameType>(GameType.PRACTICE);

  const navigation = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<Question | undefined>(undefined);
  const [gameState, setGameState] = useState<GameState>(GameState.pending);

  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);

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

  const newGameInArena = () => {
    newGame({
      galaxy: selectedGalaxy,
      difficulty: .1,
      count: LEVELS_COUNT,
      seed: Math.floor(Math.random() * 1000000),
      questionTypesBitfield: (1 << questionTypeOptions.length) - 1,
    }, GameType.PRACTICE);
  }

  const newGame = (config: typeof gameConfig, gameType : GameType) => {
    if (!config.seed) config.seed = Math.floor(Math.random() * 1000000);
    if (!config.questionTypesBitfield) config.questionTypesBitfield = (1 << questionTypeOptions.length) - 1;

    //console.log("New game started with config: ", config);

    setGameConfig(config);
    setCorrectAnswersCount(0);

    newGameWithQuestions(questionGenerator(config), gameType);
  }

  const newGameWitMostCommonMistakes = () => {
    const shuffledMistakes = [...allMistakes].sort(() => Math.random() - 0.5).slice(0, 2);
    newGameWithQuestions(shuffledMistakes.map(mistake => mistake.question), GameType.COMMON_MISTAKES);
  }

  const newGameWithQuestions = (questions: Question[], type: GameType) => {
    setQuestions(questions);

    const conf: ActiveGameInfo = {
      activeQuestionIndex: 0,
      startTime: Date.now(),
      answers: [],
    }

    setGameInfo(conf);
    nextQuestionWithValues(questions, conf);

    //console.log("New game started with config: ", questions.length);

    tryStartSession();

    setGameType(type);

    navigation.replace("games/game" as never);
  }

  const nextQuestion = () => nextQuestionWithValues(questions, gameInfo);

  const nextQuestionWithValues = (questions: Question[], gameInfo: ActiveGameInfo) => {
    resetLevelData();

    setGameInfo((prev) => ({ ...prev, activeQuestionIndex: prev.activeQuestionIndex + 1 })); // Increment the active question index

    setGameState(GameState.pending);

    if (gameInfo.activeQuestionIndex >= questions.length) {
      setGameInfo((prev) => ({ ...prev, endTime: Date.now() })); // Set the end time

      if (getSuccessRate() >= NEXT_LEVEL_TRESHOLD && gameType == GameType.PRACTICE) {
        levelUp();
      }

      console.log("Game finished");
      navigation.replace('games/resultScreen' as never);
    }
    else {
      setActiveQuestion(questions[gameInfo.activeQuestionIndex]);

      if (questions[gameInfo.activeQuestionIndex].SOURCE.length === 0) {
        console.warn("Question has no data");
      } else if (!questions[gameInfo.activeQuestionIndex].SOURCE[0]?.text)
        console.warn("Question contains invalid data: ", questions[gameInfo.activeQuestionIndex]);
    }
  }

  /// on level finished, not limited to the whole game
  const onFinished = (isCorrect: boolean) => {

    console.log("Question finished: ", isCorrect, activeQuestion);

    if (!activeQuestion) return;
    updateMistakes(activeQuestion, isCorrect);
    setGameState(isCorrect ? GameState.correct : GameState.incorrect)

    setCorrectAnswersCount((prev) => prev + (isCorrect ? 1 : 0));

    const dataUpdate = {
      score: isCorrect ? 1 : 0,
      correctAnswers: correctAnswersCount + (isCorrect ? 1 : 0),
      completed: gameInfo.activeQuestionIndex >= questions.length - 1,
    };

    tryUpdateSession(dataUpdate);
  }

  const getDuration = () => {
    if (gameInfo.startTime && gameInfo.endTime)
      return Math.floor((gameInfo.endTime - gameInfo.startTime) / 1000);
    return 0;
  };

  const getSuccessRate = () => {
    return (correctAnswersCount / questions.length) * 100;
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
        setActiveQuestion,
        newGameWitMostCommonMistakes,
        gameType,
        newGameWithQuestions,
        setGameState,
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