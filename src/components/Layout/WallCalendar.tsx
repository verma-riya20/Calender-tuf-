'use client';
import { useMemo } from 'react';
import { format } from 'date-fns';
import clsx from 'clsx';
import { MONTH_THEMES } from '@/lib/constants';
import { useCalendar } from '@/hooks/useCalendar';
import { useNotes } from '@/hooks/useNotes';
import { CalendarBinding } from '@/components/UI/CalendarBinding';
import { HeroImage } from '@/components/Calendar/HeroImage';
import { CalendarGrid } from '@/components/Calendar/CalendarGrid';
import { MonthStrip } from '@/components/Calendar/MonthStrip';
import { NotesPanel } from '@/components/Notes/NotesPanel';

export function WallCalendar() {
  const {
    currentDate,
    animDir,
    range,
    hoverDate,
    setHoverDate,
    navigate,
    goToMonth,
    handleDayClick,
    resetRange,
  } = useCalendar();

  const {
    activeNote,
    activeKey,
    hydrated,
    saveError,
    clearSaveError,
    upsertNote,
    deleteNote,
    getMonthNotes,
    notes,
  } = useNotes(range, currentDate);

  const theme = MONTH_THEMES[currentDate.getMonth()];
  const monthNotes = getMonthNotes(currentDate);

  // Set of date keys that have notes (for dot indicators)
  const noteKeys = useMemo(() => {
    const set = new Set<string>();
    notes.forEach((n) => {
      // single day note: yyyy-MM-dd
      if (/^\d{4}-\d{2}-\d{2}$/.test(n.key)) {
        set.add(n.key);
      }
    });
    return set;
  }, [notes]);

  if (!hydrated) {
    return (
      <div
        className="w-full max-w-[1020px] mx-auto rounded-2xl overflow-hidden animate-pulse"
        style={{ background: theme.bg, minHeight: '520px' }}
      />
    );
  }

  return (
    <div
      className="calendar-shell-ambient relative w-full max-w-[1020px] mx-auto rounded-2xl overflow-hidden shadow-2xl"
      style={{
        background: theme.bg,
        boxShadow: `0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06)`,
        transition: 'background 0.5s ease',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(90% 55% at 14% 8%, ${theme.accent}20 0%, transparent 58%),
            radial-gradient(70% 45% at 88% 18%, ${theme.accentText}14 0%, transparent 55%),
            linear-gradient(180deg, rgba(255,255,255,0.03), transparent 22%, transparent 78%, rgba(0,0,0,0.16))
          `,
        }}
      />

      {/* Spiral binding */}
      <CalendarBinding />

      {/* Main layout: left (hero + grid) | right (notes) */}
      <div className="relative flex flex-col lg:flex-row">

        {/* ── LEFT COLUMN ── */}
        <div className="relative flex flex-col flex-1 min-w-0">

          <div
            className="absolute inset-y-0 left-0 w-10 pointer-events-none"
            style={{
              background: `linear-gradient(90deg, ${theme.accent}14 0%, transparent 100%)`,
              filter: 'blur(16px)',
            }}
          />

          {/* Hero image */}
          <HeroImage
            theme={theme}
            year={currentDate.getFullYear()}
            animDir={animDir}
            onPrev={() => navigate('prev')}
            onNext={() => navigate('next')}
          />

          {/* Calendar grid */}
          <CalendarGrid
            currentDate={currentDate}
            range={range}
            hoverDate={hoverDate}
            theme={theme}
            noteKeys={noteKeys}
            animDir={animDir}
            onDayClick={handleDayClick}
            onDayHover={setHoverDate}
            onDayLeave={() => setHoverDate(null)}
          />

          {/* Month quick-select strip */}
          <MonthStrip
            currentMonth={currentDate.getMonth()}
            themes={MONTH_THEMES}
            onSelect={goToMonth}
          />
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div
          className="relative lg:w-[320px] xl:w-[340px] flex-shrink-0 min-h-[420px] lg:min-h-0"
          style={{ borderTop: 'none' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(180deg, ${theme.accent}0f 0%, transparent 30%)`,
            }}
          />
          <NotesPanel
            range={range}
            currentDate={currentDate}
            theme={theme}
            activeKey={activeKey}
            activeNote={activeNote}
            monthNotes={monthNotes}
            saveError={saveError}
            onReset={resetRange}
            onSave={upsertNote}
            onDelete={deleteNote}
            onClearSaveError={clearSaveError}
          />
        </div>

      </div>
    </div>
  );
}
