import { GameRoute } from "@/constants/gameRoute";
import { WordSelectionOption } from "@/types/games/SelectionOption";
import { GameLevel } from "../GameContext";

export const generateRandomGameLevels = (count : number, seed : number, allData : WordSelectionOption[][]) : GameLevel[] => {
  const data = [];

  for (let i = 0; i < count; i++) {
    data.push(getRandomLevel(seed, i, allData));
  }
  return data;
}

export const generateRandomMistakesLevels = (count : number, seed : number, allMistakes : WordSelectionOption[][]) : GameLevel[] => {
  const data = [];
  
  if (allMistakes.length === 0) {
    console.warn("No common mistakes found");
    return [];
  }

  if (allMistakes.length < count) {
    console.warn("Not enough common mistakes found");
    return [];
  }

  for (let i = 0; i < count; i++) {
    data.push(getRandomLevel(seed, i, allMistakes));
  }

  return data;
}

/*
  Rewrite this fuction to improve the generation (level based on data or the other way around or whatever)
*/
function getRandomLevel(seed : number, i : number, data : WordSelectionOption[][]) : GameLevel{
  return {
    game: Object.values(GameRoute)[(seed + i) % Object.values(GameRoute).length],
    WordSelectionOption: data[(seed + i) % data.length],
    result: ""
  }
}