import { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import * as Network from "expo-network";
import Papa from "papaparse";

const LOCAL_FILE_PATH = `${FileSystem.documentDirectory}data.csv`;

export const useCSV = (url: string) => {
  const [data, setData] = useState<Record<string, string>[]>([]);
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

export function ParseFile(filePath: string, resolve: (data: Record<string, string>[]) => void, reject: (error: never) => void) {

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
        resolve(results.data);
      },
      error: (error : never) => {
        reject(error);
        console.log("❌ Chyba při čtení CSV:", error);
      },
      delimiter: ";",
    });
  });

}
