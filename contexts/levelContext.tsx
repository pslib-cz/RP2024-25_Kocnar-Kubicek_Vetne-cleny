import { useWordTooltip, WordTooltip } from "@/hooks/useWordTooltip";
import { WordSelectionOption } from "@/types/games/SelectionOption";
import { WordButtonType } from "@/types/games/WordButtonType";
import React, { createContext, useContext, useState } from "react";

interface LevelContextData {
  resetLevelData : () => void,

  // tooltip data
  tooltip: WordTooltip,
  handleHideTooltip: () => void,
  handleShowTooltip: (abbr: string, index: number) => void,


  // game 1 data
  gameIndex : number, 
  setGameIndex : (index : number) => void,
  phraseButtons : WordButtonType[] | undefined,
  setPhraseButtons : (buttons : WordButtonType[] | undefined) => void,
  bottomButtons : WordButtonType[] | undefined,
  setBottomButtons : (buttons : WordButtonType[] | undefined) => void,

  // game 2 data
  targetType : WordButtonType | undefined,
  options : WordSelectionOption[] | undefined,
  selectedOptions : WordSelectionOption[],
  setSelectedOptions : (options : WordSelectionOption[]) => void,
  setTargetType : (type : string) => void,
  setOptions : (options : WordSelectionOption[] | undefined) => void,
}

const LevelContext = createContext<LevelContextData | undefined>(undefined);

export const LevelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tooltip, handleHideTooltip, handleShowTooltip } = useWordTooltip();

  // game 1 data
  const [gameIndex, setGameIndex] = useState(0);
  const [phraseButtons, setPhraseButtons] = useState<WordButtonType[] | undefined>();
  const [bottomButtons, setBottomButtons] = useState<WordButtonType[] | undefined>();

  // game 2 data
  const setTargetType = (type: string) => {
    setTargetTypeInternal({
      text: type,
      type: type,
      drawType: true
    });
  }

  const [targetType, setTargetTypeInternal] = useState<WordButtonType | undefined>(); // Set the target type here
  const [options, setOptions] = useState<WordSelectionOption[]>();
  const [selectedOptions, setSelectedOptions] = useState<WordSelectionOption[]>([]);

  const resetLevelData = () => {
    setGameIndex(0);
    setPhraseButtons(undefined);
    setBottomButtons(undefined);
    handleHideTooltip();

    setSelectedOptions([]);
  }

  return (
    <LevelContext.Provider
      value={{
        tooltip,
        handleHideTooltip,
        handleShowTooltip,
        
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