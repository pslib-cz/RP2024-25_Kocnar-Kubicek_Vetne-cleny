// Types related to the GameContext
export interface Question {
  id: string;
  type: string;
  question: string;
  answer: string;
}

export interface GameContextData {
  seed: number;
  questions: Question[];
  userAnswers: Record<string, string>; // Maps question ID to user's answer
  activeQuestionIndex: number;
  setSeed: (seed: number) => void;
  setQuestions: (questions: Question[]) => void;
  setUserAnswer: (questionId: string, answer: string) => void;
  setActiveQuestionIndex: (index: number) => void;
}