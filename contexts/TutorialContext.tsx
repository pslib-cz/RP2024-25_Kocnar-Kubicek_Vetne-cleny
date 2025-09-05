import { TutorialRuntimeNode, useTutorial } from '@/hooks/useTutorial';
import { WordSelectionOption } from '@/types/games/SelectionOption';
import React, { createContext, useContext, ReactNode, useState } from 'react';

interface TutorialContextValue {
  sentence: WordSelectionOption[] | null;
  wordId: number | null;
  setSentence: (sentence: WordSelectionOption[] | null) => void;
  setWordId: (wordId: number) => void;
  clearTutorialData: () => void;
  usedNodes: TutorialRuntimeNode[];
  currentNode: TutorialRuntimeNode;
  AddNode: (currentInputNode: TutorialRuntimeNode, yes: boolean) => void;
  reset: () => void;
  pathExists: (currentNode: TutorialRuntimeNode, title: string, yes: boolean) => boolean;
}

const TutorialContext = createContext<TutorialContextValue | undefined>(undefined);

export const TutorialProvider = ({ children }: { children: ReactNode }) => {
  const [sentence, setSentence] = useState<WordSelectionOption[] | null>(null);
  const [wordId, setWordId] = useState<number | null>(null);

  const { usedNodes, currentNode, AddNode, reset, pathExists } = useTutorial();

  const clearTutorialData = () => {
    setSentence(null);
    setWordId(null);
  };

  return (
    <TutorialContext.Provider value={{ 
      sentence, 
      wordId, 
      setSentence, 
      setWordId, 
      clearTutorialData,
      usedNodes,
      currentNode,
      AddNode,
      reset,
      pathExists
    }}>
      {children}
    </TutorialContext.Provider>
  );
};

export function useTutorialContext() {
  const ctx = useContext(TutorialContext);
  if (!ctx) throw new Error('useTutorialContext must be used within a TutorialProvider');
  return ctx;
}