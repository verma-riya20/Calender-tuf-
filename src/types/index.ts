export interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface NoteEntry {
  id: string;
  key: string; // "YYYY-MM" or "YYYY-MM-DD__YYYY-MM-DD"
  label: string; // human-readable label
  text: string;
  createdAt: string;
  color: NoteColor;
  pinned: boolean;
  tags: string[];
}

export type NoteColor = 'default' | 'amber' | 'rose' | 'emerald' | 'sky';

export type NoteFilter = 'all' | 'pinned' | 'tagged' | 'untagged';

export interface MonthTheme {
  month: number; // 0-indexed
  name: string;
  shortName: string;
  mood: string;
  quote: string;
  accent: string;
  accentMuted: string;
  accentText: string;
  bg: string;
  heroImage: string;
  season: string;
}

export type AnimDirection = 'left' | 'right' | null;

export interface HolidayEntry {
  name: string;
  type: 'national' | 'regional' | 'observance';
}

export type HolidayMap = Record<string, HolidayEntry>; // "M-D" key
