
export type Direction = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

export interface GameItem {
  id: string;
  name: string;
  description: string;
  canTake: boolean;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  exits: Partial<Record<Direction, string>>;
  items: string[]; // IDs of items in the room
}

export interface GameState {
  currentRoomId: string;
  inventory: string[]; // IDs of items in inventory
  roomItems: Record<string, string[]>; // roomId -> array of itemIds
  log: GameLogEntry[];
}

export interface GameLogEntry {
  id: string;
  text: string;
  type: 'action' | 'description' | 'system' | 'error';
  timestamp: number;
}
