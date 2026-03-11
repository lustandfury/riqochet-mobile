import { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Flame, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MARKETS } from '../../data/mockData';
import { Market, MarketCategory } from '../../types';

type Filter = 'All' | MarketCategory;

const CATEGORIES: Filter[] = ['All', 'Padel', 'Sports', 'Finance', 'Politics', 'Entertainment'];

const CATEGORY_DOT: Record<string, string> = {
  Padel:         '#22C55E',
  Sports:        '#818CF8',
  Finance:       '#F59E0B',
  Politics:      '#EF4444',
  Entertainment: '#A78BFA',
};

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

// ─── Trade modal ─────────────────────────────────────────────────────────────

function TradeModal({ market, side, onClose }: { market: Market; side: 'YES' | 'NO'; onClose: () => void }) {
  const [selected, setSelected] = useState<'YES' | 'NO'>(side);
  const [amount, setAmount] = useState(20);
  const [placed, setPlaced] = useState(false);

  const price = selected === 'YES' ? market.yesPrice : 100 - market.yesPrice;
  const shares = +(amount / price * 100).toFixed(1);
  const payout = +(shares).toFixed(2);
  const profit = +(payout - amount).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-end z-50"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
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
        {!placed ? (
          <>
            <div className="mb-5">
              <p className="text-gray-text text-xs mb-1.5 uppercase tracking-wider">Trade</p>
              <h3 className="text-white font-semibold text-sm leading-snug">{market.title}</h3>
            </div>

            {/* YES / NO toggle */}
            <div className="flex gap-2 mb-5">
              {(['YES', 'NO'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSelected(s)}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all"
                  style={
                    selected === s && s === 'YES'
                      ? { background: 'rgba(34,197,94,0.12)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.25)' }
                      : selected === s && s === 'NO'
                      ? { background: 'rgba(239,68,68,0.12)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.25)' }
                      : { background: 'rgba(255,255,255,0.04)', color: '#71717A', border: '1px solid rgba(255,255,255,0.07)' }
                  }
                >
                  {s} · {s === 'YES' ? market.yesPrice : 100 - market.yesPrice}¢
                </button>
              ))}
            </div>

            {/* Amount presets */}
            <div className="mb-4">
              <p className="text-gray-text text-xs uppercase tracking-wider mb-2">Amount</p>
              <div className="flex gap-2 mb-3">
                {[10, 20, 50, 100].map(a => (
                  <button
                    key={a}
                    onClick={() => setAmount(a)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={
                      amount === a
                        ? { background: 'rgba(255,255,255,0.1)', color: '#F4F4F5', border: '1px solid rgba(255,255,255,0.15)' }
                        : { background: 'rgba(255,255,255,0.04)', color: '#71717A', border: '1px solid rgba(255,255,255,0.06)' }
                    }
                  >
                    ${a}
                  </button>
                ))}
              </div>
              <div
                className="flex items-center gap-2 rounded-xl px-4 py-3"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
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
            <div
              className="rounded-xl p-4 mb-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {[
                { label: 'Avg price', value: `${price}¢` },
                { label: 'Shares', value: `${shares}` },
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
              onClick={() => setPlaced(true)}
              className="w-full py-3.5 rounded-xl font-semibold text-sm text-white"
              style={{
                background: selected === 'YES'
                  ? 'rgba(34,197,94,0.15)'
                  : 'rgba(239,68,68,0.15)',
                border: selected === 'YES'
                  ? '1px solid rgba(34,197,94,0.3)'
                  : '1px solid rgba(239,68,68,0.3)',
                color: selected === 'YES' ? '#22C55E' : '#EF4444',
              }}
            >
              Buy {selected} · ${amount}
            </button>

            <p className="text-center text-gray-text/60 text-xs mt-3">
              Sweepstakes model · See terms for eligible states
            </p>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="text-4xl mb-4">✓</div>
            <h3 className="text-white font-bold text-lg mb-1">Order placed</h3>
            <p className="text-gray-text text-sm">{shares} {selected} shares at {price}¢</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Market card ─────────────────────────────────────────────────────────────

function MarketCard({ market, onTrade }: { market: Market; onTrade: (m: Market, side: 'YES' | 'NO') => void }) {
  const dotColor = CATEGORY_DOT[market.category];
  const noPrice = 100 - market.yesPrice;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl mb-2.5 overflow-hidden"
      style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="p-4">
        {/* Top */}
        <div className="flex items-start gap-3 mb-3">
          <span className="text-xl flex-shrink-0 mt-0.5">{market.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dotColor }} />
                <span className="text-xs text-gray-text">{market.category}</span>
              </div>
              {market.isHot && (
                <span className="flex items-center gap-0.5 text-xs text-gray-text/70">
                  <Flame size={10} className="text-orange-400" /> Hot
                </span>
              )}
              {market.isNew && (
                <span className="flex items-center gap-0.5 text-xs text-gray-text/70">
                  <Sparkles size={10} className="text-indigo-400" /> New
                </span>
              )}
            </div>
            <p className="text-white text-sm font-medium leading-snug">{market.title}</p>
          </div>
        </div>

        {/* Probability bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-neon-green font-bold text-sm">{market.yesPrice}%</span>
            <span className="text-gray-text text-xs">chance YES</span>
            <span className="text-gray-text font-medium text-sm">{noPrice}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#27272A' }}>
            <div
              className="h-full rounded-full bg-neon-green"
              style={{ width: `${market.yesPrice}%`, opacity: 0.7 }}
            />
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs text-gray-text">
            <span>{fmt(market.volume)}</span>
            <span>·</span>
            <span>Ends {market.endsAt}</span>
          </div>
          <div
            className="flex items-center gap-0.5 text-xs font-medium"
            style={{
              color: market.change24h > 0 ? '#22C55E' : market.change24h < 0 ? '#EF4444' : '#71717A',
            }}
          >
            {market.change24h > 0 ? <TrendingUp size={10} /> : market.change24h < 0 ? <TrendingDown size={10} /> : null}
            {market.change24h !== 0 ? `${market.change24h > 0 ? '+' : ''}${market.change24h}%` : 'Flat'}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onTrade(market, 'YES')}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: 'rgba(34,197,94,0.08)',
              color: '#22C55E',
              border: '1px solid rgba(34,197,94,0.15)',
            }}
          >
            Yes · {market.yesPrice}¢
          </button>
          <button
            onClick={() => onTrade(market, 'NO')}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: 'rgba(239,68,68,0.08)',
              color: '#EF4444',
              border: '1px solid rgba(239,68,68,0.15)',
            }}
          >
            No · {noPrice}¢
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Featured card ────────────────────────────────────────────────────────────

function FeaturedCard({ market, onTrade }: { market: Market; onTrade: (m: Market, side: 'YES' | 'NO') => void }) {
  const dotColor = CATEGORY_DOT[market.category];
  const noPrice = 100 - market.yesPrice;

  return (
    <div
      className="rounded-2xl p-4 mb-5"
      style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{market.icon}</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: dotColor }} />
          <span className="text-xs text-gray-text">{market.category}</span>
          {market.isHot && <span className="text-xs text-gray-text/60">· Trending</span>}
        </div>
      </div>

      <p className="text-white font-semibold text-base leading-snug mb-4">{market.title}</p>

      <div className="flex items-end gap-3 mb-3">
        <div>
          <div className="text-neon-green font-bold text-3xl leading-none">{market.yesPrice}%</div>
          <div className="text-gray-text text-xs mt-1">chance YES</div>
        </div>
        <div className="flex-1 pb-1.5">
          <div className="h-2 rounded-full overflow-hidden" style={{ background: '#27272A' }}>
            <div
              className="h-full rounded-full bg-neon-green"
              style={{ width: `${market.yesPrice}%`, opacity: 0.7 }}
            />
          </div>
        </div>
        <div className="text-right">
          <div className="text-danger font-bold text-xl leading-none">{noPrice}%</div>
          <div className="text-gray-text text-xs mt-1">NO</div>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-text mb-4">
        <span>{fmt(market.volume)} vol</span>
        <span>·</span>
        <span>Closes {market.endsAt}</span>
        <span>·</span>
        <span
          className="flex items-center gap-0.5 font-medium"
          style={{ color: market.change24h > 0 ? '#22C55E' : '#EF4444' }}
        >
          {market.change24h > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {market.change24h > 0 ? '+' : ''}{market.change24h}% today
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onTrade(market, 'YES')}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium"
          style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}
        >
          Buy Yes · {market.yesPrice}¢
        </button>
        <button
          onClick={() => onTrade(market, 'NO')}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium"
          style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.18)' }}
        >
          Buy No · {noPrice}¢
        </button>
      </div>
    </div>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function Markets() {
  const [filter, setFilter] = useState<Filter>('All');
  const [query, setQuery] = useState('');
  const [tradeModal, setTradeModal] = useState<{ market: Market; side: 'YES' | 'NO' } | null>(null);

  const featured = MARKETS.find(m => m.isHot);
  const totalVolume = MARKETS.reduce((s, m) => s + m.volume, 0);

  const visible = MARKETS.filter(m => {
    const matchCat = filter === 'All' || m.category === filter;
    const matchQ = m.title.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ && m.id !== featured?.id;
  });

  return (
    <div className="flex flex-col h-full bg-app pt-14">
      {/* Header */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-white">Markets</h1>
            <p className="text-gray-text text-xs mt-0.5">{fmt(totalVolume)} total volume · {MARKETS.length} open</p>
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green inline-block" />
            <span className="text-white/60 text-xs">Live</span>
          </div>
        </div>

        {/* Search */}
        <div
          className="flex items-center gap-2.5 rounded-xl px-4 py-3 mb-3"
          style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <Search size={14} color="#71717A" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search markets..."
            className="flex-1 bg-transparent text-white placeholder-gray-text text-sm outline-none"
          />
        </div>

        {/* Category pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => {
            const active = filter === cat;
            const dotColor = cat !== 'All' ? CATEGORY_DOT[cat] : undefined;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={
                  active
                    ? { background: 'rgba(255,255,255,0.1)', color: '#F4F4F5', border: '1px solid rgba(255,255,255,0.15)' }
                    : { background: 'rgba(255,255,255,0.04)', color: '#71717A', border: '1px solid rgba(255,255,255,0.06)' }
                }
              >
                {dotColor && (
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dotColor }} />
                )}
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 pb-28">
        {filter === 'All' && !query && featured && (
          <>
            <p className="text-xs font-medium text-gray-text uppercase tracking-wider mb-3">Featured</p>
            <FeaturedCard market={featured} onTrade={(m, s) => setTradeModal({ market: m, side: s })} />
            <p className="text-xs font-medium text-gray-text uppercase tracking-wider mb-3">All Markets</p>
          </>
        )}

        <AnimatePresence mode="popLayout">
          {visible.map(m => (
            <MarketCard key={m.id} market={m} onTrade={(market, side) => setTradeModal({ market, side })} />
          ))}
        </AnimatePresence>

        {visible.length === 0 && (
          <div className="text-center py-16 text-gray-text">
            <p className="text-sm">No markets found</p>
          </div>
        )}

        <p className="text-center text-gray-text/40 text-xs mt-4 px-4 pb-2 leading-relaxed">
          Prediction markets operate under sweepstakes rules. See terms for eligible states.
        </p>
      </div>

      <AnimatePresence>
        {tradeModal && (
          <TradeModal
            market={tradeModal.market}
            side={tradeModal.side}
            onClose={() => setTradeModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
