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
    questiontypes: 0b11111111,
    expirationTime: new Date(Date.now() + 30 * 60 * 1000), // Default 30 minutes from now
    seeded: true,
    questionCount: 10, // Default number of questions
    seed: undefined, // Default seed is undefined
  });
  const [players, setPlayers] = useState<Player[]>([]);
  const [author, setAuthor] = useState<Player | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);

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
      questiontypes: 10,
      expirationTime: new Date(Date.now() + 30 * 60 * 1000), // Default 30 minutes from now
      seeded: true,
      questionCount: 10, // Default number of questions
      seed: 0, // Default seed is undefined
    });
    setPlayers([]);
    setAuthor(null);
    setSessionId(null);
    setGameId(null);
  };

  const tryStartSession = async () => {

    console.log('Starting session...');

    if(!gameId){
      console.log('No game ID provided');
      return;
    }

    const response = await API.startSession(gameId)
    setSessionId(response.sessionId);

  }

  const tryUpdateSession = async (data : SessionUpdateRequest) => {
    if(!sessionId) {
      console.log('No session ID provided');
      return;
    }

    if(!code){
      console.log('No game code provided');
      return;
    }

    console.log('Updating session...');
    API.updateSession(sessionId, data)
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
        questiontypes: response.game.questiontypes,
        expirationTime: new Date(response.game.expirationTime),
        seeded: response.game.seed !== undefined,
        seed: parseInt(response.game.seed.toString(), 16),
        questionCount: response.game.questionCount,
      });
      
      // Set author and players
      setAuthor(response.author);
      setPlayers(response.players || []);
      if(response.game.id) setGameId(response.game.id);
    } catch (error) {
      console.warn('Failed to join game:', error);
      throw error;
    }
  };

  const createGame = async (config: GameConfig) => {
    try {
      const response = await API.createGame(
        config.difficulty,
        config.galaxy,
        config.questiontypes,
        config.expirationTime.toISOString(),
        config.seeded,
        config.questionCount
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
      console.warn('Failed to create game:', error);
      throw error;
    }
  };

  const leaveGame = async () => {
    if (!code) return;

    try {
      // No need to call API for leaving, just reset the state
      resetGameState();
    } catch (error) {
      console.warn('Failed to leave game:', error);
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