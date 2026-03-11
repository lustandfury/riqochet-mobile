import { useState } from 'react';
import { MapPin, Calendar, Users, Trophy, Share2, Gavel, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../store/AppContext';
import Header from '../../components/Header';
import { BRACKETS, BRACKET } from '../../data/mockData';
import { AuctionTeam, BracketMatch, CalcuttaTeam } from '../../types';

const INCREMENTS = [100, 250, 500];

const ROUNDS: Array<'RR' | 'SF' | 'F'> = ['RR', 'SF', 'F'];
const ROUND_LABELS: Record<string, string> = { RR: 'Groups', SF: 'Semi Finals', F: 'Final' };
const ROUND_ACTIVE_LABEL: Record<string, string> = { RR: 'Groups in progress', SF: 'SF in progress', F: 'Final in progress' };

// Mock prediction market odds (0–100 = probability %)
const MATCH_ODDS: Record<string, { team1: number; team2: number; volume: number }> = {
  // South Beach Pro-Am (live) — RR group stage
  'rr-a3': { team1: 65, team2: 35, volume: 4800 },
  'rr-a6': { team1: 55, team2: 45, volume: 1200 },
  'rr-b3': { team1: 60, team2: 40, volume: 2100 },
  'rr-b6': { team1: 52, team2: 48, volume: 980 },
  sf1: { team1: 62, team2: 38, volume: 1100 },
  sf2: { team1: 50, team2: 50, volume: 720 },
  f1:  { team1: 50, team2: 50, volume: 480 },
  // Miami Open (predict mode — post-auction)
  'mo-rr-a1': { team1: 72, team2: 28, volume: 0 },
  'mo-rr-a2': { team1: 68, team2: 32, volume: 0 },
  'mo-rr-a3': { team1: 65, team2: 35, volume: 0 },
  'mo-rr-a4': { team1: 58, team2: 42, volume: 0 },
  'mo-rr-a5': { team1: 70, team2: 30, volume: 0 },
  'mo-rr-a6': { team1: 55, team2: 45, volume: 0 },
  'mo-rr-b1': { team1: 64, team2: 36, volume: 0 },
  'mo-rr-b2': { team1: 69, team2: 31, volume: 0 },
  'mo-rr-b3': { team1: 66, team2: 34, volume: 0 },
  'mo-rr-b4': { team1: 61, team2: 39, volume: 0 },
  'mo-rr-b5': { team1: 63, team2: 37, volume: 0 },
  'mo-rr-b6': { team1: 54, team2: 46, volume: 0 },
};

const PRED_AMOUNTS = [10, 20, 50, 100];

interface UserPrediction { team: 1 | 2; amount: number; }

function shortName(name: string | null): string {
  if (!name) return 'TBD';
  return name.split('/')[0].trim().split(' ').pop() ?? name;
}

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

function BracketMatchCard({ match, prediction, onPredict }: {
  match: BracketMatch;
  prediction?: UserPrediction;
  onPredict?: (side: 1 | 2) => void;
}) {
  const isLive = match.status === 'live';
  const isUpcoming = match.status === 'upcoming';
  const isCompleted = match.status === 'completed';
  const scoreParts = (match.score ?? '').split(',').map(s => s.trim());
  const [g1s1, g1s2] = (scoreParts[0] ?? '').split('-');
  const odds = MATCH_ODDS[match.id];
  const bothTeamsKnown = !!match.slot1.name && match.slot1.name !== 'TBD' && !!match.slot2.name && match.slot2.name !== 'TBD';

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: isLive ? 'rgba(239,68,68,0.04)' : '#111116',
        border: isLive ? '1px solid rgba(239,68,68,0.22)' : '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {isLive && (
        <div className="text-center py-1 text-xs font-bold tracking-wider" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
          LIVE
        </div>
      )}

      <div className="p-3">
        {/* Slot 1 */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            {match.slot1.seed !== undefined && <span className="text-xs flex-shrink-0" style={{ color: '#6B6B80' }}>#{match.slot1.seed}</span>}
            <span className="text-sm font-semibold truncate" style={{ color: match.slot1.isWinner ? '#22C55E' : '#FFFFFF' }}>
              {match.slot1.name ?? 'TBD'}
            </span>
            {match.slot1.isMe && <span className="text-xs font-bold flex-shrink-0" style={{ color: '#00E676' }}>me</span>}
          </div>
          {isLive && g1s1 && <span className="text-sm font-black flex-shrink-0" style={{ color: '#EF4444' }}>{g1s1}</span>}
          {isCompleted && <span className="text-xs font-bold flex-shrink-0" style={{ color: match.slot1.isWinner ? '#22C55E' : '#6B6B80' }}>{match.score}</span>}
        </div>

        {/* Slot 2 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 min-w-0">
            {match.slot2.seed !== undefined && <span className="text-xs flex-shrink-0" style={{ color: '#6B6B80' }}>#{match.slot2.seed}</span>}
            <span className="text-sm font-semibold truncate" style={{ color: match.slot2.isWinner ? '#22C55E' : '#FFFFFF' }}>
              {match.slot2.name ?? 'TBD'}
            </span>
            {match.slot2.isMe && <span className="text-xs font-bold flex-shrink-0" style={{ color: '#00E676' }}>me</span>}
          </div>
          {isLive && g1s2 && <span className="text-sm font-black flex-shrink-0" style={{ color: '#6B6B80' }}>{g1s2}</span>}
        </div>

        {/* Probability bar + trade buttons */}
        {odds && !isCompleted && bothTeamsKnown && (
          <>
            <div className="mb-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold" style={{ color: '#22C55E' }}>{odds.team1}%</span>
                <span className="text-xs" style={{ color: '#6B6B80' }}>chance</span>
                <span className="text-xs font-medium" style={{ color: '#6B6B80' }}>{odds.team2}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#27272A' }}>
                <div className="h-full rounded-full bg-neon-green" style={{ width: `${odds.team1}%`, opacity: 0.7 }} />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onPredict?.(1)}
                className="flex-1 py-2 rounded-lg text-xs font-medium truncate"
                style={prediction?.team === 1
                  ? { background: 'rgba(34,197,94,0.15)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.3)' }
                  : { background: 'rgba(34,197,94,0.08)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.15)' }}
              >
                {shortName(match.slot1.name)} · {odds.team1}¢
              </button>
              <button
                onClick={() => onPredict?.(2)}
                className="flex-1 py-2 rounded-lg text-xs font-medium truncate"
                style={prediction?.team === 2
                  ? { background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }
                  : { background: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.15)' }}
              >
                {shortName(match.slot2.name)} · {odds.team2}¢
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Prediction market sheet (matches TradeModal style from Markets) ──────────

function PredictionSheet({ match, initialSide, existing, onPlace, onClose }: {
  match: BracketMatch;
  initialSide: 1 | 2;
  existing?: UserPrediction;
  onPlace: (team: 1 | 2, amount: number) => void;
  onClose: () => void;
}) {
  const odds = MATCH_ODDS[match.id]!;
  const [team, setTeam] = useState<1 | 2>(existing?.team ?? initialSide);
  const [amount, setAmount] = useState(existing?.amount ?? 20);
  const [placed, setPlaced] = useState(false);

  const price = team === 1 ? odds.team1 : odds.team2;
  const shares = +(amount / price * 100).toFixed(1);
  const payout = +shares.toFixed(2);
  const profit = +(payout - amount).toFixed(2);

  const teamName = (t: 1 | 2) => (t === 1 ? match.slot1.name : match.slot2.name) ?? 'TBD';

  return (
    <Sheet onClose={onClose}>
      {!placed ? (
        <div className="px-5 pb-10 pt-2">
          <div className="mb-5">
            <p className="text-gray-text text-xs mb-1.5 uppercase tracking-wider">Trade</p>
            <h3 className="text-white font-semibold text-sm leading-snug">
              {match.slot1.name ?? 'TBD'} vs {match.slot2.name ?? 'TBD'}
            </h3>
          </div>

          {/* Team toggle — green for T1 (YES), red for T2 (NO) */}
          <div className="flex gap-2 mb-5">
            {([1, 2] as const).map(t => {
              const sel = team === t;
              const o = t === 1 ? odds.team1 : odds.team2;
              return (
                <button
                  key={t}
                  onClick={() => setTeam(t)}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all"
                  style={sel && t === 1
                    ? { background: 'rgba(34,197,94,0.12)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.25)' }
                    : sel && t === 2
                    ? { background: 'rgba(239,68,68,0.12)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.25)' }
                    : { background: 'rgba(255,255,255,0.04)', color: '#71717A', border: '1px solid rgba(255,255,255,0.07)' }
                  }
                >
                  {shortName(teamName(t))} · {o}¢
                </button>
              );
            })}
          </div>

          {/* Amount presets */}
          <div className="mb-4">
            <p className="text-gray-text text-xs uppercase tracking-wider mb-2">Amount</p>
            <div className="flex gap-2 mb-3">
              {PRED_AMOUNTS.map(a => (
                <button
                  key={a}
                  onClick={() => setAmount(a)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                  style={amount === a
                    ? { background: 'rgba(255,255,255,0.1)', color: '#F4F4F5', border: '1px solid rgba(255,255,255,0.15)' }
                    : { background: 'rgba(255,255,255,0.04)', color: '#71717A', border: '1px solid rgba(255,255,255,0.06)' }
                  }
                >
                  ${a}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-xl px-4 py-3"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="text-gray-text text-sm">$</span>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(Math.max(1, Number(e.target.value)))}
                className="flex-1 bg-transparent text-white font-semibold text-base outline-none"
              />
            </div>
          </div>

          {/* Order summary */}
          <div className="rounded-xl p-4 mb-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { label: 'Avg price', value: `${price}¢` },
              { label: 'Shares',    value: `${shares}` },
              { label: 'Max payout', value: `$${payout.toFixed(2)}` },
              { label: 'Max profit', value: `+$${profit.toFixed(2)}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-1.5">
                <span className="text-gray-text text-sm">{label}</span>
                <span className="text-white text-sm font-medium">{value}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => { onPlace(team, amount); setPlaced(true); setTimeout(onClose, 1400); }}
            className="w-full py-3.5 rounded-xl font-semibold text-sm text-white"
            style={team === 1
              ? { background: 'rgba(34,197,94,0.15)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.3)' }
              : { background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }
            }
          >
            Buy {shortName(teamName(team))} · ${amount}
          </button>

          <p className="text-center text-gray-text/60 text-xs mt-3">
            Sweepstakes model · See terms for eligible states
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-10 px-5"
        >
          <div className="text-4xl mb-4">✓</div>
          <h3 className="text-white font-bold text-lg mb-1">Order placed</h3>
          <p className="text-gray-text text-sm">{shares} {shortName(teamName(team))} shares at {price}¢</p>
        </motion.div>
      )}
    </Sheet>
  );
}

function formatTime(s: number) {
  if (s <= 0) return 'Ended';
  if (s < 3600) {
    const m = Math.floor(s / 60), sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  }
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return `${h}h ${m}m`;
}

// ── Shared bottom-sheet shell ────────────────────────────────────────────────

function Sheet({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      <motion.div
        className="absolute inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden"
        style={{ background: '#1A1B26', border: '1px solid rgba(255,255,255,0.08)' }}
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 38, mass: 0.8 }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
        </div>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// ── Pro Auction bid sheet ────────────────────────────────────────────────────

function ProBidSheet({ auction, onBid, onClose }: { auction: AuctionTeam; onBid: (amount: number) => void; onClose: () => void }) {
  const [bid, setBid] = useState(auction.currentBid + 100);
  const [custom, setCustom] = useState('');
  const [customFocused, setCustomFocused] = useState(false);
  const [placed, setPlaced] = useState(false);

  const handleIncrement = (n: number) => { setCustom(''); setBid(prev => prev + n); };
  const handleCustomChange = (val: string) => {
    const digits = val.replace(/\D/g, '');
    setCustom(digits);
    const n = parseInt(digits, 10);
    if (!isNaN(n)) setBid(n);
  };
  const isValid = bid > auction.currentBid;
  const handlePlace = () => {
    if (!isValid) return;
    onBid(bid);
    setPlaced(true);
    setTimeout(onClose, 1200);
  };

  return (
    <Sheet onClose={onClose}>
      <div className="px-5 pb-10 pt-2">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-full text-xl" style={{ background: '#111116' }}>
              {auction.pro.flag}
            </div>
            <div>
              <div className="text-white font-bold text-base">{auction.pro.name}</div>
              <div className="text-gray-text text-xs">Rank #{auction.pro.ranking} · {auction.pro.rating}★</div>
            </div>
          </div>
          <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <X size={15} color="#6B6B80" />
          </button>
        </div>

        <div className="rounded-2xl p-4 mb-4 flex items-center justify-between" style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-gray-text text-sm">Current bid</span>
          <span className="text-white font-bold text-lg">${auction.currentBid.toLocaleString()}</span>
        </div>

        <div className="mb-3">
          <div className="text-gray-text text-xs mb-2 uppercase tracking-wider">Your bid</div>
          <div className="flex items-center justify-between rounded-2xl px-4 py-3.5" style={{ background: '#111116', border: '1px solid rgba(245,158,11,0.3)' }}>
            <span className="text-gold font-bold text-2xl">${bid.toLocaleString()}</span>
            <div className="flex gap-2">
              {INCREMENTS.map(n => (
                <button key={n} onClick={() => handleIncrement(n)} className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                  style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' }}>
                  +{n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-gray-text text-xs mb-2 uppercase tracking-wider">Or enter amount</div>
          <div className="flex items-center rounded-2xl px-4 py-3"
            style={{ background: '#111116', border: `1px solid ${customFocused ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)'}` }}>
            <span className="text-gray-text mr-1">$</span>
            <input type="text" inputMode="numeric" value={custom} onChange={e => handleCustomChange(e.target.value)}
              onFocus={() => setCustomFocused(true)} onBlur={() => setCustomFocused(false)}
              placeholder="Custom amount"
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-text" />
          </div>
        </div>

        <p className="text-gray-text text-xs mb-5">
          {auction.bids.length} bid{auction.bids.length !== 1 ? 's' : ''} placed · {auction.watchers} watching
        </p>

        <motion.button whileTap={{ scale: isValid ? 0.97 : 1 }} onClick={handlePlace} disabled={!isValid}
          className="w-full py-4 rounded-2xl font-bold text-base"
          style={{
            background: placed ? 'rgba(34,197,94,0.15)' : isValid ? '#F59E0B' : 'rgba(245,158,11,0.3)',
            color: placed ? '#22C55E' : isValid ? '#000' : 'rgba(0,0,0,0.4)',
            border: placed ? '1px solid rgba(34,197,94,0.3)' : 'none',
          }}>
          {placed ? '✓ Bid placed!' : `Place bid · $${bid.toLocaleString()}`}
        </motion.button>
      </div>
    </Sheet>
  );
}

// ── Calcutta Auction bid sheet ───────────────────────────────────────────────


function CalcuttaBidSheet({ team, onBid, onClose }: { team: CalcuttaTeam; onBid: (amount: number) => void; onClose: () => void }) {
  const [bid, setBid] = useState(team.currentBid + 100);
  const [custom, setCustom] = useState('');
  const [customFocused, setCustomFocused] = useState(false);
  const [placed, setPlaced] = useState(false);

  const handleIncrement = (n: number) => { setCustom(''); setBid(prev => prev + n); };
  const handleCustomChange = (val: string) => {
    const digits = val.replace(/\D/g, '');
    setCustom(digits);
    const n = parseInt(digits, 10);
    if (!isNaN(n)) setBid(n);
  };
  const isValid = bid > team.currentBid;
  const handlePlace = () => {
    if (!isValid) return;
    onBid(bid);
    setPlaced(true);
    setTimeout(onClose, 1200);
  };

  return (
    <Sheet onClose={onClose}>
      <div className="px-5 pb-10 pt-2">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-full text-xl" style={{ background: '#111116' }}>
              {team.proFlag}
            </div>
            <div>
              <div className="text-white font-bold text-base">{team.label}</div>
              <div className="text-gray-text text-xs">Bid to own this team</div>
            </div>
          </div>
          <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <X size={15} color="#6B6B80" />
          </button>
        </div>

        <div className="rounded-2xl p-4 mb-4 flex items-center justify-between" style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-gray-text text-sm">Current bid</span>
          <span className="text-white font-bold text-lg">${team.currentBid.toLocaleString()}</span>
        </div>

        <div className="mb-3">
          <div className="text-gray-text text-xs mb-2 uppercase tracking-wider">Your bid</div>
          <div className="flex items-center justify-between rounded-2xl px-4 py-3.5" style={{ background: '#111116', border: '1px solid rgba(245,158,11,0.3)' }}>
            <span className="text-gold font-bold text-2xl">${bid.toLocaleString()}</span>
            <div className="flex gap-2">
              {INCREMENTS.map(n => (
                <button key={n} onClick={() => handleIncrement(n)} className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                  style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' }}>
                  +{n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-gray-text text-xs mb-2 uppercase tracking-wider">Or enter amount</div>
          <div className="flex items-center rounded-2xl px-4 py-3"
            style={{ background: '#111116', border: `1px solid ${customFocused ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)'}` }}>
            <span className="text-gray-text mr-1">$</span>
            <input type="text" inputMode="numeric" value={custom} onChange={e => handleCustomChange(e.target.value)}
              onFocus={() => setCustomFocused(true)} onBlur={() => setCustomFocused(false)}
              placeholder="Custom amount"
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-text" />
          </div>
        </div>

        <p className="text-gray-text text-xs mb-5">
          {team.bidsCount} bid{team.bidsCount !== 1 ? 's' : ''} placed
        </p>

        <motion.button whileTap={{ scale: isValid ? 0.97 : 1 }} onClick={handlePlace} disabled={!isValid}
          className="w-full py-4 rounded-2xl font-bold text-base"
          style={{
            background: placed ? 'rgba(34,197,94,0.15)' : isValid ? '#F59E0B' : 'rgba(245,158,11,0.3)',
            color: placed ? '#22C55E' : isValid ? '#000' : 'rgba(0,0,0,0.4)',
            border: placed ? '1px solid rgba(34,197,94,0.3)' : 'none',
          }}>
          {placed ? '✓ Bid placed!' : `Place bid · $${bid.toLocaleString()}`}
        </motion.button>
      </div>
    </Sheet>
  );
}

// ── Main screen ──────────────────────────────────────────────────────────────

export default function TournamentDetail() {
  const { selectedTournament: t, navigate, proAuctions, proTime, phase, calcuttaTime, calcuttaTeams, placeBid, placeCalcuttaBid } = useApp();

  // Local sheet state only
  const [sheetAuction, setSheetAuction] = useState<AuctionTeam | null>(null);
  const [sheetCalcuttaTeam, setSheetCalcuttaTeam] = useState<CalcuttaTeam | null>(null);
  const [proOpen, setProOpen] = useState(phase === 'pro');
  const [calcuttaOpen, setCalcuttaOpen] = useState(phase === 'calcutta');

  // Prediction market state
  const [predictions, setPredictions] = useState<Record<string, UserPrediction>>({});
  const [predictionMatch, setPredictionMatch] = useState<BracketMatch | null>(null);
  const [predictionSide, setPredictionSide] = useState<1 | 2>(1);

  // Bracket swipe state
  const tBracket = BRACKETS[t.id] ?? BRACKET;
  const liveRoundIndex = (() => {
    const liveMatch = tBracket.find(m => m.status === 'live');
    if (liveMatch) return ROUNDS.indexOf(liveMatch.round);
    const upcomingMatch = tBracket.find(m => m.status === 'upcoming');
    if (upcomingMatch) return ROUNDS.indexOf(upcomingMatch.round);
    return ROUNDS.length - 1;
  })();
  const [bracketPage, setBracketPage] = useState(liveRoundIndex);
  const currentLiveRound = tBracket.find(m => m.status === 'live')?.round ?? ROUNDS[liveRoundIndex];

  const auctions = proAuctions;

  const pct = (t.registeredTeams / t.teamCount) * 100;
  const isLive = t.status === 'live';
  const isOpen = t.status === 'open';
  const isCompleted = t.status === 'completed';
  const statusColor = isLive ? '#EF4444' : isOpen ? '#22C55E' : '#71717A';
  const statusLabel = isLive ? 'Live' : isOpen ? 'Open' : isCompleted ? 'Completed' : 'Upcoming';
  const hasActiveAuction = t.hasCalcutta && t.auctionStatus !== 'closed';

  return (
    <div className="relative flex flex-col h-full">
      <div className="flex flex-col h-full bg-app overflow-y-auto pb-28">
        <Header />

        {/* Hero */}
        <div className="px-5 pb-5">
          <div className="flex items-center gap-2 mb-2">
            {isLive && <span className="w-1.5 h-1.5 rounded-full bg-danger inline-block" />}
            <span className="text-xs font-medium" style={{ color: statusColor }}>{statusLabel}</span>
            {hasActiveAuction && (
              <>
                <span className="text-gray-text text-xs">·</span>
                <span className="text-gold text-xs font-medium">
                  {phase === 'pro' ? 'Pro Auction open' : phase === 'calcutta' ? 'Calcutta Auction open' : 'Auctions closed'}
                </span>
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
              <div key={label} className="rounded-xl p-3.5" style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.06)' }}>
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
          <div className="rounded-xl p-4" style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium text-sm">Registration</span>
              <span className="text-gray-text text-xs">{t.registeredTeams}/{t.teamCount} teams</span>
            </div>
            <div className="h-1.5 rounded-full mb-3" style={{ background: '#27272A' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full" style={{ background: isLive ? '#EF4444' : '#22C55E', opacity: 0.7 }} />
            </div>
            <div className="flex items-center gap-1">
              {t.registeredPlayers.slice(0, 6).map((p, i) => (
                <div key={p.id} className="flex items-center justify-center w-7 h-7 rounded-full text-sm -ml-1 first:ml-0"
                  style={{ background: '#1C1C24', border: '2px solid #111116', zIndex: 6 - i }}>
                  {p.flag}
                </div>
              ))}
              {t.registeredTeams > 6 && (
                <div className="flex items-center justify-center w-7 h-7 rounded-full text-xs text-gray-text font-medium -ml-1"
                  style={{ background: '#27272A', border: '2px solid #111116' }}>
                  +{t.registeredTeams - 6}
                </div>
              )}
            </div>
          </div>

          {/* ── Bracket section (live or predict mode) ── */}
          {(isLive || phase === 'done') && (() => {
            const predictMode = !isLive && phase === 'done';
            const accent = predictMode ? '#818CF8' : '#EF4444';
            const accentBg = predictMode ? 'rgba(76,110,245,0.12)' : 'rgba(239,68,68,0.12)';
            const accentBorder = predictMode ? 'rgba(76,110,245,0.25)' : 'rgba(239,68,68,0.25)';
            const borderColor = predictMode ? 'rgba(76,110,245,0.2)' : 'rgba(239,68,68,0.2)';
            return (
            <motion.div
              key="bracket-section"
              initial={predictMode ? { opacity: 0, y: 12 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="rounded-xl overflow-hidden"
              style={{ border: `1px solid ${borderColor}` }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3"
                style={{ background: '#111116', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-2">
                  {isLive
                    ? <div className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
                    : <span className="text-base">🎯</span>
                  }
                  <span className="text-white font-semibold text-sm">
                    {predictMode ? 'Predict the Winner' : 'Live Bracket'}
                  </span>
                </div>
                <span className="text-xs font-bold" style={{ color: accent }}>
                  {predictMode ? 'Bracket locked · Place your picks' : ROUND_ACTIVE_LABEL[currentLiveRound]}
                </span>
              </div>

              {/* Round tabs */}
              <div className="flex px-3 pt-3 pb-2 gap-2" style={{ background: '#111116' }}>
                {ROUNDS.map((round, i) => (
                  <button
                    key={round}
                    onClick={() => setBracketPage(i)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-semibold"
                    style={bracketPage === i
                      ? { background: accentBg, color: accent, border: `1px solid ${accentBorder}` }
                      : { background: 'transparent', color: '#6B6B80', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    {ROUND_LABELS[round]}
                  </button>
                ))}
              </div>

              {/* Swipeable match pages */}
              <motion.div
                className="overflow-hidden"
                style={{ background: '#111116' }}
                onPanEnd={(_, info) => {
                  if (info.offset.x < -40 && bracketPage < ROUNDS.length - 1) setBracketPage(p => p + 1);
                  else if (info.offset.x > 40 && bracketPage > 0) setBracketPage(p => p - 1);
                }}
              >
                <motion.div
                  className="flex"
                  animate={{ x: `-${bracketPage * 100}%` }}
                  transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                >
                  {ROUNDS.map(round => {
                    if (round === 'RR') {
                      return (
                        <div key="RR" className="w-full flex-shrink-0 px-3 py-3">
                          {(['A', 'B'] as const).map(group => {
                            const groupMatches = tBracket.filter(m => m.round === 'RR' && m.group === group);
                            const standings = computeGroupStandings(groupMatches, group);
                            return (
                              <div key={group} className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-bold text-white">Group {group}</span>
                                  <span className="text-gray-text text-xs">{groupMatches.filter(m => m.status === 'completed').length}/{groupMatches.length} played</span>
                                </div>
                                {/* Standings table */}
                                <div className="rounded-xl overflow-hidden mb-2.5" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                                  <div className="flex items-center px-3 py-1.5" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                    <span className="text-gray-text text-xs w-5">#</span>
                                    <span className="flex-1 text-gray-text text-xs">Team</span>
                                    <span className="text-gray-text text-xs w-6 text-center">W</span>
                                    <span className="text-gray-text text-xs w-6 text-center">L</span>
                                    <span className="text-gray-text text-xs w-8 text-center">Pts</span>
                                  </div>
                                  {standings.map((team, i) => (
                                    <div key={team.name} className="flex items-center px-3 py-2" style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : undefined, background: i < 2 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                                      <span className="text-gray-text text-xs w-5">{i + 1}</span>
                                      <div className="flex-1 flex items-center gap-1 min-w-0">
                                        {team.seed !== undefined && <span className="text-gray-text text-xs flex-shrink-0">#{team.seed}</span>}
                                        <span className="text-xs font-semibold truncate" style={{ color: i < 2 ? '#FFFFFF' : '#6B6B80' }}>{team.name}</span>
                                        {team.isMe && <span className="text-xs font-bold flex-shrink-0" style={{ color: '#00E676' }}>me</span>}
                                      </div>
                                      <span className="text-white text-xs w-6 text-center font-medium">{team.w}</span>
                                      <span className="text-gray-text text-xs w-6 text-center">{team.l}</span>
                                      <span className="text-xs font-bold w-8 text-center" style={{ color: i < 2 ? accent : '#6B6B80' }}>{team.pts}</span>
                                    </div>
                                  ))}
                                </div>
                                {/* Match cards */}
                                <div className="flex flex-col gap-2">
                                  {groupMatches.map(match => (
                                    <BracketMatchCard
                                      key={match.id}
                                      match={match}
                                      prediction={predictions[match.id]}
                                      onPredict={MATCH_ODDS[match.id] && match.status !== 'completed' && !!match.slot1.name && match.slot1.name !== 'TBD' && !!match.slot2.name && match.slot2.name !== 'TBD' ? (side) => { setPredictionMatch(match); setPredictionSide(side); } : undefined}
                                    />
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    }
                    const matches = tBracket.filter(m => m.round === round);
                    return (
                      <div key={round} className="w-full flex-shrink-0 px-3 py-3 flex flex-col gap-2.5">
                        {matches.map(match => (
                          <BracketMatchCard
                            key={match.id}
                            match={match}
                            prediction={predictions[match.id]}
                            onPredict={MATCH_ODDS[match.id] && match.status !== 'completed' && !!match.slot1.name && match.slot1.name !== 'TBD' && !!match.slot2.name && match.slot2.name !== 'TBD' ? (side) => { setPredictionMatch(match); setPredictionSide(side); } : undefined}
                          />
                        ))}
                      </div>
                    );
                  })}
                </motion.div>
              </motion.div>

              {/* Page dots */}
              <div className="flex justify-center gap-1.5 py-2.5" style={{ background: '#111116' }}>
                {ROUNDS.map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ width: bracketPage === i ? 16 : 4, background: bracketPage === i ? accent : 'rgba(255,255,255,0.15)' }}
                    className="h-1 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
            );
          })()}

          {/* ── Pro Auction section ── */}
          {hasActiveAuction && auctions.length > 0 && (
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              {/* Header — tappable to expand/collapse */}
              <button className="w-full flex items-center justify-between px-4 py-3 text-left"
                onClick={() => setProOpen(o => !o)}
                style={{ background: '#111116', borderBottom: proOpen ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div className="flex items-center gap-2">
                  <Gavel size={14} color={phase === 'pro' ? '#F59E0B' : '#71717A'} />
                  <span className="font-semibold text-sm" style={{ color: phase === 'pro' ? '#fff' : '#71717A' }}>Pro Auction</span>
                </div>
                <div className="flex items-center gap-2">
                  {phase === 'pro' ? (
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: proTime <= 60 ? '#EF4444' : '#F59E0B' }} />
                      <span className="text-xs font-medium tabular-nums" style={{ color: proTime <= 60 ? '#EF4444' : '#F59E0B' }}>
                        Closes in {formatTime(proTime)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-1.5">
                        {auctions.filter(a => a.bids[0]?.isMe).map(a => (
                          <div key={a.id} className="flex items-center justify-center w-5 h-5 rounded-full text-xs"
                            style={{ background: '#1C1C2E', border: '1.5px solid rgba(34,197,94,0.5)' }}>
                            {a.pro.flag}
                          </div>
                        ))}
                      </div>
                      <span className="text-gray-text text-xs">Closed</span>
                    </div>
                  )}
                  <motion.div animate={{ rotate: proOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={14} color="#6B6B80" />
                  </motion.div>
                </div>
              </button>

              {/* Expanded rows */}
              <AnimatePresence initial={false}>
                {proOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p className="text-gray-text text-xs px-4 pt-3 pb-2 leading-relaxed" style={{ background: '#111116' }}>
                      Bid to partner with a pro. Highest bidder plays alongside them to win cash and prizes.
                    </p>
                    <div style={{ background: '#111116' }}>
                      {auctions.map((auction, i) => {
                        const topBidder = auction.bids[0];
                        const isWinning = topBidder?.isMe ?? false;
                        return (
                          <motion.button
                            key={auction.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSheetAuction(auction)}
                            className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                            style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : undefined }}
                          >
                            <div className="flex items-center justify-center w-10 h-10 rounded-full text-xl flex-shrink-0"
                              style={{ background: '#1C1C2E', border: isWinning ? '1.5px solid rgba(34,197,94,0.5)' : 'none' }}>
                              {auction.pro.flag}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-white text-sm font-semibold">{auction.pro.name}</div>
                              <div className="text-gray-text text-xs mt-0.5">
                                {topBidder ? (
                                  <span style={{ color: topBidder.isMe ? '#22C55E' : undefined }}>
                                    {topBidder.isMe ? 'You' : topBidder.username} · {auction.bids.length} bid{auction.bids.length !== 1 ? 's' : ''}
                                  </span>
                                ) : `Rank #${auction.pro.ranking} · ${auction.pro.rating}★`}
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="font-bold text-sm" style={{ color: isWinning ? '#22C55E' : '#fff' }}>
                                ${auction.currentBid.toLocaleString()}
                              </div>
                              <div className="text-xs font-medium mt-0.5 px-2 py-0.5 rounded-full text-center"
                                style={isWinning
                                  ? { background: 'rgba(34,197,94,0.12)', color: '#22C55E' }
                                  : { background: 'rgba(245,158,11,0.12)', color: '#F59E0B' }}>
                                {isWinning ? 'Winning' : 'Bid'}
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ── Calcutta Auction section ── */}
          {hasActiveAuction && (phase === 'calcutta' || phase === 'done') && calcuttaTeams.length > 0 && (
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              {/* Header — tappable to expand/collapse */}
              <button className="w-full flex items-center justify-between px-4 py-3 text-left"
                onClick={() => setCalcuttaOpen(o => !o)}
                style={{ background: '#111116', borderBottom: calcuttaOpen ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div className="flex items-center gap-2">
                  <Trophy size={14} color={phase === 'calcutta' ? '#F59E0B' : '#71717A'} />
                  <span className="font-semibold text-sm" style={{ color: phase === 'calcutta' ? '#fff' : '#71717A' }}>Calcutta Auction</span>
                </div>
                <div className="flex items-center gap-2">
                  {phase === 'calcutta' ? (
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: calcuttaTime <= 60 ? '#EF4444' : '#F59E0B' }} />
                      <span className="text-xs font-medium tabular-nums" style={{ color: calcuttaTime <= 60 ? '#EF4444' : '#F59E0B' }}>
                        Closes in {formatTime(calcuttaTime)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-text text-xs">Closed</span>
                  )}
                  <motion.div animate={{ rotate: calcuttaOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={14} color="#6B6B80" />
                  </motion.div>
                </div>
              </button>

              <AnimatePresence initial={false}>
              {calcuttaOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
              {phase === 'calcutta' && (
                <p className="text-gray-text text-xs px-4 pt-3 pb-2 leading-relaxed" style={{ background: '#111116' }}>
                  Bid to own a team. Highest bidder collects a share of the prize pool if their team wins.
                </p>
              )}

              {/* Team rows */}
              <div style={{ background: '#111116' }}>
                {calcuttaTeams.map((team, i) => {
                  const isWinning = team.topBidderIsMe;
                  const auctionEnded = phase === 'done';
                  return (
                    <motion.button
                      key={team.id}
                      whileTap={{ scale: auctionEnded ? 1 : 0.98 }}
                      onClick={() => !auctionEnded && setSheetCalcuttaTeam(team)}
                      className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                      style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : undefined, opacity: auctionEnded ? 0.6 : 1 }}
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full text-xl flex-shrink-0"
                        style={{ background: '#1C1C2E', border: isWinning ? '1.5px solid rgba(34,197,94,0.5)' : 'none' }}>
                        {team.proFlag}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-semibold">{team.label}</div>
                        <div className="text-gray-text text-xs mt-0.5">
                          {team.bidsCount > 0 ? (
                            <span style={{ color: isWinning ? '#22C55E' : undefined }}>
                              {isWinning ? 'You' : team.topBidderName} · {team.bidsCount} bid{team.bidsCount !== 1 ? 's' : ''}
                            </span>
                          ) : 'No bids yet'}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-bold text-sm" style={{ color: isWinning ? '#22C55E' : '#fff' }}>
                          ${team.currentBid.toLocaleString()}
                        </div>
                        {!auctionEnded && (
                          <div className="text-xs font-medium mt-0.5 px-2 py-0.5 rounded-full text-center"
                            style={isWinning
                              ? { background: 'rgba(34,197,94,0.12)', color: '#22C55E' }
                              : { background: 'rgba(245,158,11,0.12)', color: '#F59E0B' }}>
                            {isWinning ? 'Winning' : 'Bid'}
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              </motion.div>
              )}
              </AnimatePresence>
            </div>
          )}

          {/* CTA */}
          {(!t.hasCalcutta || t.auctionStatus === 'closed') && (
            <div className="flex gap-2.5 pb-4">
              {isOpen && (
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('lobby', 'forward')}
                  className="flex-1 py-3.5 rounded-xl font-semibold text-sm text-black bg-white">
                  Register Team
                </motion.button>
              )}
              {isCompleted && (
                <button onClick={() => navigate('bracket', 'forward')}
                  className="flex-1 py-3.5 rounded-xl font-medium text-sm text-gray-text"
                  style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.08)' }}>
                  View Results
                </button>
              )}
              <button className="w-12 flex items-center justify-center rounded-xl"
                style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Share2 size={16} color="#71717A" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Prediction sheet */}
      <AnimatePresence>
        {predictionMatch && (
          <PredictionSheet
            match={predictionMatch}
            initialSide={predictionSide}
            existing={predictions[predictionMatch.id]}
            onPlace={(team, amount) => setPredictions(p => ({ ...p, [predictionMatch.id]: { team, amount } }))}
            onClose={() => setPredictionMatch(null)}
          />
        )}
      </AnimatePresence>

      {/* Pro bid sheet */}
      <AnimatePresence>
        {sheetAuction && (
          <ProBidSheet
            auction={auctions.find(a => a.id === sheetAuction.id) ?? sheetAuction}
            onBid={(amount) => placeBid(sheetAuction.id, amount)}
            onClose={() => setSheetAuction(null)}
          />
        )}
      </AnimatePresence>

      {/* Calcutta bid sheet */}
      <AnimatePresence>
        {sheetCalcuttaTeam && (
          <CalcuttaBidSheet
            team={calcuttaTeams.find(c => c.id === sheetCalcuttaTeam.id) ?? sheetCalcuttaTeam}
            onBid={(amount) => placeCalcuttaBid(sheetCalcuttaTeam.id, amount)}
            onClose={() => setSheetCalcuttaTeam(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
