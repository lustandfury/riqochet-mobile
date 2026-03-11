import { useState, useEffect } from 'react';
import { Eye, TrendingUp, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../store/AppContext';
import { AUCTION_TEAMS } from '../../data/mockData';
import { AuctionTeam } from '../../types';

export const MIN_BID_INCREMENT = 100;

function formatTime(secs: number) {
  if (secs <= 0) return '0s';
  if (secs < 60) return `${secs}s`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ${secs % 60}s`;
  return `${Math.floor(secs / 3600)}h ${Math.floor((secs % 3600) / 60)}m`;
}

function LiveTimer({ initialSeconds }: { initialSeconds: number }) {
  const [secs, setSecs] = useState(initialSeconds);
  useEffect(() => {
    if (secs <= 0) return;
    const id = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const urgent = secs > 0 && secs < 60;
  return (
    <span className="font-mono font-semibold text-sm tabular-nums" style={{ color: urgent ? '#EF4444' : '#F4F4F5' }}>
      {formatTime(secs)}
    </span>
  );
}

function ProCard({ at, onPress }: { at: AuctionTeam; onPress: () => void }) {
  const isLive = at.status === 'live';
  const isClosed = at.status === 'closed';
  const minNext = at.currentBid + MIN_BID_INCREMENT;
  const isOutbid = at.myBid != null && at.currentBid > at.myBid;
  const isWinning = at.myBid != null && at.currentBid <= at.myBid;

  return (
    <motion.div
      whileTap={{ scale: 0.985 }}
      onClick={onPress}
      className="rounded-2xl mb-3 cursor-pointer overflow-hidden"
      style={{
        background: isWinning
          ? 'linear-gradient(135deg, #071A10 0%, #0E1118 100%)'
          : isOutbid
          ? 'linear-gradient(135deg, #1A0707 0%, #0E1118 100%)'
          : '#111116',
        border: isWinning
          ? '1px solid rgba(34,197,94,0.15)'
          : isOutbid
          ? '1px solid rgba(239,68,68,0.15)'
          : '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="p-4">
        {/* Top row: status + watchers */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            {isLive && <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse inline-block" />}
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: isLive ? '#EF4444' : isClosed ? '#52525B' : '#818CF8' }}
            >
              {isLive ? 'Live' : isClosed ? 'Closed' : 'Opens Soon'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-text text-xs">
            <Eye size={11} />
            <span>{at.watchers}</span>
          </div>
        </div>

        {/* Pro info */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: '#1C1C26', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {at.pro.flag}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-base leading-tight">{at.pro.name}</div>
            <div className="text-gray-text text-xs mt-0.5">
              #{at.pro.ranking} World · {at.pro.rating}★ · {at.pro.wins}W {at.pro.losses}L
            </div>
          </div>
          <ChevronRight size={16} color="#3F3F52" />
        </div>

        {/* Bid + timer row */}
        <div className="flex items-end justify-between">
          <div>
            <div className="text-gray-text text-xs mb-0.5">
              {isClosed ? 'Final bid' : 'Current bid'}
            </div>
            <div className="text-white font-black text-2xl leading-none">
              ${at.currentBid.toLocaleString()}
            </div>
            {!isClosed && (
              <div className="text-gray-text text-xs mt-1">
                Min next: <span className="text-white font-medium">${minNext.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="text-right">
            {isLive && (
              <div>
                <div className="text-gray-text text-xs mb-0.5">Ends in</div>
                <LiveTimer initialSeconds={at.initialTimeLeft} />
              </div>
            )}
            {at.status === 'upcoming' && (
              <div>
                <div className="text-gray-text text-xs mb-0.5">Opens in</div>
                <span className="font-mono font-semibold text-sm text-royal">
                  {formatTime(at.initialTimeLeft)}
                </span>
              </div>
            )}
            {isClosed && at.winnerName && (
              <div>
                <div className="text-gray-text text-xs mb-0.5">Won by</div>
                <div className="text-white text-sm font-semibold">{at.winnerName}</div>
              </div>
            )}
          </div>
        </div>

        {/* My bid status */}
        {at.myBid != null && (
          <div
            className="mt-3 pt-3 flex items-center gap-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            <TrendingUp size={12} color={isOutbid ? '#EF4444' : '#22C55E'} />
            <span className="text-xs font-semibold" style={{ color: isOutbid ? '#EF4444' : '#22C55E' }}>
              {isOutbid ? 'OUTBID' : 'WINNING'} · Your bid: ${at.myBid.toLocaleString()}
            </span>
            {isOutbid && !isClosed && (
              <span className="ml-auto text-xs text-gray-text">Tap to rebid →</span>
            )}
          </div>
        )}
      </div>

      {/* Bid CTA bar for live/upcoming */}
      {!isClosed && (
        <div
          className="px-4 py-2.5 flex items-center justify-between"
          style={{ background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <span className="text-gray-text text-xs">Bid to partner with this pro</span>
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{
              background: isLive ? 'rgba(245,158,11,0.1)' : 'rgba(76,110,245,0.1)',
              color: isLive ? '#F59E0B' : '#818CF8',
              border: isLive ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(76,110,245,0.2)',
            }}
          >
            {isLive ? 'Bid Now' : 'View'}
          </span>
        </div>
      )}
    </motion.div>
  );
}

export default function AuctionHub() {
  const { navigate, selectAuction } = useApp();

  const live = AUCTION_TEAMS.filter(a => a.status === 'live');
  const upcoming = AUCTION_TEAMS.filter(a => a.status === 'upcoming');
  const closed = AUCTION_TEAMS.filter(a => a.status === 'closed');

  function openRoom(at: AuctionTeam) {
    selectAuction(at);
    navigate('auction-room', 'forward');
  }

  return (
    <div className="flex flex-col h-full bg-app pt-14">
      {/* Header */}
      <div className="px-5 pt-4 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Partner Auction</h1>
            <p className="text-gray-text text-xs mt-0.5">Riqochet Miami Open · Mar 22</p>
          </div>
          <div className="text-right">
            {live.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse inline-block" />
                <span className="text-danger text-xs font-semibold">{live.length} live</span>
              </div>
            )}
            <div className="text-gray-text text-xs mt-0.5">Min raise: ${MIN_BID_INCREMENT}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28 pt-4">
        {/* Live */}
        {live.length > 0 && (
          <div className="mb-2">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse inline-block" />
              <span className="text-xs font-bold uppercase tracking-widest text-danger">Bidding Open</span>
            </div>
            {live.map(at => <ProCard key={at.id} at={at} onPress={() => openRoom(at)} />)}
          </div>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div className="mb-2">
            <div className="flex items-center gap-1.5 mb-3 mt-2">
              <span className="text-xs font-bold uppercase tracking-widest text-royal">Opening Soon</span>
            </div>
            {upcoming.map(at => <ProCard key={at.id} at={at} onPress={() => openRoom(at)} />)}
          </div>
        )}

        {/* Closed */}
        {closed.length > 0 && (
          <div className="mb-2">
            <div className="flex items-center gap-1.5 mb-3 mt-2">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-text">Closed</span>
            </div>
            {closed.map(at => <ProCard key={at.id} at={at} onPress={() => openRoom(at)} />)}
          </div>
        )}

        {/* Portfolio link */}
        <motion.button
          whileTap={{ scale: 0.985 }}
          onClick={() => navigate('auction-portfolio', 'forward')}
          className="w-full p-4 rounded-2xl flex items-center justify-between mt-2"
          style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-3">
            <TrendingUp size={16} color="#71717A" />
            <div className="text-left">
              <div className="text-white font-medium text-sm">My Portfolio</div>
              <div className="text-gray-text text-xs">Bids, wins & returns</div>
            </div>
          </div>
          <ChevronRight size={16} color="#3F3F52" />
        </motion.button>
      </div>
    </div>
  );
}
