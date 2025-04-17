import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type GalaxyContextType = {
  selectedGalaxy: number;
  activePlanets: number[]; // Array to track active planet indices for each galaxy
  setSelectedGalaxy: (galaxyIndex: number) => void;
  levelUp: () => void;
  activeLevelIndex: number[]; // Array of active levels for each galaxy
  setActiveLevelIndex: (index: number[]) => void;
};

const GalaxyContext = createContext<GalaxyContextType | undefined>(undefined);

export const GalaxyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedGalaxy, setSelectedGalaxy] = useState(0);
  const [activePlanets, setActivePlanets] = useState<number[]>([0, 0, 0, 0, 0]);
  const [activeLevelIndex, setActiveLevelIndex] = useState<number[]>([0, 0, 0, 0, 0]);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedGalaxy = await AsyncStorage.getItem('selectedGalaxy');
        const savedPlanets = await AsyncStorage.getItem('activePlanets');
        const savedLevels = await AsyncStorage.getItem('activeLevelIndex'); // Load active levels
        console.log('Loaded data from AsyncStorage:', { savedGalaxy, savedPlanets, savedLevels });
        if (savedGalaxy) setSelectedGalaxy(parseInt(savedGalaxy, 10));
        if (savedPlanets) setActivePlanets(JSON.parse(savedPlanets));
        if (savedLevels) setActiveLevelIndex(JSON.parse(savedLevels)); // Set active levels
      } catch (error) {
        console.error('Failed to load data from AsyncStorage:', error);
      } finally {
        setLoading(false); // Mark loading as complete
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const saveSelectedGalaxy = async () => {
      try {
        await AsyncStorage.setItem('selectedGalaxy', selectedGalaxy.toString());
      } catch (error) {
        console.error('Failed to save selectedGalaxy to AsyncStorage:', error);
      }
    };
    saveSelectedGalaxy();
  }, [selectedGalaxy]);

  useEffect(() => {
    if (loading) return; // Prevent saving before data is loaded
    console.log('activePlanets updated:', activePlanets); // Debugging log
    const saveActivePlanets = async () => {
      try {
        await AsyncStorage.setItem('activePlanets', JSON.stringify(activePlanets));
        console.log('Saved activePlanets to AsyncStorage:', activePlanets); // Debugging log
      } catch (error) {
        console.error('Failed to save activePlanets to AsyncStorage:', error);
      }
    };
    saveActivePlanets();
  }, [activePlanets, loading]);

  useEffect(() => {
    if (loading) return; // Prevent saving before data is loaded
    console.log('activeLevelIndex updated:', activeLevelIndex); // Debugging log
    const saveActiveLevelIndex = async () => {
      try {
        await AsyncStorage.setItem('activeLevelIndex', JSON.stringify(activeLevelIndex));
        console.log('Saved activeLevelIndex to AsyncStorage:', activeLevelIndex); // Debugging log
      } catch (error) {
        console.error('Failed to save activeLevelIndex to AsyncStorage:', error);
      }
    };
    saveActiveLevelIndex();
  }, [activeLevelIndex, loading]);

  const levelUp = () => {
    setActiveLevelIndex((prevLevels) => {
      const newLevels = [...prevLevels];
      if (newLevels[selectedGalaxy] < 5) {
        newLevels[selectedGalaxy] += 1;
      } else {
        setActivePlanets((prevPlanets) => {
          const newPlanets = [...prevPlanets];
          if (newPlanets[selectedGalaxy] < (selectedGalaxy === 0 ? 24 : 7)) {
            newPlanets[selectedGalaxy] += 1;
          }
          return newPlanets;
        });
        newLevels[selectedGalaxy] = 0; // Reset level to 0 after leveling up the planet
      }
      return newLevels;
    });
  };

  return (
    <GalaxyContext.Provider value={{ selectedGalaxy, activePlanets, setSelectedGalaxy, levelUp, activeLevelIndex, setActiveLevelIndex }}>
      {children}
    </GalaxyContext.Provider>
  );
};

export const useGalaxyContext = () => {
  const context = useContext(GalaxyContext);
  if (!context) {
    throw new Error('useGalaxyContext must be used within a GalaxyProvider');
  }
  return context;
};
