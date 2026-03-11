import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Screen, NavDirection, Tournament, AuctionTeam, CalcuttaTeam, WinNotification } from '../types';
import { TOURNAMENTS, AUCTION_TEAMS, ME } from '../data/mockData';

interface AppContextValue {
  screen: Screen;
  direction: NavDirection;
  selectedTournament: Tournament;
  selectedAuction: AuctionTeam;
  navigate: (screen: Screen, direction?: NavDirection) => void;
  goBack: () => void;
  selectTournament: (t: Tournament) => void;
  selectAuction: (a: AuctionTeam) => void;
  // Auction state (persists across navigation)
  proAuctions: AuctionTeam[];
  proTime: number;
  phase: 'pro' | 'calcutta' | 'done';
  calcuttaTime: number;
  calcuttaTeams: CalcuttaTeam[];
  winNotification: WinNotification | null;
  placeBid: (auctionId: string, amount: number) => void;
  placeCalcuttaBid: (teamId: string, amount: number) => void;
  dismissWinNotification: () => void;
}

const AppContext = createContext<AppContextValue>(null!);

const TOURNAMENT_AUCTIONS = AUCTION_TEAMS.filter(a => a.tournamentId === 't1');
const INITIAL_PRO_TIME = Math.min(...TOURNAMENT_AUCTIONS.map(a => a.initialTimeLeft));

export function AppProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<Screen[]>(['welcome']);
  const [direction, setDirection] = useState<NavDirection>('auth');
  const [selectedTournament, setSelectedTournament] = useState<Tournament>(TOURNAMENTS[0]);
  const [selectedAuction, setSelectedAuction] = useState<AuctionTeam>(AUCTION_TEAMS[0]);

  // ── Auction state ──────────────────────────────────────────────────────────
  const [proAuctions, setProAuctions] = useState<AuctionTeam[]>(TOURNAMENT_AUCTIONS);
  const [proTime, setProTime] = useState(INITIAL_PRO_TIME);
  const [phase, setPhase] = useState<'pro' | 'calcutta' | 'done'>('pro');
  const [calcuttaTime, setCalcuttaTime] = useState(0);
  const [calcuttaTeams, setCalcuttaTeams] = useState<CalcuttaTeam[]>([]);
  const [winNotification, setWinNotification] = useState<WinNotification | null>(null);

  // Refs to avoid stale closures in timer callbacks
  const proAuctionsRef = useRef(proAuctions);
  useEffect(() => { proAuctionsRef.current = proAuctions; }, [proAuctions]);
  const calcuttaTeamsRef = useRef(calcuttaTeams);
  useEffect(() => { calcuttaTeamsRef.current = calcuttaTeams; }, [calcuttaTeams]);

  // Pro auction countdown
  useEffect(() => {
    if (phase !== 'pro') return;
    const id = setInterval(() => setProTime(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [phase]);

  // Pro → Calcutta transition
  useEffect(() => {
    if (phase !== 'pro' || proTime !== 0) return;
    const current = proAuctionsRef.current;
    // Notify wins from pro auction
    const winners = current.filter(a => a.bids[0]?.isMe);
    if (winners.length > 0) {
      setWinNotification({ type: 'pro', label: winners.map(a => a.pro.name).join(' & ') });
    }
    // Build calcutta teams from pro auction results
    const teams: CalcuttaTeam[] = current.map(a => {
      const topBid = a.bids[0];
      const partnerIsMe = topBid?.isMe ?? false;
      const partnerName = partnerIsMe ? ME.name.split(' ')[1] : (topBid?.username ?? 'TBD');
      return {
        id: `ct_${a.id}`,
        proFlag: a.pro.flag,
        label: `${a.pro.name.split(' ')[1]} / ${partnerName}`,
        partnerIsMe,
        currentBid: a.currentBid,
        topBidderName: '',
        topBidderIsMe: false,
        bidsCount: 0,
      };
    });
    setCalcuttaTeams(teams);
    setCalcuttaTime(INITIAL_PRO_TIME);
    setPhase('calcutta');
  }, [proTime, phase]);

  // Calcutta countdown
  useEffect(() => {
    if (phase !== 'calcutta') return;
    const id = setInterval(() => setCalcuttaTime(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [phase]);

  // Calcutta → Done transition
  useEffect(() => {
    if (phase !== 'calcutta' || calcuttaTime !== 0) return;
    const winners = calcuttaTeamsRef.current.filter(t => t.topBidderIsMe);
    if (winners.length > 0) {
      setWinNotification({ type: 'calcutta', label: winners.map(t => t.label).join(' & ') });
    }
    setPhase('done');
  }, [calcuttaTime, phase]);

  const placeBid = (auctionId: string, amount: number) => {
    setProAuctions(prev => prev.map(a => {
      if (a.id !== auctionId) return a;
      const newBid = { id: `b_${Date.now()}`, userId: ME.id, username: ME.name, amount, timestamp: Date.now(), isMe: true };
      return { ...a, currentBid: amount, myBid: amount, bids: [newBid, ...a.bids] };
    }));
  };

  const placeCalcuttaBid = (teamId: string, amount: number) => {
    setCalcuttaTeams(prev => prev.map(team => {
      if (team.id !== teamId) return team;
      return { ...team, currentBid: amount, topBidderName: ME.name, topBidderIsMe: true, bidsCount: team.bidsCount + 1 };
    }));
  };

  // ── Navigation ─────────────────────────────────────────────────────────────
  const screen = history[history.length - 1];

  const navigate = (next: Screen, dir: NavDirection = 'forward') => {
    setDirection(dir);
    setHistory(prev => [...prev, next]);
  };

  const goBack = () => {
    if (history.length <= 1) return;
    setDirection('back');
    setHistory(prev => prev.slice(0, -1));
  };

  return (
    <AppContext.Provider value={{
      screen, direction,
      selectedTournament, selectedAuction,
      navigate, goBack,
      selectTournament: setSelectedTournament,
      selectAuction: setSelectedAuction,
      proAuctions, proTime, phase, calcuttaTime, calcuttaTeams, winNotification,
      placeBid, placeCalcuttaBid,
      dismissWinNotification: () => setWinNotification(null),
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
