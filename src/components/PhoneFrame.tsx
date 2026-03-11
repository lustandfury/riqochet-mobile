import { ReactNode } from 'react';

export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      {/* Phone bezel */}
      <div
        className="relative flex-shrink-0"
        style={{
          width: 390,
          height: 844,
          background: '#1C1C1E',
          borderRadius: 50,
          boxShadow:
            '0 0 0 2px #3A3A3C, 0 30px 80px rgba(0,0,0,0.7), 0 0 120px rgba(0,230,118,0.04)',
          padding: '12px',
        }}
      >
        {/* Screen area */}
        <div
          className="relative w-full h-full overflow-hidden bg-app"
          style={{ borderRadius: 40 }}
        >
          {/* Notch */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 z-50"
            style={{
              width: 126,
              height: 34,
              background: '#1C1C1E',
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            }}
          >
            {/* Camera dot */}
            <div
              className="absolute right-6 top-1/2 -translate-y-1/2"
              style={{ width: 12, height: 12, background: '#2A2A2C', borderRadius: '50%' }}
            />
          </div>

          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 h-14 flex items-end justify-between px-8 pb-2 z-40 pointer-events-none">
            <span className="text-white text-xs font-semibold">9:41</span>
            <div className="flex items-center gap-1.5">
              {/* Signal */}
              <div className="flex items-end gap-px">
                {[3, 5, 7, 9].map((h, i) => (
                  <div key={i} className="w-1 bg-white rounded-sm" style={{ height: h }} />
                ))}
              </div>
              {/* WiFi */}
              <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
                <path d="M8 9.5a1 1 0 110 2 1 1 0 010-2zm0-3.5a5 5 0 013.9 1.87l-1.18 1.18A3.33 3.33 0 008 8a3.33 3.33 0 00-2.72 1.05L4.1 7.87A5 5 0 018 6zm0-3.5a8.33 8.33 0 016.3 2.87L13.12 6.55A6.67 6.67 0 008 4.17a6.67 6.67 0 00-5.12 2.38L1.7 5.37A8.33 8.33 0 018 2.5z" />
              </svg>
              {/* Battery */}
              <div className="flex items-center">
                <div
                  className="border border-white rounded-sm"
                  style={{ width: 22, height: 11, padding: 1.5 }}
                >
                  <div className="w-full h-full bg-white rounded-sm" style={{ width: '80%' }} />
                </div>
                <div className="bg-white rounded-sm ml-0.5" style={{ width: 2, height: 5 }} />
              </div>
            </div>
          </div>

          {/* App content */}
          <div className="absolute inset-0 overflow-hidden">{children}</div>

          {/* Home bar */}
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50 rounded-full bg-white/30"
            style={{ width: 134, height: 5 }}
          />
        </div>
      </div>

      {/* Side label */}
      <div
        className="hidden md:block ml-8 text-white/20 text-sm font-medium"
        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
      >
        RIQOCHET PROTOTYPE · INVESTOR DEMO
      </div>
    </div>
  );
}
