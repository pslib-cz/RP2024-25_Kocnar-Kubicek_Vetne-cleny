import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useAPI } from '@/hooks/useAPI';
import { loadedVersion, loadLatestData_Local, updateLoadedSets } from '@/hooks/useData';
import * as FileSystem from 'expo-file-system';

interface FileSystemStuffContextValue {

}

const FileSystemStuffContext = createContext<FileSystemStuffContextValue | undefined>(undefined);

export const FileSystemStuffProvider = ({ children }: { children: ReactNode }) => {

  const { get } = useAPI();

  useEffect(() => {
    // try to fetch data from the server on /sets/sets.json, /sets/types.json and /sets/version.json
    // if it succeeds, save it to the local storage under /version folder and copy it to the latest folder
    // lastly replace the loadedSets, loadedTypeSets and loadedVersion with the new data

    const fetchAndStoreData = async () => {
      try {
        const [sets, types, version] = await Promise.all([
          get('/sets/sets.json'),
          get('/sets/types.json'),
          get('/sets/version.json'),
        ]);

        if (!sets || !types || !version) {
          throw new Error('Failed to fetch data');
        }

        console.log('Data fetched successfully');

        if (version.version === loadedVersion) {
          console.log('Version is the same, no need to update');
          return;
        }

        const latestDir = FileSystem.documentDirectory + 'latest/';
        await FileSystem.makeDirectoryAsync(latestDir, { intermediates: true });

        await Promise.all([
          FileSystem.writeAsStringAsync(latestDir + 'sets.json', JSON.stringify(sets)),
          FileSystem.writeAsStringAsync(latestDir + 'types.json', JSON.stringify(types)),
          FileSystem.writeAsStringAsync(latestDir + 'version.json', JSON.stringify(version)),
        ]);
        
        updateLoadedSets(sets, types, version.version);
      } catch (error) {
        // this is fine, I hope at least
        loadLatestData_Local();

        console.error('Error fetching or saving data:', error);
      }
    };

    fetchAndStoreData();
  }, []);

  return (
    <FileSystemStuffContext.Provider value={{}}>
      {children}
    </FileSystemStuffContext.Provider>
  );
};

export function useFileSystemStuffContext() {
  const ctx = useContext(FileSystemStuffContext);
  if (!ctx) throw new Error('useFileSystemStuffContext must be used within a FileSystemStuffProvider');
  return ctx;
}