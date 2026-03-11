import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ChevronLeft, Info } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Bid } from '../../types';
import { MIN_BID_INCREMENT } from './AuctionHub';

const COMPETITOR_NAMES = [
  'paddle_king_mike', 'sobe_padel_club', 'smash_collective',
  'ace_investments', 'vargas_fan', 'miami_rackets', 'court_side_bets',
];

function TimerRing({ timeLeft, maxTime }: { timeLeft: number; maxTime: number }) {
  const radius = 40;
  const circ = 2 * Math.PI * radius;
  const pct = Math.max(0, timeLeft / maxTime);
  const offset = circ * (1 - pct);
  const color = timeLeft <= 15 ? '#EF4444' : timeLeft <= 30 ? '#F59E0B' : '#22C55E';

  return (
    <div className="relative flex items-center justify-center">
      <svg width="96" height="96" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="48" cy="48" r={radius} fill="none" stroke="#27272A" strokeWidth="5" />
        <circle
          cx="48" cy="48" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s', opacity: 0.8 }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-bold text-xl text-white leading-none">{timeLeft}</div>
        <div className="text-gray-text text-xs">sec</div>
      </div>
    </div>
  );
}

function BidRow({ bid, isNew }: { bid: Bid; isNew?: boolean }) {
  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: -10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between py-2.5"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
          style={{
            background: bid.isMe ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)',
            color: bid.isMe ? '#22C55E' : '#71717A',
          }}
        >
          {bid.username.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm" style={{ color: bid.isMe ? '#22C55E' : '#F4F4F5' }}>
          {bid.isMe ? 'You' : bid.username}
        </span>
      </div>
      <span className="font-semibold text-sm text-white">${bid.amount.toLocaleString()}</span>
    </motion.div>
  );
}

