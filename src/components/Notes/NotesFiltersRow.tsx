'use client';
import clsx from 'clsx';
import type { MonthTheme, NoteFilter } from '@/types';

const FILTERS: Array<{ key: NoteFilter; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'pinned', label: 'Pinned' },
  { key: 'tagged', label: 'Tagged' },
  { key: 'untagged', label: 'Untagged' },
];

interface NotesFiltersRowProps {
  theme: MonthTheme;
  counts: Record<NoteFilter, number>;
  filter: NoteFilter;
  focusMode: boolean;
  onFilterChange: (next: NoteFilter) => void;
  onToggleFocusMode: () => void;
}

export function NotesFiltersRow({
  theme,
  counts,
  filter,
  focusMode,
  onFilterChange,
  onToggleFocusMode,
}: NotesFiltersRowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((option) => {
          const active = filter === option.key;
          return (
            <button
              type="button"
              key={option.key}
              onClick={() => onFilterChange(option.key)}
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
              aria-pressed={active}
              aria-label={`Filter notes: ${option.label}`}
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
        aria-label={focusMode ? 'Turn focus mode off' : 'Turn focus mode on'}
        title="Dim non-selected weeks"
      >
        Focus {focusMode ? 'On' : 'Off'}
      </button>
    </div>
  );
}
