import { format, differenceInCalendarDays } from 'date-fns';
import type { DateRange, NoteEntry, NoteFilter } from '@/types';
import { HOLIDAYS } from '@/lib/constants';

export function getSelectionStatus(range: DateRange): string {
  if (range.start && range.end) {
    const start = format(range.start, 'MMM d, yyyy');
    const end = format(range.end, 'MMM d, yyyy');
    const dayCount = Math.abs(differenceInCalendarDays(range.end, range.start)) + 1;
    return `Selected ${start} to ${end}, ${dayCount} day range.`;
  }

  if (range.start) {
    return `Start date selected: ${format(range.start, 'MMM d, yyyy')}. Choose an end date.`;
  }

  return 'No date range selected.';
}

export function getMonthHolidays(date: Date) {
  const month = date.getMonth() + 1;

  return Object.entries(HOLIDAYS)
    .map(([key, holiday]) => {
      const [keyMonth, day] = key.split('-');
      return {
        key,
        month: Number(keyMonth),
        day: Number(day),
        name: holiday.name,
        type: holiday.type,
      };
    })
    .filter((holiday) => holiday.month === month)
    .sort((a, b) => a.day - b.day);
}

export function applyFilter(notes: NoteEntry[], filter: NoteFilter) {
  const sorted = [...notes].sort((a, b) => {
    if (a.pinned !== b.pinned) return Number(b.pinned) - Number(a.pinned);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  switch (filter) {
    case 'pinned':
      return sorted.filter((note) => note.pinned);
    case 'tagged':
      return sorted.filter((note) => note.tags.length > 0);
    case 'untagged':
      return sorted.filter((note) => note.tags.length === 0);
    default:
      return sorted;
  }
}
