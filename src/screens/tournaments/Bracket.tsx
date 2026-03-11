import { motion } from 'framer-motion';
import { useApp } from '../../store/AppContext';
import Header from '../../components/Header';
import { BRACKET } from '../../data/mockData';
import { BracketMatch } from '../../types';

function MatchCard({ match }: { match: BracketMatch }) {
  const isLive = match.status === 'live';
  const isUpcoming = match.status === 'upcoming';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl overflow-hidden"
      style={{
        background: isLive ? 'linear-gradient(135deg, #1A0E00 0%, #111118 100%)' : '#111118',
        border: isLive
          ? '1.5px solid rgba(255,71,87,0.4)'
          : '1px solid rgba(255,255,255,0.06)',
        minWidth: 130,
        boxShadow: isLive ? '0 0 20px rgba(239,68,68,0.05)' : 'none',
      }}
    >
      {isLive && (
        <div
          className="text-center py-0.5 text-xs font-bold"
          style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444' }}
        >
          LIVE
        </div>
      )}

      {/* Slot 1 */}
      <div
        className="flex items-center justify-between px-2.5 py-2 gap-1"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: match.slot1.isWinner ? 'rgba(34,197,94,0.05)' : 'transparent',
        }}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {match.slot1.seed && (
            <span className="text-gray-text text-xs flex-shrink-0">#{match.slot1.seed}</span>
          )}
          <span
            className="text-xs font-semibold truncate"
            style={{
              color: match.slot1.isWinner ? '#22C55E' : isUpcoming ? '#9090A0' : '#F0F0F5',
            }}
          >
            {match.slot1.name ?? 'TBD'}
          </span>
          {match.slot1.isMe && <span className="text-neon-green text-xs">(me)</span>}
        </div>
        {match.score && match.status !== 'upcoming' && (
          <span
            className="text-xs font-black flex-shrink-0"
            style={{ color: match.slot1.isWinner ? '#22C55E' : '#6B6B80' }}
          >
            {isLive ? match.score.split(',')[0] ?? match.score : match.score.split(',')[0]}
          </span>
        )}
      </div>

      {/* Slot 2 */}
      <div
        className="flex items-center justify-between px-2.5 py-2 gap-1"
        style={{ background: match.slot2.isWinner ? 'rgba(34,197,94,0.05)' : 'transparent' }}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {match.slot2.seed && (
            <span className="text-gray-text text-xs flex-shrink-0">#{match.slot2.seed}</span>
          )}
          <span
            className="text-xs font-semibold truncate"
            style={{
              color: match.slot2.isWinner ? '#22C55E' : isUpcoming ? '#9090A0' : '#F0F0F5',
            }}
          >
            {match.slot2.name ?? 'TBD'}
          </span>
          {match.slot2.isMe && <span className="text-neon-green text-xs">(me)</span>}
        </div>
        {match.score && match.status === 'completed' && (
          <span className="text-gray-text text-xs font-black flex-shrink-0">
            {match.score.split(',')[1]?.trim() ?? ''}
          </span>
        )}
        {isLive && (
          <span className="text-danger text-xs font-black flex-shrink-0">
            {match.score?.split('-').reverse().join('-')}
          </span>
        )}
      </div>
    </motion.div>
  );
}

function RoundLabel({ label, count }: { label: string; count: string }) {
  return (
    <div className="mb-2 text-center">
      <div className="text-white text-xs font-bold">{label}</div>
      <div className="text-gray-text text-xs">{count}</div>
    </div>
  );
}

function ConnectorLines({ count }: { count: number }) {
  return (
    <div className="flex flex-col justify-around" style={{ minWidth: 20 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex-1 relative flex items-center"
          style={{ minHeight: i % 2 === 0 ? 72 : 0 }}
        >
          {i % 2 === 0 && (
            <div
              className="absolute right-0"
              style={{
                top: '50%',
                right: 0,
                width: '100%',
                height: '60%',
                borderRight: '1px solid rgba(255,255,255,0.1)',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Bracket() {
  const { selectedTournament } = useApp();

  const qfMatches = BRACKET.filter(m => m.round === 'QF');
  const sfMatches = BRACKET.filter(m => m.round === 'SF');
  const finalMatch = BRACKET.filter(m => m.round === 'F');

  return (
    <div className="flex flex-col h-full bg-app pt-14">
      <Header title="Live Bracket" />

      {/* Tournament info bar */}
      <div className="px-5 mb-4">
        <div className="flex items-center justify-between p-3 rounded-2xl" style={{ background: '#111118' }}>
          <div>
            <div className="text-white font-bold text-sm">{selectedTournament.name}</div>
            <div className="text-gray-text text-xs">{selectedTournament.locationShort}</div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-danger animate-pulse" />
            <span className="text-danger text-xs font-bold">LIVE · QF</span>
          </div>
        </div>
      </div>

      {/* Round labels */}
      <div className="flex items-end px-4 mb-2 gap-2">
        <div style={{ minWidth: 130 }}>
          <RoundLabel label="Quarter Finals" count="4 matches" />
        </div>
        <div style={{ minWidth: 20 }} />
        <div style={{ minWidth: 130 }}>
          <RoundLabel label="Semi Finals" count="2 matches" />
        </div>
        <div style={{ minWidth: 20 }} />
        <div style={{ minWidth: 130 }}>
          <RoundLabel label="Final" count="1 match" />
        </div>
      </div>

      {/* Bracket */}
      <div className="flex-1 overflow-auto">
        <div className="flex items-center gap-0 px-4 pb-10" style={{ minHeight: 400 }}>
          {/* QF column */}
          <div className="flex flex-col justify-around gap-3" style={{ minWidth: 130 }}>
            {qfMatches.map(m => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>

          {/* QF→SF connectors */}
          <div className="flex flex-col justify-around" style={{ minWidth: 20, alignSelf: 'stretch' }}>
            <div style={{ flex: 1, borderRight: '1px solid rgba(255,255,255,0.08)', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', margin: '36px 0' }} />
            <div style={{ flex: 1, borderRight: '1px solid rgba(255,255,255,0.08)', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', margin: '36px 0' }} />
          </div>

          {/* SF column */}
          <div className="flex flex-col justify-around gap-3" style={{ minWidth: 130 }}>
            {sfMatches.map(m => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>

          {/* SF→F connectors */}
          <div className="flex flex-col justify-center" style={{ minWidth: 20, alignSelf: 'stretch' }}>
            <div style={{ flex: 1, borderRight: '1px solid rgba(255,255,255,0.08)', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', margin: '80px 0' }} />
          </div>

          {/* Final column */}
          <div className="flex flex-col justify-center" style={{ minWidth: 130 }}>
            {finalMatch.map(m => (
              <div key={m.id}>
                <div className="text-center mb-2">
                  <span className="text-gold text-xs font-bold uppercase tracking-wider">🏆 Final</span>
                </div>
                <MatchCard match={m} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div
        className="px-5 py-3 flex items-center gap-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        {[
          { color: '#22C55E', label: 'Winner' },
          { color: '#EF4444', label: 'Live match' },
          { color: '#6B6B80', label: 'Upcoming' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
            <span className="text-xs text-gray-text">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
