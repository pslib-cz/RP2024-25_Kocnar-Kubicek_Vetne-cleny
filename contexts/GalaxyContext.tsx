//
// This context is used to manage the state of the galaxy selection and its related data.
//

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPlanetImage } from '@/data/planetImages';
import { Alert, Image as RNImage } from 'react-native';
import planetNames from '@/data/planetnames.json';

type GalaxyContextType = {
  selectedGalaxy: number;
  activePlanets: number[]; // Array to track active planet indices for each galaxy
  setSelectedGalaxy: (galaxyIndex: number) => void;
  levelUp: () => void;
  activeLevelIndex: number[]; // Array of active levels for each galaxy
  setActiveLevelIndex: (index: number[]) => void;
  selectedPlanet: SelectedPlanet; // Optional selected planet object
  getSelectedGalaxyPlanetData: (planetIndex: number) => SelectedPlanet; // Function to get planet data by index
};

interface SelectedPlanet {
  planetIndex: number;
  imageSource: any;
  size:{
    width: number;
    height: number;
  };
  name: string;
  planetType: string;
  displaySize: number;
  seed: number;
}

const GalaxyContext = createContext<GalaxyContextType | undefined>(undefined);

interface GalaxyProviderProps {
  children: ReactNode;
}

function getPlanetType(width: number, height: number, planetIndex : number): string {
  if (width === 1500 && height === 1500) {
      return 'ring';
    } else if (width === 1000 && height === 1000) {
        if (planetIndex%10 === 9) {
          return 'sun';
    } else {
      return 'hole';
    }
  } else if (width === 500 && height === 500) {
    return 'normal';
  }

  return 'normal';
} 

const getPlanetDisplaySize = (type: string) => {
  switch (type) {
    case 'ring': return 380;
    case 'sun': return 500;
    case 'hole': return 340;
    default: return 260;
  }
};


const DEBUG_RESET_PROGRESS = false; // Set to true to reset progress for debugging

export const GalaxyProvider: React.FC<GalaxyProviderProps> = ({
  children
}) => {
  const [selectedGalaxy, setSelectedGalaxy] = useState(0);
  const [activePlanets, setActivePlanets] = useState<number[]>([0, 0, 0, 0, 0]);
  const [activeLevelIndex, setActiveLevelIndex] = useState<number[]>([0, 0, 0, 0, 0]);
  const [loading, setLoading] = useState(true); // Track loading state

  if (DEBUG_RESET_PROGRESS) {
    Alert.alert("Reset progress mode is enabled")
    useEffect(() => {
      setTimeout(() => {
        setActivePlanets([0, 0, 0, 0, 0]);
      }, 1000);
    }, []);
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedGalaxy = await AsyncStorage.getItem('selectedGalaxy');
        const savedPlanets = await AsyncStorage.getItem('activePlanets');
        const savedLevels = await AsyncStorage.getItem('activeLevelIndex'); // Load active levels
        if (savedGalaxy) setSelectedGalaxy(parseInt(savedGalaxy, 10));
        if (savedPlanets) setActivePlanets(JSON.parse(savedPlanets));
        if (savedLevels) setActiveLevelIndex(JSON.parse(savedLevels)); // Set active levels
      } catch (error) {
        console.warn('Failed to load data from AsyncStorage:', error);
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
        console.warn('Failed to save selectedGalaxy to AsyncStorage:', error);
      }
    };
    saveSelectedGalaxy();
  }, [selectedGalaxy]);

  useEffect(() => {
    if (loading) return; // Prevent saving before data is loaded
    const saveActivePlanets = async () => {
      try {
        await AsyncStorage.setItem('activePlanets', JSON.stringify(activePlanets));
      } catch (error) {
        console.warn('Failed to save activePlanets to AsyncStorage:', error);
      }
    };
    saveActivePlanets();
  }, [activePlanets, loading]);

  useEffect(() => {
    if (loading) return; // Prevent saving before data is loaded
    const saveActiveLevelIndex = async () => {
      try {
        await AsyncStorage.setItem('activeLevelIndex', JSON.stringify(activeLevelIndex));
      } catch (error) {
        console.warn('Failed to save activeLevelIndex to AsyncStorage:', error);
      }
    };
    saveActiveLevelIndex();
  }, [activeLevelIndex, loading]);

  const levelUp = () => {
    setActiveLevelIndex((prevLevels) => {
      const newLevels = [...prevLevels];
      if (newLevels[selectedGalaxy] < 4) {
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

  const getSelectedPlanet = (): SelectedPlanet => {
    const planetIndex = activePlanets[selectedGalaxy];
    const imageSource = getPlanetImage(selectedGalaxy, planetIndex);
    const { width, height } = RNImage.resolveAssetSource(imageSource);
    const planetList = planetNames[selectedGalaxy];
    return { 
      planetIndex, 
      imageSource, 
      size: { width, height },
      name: planetList[planetIndex],
      planetType: getPlanetType(width, height, planetIndex),
      displaySize: getPlanetDisplaySize(getPlanetType(width, height, planetIndex)),
      seed: selectedGalaxy * 100 + activePlanets[selectedGalaxy] + 12
    };
  }

  const getSelectedGalaxyPlanetData = (planetIndex: number): SelectedPlanet => {
    const imageSource = getPlanetImage(selectedGalaxy, planetIndex);
    const { width, height } = RNImage.resolveAssetSource(imageSource);
    const planetList = planetNames[selectedGalaxy];

    return { 
      planetIndex, 
      imageSource, 
      size: { width, height },
      name: planetList[planetIndex],
      planetType: getPlanetType(width, height, planetIndex),
      displaySize: getPlanetDisplaySize(getPlanetType(width, height, planetIndex)),
      seed: selectedGalaxy * 100 + activePlanets[selectedGalaxy] + 12
    };
  }

  return (
    <GalaxyContext.Provider value={{
      selectedGalaxy,
      activePlanets,
      setSelectedGalaxy,
      levelUp,
      activeLevelIndex,
      setActiveLevelIndex,
      selectedPlanet: getSelectedPlanet(),
      getSelectedGalaxyPlanetData
    }}>
      {children}
    </GalaxyContext.Provider>
  );
};

export const useGalaxyContext = () => {
  const context = useContext(GalaxyContext);
  if (!context)
    throw new Error('useGalaxyContext must be used within a GalaxyProvider');

  return context;
};
