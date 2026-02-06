export enum AppView {
  CREATE = 'CREATE',
  DASHBOARD = 'DASHBOARD',
  SHARE_PREVIEW = 'SHARE_PREVIEW',
  JOIN = 'JOIN',
  TOURNAMENT_LANDING = 'TOURNAMENT_LANDING',
}

export interface Player {
  id: string;
  nickname: string;
  avatarUrl?: string; // Base64 or URL
  joinedAt: number;
}

export interface Tournament {
  id: string;
  name: string;
  sport: string;
  location: string;
  date: string;
  maxPlayers: number;
  mood: string;
  ownerId: string;
  players: Player[];
  posterUrl?: string; // Base64 or URL
  posterPrompt?: string;
}

export interface GeneratePosterParams {
  name: string;
  sport: string;
  location: string;
  mood: string;
  playerCount: number;
  profilePictures?: string[]; // Array of base64 image data
}
