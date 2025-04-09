import { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import * as Network from "expo-network";
import Papa from "papaparse";
import { Platform } from 'react-native';
import { WordSelectionOption } from "@/types/games/SelectionOption";

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
        // const csvText = await FileSystem.readAsStringAsync(LOCAL_FILE_PATH);
        // const parsed = Papa.parse<Record<string, string>>(csvText, { header: true });
        // setData(parsed.data);

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
  
  // this does nto work in browser btw
  FileSystem.getInfoAsync(filePath).then((fileInfo) => {
    if (!fileInfo.exists) {
      console.log("❌ Soubor neexistuje:", filePath);
      return;
    }
  });

  return new Promise(() => {
    Papa.parse<Record<string, string>>(filePath, {
      header: true,
      complete: (results) => {
        console.log(`✅ CSV ${filePath} načteno - `, results);
        OnComplete(results.data);
      },
      error: (error : never) => {
        console.log("❌ Chyba při čtení CSV:", error);
        reject(error);
      },
      delimiter: ";",
    });

    function OnComplete(data : Record<string, string>[]) {
      resolve(data.map((item) => ({
        text: item.text,
        type: item.type,
      })));
    }
  });

}
