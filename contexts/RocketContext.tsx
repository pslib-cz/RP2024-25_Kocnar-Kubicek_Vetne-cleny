// 
// This context is used to manage the rocket preferences
//

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { useAPI } from '@/hooks/useAPI';
import { useGalaxyContext } from './GalaxyContext';

interface RocketContextType {
  bodyColor: string;
  setBodyColor: React.Dispatch<React.SetStateAction<string>>;
  trailColor: string;
  setTrailColor: React.Dispatch<React.SetStateAction<string>>;
  selectedRocketIndex: number;
  setSelectedRocketIndex: React.Dispatch<React.SetStateAction<number>>;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  teacherMode: boolean;
  setTeacherMode: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
  secretKey: string;
  syncPlayerData: () => Promise<void>;
}

const RocketContext = createContext<RocketContextType | null>(null);

interface RocketProviderProps {
  children: ReactNode;
}

export const RocketProvider = ({ children }: RocketProviderProps) => {
  const [bodyColor, setBodyColor] = useState('#FF7733');
  const [trailColor, setTrailColor] = useState('#F7D795');
  const [selectedRocketIndex, setSelectedRocketIndex] = useState(0);
  const [name, setName] = useState('Uživatel');
  const [teacherMode, setTeacherMode] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('');
  
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
      console.error('Error syncing player config:', error);
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

        if (savedBodyColor) setBodyColor(savedBodyColor);
        if (savedTrailColor) setTrailColor(savedTrailColor);
        if (savedRocketIndex) setSelectedRocketIndex(parseInt(savedRocketIndex, 10));
        if (savedName) setName(savedName);
        if (savedTeacherMode) setTeacherMode(savedTeacherMode === 'true');
      } catch (error) {
        console.error('Error loading rocket preferences:', error);
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
      console.error('Error saving rocket preferences:', error);
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