import { GameRoute } from "@/constants/gameRoute";
import { WordSelectionOption } from "./games/SelectionOption";
import { GameState } from "./gameState";
import { WordButtonType } from "./games/WordButtonType";

export interface GameData {
  totalQuestion: number;
  questionsRemaining: number;
  startTime?: number;
  endTime?: number;
}

export interface GameContextData {
  seed: number;
  setSeed: (seed: number) => void;

  moveToNextLevel: () => void,
  data : WordSelectionOption[],

  loadLevel : (game : GameRoute) => void,
  onFinished : (correct : boolean) => void,

  state : GameState

  newGame : (qCount : number) => void,

  gameData : GameData,

  getDuration : () => number,
  getSuccessRate : () => number,

  gameType : GameRoute,

  newGameWithCount : () => void,
}