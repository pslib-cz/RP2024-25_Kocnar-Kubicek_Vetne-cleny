// Player Management Types
export interface PlayerCreateRequest {
  id: string;
  name: string;
  bodyColor: string;
  trailColor: string;
  selectedRocketIndex: number;
  clientVersion: string;
  secretKey: string;
}

export interface PlayerCreateResponse {
  id: string;
  name: string;
  secretKey: string;
}

export interface PlayerInfo {
  id: string;
  name: string;
  bodyColor: string;
  trailColor: string;
  selectedRocketIndex: number;
  clientVersion: string;
  gameId?: string;
}

export interface PlayerSyncRequest {
  name?: string;
  bodyColor?: string;
  trailColor?: string;
  selectedRocketIndex?: number;
  clientVersion?: string;
}

// Game Management Types
export interface GameCreateRequest {
  difficulty: number;
  galaxy: number;
  questiontypes: number;
  version: string;
  expiration: number;
}

export interface GameCreateResponse {
  gameId: string;
  code: number;
  author: {
    id: string;
    name: string;
  };
}

export interface GameJoinRequest {
  code: number;
  version: string;
}

export interface PlayerData {
  id: string;
  name: string;
  bodyColor: string;
  trailColor: string;
  selectedRocketIndex: number;
}

export interface GameData {
  difficulty: number;
  galaxy: number;
  questiontypes: number;
  seed: string;
  version: string;
}

export interface GameJoinResponse {
  author: PlayerData;
  game: GameData;
  playerId: string;
  players: PlayerData[];
}

// Session Management Types
export interface SessionCreateRequest {
  gameId: string;
}

export interface SessionCreateResponse {
  sessionId: string;
}

export interface SessionUpdateRequest {
  score?: number;
  correctAnswers?: number;
  completed?: boolean;
}

export interface SessionInfo {
  id: string;
  playerId: string;
  gameId: string;
  score: number;
  correctAnswers: number;
  completed: boolean;
  startedAt: string;
  endedAt: string;
}

// System Types
export interface HealthResponse {
  status: string;
}

// API Error Types
export enum APIErrorCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  CONFLICT = 409,
  GAME_EXPIRED = 410,
  SERVER_ERROR = 500,
}

export class APIError extends Error {
  constructor(
    public code: APIErrorCode,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export interface APIErrorResponse {
  error: string;
  details?: any;
} 