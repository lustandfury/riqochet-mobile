import { MapPin, Calendar, Users, Trophy, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../store/AppContext';
import Header from '../../components/Header';
import { AUCTION_TEAMS } from '../../data/mockData';

export default function TournamentDetail() {
  const { selectedTournament: t, navigate, selectAuction } = useApp();
  const pct = (t.registeredTeams / t.teamCount) * 100;
  const isLive = t.status === 'live';
  const isOpen = t.status === 'open';
  const isCompleted = t.status === 'completed';

  const statusColor = isLive ? '#EF4444' : isOpen ? '#22C55E' : '#71717A';
  const statusLabel = isLive ? 'Live' : isOpen ? 'Open' : isCompleted ? 'Completed' : 'Upcoming';

  return (
    <div className="flex flex-col h-full bg-app overflow-y-auto pb-10">
      <Header />

      {/* Hero */}
      <div className="px-5 pb-5">
        <div className="flex items-center gap-2 mb-2">
          {isLive && <span className="w-1.5 h-1.5 rounded-full bg-danger inline-block" />}
          <span className="text-xs font-medium" style={{ color: statusColor }}>{statusLabel}</span>
          {t.hasCalcutta && t.auctionStatus === 'live' && (
            <>
              <span className="text-gray-text text-xs">·</span>
              <span className="text-gold text-xs font-medium">Auction live</span>
            </>
          )}
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">{t.name}</h1>
        <p className="text-gray-text text-sm leading-relaxed">{t.description}</p>
      </div>

      <div className="px-5 flex flex-col gap-3">
        {/* Info grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { icon: Calendar, label: 'Date',     value: t.dateShort, sub: t.date },
            { icon: MapPin,   label: 'Location', value: t.locationShort, sub: t.location },
            { icon: Users,    label: 'Teams',    value: `${t.registeredTeams}/${t.teamCount}`, sub: t.format },
            { icon: Trophy,   label: 'Prize',    value: `$${t.prizePool.toLocaleString()}`, sub: `$${t.entryFee} entry` },
          ].map(({ icon: Icon, label, value, sub }) => (
            <div
              key={label}
              className="rounded-xl p-3.5"
              style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <Icon size={13} color="#71717A" />
                <span className="text-gray-text text-xs">{label}</span>
              </div>
              <div className="text-white font-semibold text-sm">{value}</div>
              <div className="text-gray-text text-xs mt-0.5 truncate">{sub}</div>
            </div>
          ))}
        </div>

        {/* Registration */}
        <div
          className="rounded-xl p-4"
          style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium text-sm">Registration</span>
            <span className="text-gray-text text-xs">{t.registeredTeams}/{t.teamCount} teams</span>
          </div>
          <div className="h-1.5 rounded-full mb-3" style={{ background: '#27272A' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: isLive ? '#EF4444' : '#22C55E', opacity: 0.7 }}
            />
          </div>
          <div className="flex items-center gap-1">
            {t.registeredPlayers.slice(0, 6).map((p, i) => (
              <div
                key={p.id}
                className="flex items-center justify-center w-7 h-7 rounded-full text-sm -ml-1 first:ml-0"
                style={{ background: '#1C1C24', border: '2px solid #111116', zIndex: 6 - i }}
                title={p.name}
              >
                {p.flag}
              </div>
            ))}
            {t.registeredTeams > 6 && (
              <div
                className="flex items-center justify-center w-7 h-7 rounded-full text-xs text-gray-text font-medium -ml-1"
                style={{ background: '#27272A', border: '2px solid #111116' }}
              >
                +{t.registeredTeams - 6}
              </div>
            )}
          </div>
        </div>

        {/* Calcutta section */}
        {t.hasCalcutta && (
          <div
            className="rounded-xl p-4"
            style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Trophy size={14} color="#F59E0B" />
                <span className="text-white font-medium text-sm">Calcutta Auction</span>
              </div>
              {t.auctionStatus === 'live' && (
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-danger inline-block" />
                  <span className="text-danger text-xs font-medium">Live</span>
                </div>
              )}
              {t.auctionStatus === 'upcoming' && (
                <span className="text-royal text-xs font-medium">Upcoming</span>
              )}
            </div>
            <p className="text-gray-text text-xs mb-3 leading-relaxed">
              Bid on pro-am team combinations. Winnings distributed based on tournament results.
            </p>
            {t.auctionStatus === 'live' && (
              <button
                onClick={() => { selectAuction(AUCTION_TEAMS[0]); navigate('auction-room', 'forward'); }}
                className="w-full py-2.5 rounded-lg text-sm font-medium"
                style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' }}
              >
                Enter auction room
              </button>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="flex gap-2.5 pb-4">
          {isOpen && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('lobby', 'forward')}
              className="flex-1 py-3.5 rounded-xl font-semibold text-sm text-black bg-white"
            >
              Register Team
            </motion.button>
          )}
          {isLive && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('bracket', 'forward')}
              className="flex-1 py-3.5 rounded-xl font-semibold text-sm text-black bg-white"
            >
              View Bracket
            </motion.button>
          )}
          {isCompleted && (
            <button
              onClick={() => navigate('bracket', 'forward')}
              className="flex-1 py-3.5 rounded-xl font-medium text-sm text-gray-text"
              style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              View Results
            </button>
          )}
          <button
            className="w-12 flex items-center justify-center rounded-xl"
            style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Share2 size={16} color="#71717A" />
          </button>
        </div>
      </div>
    </div>
  );
}
