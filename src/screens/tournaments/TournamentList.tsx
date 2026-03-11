import { useState } from 'react';
import { Search, Plus, MapPin, Trophy, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../store/AppContext';
import { TOURNAMENTS } from '../../data/mockData';
import { Tournament } from '../../types';

type Filter = 'All' | 'Open' | 'Live' | 'Completed';

const STATUS: Record<string, { label: string; color: string }> = {
  open:      { label: 'Open',      color: '#22C55E' },
  live:      { label: 'Live',      color: '#EF4444' },
  upcoming:  { label: 'Upcoming',  color: '#818CF8' },
  completed: { label: 'Completed', color: '#71717A' },
};

function TournamentCard({ t, onPress }: { t: Tournament; onPress: () => void }) {
  const st = STATUS[t.status];
  const pct = (t.registeredTeams / t.teamCount) * 100;

  return (
    <motion.div
      whileTap={{ scale: 0.985 }}
      onClick={onPress}
      className="rounded-2xl mb-2.5 cursor-pointer"
      style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-1.5">
            {t.status === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-danger inline-block" />}
            <span className="text-xs font-medium" style={{ color: st.color }}>{st.label}</span>
          </div>
          <span className="text-white font-bold">${t.prizePool.toLocaleString()}</span>
        </div>

        <h3 className="text-white font-semibold text-sm mb-1">{t.name}</h3>

        <div className="flex items-center gap-1 text-gray-text text-xs mb-3">
          <MapPin size={10} />
          <span>{t.locationShort}</span>
          <span className="mx-1">·</span>
          <span>{t.dateShort}</span>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-gray-text text-xs flex items-center gap-1">
              <Users size={10} /> {t.registeredTeams}/{t.teamCount} teams
            </span>
            <span className="text-gray-text text-xs">${t.entryFee} entry</span>
          </div>
          <div className="h-1 rounded-full" style={{ background: '#27272A' }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${pct}%`, background: t.status === 'live' ? '#EF4444' : '#22C55E', opacity: 0.7 }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-gray-text text-xs">{t.format}</span>
          {t.hasCalcutta && (
            <span className="text-gold text-xs flex items-center gap-1">
              <Trophy size={10} /> Calcutta
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function TournamentList() {
  const { navigate, selectTournament } = useApp();
  const [filter, setFilter] = useState<Filter>('All');
  const [query, setQuery] = useState('');

  const filtered = TOURNAMENTS.filter(t => {
    if (filter === 'Open') return t.status === 'open';
    if (filter === 'Live') return t.status === 'live';
    if (filter === 'Completed') return t.status === 'completed';
    return true;
  }).filter(t => t.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex flex-col h-full bg-app pt-14">
      <div className="px-5 pt-4 pb-3">
        <h1 className="text-xl font-bold text-white mb-4">Tournaments</h1>

        <div
          className="flex items-center gap-2.5 rounded-xl px-4 py-3 mb-3"
          style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <Search size={14} color="#71717A" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tournaments..."
            className="flex-1 bg-transparent text-white placeholder-gray-text text-sm outline-none"
          />
        </div>

        <div className="flex gap-1.5">
          {(['All', 'Open', 'Live', 'Completed'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={
                filter === f
                  ? { background: 'rgba(255,255,255,0.1)', color: '#F4F4F5', border: '1px solid rgba(255,255,255,0.15)' }
                  : { background: 'rgba(255,255,255,0.04)', color: '#71717A', border: '1px solid rgba(255,255,255,0.06)' }
              }
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28">
        {filtered.map(t => (
          <TournamentCard
            key={t.id}
            t={t}
            onPress={() => { selectTournament(t); navigate('tournament-detail', 'forward'); }}
          />
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={() => navigate('create', 'forward')}
        className="absolute bottom-24 right-5 flex items-center gap-2 px-4 py-3 rounded-full text-sm font-semibold text-black bg-white z-20"
        style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
      >
        <Plus size={16} />
        Create
      </motion.button>
    </div>
  );
}
