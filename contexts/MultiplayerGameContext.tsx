import React, { createContext, useContext, useState, version } from 'react';
import { Player, GameConfig, MultiplayerGameContextData } from '../types/MultiplayerGameTypes';
import { useAPI } from '../hooks/useAPI';


const MultiplayerGameContext = createContext<MultiplayerGameContextData | undefined>(undefined);

export const MultiplayerGameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [code, setCode] = useState('');
    const [isHost, setIsHost] = useState(false);
    const [config, setConfig] = useState<GameConfig>({
        difficulty: 0,
        galaxy: 0,
        seed: '',
        questionTypes: 10,
    });
    const [players, setPlayers] = useState<Player[]>([]);

    const API = useAPI();

  const joinGame = async (code: string, user: Player) => {
    const payload = {
      code,
      user,
      version: "1.0.0", // Example version, replace with actual version if needed
    };

    try {
      const response = await API.post('/join-game', payload);
      console.log('Game joined successfully:', response);

      // Update context with game details
      setCode(code);
      setPlayers(response.players); // Assuming response contains players
      setConfig(response.game); // Assuming response contains game config
    } catch (error) {
      console.error('Failed to join game:', error);
    }
  };

  const createGame = async (config: GameConfig) => {
    const payload = {
      ...config,
      version : "1.0.0", // Example version, replace with actual version if needed
    };

    try {
      const response = await API.post('/create-game', payload);
      // Handle response (e.g., update state with game data)
      console.log('Game created successfully:', response);
      setCode(response.code); // Assuming the response contains a code
      setIsHost(true); // Set the host status to true
      setConfig(config);
      setPlayers([]); // Assuming the response contains the player's rocket data
    } catch (error) {
      console.error('Failed to create game:', error);
    }
  };

  return (
    <MultiplayerGameContext.Provider
      value={{
        code,
        config,
        players,
        setCode,
        setConfig,
        setPlayers,
        isHost,
        setIsHost,
        joinGame,
        createGame,
      }}
    >
      {children}
    </MultiplayerGameContext.Provider>
  );
};

export const useMultiplayerGameContext = () => {
  const context = useContext(MultiplayerGameContext);
  if (!context) {
    throw new Error('useMultiplayerGameContext must be used within a MultiplayerGameProvider');
  }
  return context;
};