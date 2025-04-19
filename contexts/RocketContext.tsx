import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
}

const RocketContext = createContext<RocketContextType | null>(null);

interface RocketProviderProps {
  children: ReactNode;
}

export const RocketProvider = ({ children }: RocketProviderProps) => {
  const [bodyColor, setBodyColor] = useState('#FF7733');
  const [trailColor, setTrailColor] = useState('#F7D795');
  const [selectedRocketIndex, setSelectedRocketIndex] = useState(0);
  const [name, setName] = useState('User');
  const [teacherMode, setTeacherMode] = useState(false);

  // Load preferences from AsyncStorage
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedBodyColor = await AsyncStorage.getItem('user_profile_body_color');
        const savedTrailColor = await AsyncStorage.getItem('user_profile_trail_color');
        const savedRocketIndex = await AsyncStorage.getItem('user_profile_rocket_index');
        const savedName = await AsyncStorage.getItem('user_profile_name');

        if (savedBodyColor) setBodyColor(savedBodyColor);
        if (savedTrailColor) setTrailColor(savedTrailColor);
        if (savedRocketIndex) setSelectedRocketIndex(parseInt(savedRocketIndex, 10));
        if (savedName) setName(savedName);
      } catch (error) {
        console.error('Error loading rocket preferences:', error);
      }
    };

    loadPreferences();
  }, []);

  // Save preferences to AsyncStorage
  const savePreferences = async () => {
    try {
      await AsyncStorage.setItem('user_profile_body_color', bodyColor);
      await AsyncStorage.setItem('user_profile_trail_color', trailColor);
      await AsyncStorage.setItem('user_profile_rocket_index', selectedRocketIndex.toString());
      await AsyncStorage.setItem('user_profile_name', name);
    } catch (error) {
      console.error('Error saving rocket preferences:', error);
    }
  };

  // Save preferences whenever they change
  useEffect(() => {
    savePreferences();
  }, [bodyColor, trailColor, selectedRocketIndex, name]);

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