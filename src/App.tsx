import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from './store/AppContext';
import BottomNav from './components/BottomNav';
import { Trophy } from 'lucide-react';
import { Screen, NavDirection } from './types';

// Auth screens
import Welcome from './screens/auth/Welcome';
import Login from './screens/auth/Login';
import OTP from './screens/auth/OTP';

// Main screens
import Home from './screens/main/Home';

// Tournament screens
import TournamentList from './screens/tournaments/TournamentList';
import TournamentDetail from './screens/tournaments/TournamentDetail';
import CreateTournament from './screens/tournaments/CreateTournament';
import TournamentLobby from './screens/tournaments/TournamentLobby';
import Bracket from './screens/tournaments/Bracket';

// Auction screens
import AuctionHub from './screens/auction/AuctionHub';
import AuctionRoom from './screens/auction/AuctionRoom';
import AuctionPortfolio from './screens/auction/AuctionPortfolio';

// Markets
import Markets from './screens/markets/Markets';

// Profile
import Profile from './screens/profile/Profile';

const BOTTOM_NAV_SCREENS: Screen[] = [
  'home',
  'tournaments',
  'tournament-detail',
  'create',
  'lobby',
  'bracket',
  'auction-room',
  'auction-portfolio',
  'markets',
  'profile',
];

function renderScreen(screen: Screen) {
  switch (screen) {
    case 'welcome': return <Welcome />;
    case 'login': return <Login />;
    case 'otp': return <OTP />;
    case 'home': return <Home />;
    case 'tournaments': return <TournamentList />;
    case 'tournament-detail': return <TournamentDetail />;
    case 'create': return <CreateTournament />;
    case 'lobby': return <TournamentLobby />;
    case 'bracket': return <Bracket />;
    case 'auction-hub': return <AuctionHub />;
    case 'auction-room': return <AuctionRoom />;
    case 'auction-portfolio': return <AuctionPortfolio />;
    case 'markets': return <Markets />;
    case 'profile': return <Profile />;
    default: return <Welcome />;
  }
}

function getVariants(direction: NavDirection) {
  if (direction === 'auth') {
    return {
      enter: { opacity: 0 },
      center: { opacity: 1 },
      exit: { opacity: 0 },
    };
  }
  if (direction === 'tab') {
    return {
      enter: { opacity: 0, scale: 0.97 },
      center: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.97 },
    };
  }
  if (direction === 'back') {
    return {
      enter: { x: '-100%', opacity: 1 },
      center: { x: 0, opacity: 1 },
      exit: { x: '30%', opacity: 0 },
    };
  }
  // forward
  return {
    enter: { x: '100%', opacity: 1 },
    center: { x: 0, opacity: 1 },
    exit: { x: '-30%', opacity: 0 },
  };
}

const CONFETTI_COLORS = ['#F59E0B', '#22C55E', '#4C6EF5', '#EC4899', '#F97316'];

function Confetti() {
  const pieces = Array.from({ length: 18 }, (_, i) => i);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {pieces.map(i => {
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
        const x = 5 + (i / 17) * 90;
        const delay = (i * 0.07) % 0.6;
        const size = 4 + (i % 3) * 2;
        return (
          <motion.div
            key={i}
            className="absolute rounded-sm"
            style={{ left: `${x}%`, top: -8, width: size, height: size, background: color, originX: 0.5 }}
            initial={{ y: 0, rotate: 0, opacity: 1 }}
            animate={{ y: 80, rotate: 360 * (i % 2 === 0 ? 1 : -1), opacity: [1, 1, 0] }}
            transition={{ duration: 1.2 + (i % 4) * 0.2, delay, ease: 'easeIn' }}
          />
        );
      })}
    </div>
  );
}

function WinToast() {
  const { winNotification, dismissWinNotification } = useApp();

  useEffect(() => {
    if (!winNotification) return;
    const id = setTimeout(dismissWinNotification, 5000);
    return () => clearTimeout(id);
  }, [winNotification]);

  if (!winNotification) return null;

  const isPro = winNotification.type === 'pro';
  const accent = isPro ? '#F59E0B' : '#22C55E';
  const bg = isPro ? 'rgba(245,158,11,0.08)' : 'rgba(34,197,94,0.08)';

  return (
    <motion.div
      className="absolute top-4 left-3 right-3 z-50 rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: `linear-gradient(135deg, #1A1B26 60%, ${bg})`,
        border: `1px solid ${isPro ? 'rgba(245,158,11,0.4)' : 'rgba(34,197,94,0.4)'}`,
        boxShadow: `0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px ${isPro ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)'}`,
      }}
      initial={{ y: -100, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -100, opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      onClick={dismissWinNotification}
    >
      <Confetti />
      <div className="relative flex items-center gap-3.5 px-4 py-3.5">
        {/* Icon with pulse ring */}
        <div className="relative flex-shrink-0">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: accent, opacity: 0.2 }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
          />
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full"
            style={{ background: isPro ? 'rgba(245,158,11,0.18)' : 'rgba(34,197,94,0.18)', border: `1.5px solid ${accent}` }}>
            <Trophy size={18} color={accent} />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: accent }}>
            🎉 {isPro ? 'You won the Pro Auction!' : 'You own the team!'}
          </p>
          <p className="text-white font-bold text-sm leading-tight truncate">{winNotification.label}</p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {isPro ? 'Calcutta Auction is now open' : 'Collect your share if they win'}
          </p>
        </div>
      </div>

      {/* Draining progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 5, ease: 'linear' }}
      />
    </motion.div>
  );
}

function AppContent() {
  const { screen, direction } = useApp();
  const showNav = BOTTOM_NAV_SCREENS.includes(screen);
  const variants = getVariants(direction);

  return (
    <div className="relative w-full h-full overflow-hidden bg-app">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={screen}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            type: direction === 'forward' || direction === 'back'
              ? 'spring'
              : 'tween',
            stiffness: 320,
            damping: 32,
            mass: 0.9,
            duration: direction === 'auth' || direction === 'tab' ? 0.25 : undefined,
          }}
          className="absolute inset-0 overflow-hidden"
        >
          {renderScreen(screen)}
        </motion.div>
      </AnimatePresence>

      {showNav && <BottomNav />}

      <AnimatePresence>
        <WinToast key="win-toast" />
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="relative w-full bg-app overflow-hidden" style={{ flex: 1 }}>
        <AppContent />
      </div>
    </AppProvider>
  );
}
