import { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import * as Network from "expo-network";
import Papa from "papaparse";
import { Platform } from 'react-native';
import { WordSelectionOption } from "@/types/games/SelectionOption";

import { Asset } from "expo-asset";

const LOCAL_FILE_PATH = `${FileSystem.documentDirectory}data.csv`;

interface DataRow
{
  data: WordSelectionOption[];
}

export const useCSV = (url: string) => {
  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { isConnected } = await Network.getNetworkStateAsync();

      if (isConnected) {
        try {
          const response = await fetch(url);
          const csvText = await response.text();
          await FileSystem.writeAsStringAsync(LOCAL_FILE_PATH, csvText);
          console.log("✅ CSV uloženo");
        } catch (error) {
          console.error("❌ Chyba při stahování CSV:", error);
        }
      } else {
        console.log("🔴 Offline, načítám lokální CSV.");
      }

      try {
        ParseFile(LOCAL_FILE_PATH, (parsed) => setData(parsed), (error) => {
          console.error("❌ Chyba při čtení CSV:", error);
          setData([]);
        })
      } catch (error) {
        console.error("❌ Chyba při čtení CSV:", error);
        setData([]);
      }

      setLoading(false);
    };

    fetchData();
  }, [url]);

  return { data, loading };
};

export function ParseFile(filePath: string, resolve: (data: DataRow[]) => void, reject: (error: never) => void) {

  if (!filePath)
    throw new Error("❌ filePath is null or undefined");

  if (Platform.OS === 'web') {
    console.log("FUCK YOU, DO NOT USE WEB, Here you have some mock data, hf")

    // generate something
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

    const asset = Asset.fromURI(filePath);

    console.log(asset);

    const { localUri } = await Asset.fromModule(require('@/data/List1.csv')).downloadAsync();

    console.log("localUri", localUri);

    const csvString = await FileSystem.readAsStringAsync(localUri);

    console.log("✅ CSV soubor načten:", csvString);

    Papa.parse<string[]>(csvString, {
      header: false,
      complete: (results) => {
        console.log(`✅ CSV ${filePath} načteno - `, results.data);
        OnComplete(results.data);
      },
      error: (error : never) => {
        console.log("❌ Chyba při čtení CSV:", error);
        reject(error);
      },
      delimiter: ";",
      newline: "\r\n",
    });

    function OnComplete(data : string[][]) {

      const dataRows: DataRow[] = [];

      data.forEach(row => {
        const dataRow: DataRow = {
          data: []
        };

        row.forEach((item, index) => {
          if (index % 2 === 0) {
            dataRow.data.push({ text: item, type: row[index + 1] });
          }
        });

        dataRows.push(dataRow);
        
      });
      
      resolve(dataRows);
    }
  });

}
