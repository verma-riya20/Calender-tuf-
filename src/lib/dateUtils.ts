import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isToday, isWeekend,
  isBefore, isAfter, isSameDay, format, addMonths, subMonths,
  differenceInCalendarDays,
} from 'date-fns';
import type { CalendarDay, DateRange } from '@/types';

/**
 * Generate the full grid of calendar days for a given month.
 * Grid starts on Monday (weekStartsOn: 1) to match reference design.
 */
export function buildCalendarGrid(date: Date): CalendarDay[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  return eachDayOfInterval({ start: gridStart, end: gridEnd }).map((d) => ({
    date: d,
    dayOfMonth: d.getDate(),
    isCurrentMonth: isSameMonth(d, date),
    isToday: isToday(d),
    isWeekend: isWeekend(d),
  }));
}

/** Determine the visual state of a day cell relative to the active range. */
export type DayRangeState =
  | 'none'
  | 'start'
  | 'end'
  | 'start-end'   // same-day selection
  | 'in-range'
  | 'hover-end'   // preview while hovering
  | 'hover-range';

export function getDayRangeState(
  day: Date,
  range: DateRange,
  hoverDate: Date | null,
): DayRangeState {
  const { start, end } = range;

  if (start && end) {
    const [s, e] = isBefore(start, end) ? [start, end] : [end, start];
    if (isSameDay(day, s) && isSameDay(day, e)) return 'start-end';
    if (isSameDay(day, s)) return 'start';
    if (isSameDay(day, e)) return 'end';
    if (isAfter(day, s) && isBefore(day, e)) return 'in-range';
    return 'none';
  }

  if (start && !end && hoverDate) {
    const [s, e] = isBefore(start, hoverDate) ? [start, hoverDate] : [hoverDate, start];
    if (isSameDay(day, start)) return 'start';
    if (isSameDay(day, hoverDate)) return 'hover-end';
    if (isAfter(day, s) && isBefore(day, e)) return 'hover-range';
    return 'none';
  }

  if (start && isSameDay(day, start)) return 'start';

  return 'none';
}

/** Format a DateRange into a human-readable label. */
export function formatRangeLabel(range: DateRange): string {
  if (!range.start) return '';
  if (!range.end || isSameDay(range.start, range.end)) {
    return format(range.start, 'MMM d, yyyy');
  }
  const [s, e] = isBefore(range.start, range.end)
    ? [range.start, range.end]
    : [range.end, range.start];
  const days = differenceInCalendarDays(e, s) + 1;
  return `${format(s, 'MMM d')} – ${format(e, 'MMM d, yyyy')} (${days}d)`;
}

/** Build a localStorage key for a note from a range or a month. */
export function buildNoteKey(range: DateRange, fallbackDate: Date): string {
  if (range.start && range.end && !isSameDay(range.start, range.end)) {
    const [s, e] = isBefore(range.start, range.end)
      ? [range.start, range.end]
      : [range.end, range.start];
    return `${format(s, 'yyyy-MM-dd')}__${format(e, 'yyyy-MM-dd')}`;
  }
  if (range.start) return format(range.start, 'yyyy-MM-dd');
  return format(fallbackDate, 'yyyy-MM');
}

/** Human label from a note key */
export function labelFromNoteKey(key: string): string {
  if (key.includes('__')) {
    const [a, b] = key.split('__');
    return `${formatDate(a)} → ${formatDate(b)}`;
  }
  if (key.length === 7) {
    // yyyy-MM
    const [y, m] = key.split('-');
    return `${new Date(Number(y), Number(m) - 1).toLocaleString('default', { month: 'long' })} ${y}`;
  }
  return formatDate(key);
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return format(d, 'MMM d, yyyy');
}

export { addMonths, subMonths, format, isSameDay, isBefore, isAfter };
