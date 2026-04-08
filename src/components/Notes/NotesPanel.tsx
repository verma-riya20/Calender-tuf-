'use client';
import { useMemo, useState } from 'react';
import type { DateRange, MonthTheme, NoteEntry, NoteColor, NoteFilter } from '@/types';
import { applyFilter, getMonthHolidays, getSelectionStatus } from '@/lib/notesPanelUtils';
import { RangeInfo } from './RangeInfo';
import { NoteEditor } from './NoteEditor';
import { NotesList } from './NotesList';
import { MonthStoryCard } from './MonthStoryCard';
import { NotesFiltersRow } from './NotesFiltersRow';

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
          {theme.name} {currentDate.getFullYear()}
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

      <MonthStoryCard
        currentDate={currentDate}
        theme={theme}
        monthNotes={monthNotes}
        monthHolidayCount={monthHolidays.length}
        pinnedCount={counts.pinned}
      />

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
          <div className="flex items-center justify-between gap-3">
            <span>{saveError}</span>
            <button
              type="button"
              onClick={onClearSaveError}
              className="rounded-md border px-2 py-0.5 text-[10px]"
              style={{
                borderColor: 'rgba(254,226,226,0.35)',
                color: 'rgba(254,226,226,0.95)',
                fontFamily: 'var(--font-body)',
                background: 'rgba(255,255,255,0.04)',
              }}
              aria-label="Dismiss save error"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Divider */}
      {monthNotes.length > 0 && (
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />
      )}

      {monthNotes.length > 0 && (
        <NotesFiltersRow
          theme={theme}
          counts={counts}
          filter={filter}
          focusMode={focusMode}
          onFilterChange={setFilter}
          onToggleFocusMode={onToggleFocusMode}
        />
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
