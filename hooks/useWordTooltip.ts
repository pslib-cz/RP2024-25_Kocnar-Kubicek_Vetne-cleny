import { WordTypes } from "@/constants/WordTypes";
import { useState } from "react";

export type WordTooltip = {
  visible: boolean;
  message: string;
  index: number | null;
};

const getDefinition = (abbr: string) => {
  const found = WordTypes.find((w) => w.abbr === abbr);
  return found ? found.name : abbr;
};

export const useWordTooltip = () => {
  const [tooltip, setTooltip] = useState<WordTooltip>({
    visible: false,
    message: '',
    index: null,
  });

  const handleShowTooltip = (abbr: string, index: number) => {
    setTooltip({ visible: true, message: getDefinition(abbr), index });
  };

  const handleHideTooltip = () => {
    setTooltip({ visible: false, message: '', index: null });
  };

  return { tooltip, handleShowTooltip, handleHideTooltip };
}