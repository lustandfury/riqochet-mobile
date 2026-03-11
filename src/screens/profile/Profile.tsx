import { ChevronRight, Trophy, Target, TrendingUp, Settings, HelpCircle, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../store/AppContext';
import { ME, TOURNAMENTS } from '../../data/mockData';

const HISTORY = [
  { name: 'South Beach Pro-Am', date: 'Mar 9', result: 'QF Exit', place: '6th', color: '#6B6B80' },
  { name: 'Coconut Grove Invitational', date: 'Feb 22', result: 'Runner-up', place: '2nd', color: '#F59E0B' },
  { name: 'Miami Winter Open', date: 'Jan 18', result: 'Champion', place: '1st', color: '#22C55E' },
  { name: 'South Florida Pro-Am', date: 'Dec 14', result: 'Semifinalist', place: '3rd', color: '#818CF8' },
];

const MENU = [
  { icon: Settings, label: 'Account Settings' },
  { icon: Target, label: 'Skill Assessment' },
  { icon: HelpCircle, label: 'Help & Support' },
  { icon: LogOut, label: 'Sign Out', danger: true },
];

export default function Profile() {
  const winRate = Math.round((ME.wins / (ME.wins + ME.losses)) * 100);

  return (
    <div className="flex flex-col h-full bg-app pt-14 overflow-y-auto pb-28">
      {/* Profile header */}
      <div className="px-5 py-4">
        <div className="flex items-center gap-4 mb-6">
          {/* Avatar */}
          <div
            className="flex items-center justify-center rounded-full text-4xl flex-shrink-0"
            style={{
              width: 72,
              height: 72,
              background: 'linear-gradient(135deg, #0D2E17 0%, #1A1B26 100%)',
              border: '2px solid rgba(34,197,94,0.12)',
              boxShadow: '0 0 20px rgba(34,197,94,0.06)',
            }}
          >
            {ME.flag}
          </div>
          <div>
            <h2 className="text-xl font-black text-white">{ME.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ background: 'rgba(129,140,248,0.1)', color: '#818CF8' }}
              >
                {ME.level.toUpperCase()}
              </span>
              <span className="text-gold font-semibold text-sm">{ME.rating}★</span>
            </div>
            <p className="text-gray-text text-xs mt-1">World Rank: #{ME.ranking}</p>
          </div>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-3 gap-3 mb-6"
        >
          {[
            { label: 'Wins', value: ME.wins, color: '#22C55E', icon: Trophy },
            { label: 'Losses', value: ME.losses, color: '#EF4444', icon: TrendingUp },
            { label: 'Win Rate', value: `${winRate}%`, color: '#F59E0B', icon: Target },
          ].map(({ label, value, color, icon: Icon }) => (
            <div
              key={label}
              className="rounded-2xl p-3.5 text-center"
              style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <Icon size={16} color={color} className="mx-auto mb-1" />
              <div className="font-black text-xl text-white">{value}</div>
              <div className="text-gray-text text-xs">{label}</div>
            </div>
          ))}
        </div>

        {/* Skill bar */}
        <div
          className="rounded-2xl p-4 mb-6"
          style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-semibold text-sm">Skill Level</span>
            <span className="text-gold font-bold">{ME.rating} / 5.0</span>
          </div>
          <div className="h-2 rounded-full mb-2" style={{ background: '#22223A' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(ME.rating / 5) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(to right, #818CF8, #22C55E)' }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-text">
            <span>Beginner</span>
            <span>Pro</span>
          </div>
        </div>

        {/* Tournament history */}
        <div className="mb-6">
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-3">Recent Results</h3>
          <div className="flex flex-col gap-2">
            {HISTORY.map((h, i) => (
              <motion.div
                key={h.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center justify-between p-3.5 rounded-2xl"
                style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div>
                  <div className="text-white text-sm font-semibold">{h.name}</div>
                  <div className="text-gray-text text-xs">{h.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm" style={{ color: h.color }}>{h.place}</div>
                  <div className="text-gray-text text-xs">{h.result}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Menu */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.05)' }}
        >
          {MENU.map(({ icon: Icon, label, danger }, i) => (
            <button
              key={label}
              className="w-full flex items-center justify-between p-4 transition-opacity active:opacity-70"
              style={{
                background: '#111118',
                borderBottom: i < MENU.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} color={danger ? '#EF4444' : '#6B6B80'} />
                <span
                  className="text-sm font-medium"
                  style={{ color: danger ? '#EF4444' : '#F0F0F5' }}
                >
                  {label}
                </span>
              </div>
              {!danger && <ChevronRight size={16} color="#6B6B80" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
