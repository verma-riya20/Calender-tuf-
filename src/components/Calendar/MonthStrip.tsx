'use client';
import clsx from 'clsx';
import type { MonthTheme } from '@/types';

interface MonthStripProps {
  currentMonth: number;
  themes: MonthTheme[];
  onSelect: (month: number) => void;
}

export function MonthStrip({ currentMonth, themes, onSelect }: MonthStripProps) {
  return (
    <div
      className="flex flex-wrap gap-1.5 px-4 pb-4 pt-1 border-t"
      style={{ borderColor: 'rgba(255,255,255,0.06)' }}
    >
      {themes.map((t) => (
        <button
          key={t.month}
          onClick={() => onSelect(t.month)}
          className={clsx(
            'text-[10px] tracking-wide uppercase px-2.5 py-1 rounded-full border transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40',
          )}
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: t.month === currentMonth ? 600 : 400,
            background: t.month === currentMonth ? t.accent : 'transparent',
            borderColor: t.month === currentMonth ? t.accent : 'rgba(255,255,255,0.1)',
            color: t.month === currentMonth ? '#fff' : 'rgba(255,255,255,0.4)',
            letterSpacing: '0.06em',
          }}
        >
          {t.shortName}
        </button>
      ))}
    </div>
  );
}
