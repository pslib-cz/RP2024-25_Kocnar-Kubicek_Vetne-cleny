import { ParseFileToDataRows } from "./fileParser";

export const Spreadsheets = {
  All1: require("@/data/sheets/All1.csv"),
  Doplnek: require("@/data/sheets/Doplnek.csv"),
  Privlastek: require("@/data/sheets/Privlastek.csv")
};

export function GetData_All1(
  setData : any
) {
  ParseFileToDataRows(Spreadsheets.All1, (parsed) => {
    setData(parsed[0][0].data);
  },
  (error) => {
    console.error("Error parsing file:", error);
  });
}