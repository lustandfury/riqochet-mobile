import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useApp } from '../../store/AppContext';
import RingsBackground from '../../components/RingsBackground';

const HEADLINE = 'Where every point matters.';

export default function Welcome() {
  const { navigate } = useApp();
  const [typed, setTyped] = useState('');
  const playerRef = useRef<HTMLImageElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  // Typewriter
  useEffect(() => {
    let i = 0;
    const delay = setTimeout(() => {
      const id = setInterval(() => {
        i++;
        setTyped(HEADLINE.slice(0, i));
        if (i >= HEADLINE.length) clearInterval(id);
      }, 18);
      return () => clearInterval(id);
    }, 200);
    return () => clearTimeout(delay);
  }, []);

  // Player drift + buttons fade — GSAP
  useEffect(() => {
    const player = playerRef.current;
    const buttons = buttonsRef.current;
    if (!player || !buttons) return;

    const ctx = gsap.context(() => {
      // Player: fade in quickly, drift left slowly with heavy deceleration
      gsap.fromTo(player,
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: 'power2.out', delay: 0.2 }
      );
      gsap.fromTo(player,
        { x: 120 },
        { x: 0, duration: 6, ease: 'expo.out', delay: 0 }
      );

      // Buttons: fade up
      gsap.fromTo(buttons,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 1.8 }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex flex-col h-full bg-black">
      <div className="relative flex-1">

        <RingsBackground />

        {/* Player image */}
        <img
          ref={playerRef}
          src="/player.png"
          alt=""
          className="absolute z-10 pointer-events-none"
          style={{ bottom: '12%', right: '0%', height: '78%', width: 'auto', objectFit: 'contain', opacity: 0 }}
        />

        {/* Bottom fade */}
        <div
          className="absolute inset-0 z-20"
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 10%, rgba(0,0,0,0.45) 50%, #000000 83%)' }}
        />

        {/* Hero content */}
        <div className="absolute inset-0 z-30 flex flex-col justify-end px-6 pb-10">

          {/* Brand */}
          <motion.div
            className="mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-white font-bold text-lg tracking-tight" style={{ fontFamily: 'Lexend, sans-serif' }}>
              Riqochet
            </span>
          </motion.div>

          {/* Headline — typewriter */}
          <h1
            className="text-white font-bold leading-[1.05] tracking-tight mb-8 min-h-[108px]"
            style={{ fontSize: 44, fontFamily: 'Lexend, sans-serif' }}
          >
            {typed}
            {typed.length < HEADLINE.length && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.25 }}
                className="inline-block w-[3px] h-[44px] bg-white ml-1 align-middle"
              />
            )}
          </h1>

          {/* Buttons */}
          <div ref={buttonsRef} className="flex flex-col gap-3" style={{ opacity: 0 }}>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('login', 'forward')}
              className="w-full h-14 rounded-xl font-bold text-lg text-black"
              style={{ background: '#93E01F', fontFamily: 'Lexend, sans-serif' }}
            >
              Sign up
            </motion.button>
            <button
              onClick={() => navigate('login', 'forward')}
              className="w-full text-center text-white/60 text-sm font-medium py-2"
              style={{ fontFamily: 'Lexend, sans-serif' }}
            >
              I have an account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
