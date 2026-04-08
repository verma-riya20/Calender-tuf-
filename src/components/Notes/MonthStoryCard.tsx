'use client';
import type { MonthTheme, NoteEntry } from '@/types';

interface MonthStoryCardProps {
  currentDate: Date;
  theme: MonthTheme;
  monthNotes: NoteEntry[];
  monthHolidayCount: number;
  pinnedCount: number;
}

export function MonthStoryCard({
  currentDate,
  theme,
  monthNotes,
  monthHolidayCount,
  pinnedCount,
}: MonthStoryCardProps) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        borderColor: `${theme.accent}26`,
        background: `linear-gradient(180deg, ${theme.accent}10 0%, rgba(255,255,255,0.02) 100%)`,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div
            className="text-[9px] tracking-[0.2em] uppercase mb-1"
            style={{ color: 'rgba(240,236,228,0.32)', fontFamily: 'var(--font-body)' }}
          >
            Month Story
          </div>
          <p
            key={`${currentDate.getFullYear()}-${currentDate.getMonth()}`}
            className="month-quote-animate mt-1 text-[12px] leading-relaxed"
            style={{
              color: 'rgba(240,236,228,0.72)',
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              letterSpacing: '0.01em',
            }}
          >
            "{theme.quote}"
          </p>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div
            className="mood-orb relative h-[88px] w-[88px] rounded-full border flex items-center justify-center text-center px-2"
            style={{
              borderColor: `${theme.accent}4a`,
              background: `
                radial-gradient(circle at 35% 30%, ${theme.accentText}28 0%, ${theme.accent}2a 45%, ${theme.accent}12 100%),
                rgba(10,14,12,0.65)
              `,
              boxShadow: `
                inset 0 0 0 1px rgba(255,255,255,0.05),
                inset 0 -10px 22px rgba(0,0,0,0.25),
                0 8px 22px ${theme.accent}22
              `,
            }}
          >
            <span
              className="leading-tight"
              style={{
                color: theme.accentText,
                fontSize: '11px',
                fontWeight: 600,
                fontFamily: 'var(--font-body)',
              }}
            >
              {theme.mood}
            </span>
          </div>
          <div
            className="text-[9px] uppercase tracking-[0.18em]"
            style={{ color: 'rgba(240,236,228,0.45)', fontFamily: 'var(--font-body)' }}
          >
            {theme.season} mood
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <StoryStat label="Notes" value={String(monthNotes.length)} accent={theme.accentText} />
        <StoryStat label="Holidays" value={String(monthHolidayCount)} accent={theme.accentText} />
        <StoryStat label="Pinned" value={String(pinnedCount)} accent={theme.accentText} />
      </div>
    </div>
  );
}

function StoryStat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-lg border px-2 py-2 text-center" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
      <div style={{ color: accent, fontFamily: 'var(--font-body)', fontWeight: 700 }} className="text-[13px]">
        {value}
      </div>
      <div style={{ color: 'rgba(240,236,228,0.35)', fontFamily: 'var(--font-body)' }} className="text-[9px] uppercase tracking-[0.18em]">
        {label}
      </div>
    </div>
  );
}
