export type Screen =
  | 'welcome'
  | 'login'
  | 'otp'
  | 'home'
  | 'tournaments'
  | 'tournament-detail'
  | 'create'
  | 'lobby'
  | 'bracket'
  | 'auction-hub'
  | 'auction-room'
  | 'auction-portfolio'
  | 'markets'
  | 'profile';

export type NavDirection = 'forward' | 'back' | 'tab' | 'auth';

export interface Player {
  id: string;
  name: string;
  flag: string;
  rating: number;
  level: 'Pro' | 'Amateur';
  nationality: string;
  wins: number;
  losses: number;
  ranking: number;
  avatar?: string;
}

export interface Tournament {
  id: string;
  name: string;
  location: string;
  locationShort: string;
  date: string;
  dateShort: string;
  format: 'Knockout' | 'Round Robin' | 'Hybrid';
  teamCount: number;
  registeredTeams: number;
  entryFee: number;
  prizePool: number;
  status: 'open' | 'upcoming' | 'live' | 'completed';
  hasCalcutta: boolean;
  auctionStatus?: 'upcoming' | 'live' | 'closed';
  coverGradient: string;
  description: string;
  registeredPlayers: Player[];
}

export interface Bid {
  id: string;
  userId: string;
  username: string;
  amount: number;
  timestamp: number;
  isMe?: boolean;
}

export interface AuctionTeam {
  id: string;
  pro: Player;
  tournamentId: string;
  tournamentName: string;
  currentBid: number;
  startingBid: number;
  initialTimeLeft: number;
  status: 'live' | 'upcoming' | 'closed';
  winnerId?: string;
  winnerName?: string;
  bids: Bid[];
  watchers: number;
  myBid?: number;
}

export interface BracketSlot {
  name: string | null;
  seed?: number;
  isWinner?: boolean;
  isMe?: boolean;
}

export interface BracketMatch {
  id: string;
  round: 'RR' | 'SF' | 'F';
  group?: 'A' | 'B';
  slot1: BracketSlot;
  slot2: BracketSlot;
  score?: string;
  status: 'completed' | 'live' | 'upcoming';
}

export type MarketCategory = 'Sports' | 'Politics' | 'Finance' | 'Entertainment' | 'Padel';

export interface Market {
  id: string;
  title: string;
  subtitle?: string;
  category: MarketCategory;
  yesPrice: number;   // 1–99 (cents on the dollar = % probability)
  volume: number;     // total $ traded
  endsAt: string;
  isHot?: boolean;
  change24h: number;  // percentage point change in yes price
  icon: string;       // emoji
  isNew?: boolean;
}

export interface CalcuttaTeam {
  id: string;
  proFlag: string;
  label: string;
  partnerIsMe: boolean;
  currentBid: number;
  topBidderName: string;
  topBidderIsMe: boolean;
  bidsCount: number;
}

export interface WinNotification {
  type: 'pro' | 'calcutta';
  label: string;
}

export interface CreateTournamentForm {
  name: string;
  location: string;
  date: string;
  format: string;
  teamCount: number;
  entryFee: number;
  hasCalcutta: boolean;
  auctionDate: string;
  startingBid: number;
  buyIn: number;
}
