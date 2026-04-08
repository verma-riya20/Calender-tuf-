'use client';
import clsx from 'clsx';
import type { NoteEntry, MonthTheme } from '@/types';
import { NOTE_COLORS } from '@/lib/constants';

interface NotesListProps {
  notes: NoteEntry[];
  theme: MonthTheme;
  onDelete: (id: string) => void;
}

export function NotesList({ notes, theme, onDelete }: NotesListProps) {
  if (notes.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <div
        className="text-[9px] tracking-[0.2em] uppercase"
        style={{ color: 'rgba(240,236,228,0.3)', fontFamily: 'var(--font-body)' }}
      >
        All Notes This Month
      </div>
      <div className="flex flex-col gap-2 pr-1 custom-scrollbar max-h-none overflow-visible lg:max-h-[220px] lg:overflow-y-auto">
        {notes.map((note) => {
          const style = NOTE_COLORS[note.color];
          return (
            <div
              key={note.id}
              className="group relative rounded-lg border px-3 py-2.5 transition-all duration-150"
              style={{
                background: style.bg,
                borderColor: style.border,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1"
                    style={{ background: style.dot }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <div
                        className="text-[10px] truncate"
                        style={{ color: 'rgba(240,236,228,0.4)', fontFamily: 'var(--font-body)' }}
                      >
                        {note.label}
                      </div>
                      {note.pinned && (
                        <span
                          className="text-[8px] px-1.5 py-0.5 rounded-full border"
                          style={{
                            color: '#f8fafc',
                            borderColor: 'rgba(255,255,255,0.12)',
                            background: 'rgba(255,255,255,0.06)',
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          PIN
                        </span>
                      )}
                    </div>
                    <p
                      className="text-[12px] leading-snug line-clamp-2 mt-0.5"
                      style={{ color: 'rgba(240,236,228,0.78)', fontFamily: 'var(--font-body)' }}
                    >
                      {note.text}
                    </p>
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {note.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] px-1.5 py-0.5 rounded-full border"
                            style={{
                              color: style.dot,
                              borderColor: `${style.dot}40`,
                              background: 'rgba(255,255,255,0.03)',
                              fontFamily: 'var(--font-body)',
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onDelete(note.id)}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-white/30 hover:text-white/60 text-[14px] leading-none mt-0.5"
                  aria-label="Delete note"
                >
                  ×
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
