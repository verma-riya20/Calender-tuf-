'use client';
import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import type { NoteColor, NoteEntry, MonthTheme } from '@/types';
import { NOTE_COLORS } from '@/lib/constants';
import { labelFromNoteKey } from '@/lib/dateUtils';
import { TagEditor } from './TagEditor';

interface NoteEditorProps {
  activeKey: string;
  activeNote: NoteEntry | null;
  theme: MonthTheme;
  onSave: (payload: {
    text: string;
    color: NoteColor;
    pinned: boolean;
    tags: string[];
  }) => boolean;
  onEdit?: () => void;
}

const COLOR_OPTIONS: NoteColor[] = ['default', 'amber', 'rose', 'emerald', 'sky'];

export function NoteEditor({ activeKey, activeNote, theme, onSave, onEdit }: NoteEditorProps) {
  const [text, setText] = useState(activeNote?.text ?? '');
  const [color, setColor] = useState<NoteColor>(activeNote?.color ?? 'default');
  const [pinned, setPinned] = useState(activeNote?.pinned ?? false);
  const [tags, setTags] = useState<string[]>(activeNote?.tags ?? []);
  const [saved, setSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync when active note changes (different key selected)
  useEffect(() => {
    setText(activeNote?.text ?? '');
    setColor(activeNote?.color ?? 'default');
    setPinned(activeNote?.pinned ?? false);
    setTags(activeNote?.tags ?? []);
    setSaved(false);
  }, [activeKey, activeNote]);

  function saveNow(nextText = text, nextColor = color, nextPinned = pinned, nextTags = tags) {
    if (!nextText.trim()) return false;
    return onSave({
      text: nextText.trim(),
      color: nextColor,
      pinned: nextPinned,
      tags: nextTags,
    });
  }

  function handleSave() {
    if (!text.trim()) return;
    const savedOk = saveNow();
    if (savedOk) {
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    }
  }

  function updateTags(nextTags: string[]) {
    setTags(nextTags);
    setSaved(false);
    onEdit?.();
    if (text.trim()) {
      const savedOk = saveNow(text, color, pinned, nextTags);
      if (savedOk) {
        setSaved(true);
        setTimeout(() => setSaved(false), 1800);
      }
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  }

  const label = labelFromNoteKey(activeKey);
  const noteStyle = NOTE_COLORS[color];

  return (
    <div className="flex flex-col gap-3">
      {/* Label */}
      <div className="flex items-center justify-between">
        <div>
          <div
            className="text-[9px] tracking-[0.2em] uppercase mb-0.5"
            style={{ color: 'rgba(240,236,228,0.3)', fontFamily: 'var(--font-body)' }}
          >
            Note for
          </div>
          <div
            className="text-[12px]"
            style={{ color: 'rgba(240,236,228,0.65)', fontFamily: 'var(--font-body)' }}
          >
            {label}
          </div>
        </div>

        {/* Color picker */}
        <div className="flex gap-1.5 items-center">
          <button
            type="button"
            onClick={() => {
              const nextPinned = !pinned;
              setPinned(nextPinned);
              onEdit?.();
              if (text.trim()) {
                const savedOk = saveNow(text, color, nextPinned, tags);
                if (savedOk) {
                  setSaved(true);
                  setTimeout(() => setSaved(false), 1800);
                }
              }
            }}
            className={clsx(
              'flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] border transition-all duration-150',
              pinned ? 'scale-[1.01]' : 'opacity-85 hover:opacity-100',
            )}
            style={{
              background: pinned ? `${theme.accent}22` : 'rgba(255,255,255,0.03)',
              color: pinned ? theme.accentText : 'rgba(240,236,228,0.7)',
              borderColor: pinned ? `${theme.accent}55` : 'rgba(255,255,255,0.08)',
              fontFamily: 'var(--font-body)',
            }}
            aria-pressed={pinned}
            aria-label={pinned ? 'Unpin note' : 'Pin note'}
          >
            <span
              className="relative inline-flex h-3.5 w-6 rounded-full transition-colors duration-150"
              style={{
                background: pinned ? theme.accent : 'rgba(255,255,255,0.12)',
              }}
            >
              <span
                className="absolute top-[1px] h-3 w-3 rounded-full bg-white transition-transform duration-150"
                style={{
                  transform: pinned ? 'translateX(10px)' : 'translateX(1px)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
                }}
              />
            </span>
            <span>{pinned ? 'Pinned' : 'Pin note'}</span>
          </button>
          {COLOR_OPTIONS.map((c) => (
            <button
              type="button"
              key={c}
                onClick={() => {
                  setColor(c);
                  onEdit?.();
                  if (text.trim()) {
                  const savedOk = saveNow(text, c, pinned, tags);
                  if (savedOk) {
                    setSaved(true);
                    setTimeout(() => setSaved(false), 1800);
                  }
                  }
                }}
              className={clsx(
                'w-4 h-4 rounded-full border-2 transition-all duration-150',
                c === color ? 'scale-125' : 'opacity-60 hover:opacity-90',
              )}
              style={{
                background: NOTE_COLORS[c].dot,
                borderColor: c === color ? 'white' : 'transparent',
              }}
              title={c}
            />
          ))}
        </div>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setSaved(false);
          onEdit?.();
        }}
        onKeyDown={handleKeyDown}
        placeholder="Write a note for this date or range…"
        rows={4}
        className="w-full resize-none rounded-xl border outline-none transition-all duration-200 text-[13px] leading-relaxed"
        style={{
          background: noteStyle.bg,
          borderColor: text ? noteStyle.border : 'rgba(255,255,255,0.08)',
          color: 'rgba(240,236,228,0.85)',
          fontFamily: 'var(--font-body)',
          padding: '12px 14px',
          caretColor: theme.accent,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = `${theme.accent}60`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = text ? noteStyle.border : 'rgba(255,255,255,0.08)';
        }}
      />

      <TagEditor tags={tags} theme={theme} onChange={updateTags} />

      <p
        className="text-[10px] -mt-1"
        style={{ color: 'rgba(240,236,228,0.28)', fontFamily: 'var(--font-body)' }}
      >
        Pinned notes stay at the top of the month list.
      </p>

      {/* Save button */}
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={!text.trim()}
          className={clsx(
            'px-4 py-1.5 rounded-lg text-[12px] font-medium tracking-wide',
            'transition-all duration-200 active:scale-95',
            'disabled:opacity-30 disabled:cursor-not-allowed',
          )}
          style={{
            background: saved ? '#22c55e' : theme.accent,
            color: '#fff',
            fontFamily: 'var(--font-body)',
          }}
        >
          {saved ? '✓ Saved' : 'Save Note'}
        </button>
      </div>
    </div>
  );
}
