import { SessionUpdateRequest } from "./api";

// Types related to the MultiplayerGameContext
export interface Player {
  id: string;
  name: string;
  bodyColor: string;
  trailColor: string;
  selectedRocketIndex: number;
}

export interface GameConfig {
  difficulty: number; // (0 - 100) question difficulty
  galaxy: number; // (0-4) galaxy index - Hlavní, Přísl, Přívlastek a Doplňek
  questiontypes: number;
  expirationTime: Date; // Game expiration time
  seeded: boolean; // Whether to generate a seed for the game (only used during creation)
  questionCount: number; // Number of questions in the game
  seed?: number; // Server-generated seed (undefined if game is not seeded)
}

export interface MultiplayerGameContextData {
  isHost: boolean;
  code: string;
  config: GameConfig;
  players: Player[];
  author: Player | null;
  setIsHost: (isHost: boolean) => void;
  setCode: (code: string) => void;
  setConfig: (config: GameConfig) => void;
  setPlayers: (player: Player[]) => void;
  setAuthor: (author: Player | null) => void;
  joinGame: (gameCode: string) => Promise<void>;
  createGame: (config: GameConfig) => Promise<void>;
  leaveGame: () => Promise<void>;
  tryStartSession: () => Promise<void>;
  tryUpdateSession: (data : SessionUpdateRequest) => Promise<void>;
}
