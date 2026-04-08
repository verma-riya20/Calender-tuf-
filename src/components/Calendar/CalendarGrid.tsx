'use client';
import { useMemo } from 'react';
import { format } from 'date-fns';
import clsx from 'clsx';
import type { DateRange, MonthTheme } from '@/types';
import { buildCalendarGrid, getDayRangeState } from '@/lib/dateUtils';
import { HOLIDAYS, WEEKDAYS_SHORT, WEEKDAYS_MINI } from '@/lib/constants';
import { DayCell } from './DayCell';

interface CalendarGridProps {
  currentDate: Date;
  range: DateRange;
  hoverDate: Date | null;
  theme: MonthTheme;
  noteKeys: Set<string>;
  animDir: 'left' | 'right' | null;
  focusMode: boolean;
  onDayClick: (date: Date) => void;
  onDayHover: (date: Date) => void;
  onDayLeave: () => void;
}

export function CalendarGrid({
  currentDate, range, hoverDate, theme, noteKeys, animDir, focusMode,
  onDayClick, onDayHover, onDayLeave,
}: CalendarGridProps) {
  const grid = useMemo(() => buildCalendarGrid(currentDate), [currentDate]);
  const rows = useMemo(() => {
    const split: typeof grid[] = [];
    for (let i = 0; i < grid.length; i += 7) {
      split.push(grid.slice(i, i + 7));
    }
    return split;
  }, [grid]);

  const activeRows = useMemo(() => {
    const set = new Set<number>();
    grid.forEach((day, index) => {
      const state = getDayRangeState(day.date, range, hoverDate);
      if (state !== 'none') {
        set.add(Math.floor(index / 7));
      }
    });
    return set;
  }, [grid, range, hoverDate]);

  const shouldDimRows = focusMode && activeRows.size > 0;

  return (
    <div
      className={clsx(
        'calendar-page flex-1 px-4 pb-4 pt-2',
        animDir === 'left'  && 'calendar-page-turn-left',
        animDir === 'right' && 'calendar-page-turn-right',
        !animDir && 'calendar-page-settle',
      )}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS_SHORT.map((d, i) => (
          <div
            key={d}
            className="text-center py-1.5 hidden sm:block"
            style={{
              fontSize: '10px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-body)',
              color: i >= 5 ? theme.accentText : 'rgba(240,236,228,0.35)',
              fontWeight: 500,
            }}
          >
            {d}
          </div>
        ))}
        {WEEKDAYS_MINI.map((d, i) => (
          <div
            key={`mini-${i}`}
            className="text-center py-1.5 sm:hidden"
            style={{
              fontSize: '10px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-body)',
              color: i >= 5 ? theme.accentText : 'rgba(240,236,228,0.35)',
              fontWeight: 500,
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="flex flex-col gap-y-0.5">
        {rows.map((row, rowIndex) => {
          const dimRow = shouldDimRows && !activeRows.has(rowIndex);

          return (
            <div
              key={`row-${rowIndex}`}
              className={clsx('grid grid-cols-7 transition-opacity duration-200', dimRow && 'opacity-30')}
            >
              {row.map((day, colIndex) => {
                const holidayKey = `${day.date.getMonth() + 1}-${day.date.getDate()}`;
                const holiday = HOLIDAYS[holidayKey] ?? null;
                const noteKey = format(day.date, 'yyyy-MM-dd');
                const hasNote = noteKeys.has(noteKey);
                const rangeState = getDayRangeState(day.date, range, hoverDate);

                return (
                  <DayCell
                    key={day.date.toISOString()}
                    day={day}
                    rangeState={rangeState}
                    holiday={holiday}
                    hasNote={hasNote}
                    theme={theme}
                    colIndex={colIndex}
                    onClick={onDayClick}
                    onMouseEnter={onDayHover}
                    onMouseLeave={onDayLeave}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
