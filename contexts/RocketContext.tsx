// 
// This context is used to manage the rocket preferences
//

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { useAPI } from '@/hooks/useAPI';
import { useGalaxyContext } from './GalaxyContext';
import { router } from 'expo-router';
import { loadSvgAsset } from '@/app/(pages)/profile';
import { rocket1, rocket2, rocket3, rocket4, rocket5 } from '@/data/rocketsImages';

interface RocketContextType {
  bodyColor: string;
  setBodyColor: React.Dispatch<React.SetStateAction<string>>;
  trailColor: string;
  setTrailColor: React.Dispatch<React.SetStateAction<string>>;
  selectedRocketIndex: number;
  setSelectedRocketIndex: React.Dispatch<React.SetStateAction<number>>;
  name: string;
  setName: (nameInput: string) => void;
  teacherMode: boolean;
  setTeacherMode: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
  secretKey: string;
  syncPlayerData: () => Promise<void>;
  rocketSvgs: string[];
}

const RocketContext = createContext<RocketContextType | null>(null);

interface RocketProviderProps {
  children: ReactNode;
}

// Helper to generate a random light gray color
function randomLightGray() {
  const v = Math.floor(200 + Math.random() * 55); // 200-255
  return `rgb(${v},${v},${v})`;
}

// Helper to generate a random fully saturated color (HSV to RGB)
function randomSaturatedColor() {
  const h = Math.floor(Math.random() * 360);
  return `hsl(${h}, 100%, 50%)`;
}

export const RocketProvider = ({ children }: RocketProviderProps) => {
  const [bodyColor, setBodyColor] = useState(() => randomLightGray());
  const [trailColor, setTrailColor] = useState(() => randomSaturatedColor());
  const [selectedRocketIndex, setSelectedRocketIndex] = useState(0);
  const [name, setNameRaw] = useState('');
  const [teacherMode, setTeacherMode] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('');

  const [rocketSvgs, setRocketSvgs] = useState<string[]>([]);

  useEffect(() => {
    const loadRockets = async () => {
      try {
        const svg1 = await loadSvgAsset(rocket1);
        const svg2 = await loadSvgAsset(rocket2);
        const svg3 = await loadSvgAsset(rocket3);
        const svg4 = await loadSvgAsset(rocket4);
        const svg5 = await loadSvgAsset(rocket5);

        setRocketSvgs([svg1, svg2, svg3, svg4, svg5].filter(svg => svg !== null));
      } catch (error) {
        console.warn('Error loading rocket SVGs:', error);
      }
    };

    loadRockets();
  }, []);

  const setName = (nameInput: string) => {
    if (nameInput && nameInput !== '') {
      setNameRaw(nameInput);
    }
  };
  
  const { activePlanets } = useGalaxyContext();
  
  const api = useAPI({
    secretKey,
    userId,
    name,
    bodyColor,
    trailColor,
    selectedRocketIndex,
  });

  // Sync player config with server
  const syncWithServer = async () => {
    if (!userId || !secretKey) return;
    
    try {
      await api.upsertPlayer(activePlanets);
    } catch (error) {
      console.warn('Error syncing player config:', error);
    }
  };

  // Public method to sync player data that can be called externally
  const syncPlayerData = async () => {
    await syncWithServer();
  };

  // Load preferences from AsyncStorage
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedUserId = await AsyncStorage.getItem('user_profile_id');
        const savedSecretKey = await AsyncStorage.getItem('user_profile_secret_key');
        
        if (savedUserId) {
          setUserId(savedUserId);
        } else {
          // Generate new UUID if none exists
          const newUserId = await Crypto.randomUUID();
          await AsyncStorage.setItem('user_profile_id', newUserId);
          setUserId(newUserId);
        }

        if (savedSecretKey) {
          setSecretKey(savedSecretKey);
        } else {
          // Generate new secret key if none exists
          const newSecretKey = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            await Crypto.randomUUID()
          );
          await AsyncStorage.setItem('user_profile_secret_key', newSecretKey);
          setSecretKey(newSecretKey);
        }

        const savedBodyColor = await AsyncStorage.getItem('user_profile_body_color');
        const savedTrailColor = await AsyncStorage.getItem('user_profile_trail_color');
        const savedRocketIndex = await AsyncStorage.getItem('user_profile_rocket_index');
        const savedName = await AsyncStorage.getItem('user_profile_name');
        const savedTeacherMode = await AsyncStorage.getItem('user_profile_teacher_mode');

        if (!savedName || savedName === '') {
            router.replace('/(pages)/onboarding');
        }

        if (savedBodyColor) setBodyColor(savedBodyColor);
        if (savedTrailColor) setTrailColor(savedTrailColor);
        if (savedRocketIndex) setSelectedRocketIndex(parseInt(savedRocketIndex, 10));
        if (savedName) setName(savedName);
        if (savedTeacherMode) setTeacherMode(savedTeacherMode === 'true');
      } catch (error) {
        console.warn('Error loading rocket preferences:', error);
      }
    };
    loadPreferences();
  }, []);

  // Save preferences to AsyncStorage and sync with server
  const savePreferences = async () => {
    try {
      await AsyncStorage.setItem('user_profile_body_color', bodyColor);
      await AsyncStorage.setItem('user_profile_trail_color', trailColor);
      await AsyncStorage.setItem('user_profile_rocket_index', selectedRocketIndex.toString());
      await AsyncStorage.setItem('user_profile_name', name);
      await AsyncStorage.setItem('user_profile_teacher_mode', teacherMode.toString());
    } catch (error) {
      console.warn('Error saving rocket preferences:', error);
    }
  };

  // Save preferences whenever they change, but don't sync with server
  useEffect(() => {
    if (!userId) return;
    savePreferences();
  }, [bodyColor, trailColor, selectedRocketIndex, name, teacherMode]);

  // Only sync when levels or user preferences change (except during initial load)
  useEffect(() => {
    // Skip if no user data yet
    if (!userId || !secretKey) return;
    
    // Sync with server
    syncWithServer();
  }, [activePlanets, userId, secretKey, bodyColor, trailColor, selectedRocketIndex, name]);

  return (
    <RocketContext.Provider
      value={{
        bodyColor,
        setBodyColor,
        trailColor,
        setTrailColor,
        selectedRocketIndex,
        setSelectedRocketIndex,
        name,
        setName,
        teacherMode,
        setTeacherMode,
        userId,
        secretKey,
        syncPlayerData,
        rocketSvgs
      }}
    >
      {children}
    </RocketContext.Provider>
  );
};

export const useRocket = (): RocketContextType => {
  const context = useContext(RocketContext);
  if (!context) {
    throw new Error('useRocket must be used within a RocketProvider');
  }
  return context;
};