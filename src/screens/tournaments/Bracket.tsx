import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../store/AppContext';
import Header from '../../components/Header';
import { BRACKETS, BRACKET } from '../../data/mockData';
import { BracketMatch } from '../../types';

function computeGroupStandings(matches: BracketMatch[], group: 'A' | 'B') {
  const groupMatches = matches.filter(m => m.group === group);
  const teams = new Map<string, { name: string; w: number; l: number; pts: number; seed?: number; isMe?: boolean }>();
  for (const m of groupMatches) {
    const t1 = m.slot1.name ?? 'TBD';
    const t2 = m.slot2.name ?? 'TBD';
    if (!teams.has(t1)) teams.set(t1, { name: t1, w: 0, l: 0, pts: 0, seed: m.slot1.seed, isMe: m.slot1.isMe });
    if (!teams.has(t2)) teams.set(t2, { name: t2, w: 0, l: 0, pts: 0, seed: m.slot2.seed, isMe: m.slot2.isMe });
    if (m.status === 'completed') {
      if (m.slot1.isWinner) { teams.get(t1)!.w++; teams.get(t1)!.pts += 2; teams.get(t2)!.l++; }
      else if (m.slot2.isWinner) { teams.get(t2)!.w++; teams.get(t2)!.pts += 2; teams.get(t1)!.l++; }
    }
  }
  return [...teams.values()].sort((a, b) => b.pts - a.pts || b.w - a.w);
}

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
              color: match.slot1.isWinner ? '#22C55E' : '#FFFFFF',
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
              color: match.slot2.isWinner ? '#22C55E' : '#FFFFFF',
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

export default function Bracket() {
  const { selectedTournament } = useApp();
  const [tab, setTab] = useState<'groups' | 'knockout'>('groups');

  const bracket = BRACKETS[selectedTournament.id] ?? BRACKET;
  const isCompleted = selectedTournament.status === 'completed';
  const isLive = selectedTournament.status === 'live';

  const rrMatches = bracket.filter(m => m.round === 'RR');
  const sfMatches = bracket.filter(m => m.round === 'SF');
  const finalMatch = bracket.filter(m => m.round === 'F');
  const winner = finalMatch[0]?.slot1.isWinner ? finalMatch[0].slot1.name : finalMatch[0]?.slot2.isWinner ? finalMatch[0].slot2.name : null;

  return (
    <div className="flex flex-col h-full bg-app pt-14">
      <Header title={isCompleted ? 'Results' : 'Live Bracket'} />

      {/* Tournament info bar */}
      <div className="px-5 mb-3">
        <div className="flex items-center justify-between p-3 rounded-2xl" style={{ background: '#111118' }}>
          <div>
            <div className="text-white font-bold text-sm">{selectedTournament.name}</div>
            <div className="text-gray-text text-xs">{selectedTournament.locationShort}</div>
          </div>
          {isLive && (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-danger animate-pulse" />
              <span className="text-danger text-xs font-bold">LIVE · Groups</span>
            </div>
          )}
          {isCompleted && winner && (
            <div className="flex items-center gap-1.5">
              <span className="text-gold text-xs">🏆</span>
              <span className="text-gold text-xs font-bold">{winner}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-5 gap-2 mb-3">
        {(['groups', 'knockout'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-xl text-xs font-semibold"
            style={tab === t
              ? { background: isLive ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.08)', color: isLive ? '#EF4444' : '#FFFFFF', border: `1px solid ${isLive ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.15)'}` }
              : { background: 'transparent', color: '#6B6B80', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {t === 'groups' ? 'Group Stage' : 'Knockout'}
          </button>
        ))}
      </div>

      {tab === 'groups' ? (
        /* Group stage — standings + matches */
        <div className="flex-1 overflow-y-auto px-5 pb-28">
          {(['A', 'B'] as const).map(group => {
            const groupMatches = rrMatches.filter(m => m.group === group);
            const standings = computeGroupStandings(rrMatches, group);
            const played = groupMatches.filter(m => m.status === 'completed').length;
            return (
              <div key={group} className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white">Group {group}</span>
                  <span className="text-gray-text text-xs">{played}/{groupMatches.length} played</span>
                </div>

                {/* Standings table */}
                <div className="rounded-xl overflow-hidden mb-3" style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center px-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="text-gray-text text-xs w-5">#</span>
                    <span className="flex-1 text-gray-text text-xs">Team</span>
                    <span className="text-gray-text text-xs w-6 text-center">W</span>
                    <span className="text-gray-text text-xs w-6 text-center">L</span>
                    <span className="text-gray-text text-xs w-8 text-center">Pts</span>
                  </div>
                  {standings.map((team, i) => (
                    <div
                      key={team.name}
                      className="flex items-center px-3 py-2.5"
                      style={{
                        borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : undefined,
                        background: i === 1 ? 'transparent' : i < 2 ? 'rgba(34,197,94,0.03)' : 'transparent',
                      }}
                    >
                      <span className="text-gray-text text-xs w-5">{i + 1}</span>
                      <div className="flex-1 flex items-center gap-1.5 min-w-0">
                        {team.seed !== undefined && <span className="text-gray-text text-xs flex-shrink-0">#{team.seed}</span>}
                        <span className="text-xs font-semibold truncate" style={{ color: i < 2 ? '#FFFFFF' : '#6B6B80' }}>
                          {team.name}
                        </span>
                        {team.isMe && <span className="text-xs font-bold" style={{ color: '#00E676' }}>(me)</span>}
                        {i < 2 && <span className="text-xs flex-shrink-0" style={{ color: '#22C55E' }}>↑ Q</span>}
                      </div>
                      <span className="text-white text-xs w-6 text-center font-medium">{team.w}</span>
                      <span className="text-gray-text text-xs w-6 text-center">{team.l}</span>
                      <span className="text-xs font-bold w-8 text-center" style={{ color: i < 2 ? '#22C55E' : '#6B6B80' }}>{team.pts}</span>
                    </div>
                  ))}
                </div>

                {/* Match results */}
                <div className="flex flex-col gap-2">
                  {groupMatches.map(m => <MatchCard key={m.id} match={m} />)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Knockout bracket — SF + Final */
        <div className="flex-1 overflow-auto">
          {/* Round labels */}
          <div className="flex items-end px-4 mb-2 gap-2">
            <div style={{ minWidth: 130 }}>
              <RoundLabel label="Semi Finals" count="2 matches" />
            </div>
            <div style={{ minWidth: 20 }} />
            <div style={{ minWidth: 130 }}>
              <RoundLabel label="Final" count="1 match" />
            </div>
          </div>

          <div className="flex items-center gap-0 px-4 pb-28" style={{ minHeight: 300 }}>
            {/* SF column */}
            <div className="flex flex-col justify-around gap-3" style={{ minWidth: 130 }}>
              {sfMatches.map(m => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>

            {/* SF→F connectors */}
            <div className="flex flex-col justify-center" style={{ minWidth: 20, alignSelf: 'stretch' }}>
              <div style={{ flex: 1, borderRight: '1px solid rgba(255,255,255,0.08)', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', margin: '60px 0' }} />
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
      )}

      {/* Legend */}
      <div
        className="px-5 py-3 pb-20 flex items-center gap-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        {[
          { color: '#22C55E', label: 'Winner / Qualified' },
          ...(!isCompleted ? [{ color: '#EF4444', label: 'Live' }, { color: '#6B6B80', label: 'Upcoming' }] : []),
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