export default function AuctionRoom() {
  const { selectedAuction: at, goBack } = useApp();

  const [timeLeft, setTimeLeft] = useState(at.initialTimeLeft > 0 ? at.initialTimeLeft : 47);
  const [currentBid, setCurrentBid] = useState(at.currentBid);
  const [bids, setBids] = useState<Bid[]>([...at.bids]);
  const [myHighestBid, setMyHighestBid] = useState(at.myBid ?? 0);
  const [outbid, setOutbid] = useState(false);
  const [outbidBy, setOutbidBy] = useState('');
  const [bidAmount, setBidAmount] = useState(at.currentBid + MIN_BID_INCREMENT);
  const [showConfirm, setShowConfirm] = useState(false);
  const [justWon, setJustWon] = useState(false);
  const [watchers, setWatchers] = useState(at.watchers);
  const ended = timeLeft <= 0;
  const iAmWinning = !ended && myHighestBid >= currentBid;
  const nextBid = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (ended) { if (myHighestBid >= currentBid) setJustWon(true); return; }
    const id = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [ended, myHighestBid, currentBid]);

  useEffect(() => {
    const id = setInterval(() => setWatchers(w => Math.max(10, w + (Math.random() > 0.5 ? 1 : -1))), 5000);
    return () => clearInterval(id);
  }, []);

  const scheduleCompetitorBid = useCallback(() => {
    if (nextBid.current) clearTimeout(nextBid.current);
    const delay = 8000 + Math.random() * 7000;
    nextBid.current = setTimeout(() => {
      const inc = [50, 75, 100, 150, 200][Math.floor(Math.random() * 5)];
      const bidder = COMPETITOR_NAMES[Math.floor(Math.random() * COMPETITOR_NAMES.length)];
      setCurrentBid(prev => {
        const newBid = prev + inc;
        setBidAmount(newBid + MIN_BID_INCREMENT);
        setMyHighestBid(myBid => {
          if (myBid >= prev) {
            setOutbid(true);
            setOutbidBy(bidder);
            setTimeout(() => setOutbid(false), 3000);
          }
          return myBid;
        });
        setBids(pb => [{
          id: Date.now().toString(), userId: 'comp', username: bidder,
          amount: newBid, timestamp: Date.now(),
        }, ...pb.slice(0, 9)]);
        setTimeLeft(t => (t < 20 ? 30 : t));
        return newBid;
      });
      scheduleCompetitorBid();
    }, delay);
  }, []);

  useEffect(() => {
    if (!ended) scheduleCompetitorBid();
    return () => { if (nextBid.current) clearTimeout(nextBid.current); };
  }, [ended, scheduleCompetitorBid]);

  const handlePlaceBid = () => {
    const amount = bidAmount;
    setCurrentBid(amount);
    setMyHighestBid(amount);
    setBidAmount(amount + MIN_BID_INCREMENT);
    setBids(prev => [{
      id: Date.now().toString(), userId: 'me', username: 'You',
      amount, timestamp: Date.now(), isMe: true,
    }, ...prev.slice(0, 9)]);
    setTimeLeft(t => (t < 20 ? 30 : t));
    setShowConfirm(false);
  };

  return (
    <div className="flex flex-col h-full bg-app overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-16 pb-4">
        <button
          onClick={goBack}
          className="flex items-center justify-center w-9 h-9 rounded-full"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <ChevronLeft size={18} color="#F4F4F5" />
        </button>
        <div className="text-center">
          <p className="text-white font-semibold text-sm">{at.tournamentName}</p>
          <p className="text-gray-text text-xs">Partner Auction</p>
        </div>
        <div className="flex items-center gap-1 text-gray-text text-xs">
          <Eye size={13} />
          <span>{watchers}</span>
        </div>
      </div>

      {/* Outbid notice */}
      <AnimatePresence>
        {outbid && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-5 mb-3 py-2.5 rounded-xl text-center text-xs font-medium"
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#EF4444',
            }}
          >
            Outbid by {outbidBy} — place a new bid
          </motion.div>
        )}
      </AnimatePresence>

      {/* Winning notice */}
      <AnimatePresence>
        {iAmWinning && !outbid && !ended && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-5 mb-3 py-2 rounded-xl text-center text-xs font-medium"
            style={{ background: 'rgba(34,197,94,0.07)', color: '#22C55E' }}
          >
            You are currently winning
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pro being auctioned */}
      <div
        className="mx-5 mb-4 p-4 rounded-2xl"
        style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-3xl flex-shrink-0"
            style={{ background: '#1C1C24', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {at.pro.flag}
          </div>
          <div className="flex-1">
            <div className="text-white font-bold text-base">{at.pro.name}</div>
            <div className="text-gray-text text-xs mt-0.5">#{at.pro.ranking} World · {at.pro.rating}★</div>
            <div
              className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ background: 'rgba(76,110,245,0.1)', color: '#818CF8', border: '1px solid rgba(76,110,245,0.15)' }}
            >
              Win to partner with this pro
            </div>
          </div>
        </div>
      </div>

      {/* Bid + Timer */}
      <div className="flex items-center justify-between px-5 mb-4">
        <div>
          <div className="text-gray-text text-xs mb-1">Current bid</div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBid}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="font-bold text-3xl text-white"
            >
              ${currentBid.toLocaleString()}
            </motion.div>
          </AnimatePresence>
          <div className="text-gray-text text-xs mt-1">{bids.length} bids total</div>
          {myHighestBid > 0 && !ended && (
            <div className="text-xs font-medium mt-1" style={{ color: iAmWinning ? '#22C55E' : '#EF4444' }}>
              Your bid: ${myHighestBid.toLocaleString()} · {iAmWinning ? 'Winning' : 'Outbid'}
            </div>
          )}
        </div>

        {!ended ? (
          <TimerRing timeLeft={timeLeft} maxTime={60} />
        ) : (
          <div className="text-center">
            <div className="text-3xl mb-1">🏆</div>
            <div className="text-white font-semibold text-sm">{justWon ? 'You won' : 'Ended'}</div>
          </div>
        )}
      </div>

      {/* Bid controls */}
      {!ended && (
        <div className="px-5 mb-3">
          {/* Min bid info */}
          <div
            className="flex items-center gap-2 mb-2.5 px-3 py-2 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <Info size={11} color="#52525B" />
            <span className="text-gray-text text-xs">
              Min bid: <span className="text-white font-semibold">${(currentBid + MIN_BID_INCREMENT).toLocaleString()}</span>
              <span className="text-gray-text"> (min raise +${MIN_BID_INCREMENT})</span>
            </span>
          </div>

          {/* Quick-increment buttons above the minimum */}
          <div className="flex gap-2 mb-2.5">
            {[0, 100, 250, 500].map(extra => {
              const amount = currentBid + MIN_BID_INCREMENT + extra;
              const label = extra === 0 ? 'Min' : `+$${extra}`;
              return (
                <button
                  key={extra}
                  onClick={() => setBidAmount(amount)}
                  className="flex-1 py-2.5 rounded-lg text-xs font-medium transition-all"
                  style={
                    bidAmount === amount
                      ? { background: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.25)' }
                      : { background: 'rgba(255,255,255,0.04)', color: '#71717A', border: '1px solid rgba(255,255,255,0.06)' }
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => bidAmount >= currentBid + MIN_BID_INCREMENT && setShowConfirm(true)}
            className="w-full py-3.5 rounded-xl font-semibold text-sm"
            style={{
              background: bidAmount >= currentBid + MIN_BID_INCREMENT
                ? 'rgba(245,158,11,0.1)'
                : 'rgba(255,255,255,0.03)',
              border: bidAmount >= currentBid + MIN_BID_INCREMENT
                ? '1px solid rgba(245,158,11,0.25)'
                : '1px solid rgba(255,255,255,0.05)',
              color: bidAmount >= currentBid + MIN_BID_INCREMENT ? '#F59E0B' : '#3F3F52',
              cursor: bidAmount >= currentBid + MIN_BID_INCREMENT ? 'pointer' : 'not-allowed',
            }}
          >
            Bid ${bidAmount.toLocaleString()}
          </button>
        </div>
      )}

      {/* Bid feed — mb-20 clears the BottomNav */}
      <div
        className="flex-1 overflow-hidden mx-5 mb-20 rounded-xl"
        style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="px-4 py-2.5 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <span className="text-gray-text text-xs font-medium uppercase tracking-wider">Bid History</span>
          <span className="text-gray-text text-xs">{bids.length}</span>
        </div>
        <div className="overflow-y-auto px-4" style={{ maxHeight: 160 }}>
          {bids.map((bid, i) => <BidRow key={bid.id} bid={bid} isNew={i === 0} />)}
        </div>
      </div>

      {/* Confirm modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-end z-50"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              onClick={e => e.stopPropagation()}
              className="w-full rounded-t-3xl p-6 pb-10"
              style={{ background: '#1C1C24', borderTop: '1px solid rgba(255,255,255,0.08)' }}
            >
              <h3 className="text-white font-bold text-lg mb-1 text-center">Confirm bid</h3>
              <p className="text-gray-text text-sm text-center mb-5">
                Partner with {at.pro.name}
              </p>

              <div
                className="rounded-xl p-4 mb-5 text-center"
                style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}
              >
                <div className="text-white font-bold text-3xl">${bidAmount.toLocaleString()}</div>
                <div className="text-gray-text text-xs mt-1">Your bid</div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3.5 rounded-xl font-medium text-sm text-gray-text"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePlaceBid}
                  className="flex-1 py-3.5 rounded-xl font-semibold text-sm"
                  style={{
                    background: 'rgba(245,158,11,0.12)',
                    border: '1px solid rgba(245,158,11,0.25)',
                    color: '#F59E0B',
                  }}
                >
                  Place bid
                </button>
              </div>
              <p className="text-center text-gray-text/50 text-xs mt-3">Held in escrow · Stripe</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Won overlay */}
      <AnimatePresence>
        {justWon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center z-60"
            style={{ background: 'rgba(9,9,14,0.92)' }}
          >
            <div className="text-center px-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-5xl mb-5">🏆</div>
                <h2 className="text-white font-bold text-2xl mb-2">You're partnered!</h2>
                <p className="text-gray-text mb-1">You × {at.pro.name}</p>
                <p className="text-white font-bold text-xl mb-8">${currentBid.toLocaleString()}</p>
                <button
                  onClick={goBack}
                  className="px-8 py-3 rounded-xl font-semibold text-sm text-white"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  View portfolio
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
