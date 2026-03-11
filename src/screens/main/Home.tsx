import { Bell, ChevronRight, MapPin, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../store/AppContext';
import { TOURNAMENTS, ME } from '../../data/mockData';

export default function Home() {
  const { navigate, selectTournament } = useApp();
  const openTournament = TOURNAMENTS[0];

  return (
    <div className="flex flex-col h-full bg-app overflow-y-auto pb-28 pt-14">
      {/* App bar */}
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Riqochet</h1>
          <p className="text-gray-text text-xs mt-0.5">Good morning, {ME.name.split(' ')[0]}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="relative flex items-center justify-center w-9 h-9 rounded-full"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <Bell size={16} color="#71717A" />
            <span
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-danger"
              style={{ border: '1.5px solid #09090E' }}
            />
          </button>
          <button
            onClick={() => navigate('profile', 'forward')}
            className="flex items-center justify-center w-9 h-9 rounded-full text-lg"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            {ME.flag}
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="flex gap-2 px-5 mb-6">
        {[
          { label: 'Ranking', value: `#${ME.ranking}` },
          { label: 'Win Rate', value: `${Math.round((ME.wins / (ME.wins + ME.losses)) * 100)}%` },
          { label: 'Rating', value: `${ME.rating}★` },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex-1 rounded-xl p-3 text-center"
            style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="font-bold text-sm text-white">{value}</div>
            <div className="text-xs text-gray-text mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Your tournaments */}
      <div className="px-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-text uppercase tracking-wider">Your Tournaments</span>
          <button
            onClick={() => navigate('tournaments', 'forward')}
            className="text-white/50 text-xs flex items-center gap-0.5 hover:text-white transition-colors"
          >
            See all <ChevronRight size={11} />
          </button>
        </div>
        <motion.div
          whileTap={{ scale: 0.985 }}
          onClick={() => { selectTournament(openTournament); navigate('tournament-detail', 'forward'); }}
          className="rounded-2xl p-4 cursor-pointer"
          style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-green inline-block" />
              <span className="text-neon-green text-xs font-medium">Open</span>
            </div>
            <span className="text-gray-text text-xs">{openTournament.dateShort}</span>
          </div>
          <h4 className="text-white font-semibold text-sm mb-1">{openTournament.name}</h4>
          <div className="flex items-center gap-1 text-gray-text text-xs mb-3">
            <MapPin size={10} />
            <span>{openTournament.locationShort}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-text text-xs">{openTournament.registeredTeams}/{openTournament.teamCount} teams</span>
            <span className="text-gray-text text-xs">${openTournament.entryFee} entry</span>
            {openTournament.hasCalcutta && (
              <span className="text-gold text-xs flex items-center gap-1">
                <Trophy size={10} /> Calcutta
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
