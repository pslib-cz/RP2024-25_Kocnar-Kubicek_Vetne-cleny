import { DataRow } from "@/types/DataRow";
import { Asset } from "expo-asset";
import Papa from "papaparse";
import { Platform } from 'react-native';
import * as FileSystem from "expo-file-system";

const mockData: DataRow[][] = [[
  {
    data:
      [
        { text: "Hello 1", type: "greeting 1" },
        { text: "World 2", type: "noun 2" },
        { text: "Run 3", type: "verb 3" },
        { text: "Quickly 4", type: "adverb 4" },
        { text: "Beautiful 5", type: "adjective 5" },
      ]
  }
]];

export function ParseFileToDataRows(
  requireFile: any,
  resolve: (data: DataRow[][]) => void,
  reject: (error: never) => void
) {
  if (Platform.OS === 'web') {
    console.log("FUCK YOU, DO NOT USE WEB, Here you have some mock data, hf")
    resolve(mockData);
    return;
  }

  return new Promise(async () => {
    const { localUri } = await Asset.fromModule(requireFile).downloadAsync();
    if (!localUri) throw Error("File was not found")

    const csvString = await FileSystem.readAsStringAsync(localUri);
    console.log("✅ CSV soubor načten:", csvString);

    // Array data are temporary, for debug only
    ParseData_ColumnValues(csvString, [["pks", "po", "pks_1"], ["po_1", "pkn"]], reject, resolve)
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

    //const dataRows: DataRow[] = new Array(arrayData.length).fill({ data: [] });

    // Transform parsedData into DataRow[] based on arrayData
    const dataRows: DataRow[][] = arrayData.map((headerGroup) => {
      return data.map((row) => {
        const dataRow: DataRow = {
          data: headerGroup.map((header) => ({
            text: row[header] || "", // Use the value from the row for the header
            type: header, // Use the header as the type
          })).filter((item) => item.text !== ""),
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

    //resolve(dataRows);
  }
}