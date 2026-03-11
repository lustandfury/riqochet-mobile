import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useApp } from '../../store/AppContext';

const CODE = ['4', '2', '8', '1', '9', '3'];

export default function OTP() {
  const { navigate, goBack } = useApp();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [filled, setFilled] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-fill simulation after 1.5s
  useEffect(() => {
    const t = setTimeout(() => {
      setDigits(CODE);
      setFilled(true);
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  // Auto verify after fill
  useEffect(() => {
    if (filled) {
      const t = setTimeout(() => {
        setVerifying(true);
        setTimeout(() => navigate('home', 'auth'), 900);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [filled]);

  const handleInput = (idx: number, val: string) => {
    if (!val.match(/^\d?$/)) return;
    const next = [...digits];
    next[idx] = val;
    setDigits(next);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
    if (next.every(d => d)) setFilled(true);
  };

  return (
    <div className="flex flex-col h-full bg-app px-6 pt-16">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col flex-1"
      >
        <button onClick={goBack} className="mb-8 self-start flex items-center gap-1 text-gray-text">
          <ChevronLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        <div className="mb-10">
          <div className="text-4xl mb-4">📬</div>
          <h2 className="text-3xl font-black text-white mb-2">Check your email</h2>
          <p className="text-gray-text">
            We sent a 6-digit code to{' '}
            <span className="text-white font-medium">alex@example.com</span>
          </p>
        </div>

        {/* OTP boxes */}
        <div className="flex gap-2.5 mb-8">
          {digits.map((d, i) => (
            <motion.div
              key={i}
              animate={d ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              <input
                ref={el => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleInput(i, e.target.value)}
                className="w-full aspect-square rounded-2xl text-center text-2xl font-black text-white outline-none transition-all"
                style={{
                  background: d ? 'rgba(34,197,94,0.07)' : '#111118',
                  border: `2px solid ${d ? '#22C55E' : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: d ? '0 0 16px rgba(34,197,94,0.08)' : 'none',
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Verify button */}
        <motion.button
          onClick={() => {
            setVerifying(true);
            setTimeout(() => navigate('home', 'auth'), 900);
          }}
          disabled={verifying}
          className="w-full py-4 rounded-2xl font-bold text-base text-black mb-4"
          style={{
            background: filled
              ? 'linear-gradient(135deg, #22C55E 0%, #1A9E50 100%)'
              : '#22223A',
            color: filled ? '#000' : '#6B6B80',
            boxShadow: filled ? '0 8px 30px rgba(34,197,94,0.1)' : 'none',
          }}
          animate={verifying ? { opacity: [1, 0.6, 1] } : {}}
          transition={verifying ? { repeat: Infinity, duration: 0.6 } : {}}
        >
          {verifying ? 'Verifying...' : 'Verify Code'}
        </motion.button>

        <p className="text-center text-gray-text text-sm">
          Didn't receive it?{' '}
          <button className="font-semibold" style={{ color: '#22C55E' }}>
            Resend code
          </button>
        </p>
      </motion.div>
    </div>
  );
}
