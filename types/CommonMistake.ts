import { Question } from "./Question";

export interface CommonMistake {
  question: Question,
  mistakeCount: number,
  correctCount: number,
}