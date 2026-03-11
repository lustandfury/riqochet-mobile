import { Home, Trophy, BarChart2, User } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Screen } from '../types';

const TABS: { label: string; icon: typeof Home; screens: Screen[]; target: Screen }[] = [
  { label: 'Home', icon: Home, screens: ['home'], target: 'home' },
  {
    label: 'Tournaments',
    icon: Trophy,
    screens: ['tournaments', 'tournament-detail', 'create', 'lobby', 'bracket', 'auction-room', 'auction-portfolio'],
    target: 'tournaments',
  },
  { label: 'Markets', icon: BarChart2, screens: ['markets'], target: 'markets' },
  { label: 'Profile', icon: User, screens: ['profile'], target: 'profile' },
];

export default function BottomNav() {
  const { screen, navigate } = useApp();

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-30"
      style={{
        background: 'linear-gradient(to top, #08090E 80%, rgba(8,9,14,0.95))',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 12px)',
      }}
    >
      <div className="flex items-center justify-around pt-3">
        {TABS.map(({ label, icon: Icon, screens, target }) => {
          const active = screens.includes(screen);
          return (
            <button
              key={label}
              onClick={() => navigate(target, 'tab')}
              className="flex flex-col items-center gap-1 px-4 py-1 transition-opacity"
              style={{ opacity: active ? 1 : 0.45 }}
            >
              <div className="relative">
                <Icon
                  size={22}
                  strokeWidth={active ? 2.5 : 1.8}
                  color={active ? '#22C55E' : '#6B6B80'}
                />
                {active && (
                  <div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-neon-green"
                    style={{ width: 4, height: 4 }}
                  />
                )}
              </div>
              <span
                className="text-xs font-medium"
                style={{ color: active ? '#22C55E' : '#6B6B80', fontSize: 10 }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
