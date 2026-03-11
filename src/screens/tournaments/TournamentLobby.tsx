import { Copy, Share2, Users, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useApp } from '../../store/AppContext';
import Header from '../../components/Header';
import { TOURNAMENTS } from '../../data/mockData';

const SHARE_LINK = 'riqochet.app/join/miami-open-2025';

const REGISTERED = [
  { id: '1', name: 'Carlos Ruiz', flag: '🇪🇸', partner: 'Diego Santos', partnerFlag: '🇧🇷', status: 'confirmed' },
  { id: '2', name: 'Sofia Vargas', flag: '🇦🇷', partner: 'Rafael Costa', partnerFlag: '🇵🇹', status: 'confirmed' },
  { id: '3', name: 'Marco Bellini', flag: '🇮🇹', partner: 'Emma Thompson', partnerFlag: '🇬🇧', status: 'confirmed' },
  { id: '4', name: 'Isabella Chen', flag: '🇺🇸', partner: 'Lucia Martínez', partnerFlag: '🇲🇽', status: 'confirmed' },
  { id: '5', name: 'María González', flag: '🇨🇴', partner: 'James Wilson', partnerFlag: '🇺🇸', status: 'confirmed' },
  { id: '6', name: 'You', flag: '🇺🇸', partner: 'Partner TBD', partnerFlag: '❓', status: 'pending' },
];

export default function TournamentLobby() {
  const { navigate } = useApp();
  const t = TOURNAMENTS[0];
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-app pt-14 overflow-y-auto pb-28">
      <Header title="Tournament Lobby" />

      <div className="px-5">
        {/* Tournament name */}
        <div className="mb-5">
          <h2 className="text-xl font-black text-white">{t.name}</h2>
          <p className="text-gray-text text-sm mt-1">{t.dateShort} · {t.locationShort}</p>
        </div>

        {/* Status card */}
        <div
          className="rounded-2xl p-4 mb-5"
          style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.08)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl"
              style={{ background: 'rgba(34,197,94,0.08)' }}
            >
              <Users size={18} color="#22C55E" />
            </div>
            <div className="flex-1">
              <div className="text-white font-bold text-sm">Awaiting Players</div>
              <div className="text-gray-text text-xs">
                {REGISTERED.length}/{t.teamCount} teams registered · {t.teamCount - REGISTERED.length} spots left
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(REGISTERED.length / t.teamCount) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full bg-neon-green"
              />
            </div>
          </div>
        </div>

        {/* Share link */}
        <div className="mb-5">
          <span className="text-xs font-semibold text-gray-text uppercase tracking-wider block mb-2">
            Share Invite Link
          </span>
          <div
            className="flex items-center gap-3 rounded-2xl p-4"
            style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {/* QR placeholder */}
            <div
              className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ background: '#22223A' }}
            >
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-sm"
                    style={{ background: Math.random() > 0.4 ? '#22C55E' : 'transparent', opacity: 0.8 }}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-neon-green text-xs font-mono truncate">{SHARE_LINK}</p>
              <p className="text-gray-text text-xs mt-0.5">Tap to copy · Expires in 7 days</p>
            </div>
            <button
              onClick={handleCopy}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={copied ? { background: 'rgba(34,197,94,0.08)', color: '#22C55E' } : { background: '#22223A', color: '#6B6B80' }}
            >
              <Copy size={12} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Teams list */}
        <div className="mb-5">
          <span className="text-xs font-semibold text-gray-text uppercase tracking-wider block mb-3">
            Registered Teams ({REGISTERED.length})
          </span>
          <div className="flex flex-col gap-2">
            {REGISTERED.map((team, i) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-2xl"
                style={{
                  background: team.name === 'You' ? 'rgba(34,197,94,0.05)' : '#111118',
                  border: team.name === 'You' ? '1px solid rgba(34,197,94,0.08)' : '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <span className="text-2xl">{team.flag}</span>
                <div className="flex-1">
                  <div className="text-white text-sm font-semibold">
                    {team.name} {team.name === 'You' && <span className="text-neon-green text-xs">(You)</span>}
                  </div>
                  <div className="text-gray-text text-xs flex items-center gap-1">
                    <span>{team.partnerFlag}</span> {team.partner}
                  </div>
                </div>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={
                    team.status === 'confirmed'
                      ? { background: 'rgba(34,197,94,0.07)', color: '#22C55E' }
                      : { background: 'rgba(245,158,11,0.07)', color: '#F59E0B' }
                  }
                >
                  {team.status}
                </span>
              </motion.div>
            ))}

            {/* TBD slots */}
            {Array.from({ length: t.teamCount - REGISTERED.length }).map((_, i) => (
              <div
                key={`tbd-${i}`}
                className="flex items-center gap-3 p-3 rounded-2xl"
                style={{ background: '#0D0D14', border: '1px dashed rgba(255,255,255,0.07)' }}
              >
                <div className="w-8 h-8 rounded-full bg-gray-dim flex items-center justify-center">
                  <span className="text-gray-text text-xs">?</span>
                </div>
                <span className="text-gray-text text-sm">Open slot</span>
              </div>
            ))}
          </div>
        </div>

        {/* Start Tournament */}
        <div
          className="rounded-2xl p-4 mb-4"
          style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Clock size={14} color="#6B6B80" />
            <span className="text-gray-text text-xs">Tournament starts when all teams are confirmed</span>
          </div>
          <button
            onClick={() => navigate('bracket', 'forward')}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-black flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #22C55E 0%, #1A9E50 100%)' }}
          >
            Start Tournament <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
