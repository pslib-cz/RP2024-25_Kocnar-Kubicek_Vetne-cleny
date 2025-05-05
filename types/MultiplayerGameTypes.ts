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
  seed?: number;
  questionTypes: number;
}

export interface MultiplayerGameContextData {
  isHost: boolean;
  code: string;
  config: GameConfig;
  players: Player[];
  setIsHost: (isHost: boolean) => void;
  setCode: (code: string) => void;
  setConfig: (config: GameConfig) => void;
  setPlayers: (player: Player[]) => void;
  joinGame: (gameCode: string) => Promise<void>;
  createGame: (config: GameConfig) => Promise<void>;
  leaveGame: () => Promise<void>;
}
