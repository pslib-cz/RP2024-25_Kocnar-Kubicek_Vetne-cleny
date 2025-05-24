import { GameRoute } from "@/constants/gameRoute";
import { WordSelectionOption } from "./SelectionOption";

export interface GameLevel {
  game: GameRoute,
  WordSelectionOption: WordSelectionOption[],
  result: string
}