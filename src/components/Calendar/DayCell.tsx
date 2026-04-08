'use client';
import { memo } from 'react';
import clsx from 'clsx';
import type { CalendarDay, MonthTheme, HolidayEntry } from '@/types';
import type { DayRangeState } from '@/lib/dateUtils';

interface DayCellProps {
  day: CalendarDay;
  rangeState: DayRangeState;
  holiday: HolidayEntry | null;
  hasNote: boolean;
  theme: MonthTheme;
  colIndex: number; // 0–6 (Mon–Sun)
  onClick: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
  onMouseLeave: () => void;
}

const DayCell = memo(function DayCell({
  day, rangeState, holiday, hasNote, theme, colIndex, onClick, onMouseEnter, onMouseLeave,
}: DayCellProps) {
  const { date, dayOfMonth, isCurrentMonth, isToday } = day;

  const isStart      = rangeState === 'start' || rangeState === 'start-end';
  const isEnd        = rangeState === 'end'   || rangeState === 'start-end';
  const isInRange    = rangeState === 'in-range';
  const isHoverEnd   = rangeState === 'hover-end';
  const isHoverRange = rangeState === 'hover-range';
  const isSelected   = isStart || isEnd;

  // Range bar rounding
  const isRangeSegment = isInRange || isHoverRange;
  const roundLeft  = isRangeSegment && colIndex === 0;
  const roundRight = isRangeSegment && colIndex === 6;

  return (
    <div
      role="button"
      tabIndex={isCurrentMonth ? 0 : -1}
      aria-label={`${dayOfMonth}${holiday ? `, ${holiday.name}` : ''}`}
      aria-pressed={isSelected}
      onClick={() => isCurrentMonth && onClick(date)}
      onMouseEnter={() => onMouseEnter(date)}
      onMouseLeave={onMouseLeave}
      onKeyDown={(e) => e.key === 'Enter' && isCurrentMonth && onClick(date)}
      className={clsx(
        'relative flex items-center justify-center select-none',
        'aspect-square cursor-pointer outline-none',
        'transition-all duration-150',
        'group',
        !isCurrentMonth && 'opacity-[0.18] pointer-events-none',
        isRangeSegment && 'rounded-none',
        roundLeft && 'rounded-l-lg',
        roundRight && 'rounded-r-lg',
        isSelected && 'z-10',
        isCurrentMonth && !isSelected && !isRangeSegment && 'hover:bg-white/[0.07] rounded-lg',
        'focus-visible:ring-2 focus-visible:ring-white/40 rounded-lg',
      )}
      style={{
        background: isRangeSegment
          ? `${theme.accent}1a`
          : isHoverRange
          ? `${theme.accent}12`
          : undefined,
      }}
    >
      {/* Range connection lines for start/end */}
      {isStart && !isEnd && (
        <div
          className="absolute inset-y-1 right-0 left-1/2 -z-[1]"
          style={{ background: `${theme.accent}1a` }}
        />
      )}
      {isEnd && !isStart && (
        <div
          className="absolute inset-y-1 left-0 right-1/2 -z-[1]"
          style={{ background: `${theme.accent}1a` }}
        />
      )}

      {/* Day number */}
      <div
        className={clsx(
          'relative z-10 w-8 h-8 flex items-center justify-center rounded-full text-[13px]',
          'transition-all duration-150',
          isSelected && 'animate-pop font-bold text-white shadow-lg',
          isToday && !isSelected && 'font-semibold ring-1 ring-white/30',
          !isSelected && isCurrentMonth && 'font-normal',
        )}
        style={{
          background: isSelected ? theme.accent : isToday ? 'rgba(255,255,255,0.1)' : undefined,
          color: isSelected
            ? '#fff'
            : isCurrentMonth
            ? day.isWeekend
              ? theme.accentText
              : 'rgba(240,236,228,0.9)'
            : 'rgba(255,255,255,0.15)',
          boxShadow: isSelected ? `0 0 18px ${theme.accent}70` : undefined,
          fontFamily: 'var(--font-body)',
        }}
      >
        {dayOfMonth}

        {/* Pulse ring on selected */}
        {isSelected && (
          <span
            className="absolute inset-0 rounded-full animate-pulse-ring"
            style={{ background: theme.accent, opacity: 0.3 }}
          />
        )}
      </div>

      {/* Holiday dot */}
      {holiday && (
        <span
          className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
          style={{ background: theme.accent, opacity: 0.85 }}
          title={holiday.name}
        />
      )}

      {/* Holiday name tooltip */}
      {holiday && isCurrentMonth && (
        <span
          className="pointer-events-none absolute left-1/2 top-1 z-20 -translate-x-1/2 -translate-y-full rounded-md border px-2 py-1 text-[9px] opacity-0 transition-opacity duration-150 whitespace-nowrap group-hover:opacity-100 group-focus-within:opacity-100"
          style={{
            color: 'rgba(255,255,255,0.92)',
            background: 'rgba(10,10,10,0.88)',
            borderColor: `${theme.accent}66`,
            fontFamily: 'var(--font-body)',
            boxShadow: '0 6px 16px rgba(0,0,0,0.35)',
          }}
        >
          {holiday.name}
        </span>
      )}

      {/* Note indicator dot */}
      {hasNote && !holiday && (
        <span
          className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/40"
        />
      )}
    </div>
  );
});

export { DayCell };
