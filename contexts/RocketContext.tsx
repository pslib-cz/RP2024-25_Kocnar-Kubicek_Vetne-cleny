// 
// This context is used to manage the rocket preferences
//

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { useAPI } from '@/hooks/useAPI';

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
  isPlayerCreated: boolean;
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
  const [isPlayerCreated, setIsPlayerCreated] = useState(false);
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
    if (!isPlayerCreated) return;
    
    try {
      await api.syncPlayerConfig();
      console.log('Player config synced with server');
    } catch (error) {
      console.error('Error syncing player config:', error);
    }
  };

  // Load preferences from AsyncStorage and create player if needed
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedUserId = await AsyncStorage.getItem('user_profile_id');
        const savedSecretKey = await AsyncStorage.getItem('user_profile_secret_key');
        const savedIsPlayerCreated = await AsyncStorage.getItem('user_profile_created');
        
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

        if (savedIsPlayerCreated === 'true') {
          setIsPlayerCreated(true);
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

        // Try to create player account if we have both userId and secretKey and haven't created it yet
        if (userId && secretKey && !isPlayerCreated) {
          try {
            await api.createPlayer();
            await AsyncStorage.setItem('user_profile_created', 'true');
            setIsPlayerCreated(true);
            console.log('Player account created successfully');
          } catch (error) {
            // If player already exists, mark as created
            if (error instanceof Error && error.message.includes('already exists')) {
              await AsyncStorage.setItem('user_profile_created', 'true');
              setIsPlayerCreated(true);
              console.log('Player account already exists');
            } else {
              console.error('Error creating player account:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error loading rocket preferences:', error);
      }
    };
    loadPreferences();
  }, [userId, secretKey, isPlayerCreated]);

  // Save preferences to AsyncStorage and sync with server
  const savePreferences = async () => {
    try {
      await AsyncStorage.setItem('user_profile_body_color', bodyColor);
      await AsyncStorage.setItem('user_profile_trail_color', trailColor);
      await AsyncStorage.setItem('user_profile_rocket_index', selectedRocketIndex.toString());
      await AsyncStorage.setItem('user_profile_name', name);
      await AsyncStorage.setItem('user_profile_teacher_mode', teacherMode.toString());

      // Sync with server if player is created
      await syncWithServer();
    } catch (error) {
      console.error('Error saving rocket preferences:', error);
    }
  };

  // Save preferences whenever they change
  useEffect(() => {
    // Skip the initial load
    if (userId === '') return;
    
    savePreferences();
  }, [bodyColor, trailColor, selectedRocketIndex, name, teacherMode]);

  // Sync with server when player is created
  useEffect(() => {
    if (isPlayerCreated) {
      syncWithServer();
    }
  }, [isPlayerCreated]);

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
        isPlayerCreated,
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