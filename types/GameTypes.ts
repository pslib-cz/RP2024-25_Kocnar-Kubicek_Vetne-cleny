import { WordSelectionOption } from "./games/SelectionOption";
import { GameState } from "./gameState";
import { Question } from "./Question";
import { GameType } from "./GameType";

export interface ActiveGameInfo {
  activeQuestionIndex: number;
  startTime?: number;
  endTime?: number;
  answers: {
    question: Question,
    mistakeIndex?: number,
    correct: boolean,
    time: number,
    userSelections?: {
      // For Game1: which words were selected and what types were assigned
      selectedWords?: Array<{
        word: string;
        wordIndex: number;
        selectedType: string;
        correctType: string;
      }>;
      // For Game2: which options were selected
      selectedOptions?: Array<{
        text: string;
        type: string;
        selected: boolean;
        correct: boolean;
      }>;
      // Game type to understand the selection format
      gameType?: string;
    }
  }[]
}

export interface GameContextData {
  newGame: (config: any, gameType : GameType) => void;
  newGameInArena: () => void;
  onFinished: (correctPercentage : number, userSelections?: any) => void;
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