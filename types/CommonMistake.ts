import { WordSelectionOption } from "./games/SelectionOption";

export interface CommonMistake {
  sentence: WordSelectionOption[],
  mistakeCount: number,
  correctCount: number,
}