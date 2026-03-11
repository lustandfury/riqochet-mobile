import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from './store/AppContext';
import BottomNav from './components/BottomNav';
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
  'lobby',
  'bracket',
  'auction-hub',
  'auction-portfolio',
  'markets',
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
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="flex justify-center bg-app" style={{ height: '100svh' }}>
        <div
          className="relative w-full bg-app overflow-hidden"
          style={{ maxWidth: 480, height: '100%' }}
        >
          <AppContent />
        </div>
      </div>
    </AppProvider>
  );
}
