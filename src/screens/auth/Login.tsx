import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ChevronLeft } from 'lucide-react';
import { useApp } from '../../store/AppContext';

export default function Login() {
  const { navigate, goBack } = useApp();
  const [email, setEmail] = useState('');
  const [focused, setFocused] = useState(false);

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="flex flex-col h-full bg-app px-6 pt-16">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col flex-1"
      >
        {/* Back */}
        <button onClick={goBack} className="mb-8 self-start flex items-center gap-1 text-gray-text">
          <ChevronLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-black text-white mb-2">Enter your email</h2>
          <p className="text-gray-text text-sm">We'll send you a code to sign in or create your account.</p>
        </div>

        {/* Email input */}
        <div
          className="flex items-center gap-3 rounded-2xl px-4 py-4 transition-all"
          style={{
            background: '#111118',
            border: `1px solid ${focused ? '#22C55E' : 'rgba(255,255,255,0.08)'}`,
            boxShadow: focused ? '0 0 0 3px rgba(34,197,94,0.06)' : 'none',
          }}
        >
          <Mail size={18} color={focused ? '#22C55E' : '#6B6B80'} />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="you@example.com"
            autoFocus
            className="flex-1 bg-transparent text-white placeholder-gray-text text-base outline-none"
          />
        </div>

        {/* Continue */}
        <div className="mt-auto pb-8">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('otp', 'forward')}
            disabled={!valid}
            className="w-full py-4 rounded-2xl font-bold text-base transition-all"
            style={{
              background: valid ? '#22C55E' : '#1a1a24',
              color: valid ? '#000' : '#6B6B80',
              boxShadow: valid ? '0 8px 30px rgba(34,197,94,0.15)' : 'none',
            }}
          >
            Continue
          </motion.button>
          <p className="text-center text-gray-text text-xs mt-4">
            By continuing you agree to our Terms of Service
          </p>
        </div>
      </motion.div>
    </div>
  );
}
