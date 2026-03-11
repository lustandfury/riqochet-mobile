/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        app: '#09090E',
        card: '#111116',
        elevated: '#1C1C24',
        'neon-green': '#22C55E',
        gold: '#F59E0B',
        royal: '#818CF8',
        danger: '#EF4444',
        'gray-text': '#71717A',
        'gray-dim': '#27272A',
        court: '#0D2E17',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.8)' },
        },
        'bid-flash': {
          '0%': { backgroundColor: 'rgba(34, 197, 94, 0.1)' },
          '100%': { backgroundColor: 'transparent' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'count-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'pulse-dot': 'pulse-dot 1.5s ease-in-out infinite',
        'bid-flash': 'bid-flash 1s ease-out forwards',
        'slide-down': 'slide-down 0.3s ease-out',
        'count-up': 'count-up 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
