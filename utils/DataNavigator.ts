import { useGalaxyContext } from "@/contexts/GalaxyContext";
import { ParseFileToDataRows_ColumnValues, ParseFileToDataRows_RowValues } from "./filePa+rser";

const version = "v1"
export const Spreadsheets = [
  require(`@/data/sheets/${version}/All.csv`),
  require(`@/data/sheets/${version}/All.csv`),
  require(`@/data/sheets/${version}/Privlastek.csv`),
  require(`@/data/sheets/${version}Doplnek.csv`),
  require(`@/data/sheets/${version}/Prisl.csv`),
];

export function GetDataBasedOnContext(
  setData: any
) {
  // add input prop - enum like behavior and return apropriate data
}

export function GetDataByGalaxy(galaxyIndex: number) {
  
}

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