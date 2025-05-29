import { Question } from "@/hooks/QuestionsGenerator/useQuestionGenerator";
import { WordSelectionOption } from "./games/SelectionOption";

export interface CommonMistake {
  question: Question,
  mistakeCount: number,
  correctCount: number,
}