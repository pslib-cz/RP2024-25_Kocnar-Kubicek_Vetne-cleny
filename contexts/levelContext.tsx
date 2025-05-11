import { WordSelectionOption } from "@/types/games/SelectionOption";
import { WordButtonType } from "@/types/games/WordButtonType";
import React, { createContext, useContext, useState } from "react";

interface LevelContextData {
  gameIndex : number, 
  setGameIndex : (index : number) => void,

  phraseButtons : WordButtonType[] | undefined,
  setPhraseButtons : (buttons : WordButtonType[] | undefined) => void,
  bottomButtons : WordButtonType[] | undefined,
  setBottomButtons : (buttons : WordButtonType[] | undefined) => void,

  resetLevelData : () => void,

  // game 2 data
  targetType : string,
  options : WordSelectionOption[] | undefined,
  selectedOptions : WordSelectionOption[],
  setSelectedOptions : (options : WordSelectionOption[]) => void,
  setTargetType : (type : string) => void,
  setOptions : (options : WordSelectionOption[] | undefined) => void,
}

const LevelContext = createContext<LevelContextData | undefined>(undefined);

export const LevelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // game 1 data
  const [gameIndex, setGameIndex] = useState(0);
  const [phraseButtons, setPhraseButtons] = useState<WordButtonType[] | undefined>();
  const [bottomButtons, setBottomButtons] = useState<WordButtonType[] | undefined>();

  // game 2 data
  const [targetType, setTargetType] = useState<string>('... loading'); // Set the target type here
  const [options, setOptions] = useState<WordSelectionOption[]>();
  const [selectedOptions, setSelectedOptions] = useState<WordSelectionOption[]>([]);

  const resetLevelData = () => {
    setGameIndex(0);
    setPhraseButtons(undefined);
    setBottomButtons(undefined);
  }

  return (
    <LevelContext.Provider
      value={{
        gameIndex,
        setGameIndex,
        phraseButtons,
        setPhraseButtons,
        bottomButtons,
        setBottomButtons,

        resetLevelData,
        targetType,
        setTargetType,
        options,
        setOptions,
        selectedOptions,
        setSelectedOptions
      }}
    >
      {children}
    </LevelContext.Provider>
  );
}


export const useLevelContext = () => {
  const context = useContext(LevelContext);
  if (!context)
    throw new Error('useGameContext must be used within a GameProvider');
  return context;
};