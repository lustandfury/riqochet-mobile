import { TrendingUp, TrendingDown, Trophy, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../store/AppContext';
import Header from '../../components/Header';
import { AUCTION_TEAMS, PLAYERS, ME } from '../../data/mockData';

const MY_BIDS = [
  {
    team: AUCTION_TEAMS[0],
    myBid: 2100,
    currentBid: 2400,
    status: 'outbid' as const,
    potentialReturn: 4800,
  },
];

const WON = [
  {
    pro: PLAYERS[2], // Marco Bellini — you won the right to partner with him
    paidBid: 1600,
    tournamentName: 'Coconut Grove Invitational',
    result: 'Runner-up',
    payout: 2400,
    profit: 800,
  },
];

export default function AuctionPortfolio() {
  const { navigate } = useApp();

  const totalInvested = MY_BIDS.reduce((s, b) => s + b.myBid, 0) + WON.reduce((s, w) => s + w.paidBid, 0);
  const totalPotential = MY_BIDS.reduce((s, b) => s + b.potentialReturn, 0);
  const totalReturns = WON.reduce((s, w) => s + w.payout, 0);
  const netPnl = totalReturns - WON.reduce((s, w) => s + w.paidBid, 0);

  return (
    <div className="flex flex-col h-full bg-app pt-14 overflow-y-auto pb-28">
      <Header title="My Portfolio" />

      <div className="px-5">
        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: 'Total Invested', value: `$${totalInvested.toLocaleString()}`, color: '#F0F0F5', icon: TrendingUp },
            { label: 'Potential Win', value: `$${totalPotential.toLocaleString()}`, color: '#22C55E', icon: TrendingUp },
            { label: 'Total Returned', value: `$${totalReturns.toLocaleString()}`, color: '#F59E0B', icon: Trophy },
            { label: 'Net P&L', value: `+$${netPnl.toLocaleString()}`, color: '#22C55E', icon: TrendingUp },
          ].map(({ label, value, color, icon: Icon }) => (
            <div
              key={label}
              className="rounded-2xl p-4"
              style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon size={12} color={color} />
                <span className="text-gray-text text-xs">{label}</span>
              </div>
              <div className="font-black text-lg" style={{ color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Active bids */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={14} color="#6B6B80" />
            <span className="text-white font-bold text-sm uppercase tracking-wider">Active Bids</span>
          </div>

          {MY_BIDS.map(({ team, myBid, currentBid, status, potentialReturn }, i) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-4 mb-3 cursor-pointer"
              onClick={() => {
                navigate('auction-room', 'forward');
              }}
              style={{
                background: status === 'outbid'
                  ? 'linear-gradient(135deg, #200A0A 0%, #111118 100%)'
                  : 'linear-gradient(135deg, #0A200A 0%, #111118 100%)',
                border: status === 'outbid'
                  ? '1px solid rgba(239,68,68,0.08)'
                  : '1px solid rgba(34,197,94,0.08)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{team.pro.flag}</span>
                  <span className="text-white font-bold text-sm">
                    {team.pro.name}
                  </span>
                </div>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={
                    status === 'outbid'
                      ? { background: 'rgba(239,68,68,0.08)', color: '#EF4444' }
                      : { background: 'rgba(34,197,94,0.08)', color: '#22C55E' }
                  }
                >
                  {status === 'outbid' ? 'OUTBID' : 'WINNING'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'My Bid', value: `$${myBid.toLocaleString()}`, color: '#6B6B80' },
                  { label: 'Current', value: `$${currentBid.toLocaleString()}`, color: status === 'outbid' ? '#EF4444' : '#22C55E' },
                  { label: 'Potential', value: `$${potentialReturn.toLocaleString()}`, color: '#F59E0B' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="text-center">
                    <div className="text-gray-text text-xs mb-0.5">{label}</div>
                    <div className="font-bold text-sm" style={{ color }}>{value}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {MY_BIDS.length === 0 && (
            <div className="text-center py-8 text-gray-text">
              <p>No active bids. Head to the auction hub.</p>
            </div>
          )}
        </div>

        {/* Won auctions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={14} color="#F59E0B" />
            <span className="text-white font-bold text-sm uppercase tracking-wider">Won Auctions</span>
          </div>

          {WON.map((w, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
              className="rounded-2xl p-4 mb-3"
              style={{
                background: 'linear-gradient(135deg, #0D1A00 0%, #111118 100%)',
                border: '1px solid rgba(245,158,11,0.08)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{w.pro.flag}</span>
                  <div>
                    <div className="text-white font-bold text-sm">
                      {ME.name} × {w.pro.name}
                    </div>
                    <div className="text-gray-text text-xs">{w.tournamentName}</div>
                  </div>
                </div>
                <span className="text-gold text-sm font-bold">{w.result}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Paid', value: `$${w.paidBid.toLocaleString()}`, color: '#6B6B80' },
                  { label: 'Payout', value: `$${w.payout.toLocaleString()}`, color: '#F59E0B' },
                  { label: 'Profit', value: `+$${w.profit.toLocaleString()}`, color: '#22C55E' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="text-center">
                    <div className="text-gray-text text-xs mb-0.5">{label}</div>
                    <div className="font-bold text-sm" style={{ color }}>{value}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
