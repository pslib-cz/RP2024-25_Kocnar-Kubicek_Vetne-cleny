import React, { createContext, useContext, useState } from 'react';
import { Player, GameConfig, MultiplayerGameContextData } from '../types/MultiplayerGameTypes';
import { useAPI } from '../hooks/useAPI';
import { useRocket } from './RocketContext';
import { SessionUpdateRequest } from '@/types/api';

const MultiplayerGameContext = createContext<MultiplayerGameContextData | undefined>(undefined);

export const MultiplayerGameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [code, setCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [config, setConfig] = useState<GameConfig>({
    difficulty: 0,
    galaxy: 0,
    seed: 0,
    questionTypes: 10,
  });
  const [players, setPlayers] = useState<Player[]>([]);
  const [author, setAuthor] = useState<Player | null>(null);

  const rocket = useRocket();
  const API = useAPI({
    secretKey: rocket.secretKey,
    userId: rocket.userId,
    name: rocket.name,
    bodyColor: rocket.bodyColor,
    trailColor: rocket.trailColor,
    selectedRocketIndex: rocket.selectedRocketIndex,
  });

  const resetGameState = () => {
    setCode('');
    setIsHost(false);
    setConfig({
      difficulty: 0,
      galaxy: 0,
      seed: 0,
      questionTypes: 10,
    });
    setPlayers([]);
    setAuthor(null);
  };

  const tryStartSession = async () => {

    console.log('Starting session...');

    if(!code){
      console.error('No game code provided');
      return;
    }

    API.startSession(code)

  }

  const tryUpdateSession = async (data : SessionUpdateRequest) => {

    console.log('Updating session...');

    if(!code){
      console.error('No game code provided');
      return;
    }

    API.updateSession(code, data)

  }

  const joinGame = async (code: string) => {
    try {
      const response = await API.joinGame(parseInt(code, 10));
      console.log('Game joined successfully:', response);

      // Update context with game details
      setCode(code);
      setConfig({
        difficulty: response.game.difficulty,
        galaxy: response.game.galaxy,
        seed: parseInt(response.game.seed, 10),
        questionTypes: response.game.questiontypes,
      });
      
      // Set author and players
      setAuthor(response.author);
      setPlayers(response.players || []);
    } catch (error) {
      console.error('Failed to join game:', error);
      throw error;
    }
  };

  const createGame = async (config: GameConfig) => {
    try {
      const response = await API.createGame(
        config.difficulty,
        config.galaxy,
        config.questionTypes
      );
      
      console.log('Game created successfully:', response);
      setCode(response.code.toString());
      setIsHost(true);
      setConfig(config);
      
      // When creating a game, the current user is the author
      setAuthor({
        id: rocket.userId,
        name: rocket.name,
        bodyColor: rocket.bodyColor,
        trailColor: rocket.trailColor,
        selectedRocketIndex: rocket.selectedRocketIndex,
      });
    } catch (error) {
      console.error('Failed to create game:', error);
      throw error;
    }
  };

  const leaveGame = async () => {
    if (!code) return;

    try {
      // No need to call API for leaving, just reset the state
      resetGameState();
    } catch (error) {
      console.error('Failed to leave game:', error);
      throw error;
    }
  };

  return (
    <MultiplayerGameContext.Provider
      value={{
        code,
        config,
        players,
        author,
        setCode,
        setConfig,
        setPlayers,
        setAuthor,
        isHost,
        setIsHost,
        joinGame,
        createGame,
        leaveGame,
        tryStartSession,
        tryUpdateSession,
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