'use client';
import { isBefore, isSameDay, format } from 'date-fns';
import type { DateRange, MonthTheme } from '@/types';
import { HOLIDAYS } from '@/lib/constants';

interface RangeInfoProps {
  range: DateRange;
  theme: MonthTheme;
  onReset: () => void;
}

export function RangeInfo({ range, theme, onReset }: RangeInfoProps) {
  const { start, end } = range;

  if (!start) {
    return (
      <div
        className="rounded-xl border p-4"
        style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.025)' }}
      >
        <p
          className="text-[12px] leading-relaxed"
          style={{ color: 'rgba(240,236,228,0.35)', fontFamily: 'var(--font-body)' }}
        >
          Tap any day to start selecting.<br />
          Tap a second day to complete a range.
        </p>
      </div>
    );
  }

  const [s, e] = end && isBefore(end, start) ? [end, start] : [start, end];
  const diffDays = e
    ? Math.round((e.getTime() - s.getTime()) / 86400000) + 1
    : 1;

  const startHoliday = HOLIDAYS[`${s.getMonth() + 1}-${s.getDate()}`];
  const endHoliday   = e ? HOLIDAYS[`${e.getMonth() + 1}-${e.getDate()}`] : null;

  return (
    <div
      className="rounded-xl border p-4 flex flex-col gap-3"
      style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.025)' }}
    >
      {/* Label row */}
      <div className="flex items-center justify-between">
        <span
          className="text-[9px] tracking-[0.2em] uppercase"
          style={{ color: 'rgba(240,236,228,0.3)', fontFamily: 'var(--font-body)' }}
        >
          Selected Range
        </span>
        <button
          onClick={onReset}
          className="text-[10px] px-2 py-0.5 rounded-full border transition-colors duration-150"
          style={{
            color: 'rgba(240,236,228,0.4)',
            borderColor: 'rgba(255,255,255,0.1)',
            fontFamily: 'var(--font-body)',
          }}
        >
          Clear ×
        </button>
      </div>

      {/* Start date */}
      <DateRow
        label="Start"
        date={s}
        holiday={startHoliday?.name}
        accentColor={theme.accent}
        accentText={theme.accentText}
        filled
      />

      {/* End date */}
      {e && !isSameDay(s, e) && (
        <DateRow
          label="End"
          date={e}
          holiday={endHoliday?.name}
          accentColor={theme.accent}
          accentText={theme.accentText}
          filled={false}
        />
      )}

      {/* Days badge */}
      {e && (
        <div
          className="self-start text-[11px] px-3 py-1 rounded-full font-medium"
          style={{
            background: `${theme.accent}22`,
            color: theme.accentText,
            fontFamily: 'var(--font-body)',
          }}
        >
          {diffDays} day{diffDays !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
}

function DateRow({
  label, date, holiday, accentColor, accentText, filled,
}: {
  label: string;
  date: Date;
  holiday?: string;
  accentColor: string;
  accentText: string;
  filled: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{
          background: filled ? accentColor : 'transparent',
          border: filled ? 'none' : `2px solid ${accentColor}`,
          boxShadow: filled ? `0 0 8px ${accentColor}80` : undefined,
        }}
      />
      <div>
        <div
          className="text-[10px]"
          style={{ color: 'rgba(240,236,228,0.3)', fontFamily: 'var(--font-body)' }}
        >
          {label}
        </div>
        <div
          className="text-[14px] leading-tight"
          style={{
            color: 'rgba(240,236,228,0.9)',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
          }}
        >
          {format(date, 'EEEE, MMM d yyyy')}
        </div>
        {holiday && (
          <div
            className="text-[10px] mt-0.5 flex items-center gap-1"
            style={{ color: accentText, opacity: 0.8, fontFamily: 'var(--font-body)' }}
          >
            <span>✦</span> {holiday}
          </div>
        )}
      </div>
    </div>
  );
}
