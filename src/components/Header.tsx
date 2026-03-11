import { ChevronLeft } from 'lucide-react';
import { ReactNode } from 'react';
import { useApp } from '../store/AppContext';

interface HeaderProps {
  title?: string;
  onBack?: () => void;
  right?: ReactNode;
  transparent?: boolean;
  light?: boolean;
}

export default function Header({ title, onBack, right, transparent, light }: HeaderProps) {
  const { goBack } = useApp();
  const handleBack = onBack ?? goBack;

  return (
    <div
      className={`flex items-center justify-between px-4 pt-16 pb-4 ${transparent ? 'absolute top-0 left-0 right-0 z-20' : ''}`}
      style={transparent ? { background: 'transparent' } : undefined}
    >
      <div className="w-10">
        {onBack !== undefined || true ? (
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-9 h-9 rounded-full"
            style={{ background: light ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)' }}
          >
            <ChevronLeft size={20} color={light ? '#fff' : '#F0F0F5'} strokeWidth={2.5} />
          </button>
        ) : null}
      </div>

      {title && (
        <span
          className="font-semibold text-base"
          style={{ color: light ? '#fff' : '#F0F0F5' }}
        >
          {title}
        </span>
      )}

      <div className="w-10 flex justify-end">{right ?? null}</div>
    </div>
  );
}
