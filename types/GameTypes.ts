import { WordSelectionOption } from "./games/SelectionOption";
import { GameState } from "./gameState";
import { WordButtonType } from "./games/WordButtonType";
import { GameType } from "@/contexts/GameContext";
import { Question } from "./Question";

export interface ActiveGameInfo {
  activeQuestionIndex: number;
  startTime?: number;
  endTime?: number;
  answers: {
    question: Question,
    mistakeIndex?: number,
    correct: boolean,
    time: number,
  }[]
}

export interface GameContextData {
  newGame: (config: any, gameType : GameType) => void;
  newGameInArena: () => void;
  onFinished: (isCorrect: boolean) => void;
  getDuration: () => number;
  getSuccessRate: () => number;
  gameState: GameState;
  gameConfig: any;
  questions: Question[];
  activeQuestion?: Question;
  gameInfo: ActiveGameInfo;
  nextQuestion: () => void;
  setGameInfo: React.Dispatch<React.SetStateAction<ActiveGameInfo>>;
  setGameConfig: React.Dispatch<React.SetStateAction<any>>;
  setActiveQuestion: React.Dispatch<React.SetStateAction<Question | undefined>>;
  newGameWitMostCommonMistakes: () => void;
  gameType: GameType;
  data: WordSelectionOption[] | undefined;
  setGameState: (state: GameState) => void;
  newGameWithQuestions: (questions: Question[], type : GameType) => void;
}