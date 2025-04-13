import { DataRow } from "@/types/DataRow";
import { Asset } from "expo-asset";
import Papa from "papaparse";
import { Platform } from 'react-native';
import * as FileSystem from "expo-file-system";

export function ParseFileToDataRows(
  requireFile: any, 
  resolve: (data: DataRow[]) => void, 
  reject: (error: never) => void
) {
  if (Platform.OS === 'web') {
    console.log("FUCK YOU, DO NOT USE WEB, Here you have some mock data, hf")
    const mockData: DataRow[] = [
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
    ];
    resolve(mockData);
    return;
  }
  
  return new Promise(async () => {
    const { localUri } = await Asset.fromModule(requireFile).downloadAsync();
    if (!localUri) throw Error("File was not found")

    const csvString = await FileSystem.readAsStringAsync(localUri);
    console.log("✅ CSV soubor načten:", csvString);

    // Array data are temporary, for debug only
    ParseData_ColumnValues(csvString, [2, 2], reject, resolve)     
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
    error: (error : never) => {
      console.log("❌ Chyba při čtení CSV:", error);
      reject(error);
    }
   });

   function OnComplete(data : string[][]) {
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
function ParseData_ColumnValues(
  csvString: string,
  arrayData: number[], // number of non-empty columns for each DataRow: example for 'Privlastek': [2, 2]
  reject: (error: never) => void,
  resolve: (data: DataRow[]) => void
) {
  Papa.parse<string[]>(csvString, {
    header: true,
    complete: (results) => {
      OnComplete(results.data);
    },
    error: (error : never) => {
      console.log("❌ Chyba při čtení CSV:", error);
      reject(error);
    }
   });


   function OnComplete(data : string[][]) {
    const dataRows: DataRow[] = [];

    console.log("values parsed:", data)

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