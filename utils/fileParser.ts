import { DataRow } from "@/types/DataRow";
import { Asset } from "expo-asset";
import Papa from "papaparse";
import { Platform } from 'react-native';
import * as FileSystem from "expo-file-system";

export function ParseFileToDataRows_ColumnValues(
  requireFile: any,
  arrayData: string[][], // array of headers that should be grouped
  resolve: (data: DataRow[][]) => void,
  reject: (error: never) => void
) {
  if (Platform.OS === 'web')
    throw Error("Files cannot be loaded on the web")

  return new Promise(async () => {
    const { localUri } = await Asset.fromModule(requireFile).downloadAsync();
    if (!localUri) throw Error("File was not found")

    const csvString = await FileSystem.readAsStringAsync(localUri);
    console.log("✅ CSV soubor načten:", csvString);

    // Array data are temporary, for debug only
    ParseData_ColumnValues(csvString, arrayData, reject, resolve)
  });
}

export function ParseFileToDataRows_RowValues(
  requireFile: any,
  resolve: (data: DataRow[]) => void,
  reject: (error: never) => void
) {
  if (Platform.OS === 'web')
    throw Error("Files cannot be loaded on the web")

  return new Promise(async () => {
    const { localUri } = await Asset.fromModule(requireFile).downloadAsync();
    if (!localUri) throw Error("File was not found")

    const csvString = await FileSystem.readAsStringAsync(localUri);
    console.log("✅ CSV soubor načten:", csvString);

    // Array data are temporary, for debug only
    ParseData_SentenceRow(csvString, reject, resolve)
  });
}


//
// Parsing for tables where each sentence has its own row and the table contains no headers
// example: Pes, PO, je, PŘ
//
function ParseData_SentenceRow(
  csvString: string,
  reject: (error: never) => void,
  resolve: (data: DataRow[]) => void
) {
  Papa.parse<string[]>(csvString, {
    header: false,
    complete: (results) => {
      OnComplete(results.data);
    },
    error: (error: never) => {
      console.log("❌ Chyba při čtení CSV:", error);
      reject(error);
    }
  });

  function OnComplete(data: string[][]) {
    const dataRows: DataRow[] = [];

    data.forEach(row => {
      const dataRow: DataRow = {
        data: []
      };

      row.forEach((item, index) => {
        if (item === "") return;

        if (index % 2 === 0) {
          dataRow.data.push({ text: item, type: row[index + 1] });
        }
      });

      dataRows.push(dataRow);
    });
    resolve(dataRows);
  }
}

// todo
// returns array of DataRow[] based on array data prop
function ParseData_ColumnValues(
  csvString: string,
  arrayData: string[][], // array of headers that should be grouped
  reject: (error: never) => void,
  resolve: (data: DataRow[][]) => void
) {
    Papa.parse<Record<string, string>>(csvString, {
      header: true,
      complete: (results) => {
        OnComplete(arrayData, results.data);
      },
      error: (error: never) => {
        console.log("❌ Chyba při čtení CSV:", error);
        reject(error);
      }
  });


  function OnComplete(
    arrayData: string[][], // array of headers that should be grouped
    data: Record<string, string>[]
  ) {

    const parsedData: Record<string, string[]> = {};
    
    console.log("data: ", data)

    // Transform rows into a column-based record
    data.forEach((row) => {
      Object.entries(row).forEach(([key, value]) => {
        if (!parsedData[key]) {
          parsedData[key] = []; // Initialize the array for the column if it doesn't exist
        }
        parsedData[key].push(value || ""); // Add the value to the column, defaulting to an empty string if undefined
      });
    });

    console.log("Parsed data: ", parsedData)

    // Transform parsedData into DataRow[] based on arrayData
    const dataRows: DataRow[][] = arrayData.map((headerGroup) => {
      return data.map((row) => {
        const dataRow: DataRow = {
          data: headerGroup.map((header) => ({
            text: row[header] || "", // Use the value from the row for the header
            type: header, // Use the header as the type
          })).filter(item => item.text !== ""),
        };
        return dataRow;
      });
    });

    for (let i = 0; i < dataRows.length; i++) {
      console.log(`\n\nGroup ${i + 1}:`);
      for (let j = 0; j < dataRows[i].length; j++) {
        console.log(`Row ${j + 1}:`, dataRows[i][j]);
      }
    }

    resolve(dataRows);
  }
}