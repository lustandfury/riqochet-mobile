import { createContext, useContext, useState, ReactNode } from 'react';
import { Screen, NavDirection, Tournament, AuctionTeam } from '../types';
import { TOURNAMENTS, AUCTION_TEAMS } from '../data/mockData';

interface AppContextValue {
  screen: Screen;
  direction: NavDirection;
  selectedTournament: Tournament;
  selectedAuction: AuctionTeam;
  navigate: (screen: Screen, direction?: NavDirection) => void;
  goBack: () => void;
  selectTournament: (t: Tournament) => void;
  selectAuction: (a: AuctionTeam) => void;
}

const AppContext = createContext<AppContextValue>(null!);

export function AppProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<Screen[]>(['welcome']);
  const [direction, setDirection] = useState<NavDirection>('auth');
  const [selectedTournament, setSelectedTournament] = useState<Tournament>(TOURNAMENTS[0]);
  const [selectedAuction, setSelectedAuction] = useState<AuctionTeam>(AUCTION_TEAMS[0]);

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

  const selectTournament = (t: Tournament) => setSelectedTournament(t);
  const selectAuction = (a: AuctionTeam) => setSelectedAuction(a);

  return (
    <AppContext.Provider
      value={{
        screen,
        direction,
        selectedTournament,
        selectedAuction,
        navigate,
        goBack,
        selectTournament,
        selectAuction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
