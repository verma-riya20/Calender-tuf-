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
      className="border-t px-4 pb-4 pt-2"
      style={{ borderColor: 'rgba(255,255,255,0.06)' }}
    >
      <div
        className="text-[9px] tracking-[0.2em] uppercase mb-2 md:mb-1"
        style={{ color: 'rgba(240,236,228,0.3)', fontFamily: 'var(--font-body)' }}
      >
        Jump to month
      </div>

      <div className="md:hidden -mx-1 px-1 overflow-x-auto custom-scrollbar">
        <div className="flex gap-1.5 min-w-max pb-1">
          {themes.map((t) => (
            <button
              key={t.month}
              onClick={() => onSelect(t.month)}
              className={clsx(
                'text-[10px] tracking-wide uppercase px-2.5 py-1 rounded-full border transition-all duration-200 whitespace-nowrap',
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
      </div>

      <div className="hidden md:flex md:flex-wrap gap-1.5">
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
    </div>
  );
}
