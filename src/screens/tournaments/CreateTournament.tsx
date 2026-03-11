import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, MapPin, Calendar, Users, DollarSign, Trophy, Check } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { CreateTournamentForm } from '../../types';

const FORMATS = ['Knockout', 'Round Robin', 'Hybrid'];
const TEAM_COUNTS = [4, 8, 16, 32];

function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all"
            style={
              i + 1 < step
                ? { background: '#22C55E', color: '#000' }
                : i + 1 === step
                ? { background: 'rgba(34,197,94,0.08)', color: '#22C55E', border: '1.5px solid #22C55E' }
                : { background: '#22223A', color: '#6B6B80' }
            }
          >
            {i + 1 < step ? <Check size={12} /> : i + 1}
          </div>
          {i < total - 1 && (
            <div
              className="flex-1 h-0.5 w-8 rounded-full"
              style={{ background: i + 1 < step ? '#22C55E' : '#22223A' }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <label className="block text-xs font-semibold text-gray-text uppercase tracking-wider mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, icon: Icon }: any) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl px-4 py-4"
      style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {Icon && <Icon size={16} color="#6B6B80" />}
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-white placeholder-gray-text text-sm outline-none"
      />
    </div>
  );
}

export default function CreateTournament() {
  const { navigate, goBack } = useApp();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CreateTournamentForm>({
    name: '',
    location: '',
    date: '',
    format: 'Knockout',
    teamCount: 8,
    entryFee: 250,
    hasCalcutta: true,
    auctionDate: '',
    startingBid: 500,
    buyIn: 100,
  });

  const update = (key: keyof CreateTournamentForm, val: any) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const estimatedRevenue = form.teamCount * form.entryFee;
  const calcuttaPool = form.teamCount * form.buyIn;

  return (
    <div className="flex flex-col h-full bg-app pt-14 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <button onClick={step === 1 ? goBack : () => setStep(s => s - 1)} className="flex items-center gap-1 text-gray-text">
          <ChevronLeft size={18} />
          <span className="text-sm">{step === 1 ? 'Cancel' : 'Back'}</span>
        </button>
        <span className="text-white font-semibold text-sm">Create Tournament</span>
        <div className="w-16" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-32">
        <StepIndicator step={step} total={3} />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-2xl font-black text-white mb-1">Tournament Details</h2>
              <p className="text-gray-text text-sm mb-6">Set up the basics for your tournament</p>

              <FormField label="Tournament Name">
                <TextInput
                  value={form.name}
                  onChange={(v: string) => update('name', v)}
                  placeholder="e.g. Riqochet Spring Classic"
                />
              </FormField>

              <FormField label="Location">
                <TextInput
                  value={form.location}
                  onChange={(v: string) => update('location', v)}
                  placeholder="Venue name or address"
                  icon={MapPin}
                />
              </FormField>

              <FormField label="Date & Time">
                <TextInput
                  value={form.date}
                  onChange={(v: string) => update('date', v)}
                  placeholder="e.g. April 12, 2025 · 9:00 AM"
                  icon={Calendar}
                />
              </FormField>

              <FormField label="Format">
                <div className="grid grid-cols-3 gap-2">
                  {FORMATS.map(f => (
                    <button
                      key={f}
                      onClick={() => update('format', f)}
                      className="py-3 rounded-xl text-sm font-semibold transition-all"
                      style={
                        form.format === f
                          ? { background: 'rgba(34,197,94,0.08)', color: '#22C55E', border: '1.5px solid #22C55E' }
                          : { background: '#111118', color: '#6B6B80', border: '1px solid rgba(255,255,255,0.07)' }
                      }
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </FormField>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-2xl font-black text-white mb-1">Teams & Fees</h2>
              <p className="text-gray-text text-sm mb-6">Configure participation and prize structure</p>

              <FormField label="Number of Teams">
                <div className="grid grid-cols-4 gap-2">
                  {TEAM_COUNTS.map(n => (
                    <button
                      key={n}
                      onClick={() => update('teamCount', n)}
                      className="py-3.5 rounded-xl text-base font-black transition-all"
                      style={
                        form.teamCount === n
                          ? { background: 'rgba(34,197,94,0.08)', color: '#22C55E', border: '1.5px solid #22C55E' }
                          : { background: '#111118', color: '#6B6B80', border: '1px solid rgba(255,255,255,0.07)' }
                      }
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </FormField>

              <FormField label={`Entry Fee · $${form.entryFee} per team`}>
                <input
                  type="range"
                  min={0}
                  max={1000}
                  step={25}
                  value={form.entryFee}
                  onChange={e => update('entryFee', Number(e.target.value))}
                  className="w-full mt-1"
                />
                <div className="flex justify-between text-gray-text text-xs mt-1">
                  <span>$0</span>
                  <span>$1,000</span>
                </div>
              </FormField>

              {/* Revenue preview */}
              <div
                className="rounded-2xl p-4 mt-2"
                style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <span className="text-gray-text text-xs uppercase tracking-wider">Revenue Estimate</span>
                <div className="mt-2 flex items-center gap-4">
                  <div>
                    <div className="text-2xl font-black text-white">${estimatedRevenue.toLocaleString()}</div>
                    <div className="text-gray-text text-xs">Total entry fees</div>
                  </div>
                  <div className="w-px h-10 bg-gray-dim" />
                  <div>
                    <div className="text-lg font-black text-gold">${Math.round(estimatedRevenue * 0.1).toLocaleString()}</div>
                    <div className="text-gray-text text-xs">Platform fee (10%)</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-2xl font-black text-white mb-1">Calcutta Auction</h2>
              <p className="text-gray-text text-sm mb-6">Enable social betting on your tournament</p>

              {/* Toggle */}
              <div
                className="flex items-center justify-between p-4 rounded-2xl mb-5"
                style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="flex items-center gap-3">
                  <Trophy size={20} color="#F59E0B" />
                  <div>
                    <div className="text-white font-semibold text-sm">Enable Calcutta Auction</div>
                    <div className="text-gray-text text-xs">Players bid on pro-am teams</div>
                  </div>
                </div>
                <button
                  onClick={() => update('hasCalcutta', !form.hasCalcutta)}
                  className="relative w-12 h-6 rounded-full transition-colors"
                  style={{ background: form.hasCalcutta ? '#22C55E' : '#22223A' }}
                >
                  <div
                    className="absolute top-0.5 bottom-0.5 w-5 rounded-full bg-white transition-transform"
                    style={{ transform: form.hasCalcutta ? 'translateX(26px)' : 'translateX(2px)' }}
                  />
                </button>
              </div>

              <AnimatePresence>
                {form.hasCalcutta && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <FormField label="Auction Date">
                      <TextInput
                        value={form.auctionDate}
                        onChange={(v: string) => update('auctionDate', v)}
                        placeholder="e.g. April 11, 2025 · 7:00 PM"
                        icon={Calendar}
                      />
                    </FormField>

                    <FormField label={`Starting Bid · $${form.startingBid}`}>
                      <input
                        type="range"
                        min={100}
                        max={2000}
                        step={100}
                        value={form.startingBid}
                        onChange={e => update('startingBid', Number(e.target.value))}
                        className="w-full mt-1"
                      />
                    </FormField>

                    <FormField label={`Buy-In per Team · $${form.buyIn}`}>
                      <input
                        type="range"
                        min={0}
                        max={500}
                        step={25}
                        value={form.buyIn}
                        onChange={e => update('buyIn', Number(e.target.value))}
                        className="w-full mt-1"
                      />
                    </FormField>

                    {/* Calcutta summary */}
                    <div
                      className="rounded-2xl p-4 mt-1"
                      style={{ background: 'linear-gradient(135deg, #1A1000 0%, #111118 100%)', border: '1px solid rgba(245,158,11,0.08)' }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Trophy size={14} color="#F59E0B" />
                        <span className="text-gold text-xs font-semibold uppercase tracking-wider">Calcutta Summary</span>
                      </div>
                      {[
                        { label: 'Teams in auction', value: form.teamCount },
                        { label: 'Minimum pool (buy-ins)', value: `$${calcuttaPool.toLocaleString()}` },
                        { label: 'Starting bids from', value: `$${form.startingBid.toLocaleString()}` },
                        { label: 'Pro payout (50%)', value: `$${Math.round(calcuttaPool * 0.5).toLocaleString()}+` },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex items-center justify-between py-1.5">
                          <span className="text-gray-text text-xs">{label}</span>
                          <span className="text-white text-xs font-semibold">{value}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div
        className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4"
        style={{ background: 'linear-gradient(to top, #08090E 70%, transparent)' }}
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            if (step < 3) setStep(s => s + 1);
            else navigate('lobby', 'forward');
          }}
          className="w-full py-4 rounded-2xl font-bold text-base text-black"
          style={{
            background: 'linear-gradient(135deg, #22C55E 0%, #1A9E50 100%)',
            boxShadow: '0 8px 24px rgba(34,197,94,0.1)',
          }}
        >
          {step < 3 ? 'Continue' : 'Create Tournament'}
        </motion.button>
      </div>
    </div>
  );
}
