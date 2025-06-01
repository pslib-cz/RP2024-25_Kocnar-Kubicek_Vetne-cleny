import { questionGeneratorParams } from "@/constants/questionGeneratorParams";
import { WordSelectionOption } from "./games/SelectionOption";
import { WordType } from "./WordTypes";

export type Question = {
  SOURCE: WordSelectionOption[];
  TEMPLATE: typeof questionGeneratorParams[number][number];
  WANTED?: WordType;
  INDEX?: number;
}
