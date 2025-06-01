import * as Network from 'expo-network';
import {
  PlayerCreateRequest,
  PlayerCreateResponse,
  PlayerInfo,
  PlayerSyncRequest,
  GameCreateRequest,
  GameCreateResponse,
  GameJoinRequest,
  GameJoinResponse,
  SessionCreateRequest,
  SessionCreateResponse,
  SessionUpdateRequest,
  SessionInfo,
  HealthResponse,
  APIError,
  APIErrorCode,
  APIErrorResponse,
} from '@/types/api';
import { useConfigContext } from '@/contexts/ConfigContext';

const NO_AUTH_ENDPOINTS = ['/health', '/players/create', '/players/upsert'];

interface APIUserData {
  secretKey: string;
  userId: string;
  name: string;
  bodyColor: string;
  trailColor: string;
  selectedRocketIndex: number;
}

const DEFAULT_USER_DATA: APIUserData = {
  secretKey: '',
  userId: '',
  name: 'Uživatel',
  bodyColor: '#FF7733',
  trailColor: '#F7D795',
  selectedRocketIndex: 0,
};

export interface AuthoredGame {
  id: string;
  code: number;
  difficulty: number;
  galaxy: number;
  questiontypes: number;
  version: string;
  seed: string;
  active: boolean;
  expirationTime: string;
  createdAt: string;
  questionCount: number;
  seeded: boolean;
  sessions: Array<{
    id: string;
    playerId: string;
    score: number;
    correctAnswers: number;
    completed: boolean;
    startedAt: string;
    endedAt: string;
    player: {
      id: string;
      name: string;
      bodyColor: string;
      trailColor: string;
      selectedRocketIndex: number;
    };
  }>;
}

export const useAPI = (userData?: Partial<APIUserData>) => {
  const { config } = useConfigContext();
  const API_URL = config.API_URL;
  const API_BACKUP_URL = config.API_BACKUP_URL;
  const CLIENT_VERSION = '1.0.0'; 

  const data = { ...DEFAULT_USER_DATA, ...userData };
  const { secretKey, userId, name, bodyColor, trailColor, selectedRocketIndex } = data;

  const handleAPIError = async (response: Response): Promise<never> => {
    const errorData = await response.json() as APIErrorResponse;
    throw new APIError(
      response.status as APIErrorCode,
      errorData.error || 'An error occurred',
      errorData.details
    );
  };

  const checkNetworkConnection = async (): Promise<void> => {
    const networkState = await Network.getNetworkStateAsync();
    if (!networkState.isConnected) {
      throw new APIError(
        APIErrorCode.SERVER_ERROR,
        'No internet connection available',
        { networkState }
      );
    }
  };

  const fetchWithFallback = async <T = any>(path: string, options: RequestInit, secretKey: string, userId: string): Promise<T> => {
    await checkNetworkConnection();
    const headers: Record<string, string> = {
      ...options.headers as Record<string, string>,
    };
    if (!NO_AUTH_ENDPOINTS.includes(path)) {
      headers['X-User-Secret'] = secretKey;
      headers['X-User-ID'] = userId;
    }
    try {
      const response = await fetch(`${API_URL}${path}`, { ...options, headers });
      if (!response.ok) {
        return handleAPIError(response);
      }
      return await response.json();
    } catch (primaryError) {
      console.warn('Primary API failed, trying backup API:', primaryError);
      try {
        const backupResponse = await fetch(`${API_BACKUP_URL}${path}`, { ...options, headers });
        if (!backupResponse.ok) {
          return handleAPIError(backupResponse);
        }
        return await backupResponse.json();
      } catch (backupError) {
        console.warn('Backup API failed:', backupError);
        throw new APIError(
          APIErrorCode.SERVER_ERROR,
          'Both primary and backup APIs failed',
          { primaryError, backupError }
        );
      }
    }
  };

  const post = async <T = any>(path: string, payload?: any): Promise<T> => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload ? JSON.stringify(payload) : undefined,
    };
    return fetchWithFallback<T>(path, options, secretKey, userId);
  };

  const get = async <T = any>(path: string): Promise<T> => {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    return fetchWithFallback<T>(path, options, secretKey, userId);
  };

  const patch = async <T = any>(path: string, payload: any): Promise<T> => {
    const options: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    return fetchWithFallback<T>(path, options, secretKey, userId);
  };

  // Player Management Functions
  const createPlayer = async (): Promise<PlayerCreateResponse> => {
    const payload: PlayerCreateRequest = {
      id: userId,
      name,
      bodyColor,
      trailColor,
      selectedRocketIndex,
      clientVersion: CLIENT_VERSION,
      secretKey,
    };
    return post<PlayerCreateResponse>('/players/create', payload);
  };

  const upsertPlayer = async (levels: number[] = [0,0,0,0,0]): Promise<PlayerInfo> => {
    const payload = {
      name,
      bodyColor,
      trailColor,
      selectedRocketIndex,
      levels,
      clientVersion: CLIENT_VERSION,
    };
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': userId,
        'X-User-Secret': secretKey,
      },
      body: JSON.stringify(payload),
    };
    return fetchWithFallback<PlayerInfo>('/players/upsert', options, secretKey, userId);
  };

  const getPlayerInfo = async (): Promise<PlayerInfo> => {
    return get<PlayerInfo>(`/players/${userId}`);
  };

  const syncPlayerConfig = async (): Promise<PlayerInfo> => {
    const payload: PlayerSyncRequest = {
      name,
      bodyColor,
      trailColor,
      selectedRocketIndex,
      clientVersion: CLIENT_VERSION,
    };
    return patch<PlayerInfo>('/players/sync', payload);
  };

  // Game Management Functions
  const createGame = async (
    difficulty: number,
    galaxy: number,
    questiontypes: number,
    expirationTime: string,
    seeded: boolean,
    questionCount: number
  ): Promise<GameCreateResponse> => {
    const payload: GameCreateRequest = {
      difficulty,
      galaxy,
      questiontypes,
      version: CLIENT_VERSION,
      expirationTime,
      seeded,
      questionCount,
    };
    return post<GameCreateResponse>('/games/create', payload);
  };

  const joinGame = async (code: number): Promise<GameJoinResponse> => {
    const payload: GameJoinRequest = {
      code,
      version: CLIENT_VERSION,
    };
    return post<GameJoinResponse>('/games/join', payload);
  };

  const getGameSessions = async (gameId: string): Promise<SessionInfo[]> => {
    return get<SessionInfo[]>(`/games/${gameId}/sessions`);
  };

  // Session Management Functions
  const startSession = async (gameId: string): Promise<SessionCreateResponse> => {
    const payload: SessionCreateRequest = {
      gameId,
    };
    return post<SessionCreateResponse>('/sessions', payload);
  };

  const updateSession = async (
    sessionId: string,
    update: SessionUpdateRequest
  ): Promise<SessionInfo> => {
    return patch<SessionInfo>(`/sessions/${sessionId}`, update);
  };

  // System Functions
  const checkHealth = async (): Promise<HealthResponse> => {
    return get<HealthResponse>('/health');
  };

  const getAuthoredGames = async (): Promise<AuthoredGame[]> => {
    return get<AuthoredGame[]>('/players/me/authored-games');
  };

  return { 
    post, 
    get, 
    patch,
    createPlayer,
    upsertPlayer,
    getPlayerInfo,
    syncPlayerConfig,
    createGame,
    joinGame,
    getGameSessions,
    startSession,
    updateSession,
    checkHealth,
    getAuthoredGames,
  };
};