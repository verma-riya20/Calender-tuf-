'use client';

import { useState } from 'react';
import type { MonthTheme } from '@/types';

interface TagEditorProps {
  tags: string[];
  theme: MonthTheme;
  onChange: (tags: string[]) => void;
}

const QUICK_TAGS = ['Work', 'Study', 'Personal', 'Reminder', 'Event'];

export function TagEditor({ tags, theme, onChange }: TagEditorProps) {
  const [tagInput, setTagInput] = useState('');

  function addTag(raw: string) {
    const t = raw.trim();
    if (!t || tags.some((x) => x.toLowerCase() === t.toLowerCase())) return;
    onChange([...tags, t]);
    setTagInput('');
  }

  function removeTag(t: string) {
    onChange(tags.filter((x) => x !== t));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span
          className="text-[9px] tracking-[0.2em] uppercase"
          style={{ color: 'rgba(240,236,228,0.3)', fontFamily: 'var(--font-body)' }}
        >
          Tags
        </span>
        <button
          type="button"
          onClick={() => onChange([])}
          className="text-[10px]"
          style={{ color: 'rgba(240,236,228,0.35)', fontFamily: 'var(--font-body)' }}
        >
          Clear all
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {tags.length > 0 ? tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[10px]"
            style={{
              background: `${theme.accent}16`,
              borderColor: `${theme.accent}38`,
              color: theme.accentText,
              fontFamily: 'var(--font-body)',
            }}
          >
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove tag ${tag}`}
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              ×
            </button>
          </span>
        )) : (
          <span
            className="text-[11px]"
            style={{ color: 'rgba(240,236,228,0.3)', fontFamily: 'var(--font-body)' }}
          >
            No tags yet.
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag(tagInput);
            }
          }}
          placeholder="Add a tag and press Enter"
          className="flex-1 rounded-xl border outline-none text-[12px]"
          style={{
            background: 'rgba(255,255,255,0.04)',
            borderColor: 'rgba(255,255,255,0.08)',
            color: 'rgba(240,236,228,0.8)',
            fontFamily: 'var(--font-body)',
            padding: '10px 12px',
            caretColor: theme.accent,
          }}
        />
        <button
          type="button"
          onClick={() => addTag(tagInput)}
          className="px-3 rounded-xl border text-[11px]"
          style={{
            background: `${theme.accent}18`,
            color: theme.accentText,
            borderColor: `${theme.accent}38`,
            fontFamily: 'var(--font-body)',
          }}
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {QUICK_TAGS.map((qt) => {
          const active = tags.some((t) => t.toLowerCase() === qt.toLowerCase());
          return (
            <button
              type="button"
              key={qt}
              onClick={() => active
                ? removeTag(tags.find((t) => t.toLowerCase() === qt.toLowerCase()) ?? qt)
                : addTag(qt)}
              className="px-2 py-1 rounded-full border text-[10px] transition-all duration-150"
              style={{
                background: active ? `${theme.accent}22` : 'rgba(255,255,255,0.03)',
                color: active ? theme.accentText : 'rgba(240,236,228,0.55)',
                borderColor: active ? `${theme.accent}50` : 'rgba(255,255,255,0.08)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {active ? `✓ ${qt}` : `+ ${qt}`}
            </button>
          );
        })}
      </div>
    </div>
  );
}
