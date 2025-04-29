import { useGalaxyContext } from "@/contexts/GalaxyContext";
import { WordSelectionOption } from "@/types/games/SelectionOption";
import { WordType } from "@/types/WordTypes";
import { useMemo } from "react";

const version = "v1"

const sets: string[][][] = require(`../data/sheets/${version}/sets.json`);
const typeSets: Record<string, string[]> = require(`../data/sheets/${version}/types.json`);

const availableTypes = Object.keys(typeSets);

export const useWordsByType = (
  count: number,
  types: WordType | WordType[],
  blacklist: string[] = [],
  seed: number = Math.random()
): WordSelectionOption[] => {
  return useMemo(() => {
    // Convert single type to array
    const typeArray = Array.isArray(types) ? types : [types];
    
    // Get all words from requested types
    let allWords: WordSelectionOption[] = [];
    typeArray.forEach(type => {
      const typeWords = typeSets[type.toLowerCase()] || [];
      allWords = [...allWords, ...typeWords.map((word: string) => ({ type, text: word }))];
    });

    // Remove blacklisted words
    allWords = allWords.filter(word => !blacklist.includes(word.text));

    // Use seed to shuffle array
    const shuffled = [...allWords];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor((seed * (i + 1)) % (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Return requested count
    return shuffled.slice(0, count);
  }, [count, types, blacklist, seed]);
};

export const useData: (difficulty?: number, range?: number) => WordSelectionOption[][] = (difficulty, range = 0.2) => {
  const { selectedGalaxy, activePlanets } = useGalaxyContext();
  const set: string[][] = sets[selectedGalaxy];

  const memoizedData : WordSelectionOption[][]  = useMemo(() => {
    const effectiveDifficulty = difficulty ?? (activePlanets[selectedGalaxy] / (selectedGalaxy === 0 ? 24 : 7)); // 0 - 1

    const minDiff = Math.max(0, effectiveDifficulty - range) * set.length;
    const maxDiff = Math.min(1, effectiveDifficulty + range) * set.length;

    const resultSet = set.slice(Math.floor(minDiff), Math.ceil(maxDiff));

    console.log("minDiff", minDiff, "maxDiff", maxDiff, "initSetLength", set.length, "resultSetLength", resultSet.length);
    console.log("effectiveDifficulty", effectiveDifficulty, "difficulty", difficulty, "range", range, "selectedGalaxy", selectedGalaxy, "activePlanets", activePlanets[selectedGalaxy]);

    return resultSet.map(group => 
      group.map(item => ({ type: item[1], text: item[0] }))
    );
  }, [difficulty, range, selectedGalaxy, activePlanets, set]);

  return memoizedData;
};





// export function GetData_All (
//   setData : any
// ) {
//   ParseFileToDataRows_RowValues(Spreadsheets.All, (parsed) => {
//     setData(parsed[0].data);
//   },
//   (error) => {
//     console.error("Error parsing file:", error);
//   });
// }

// export function GetData_Doplnek (
//   setData : any
// ) {
//   ParseFileToDataRows_RowValues(Spreadsheets.Doplnek, (parsed) => {
//     setData(parsed[0].data);
//   },
//   (error) => {
//     console.error("Error parsing file:", error);
//   });
// }

// export function GetData_Pks(
//   setData : any
// ) {
//   ParseFileToDataRows_ColumnValues(
//     Spreadsheets.Privlastek, 
//     [["pks", "po", "pks_1"], ["po_1", "pkn"]],
//     (parsed) => {
//     setData(parsed[0][0].data);
//   },
//   (error) => {
//     console.error("Error parsing file:", error);
//   });
// }

// export function GetData_Pkn(
//   setData : any
// ) {
//   ParseFileToDataRows_ColumnValues(
//     Spreadsheets.Privlastek, 
//     [["pks", "po", "pks_1"], ["po_1", "pkn"]],
//     (parsed) => {
//     setData(parsed[1][0].data);
//   },
//   (error) => {
//     console.error("Error parsing file:", error);
//   });
// }

// export function GetData_PrislovecneUrceni(
//   setData : any
// ) {
//   throw Error("The file structure has to be changed before it can be parsed");
// }

// export function GetData_All2(
//   setData : any
// ) {
//   ParseFileToDataRows_RowValues(Spreadsheets.All2, (parsed) => {
//     setData(parsed[0].data);
//   },
//   (error) => {
//     console.error("Error parsing file:", error);
//   });
// }