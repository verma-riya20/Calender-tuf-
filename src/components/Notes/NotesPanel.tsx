'use client';
import { useMemo, useState } from 'react';
import { format, differenceInCalendarDays } from 'date-fns';
import clsx from 'clsx';
import type { DateRange, MonthTheme, NoteEntry, NoteColor, NoteFilter } from '@/types';
import { HOLIDAYS } from '@/lib/constants';
import { RangeInfo } from './RangeInfo';
import { NoteEditor } from './NoteEditor';
import { NotesList } from './NotesList';

interface NotesPanelProps {
  range: DateRange;
  currentDate: Date;
  theme: MonthTheme;
  activeKey: string;
  activeNote: NoteEntry | null;
  monthNotes: NoteEntry[];
  saveError: string | null;
  onReset: () => void;
  onSave: (payload: {
    text: string;
    color: NoteColor;
    pinned: boolean;
    tags: string[];
  }) => boolean;
  onDelete: (id: string) => void;
  onClearSaveError: () => void;
  focusMode: boolean;
  onToggleFocusMode: () => void;
  onHolidayJump: (day: number) => void;
}

export function NotesPanel({
  range,
  currentDate,
  theme,
  activeKey,
  activeNote,
  monthNotes,
  saveError,
  onReset,
  onSave,
  onDelete,
  onClearSaveError,
  focusMode,
  onToggleFocusMode,
  onHolidayJump,
}: NotesPanelProps) {
  const [filter, setFilter] = useState<NoteFilter>('all');
  const selectionStatus = getSelectionStatus(range);
  const filteredNotes = useMemo(() => applyFilter(monthNotes, filter), [monthNotes, filter]);
  const monthHolidays = useMemo(() => getMonthHolidays(currentDate), [currentDate]);
  const counts = useMemo(() => ({
    all: monthNotes.length,
    pinned: monthNotes.filter((note) => note.pinned).length,
    tagged: monthNotes.filter((note) => note.tags.length > 0).length,
    untagged: monthNotes.filter((note) => note.tags.length === 0).length,
  }), [monthNotes]);

  return (
    <div
      className="relative flex flex-col gap-5 h-full p-5 overflow-y-auto custom-scrollbar"
      style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {selectionStatus}
      </div>

      {/* Header */}
      <div>
        <div
          className="text-[9px] tracking-[0.25em] uppercase mb-1"
          style={{ color: 'rgba(240,236,228,0.25)', fontFamily: 'var(--font-body)' }}
        >
          {theme.name} {new Date().getFullYear()}
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '18px',
            fontWeight: 700,
            color: 'rgba(240,236,228,0.9)',
            lineHeight: 1.1,
          }}
        >
          Notes &amp; Events
        </h2>
      </div>

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
          <StoryStat label="Holidays" value={String(monthHolidays.length)} accent={theme.accentText} />
          <StoryStat label="Pinned" value={String(counts.pinned)} accent={theme.accentText} />
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

      {/* Selection info */}
      <RangeInfo range={range} theme={theme} onReset={onReset} />

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

      {/* Note editor */}
      <NoteEditor
        activeKey={activeKey}
        activeNote={activeNote}
        theme={theme}
        onSave={onSave}
        onEdit={onClearSaveError}
      />

      {saveError && (
        <div
          role="alert"
          className="rounded-lg border px-3 py-2 text-[12px]"
          style={{
            borderColor: 'rgba(248,113,113,0.45)',
            background: 'rgba(127,29,29,0.25)',
            color: 'rgba(254,226,226,0.95)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {saveError}
        </div>
      )}

      {/* Divider */}
      {monthNotes.length > 0 && (
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />
      )}

      {monthNotes.length > 0 && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
          {FILTERS.map((option) => {
            const active = filter === option.key;
            return (
              <button
                key={option.key}
                onClick={() => setFilter(option.key)}
                className={clsx(
                  'px-2.5 py-1 rounded-full text-[10px] border transition-all duration-150',
                  active ? 'translate-y-[-1px]' : 'opacity-75 hover:opacity-100',
                )}
                style={{
                  background: active ? `${theme.accent}20` : 'rgba(255,255,255,0.03)',
                  color: active ? theme.accentText : 'rgba(240,236,228,0.5)',
                  borderColor: active ? `${theme.accent}50` : 'rgba(255,255,255,0.08)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {option.label} <span style={{ opacity: 0.7 }}>({counts[option.key]})</span>
              </button>
            );
          })}
          </div>
          <button
            type="button"
            onClick={onToggleFocusMode}
            className="px-2.5 py-1 rounded-full text-[10px] border transition-all duration-150"
            style={{
              background: focusMode ? `${theme.accent}22` : 'rgba(255,255,255,0.03)',
              color: focusMode ? theme.accentText : 'rgba(240,236,228,0.5)',
              borderColor: focusMode ? `${theme.accent}50` : 'rgba(255,255,255,0.08)',
              fontFamily: 'var(--font-body)',
            }}
            aria-pressed={focusMode}
            title="Dim non-selected weeks"
          >
            Focus {focusMode ? 'On' : 'Off'}
          </button>
        </div>
      )}

      {/* Notes list */}
      {monthNotes.length === 0 ? (
        <EmptyState theme={theme} title="No notes yet" description="Create a note for the selected date or month." />
      ) : filteredNotes.length > 0 ? (
        <>
          <NotesList notes={filteredNotes} theme={theme} onDelete={onDelete} />

          {monthHolidays.length > 0 && (
            <div className="flex flex-col gap-2">
              <div
                className="text-[9px] tracking-[0.2em] uppercase"
                style={{ color: 'rgba(240,236,228,0.32)', fontFamily: 'var(--font-body)' }}
              >
                This Month&apos;s Holidays
              </div>
              <div className="flex flex-wrap gap-1.5">
                {monthHolidays.map((holiday) => (
                  <button
                    type="button"
                    key={holiday.key}
                    onClick={() => onHolidayJump(holiday.day)}
                    className="px-2 py-1 rounded-full border text-[10px]"
                    style={{
                      background: `${theme.accent}16`,
                      borderColor: `${theme.accent}35`,
                      color: theme.accentText,
                      fontFamily: 'var(--font-body)',
                    }}
                    title={`Jump to ${holiday.name}`}
                  >
                    {holiday.day} · {holiday.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          theme={theme}
          title="No notes match this filter"
          description="Try a different filter to bring notes back into view."
        />
      )}

      {/* Legend */}
      <div
        className="mt-auto pt-4 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div
          className="text-[9px] tracking-[0.2em] uppercase mb-2"
          style={{ color: 'rgba(240,236,228,0.2)', fontFamily: 'var(--font-body)' }}
        >
          Legend
        </div>
        <div className="flex flex-col gap-1.5">
          <LegendRow color={theme.accent} label="Selected / Holiday" />
          <LegendRow color="rgba(255,255,255,0.4)" label="Note attached" dot />
          <LegendRow color="rgba(255,255,255,0.15)" label="Today" ring />
        </div>
      </div>
    </div>
  );
}

function getSelectionStatus(range: DateRange): string {
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

function getMonthHolidays(date: Date) {
  const month = date.getMonth() + 1;
  return Object.entries(HOLIDAYS)
    .map(([key, holiday]) => {
      const [keyMonth, day] = key.split('-');
      return {
        key,
        day: Number(day),
        name: holiday.name,
        type: holiday.type,
      };
    })
    .filter((holiday) => Number(String(holiday.day)) && Number(keyMonthFromKey(holiday.key)) === month)
    .sort((a, b) => a.day - b.day);
}

function keyMonthFromKey(key: string) {
  return key.split('-')[0];
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

function applyFilter(notes: NoteEntry[], filter: NoteFilter) {
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

const FILTERS: Array<{ key: NoteFilter; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'pinned', label: 'Pinned' },
  { key: 'tagged', label: 'Tagged' },
  { key: 'untagged', label: 'Untagged' },
];

function EmptyState({ theme, title, description }: { theme: MonthTheme; title: string; description: string; }) {
  return (
    <div
      className="rounded-xl border px-4 py-4"
      style={{
        borderColor: 'rgba(255,255,255,0.06)',
        background: `${theme.accent}08`,
      }}
    >
      <div
        className="text-[12px] mb-1"
        style={{ color: 'rgba(240,236,228,0.82)', fontFamily: 'var(--font-body)' }}
      >
        {title}
      </div>
      <div
        className="text-[10px] leading-relaxed"
        style={{ color: 'rgba(240,236,228,0.35)', fontFamily: 'var(--font-body)' }}
      >
        {description}
      </div>
    </div>
  );
}

function LegendRow({
  color, label, dot = false, ring = false,
}: { color: string; label: string; dot?: boolean; ring?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{
          background: dot || ring ? 'transparent' : color,
          border: ring ? `1.5px solid ${color}` : dot ? `1.5px solid ${color}` : 'none',
        }}
      />
      <span
        className="text-[10px]"
        style={{ color: 'rgba(240,236,228,0.3)', fontFamily: 'var(--font-body)' }}
      >
        {label}
      </span>
    </div>
  );
}
