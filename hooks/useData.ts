import { useGalaxyContext } from "@/contexts/GalaxyContext";
import { WordSelectionOption } from "@/types/games/SelectionOption";
import { useMemo } from "react";

const version = "v1"

const sets = require(`../data/sheets/${version}/sets.json`);

export const useData: (difficulty?: number, range?: number) => WordSelectionOption[] = (difficulty, range = 0.2) => {
  const { selectedGalaxy, activePlanets } = useGalaxyContext();
  const set: string[][] = sets[selectedGalaxy];

  const memoizedData = useMemo(() => {
    const effectiveDifficulty = difficulty ?? (activePlanets[selectedGalaxy] / (selectedGalaxy === 0 ? 24 : 7)); // 0 - 1

    const minDiff = Math.max(0, effectiveDifficulty - range) * set.length;
    const maxDiff = Math.min(1, effectiveDifficulty + range) * set.length;

    const resultSet = set.slice(Math.floor(minDiff), Math.ceil(maxDiff));

    console.log("minDiff", minDiff, "maxDiff", maxDiff, "resultSet", resultSet);

    return resultSet.map((item) => { return { type: item[1], text: item[0] } });
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