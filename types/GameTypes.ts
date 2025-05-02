import { GameRoutes } from "@/constants/gameRoutes";
import { WordSelectionOption } from "./games/SelectionOption";
import { GameState } from "./gameState";

export interface GameData {
  totalQuestion: number;
  questionsRemaining: number;
}

export interface GameContextData {
  seed: number;
  setSeed: (seed: number) => void;

  moveToNextLevel: () => void,
  data : WordSelectionOption[],

  loadLevel : (game : GameRoutes) => void,
  onFinished : (correct : boolean) => void,

  state : GameState

  newGame : (qCount : number) => void,

  gameData : GameData,
}