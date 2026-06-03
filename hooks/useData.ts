import { useGalaxyContext } from "@/contexts/GalaxyContext";
import { WordSelectionOption } from "@/types/games/SelectionOption";
import { WordType } from "@/types/WordTypes";
import { normalizeWordType } from "@/constants/WordTypes";
import { useEffect, useMemo } from "react";
import * as FileSystem from 'expo-file-system/legacy';

const version = "latest"
type LoadedSetItem = [string, string, ...string[]];
type LoadedSets = LoadedSetItem[][][];

const normalizeLoadedSets = (sets: LoadedSets): LoadedSets =>
  sets.map((set) =>
    set.map((group) =>
      group.map((item) => [item[0], normalizeWordType(item[1]), ...item.slice(2)])
    )
  );

const normalizeLoadedTypeSets = (typeSets: Record<string, string[]>): Record<string, string[]> => {
  return Object.entries(typeSets).reduce<Record<string, string[]>>((normalized, [type, words]) => {
    const normalizedType = normalizeWordType(type);
    normalized[normalizedType] = [...(normalized[normalizedType] ?? []), ...words];
    return normalized;
  }, {});
};

// just in case
let loadedSets: LoadedSets = normalizeLoadedSets(require(`../data/sheets/${version}/sets.json`));
let loadedTypeSets: Record<string, string[]> = normalizeLoadedTypeSets(require(`../data/sheets/${version}/types.json`));
export let loadedVersion : string = require(`../data/sheets/version.json`).version;

export const loadLatestData_Local = async () => {
  const latestDir = FileSystem.documentDirectory + 'latest/';

  try{
    const [setsStr, typesStr, versionStr] = await Promise.all([
      FileSystem.readAsStringAsync(latestDir + 'sets.json'),
      FileSystem.readAsStringAsync(latestDir + 'types.json'),
      FileSystem.readAsStringAsync(latestDir + 'version.json'),
    ]);

    const sets = JSON.parse(setsStr);
    const types = JSON.parse(typesStr);
    const loadedVer = JSON.parse(versionStr).version;

    updateLoadedSets(sets, types, loadedVer);
  }
  catch (error) {
    console.warn('Error loading data:', error);
  }
}

export const updateLoadedSets = (ls : any, lts:any, lv:any) => {
  loadedSets = normalizeLoadedSets(ls);
  loadedTypeSets = normalizeLoadedTypeSets(lts);
  loadedVersion = lv;
}

export function useLoadedData() {
  return { loadedSets, loadedTypeSets, loadedVersion };
}

export const useWordsByType = (
  count: number,
  types: WordType | WordType[],
  blacklist: string[] = [],
  seed: number = Math.random()
): WordSelectionOption[] => {
  return useMemo(() => {
    const typeArray = (Array.isArray(types) ? types : [types]).map(normalizeWordType);
    
    // Get all words from requested types
    let allWords: WordSelectionOption[] = [];
    typeArray.forEach(type => {
      const typeWords = loadedTypeSets[type] || [];
      allWords = [...allWords, ...typeWords.map((word: string) => ({ type, text: word }))];
    });

    allWords = allWords.filter(word => !blacklist.includes(word.text));

    const shuffled = [...allWords];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor((seed * (i + 1)) % (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, count);
  }, [count, types, blacklist, seed]);
};

export const useData: (difficulty?: number, range?: number) => WordSelectionOption[][] = (difficulty, range = 0.2) => {
  const { selectedGalaxy, activePlanets } = useGalaxyContext();
  const set: LoadedSetItem[][] = loadedSets[selectedGalaxy];

  const memoizedData : WordSelectionOption[][]  = useMemo(() => {
    const effectiveDifficulty = difficulty ?? (activePlanets[selectedGalaxy] / (selectedGalaxy === 0 ? 24 : 7)); // 0 - 1

    const minDiff = Math.max(0, effectiveDifficulty - range) * set.length;
    const maxDiff = Math.min(1, effectiveDifficulty + range) * set.length;

    const resultSet = set.slice(Math.floor(minDiff), Math.ceil(maxDiff));

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
//     console.warn("Error parsing file:", error);
//   });
// }

// export function GetData_Doplnek (
//   setData : any
// ) {
//   ParseFileToDataRows_RowValues(Spreadsheets.Doplnek, (parsed) => {
//     setData(parsed[0].data);
//   },
//   (error) => {
//     console.warn("Error parsing file:", error);
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
//     console.warn("Error parsing file:", error);
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
//     console.warn("Error parsing file:", error);
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
//     console.warn("Error parsing file:", error);
//   });
// }
