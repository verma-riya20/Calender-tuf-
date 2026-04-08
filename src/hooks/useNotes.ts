'use client';
import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import type { NoteEntry, NoteColor, DateRange } from '@/types';
import { buildNoteKey, labelFromNoteKey } from '@/lib/dateUtils';

const STORAGE_KEY = 'wall-calendar-notes-v1';

function loadNotes(): NoteEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.map((note) => ({
          ...note,
          pinned: Boolean(note.pinned),
          tags: Array.isArray(note.tags) ? note.tags.filter(Boolean) : [],
        }))
      : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: NoteEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return true;
  } catch {
    return false;
  }
}

export function useNotes(range: DateRange, currentDate: Date) {
  const [notes, setNotes] = useState<NoteEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setNotes(loadNotes());
    setHydrated(true);
  }, []);

  const activeKey = buildNoteKey(range, currentDate);

  const activeNote = notes.find((n) => n.key === activeKey) ?? null;

  const upsertNote = useCallback(
    (payload: {
      text: string;
      color: NoteColor;
      pinned: boolean;
      tags: string[];
    }) => {
      const { text, color, pinned, tags } = payload;
      let didSave = false;

      setNotes((prev) => {
        const existing = prev.find((n) => n.key === activeKey);
        let updated: NoteEntry[];
        if (existing) {
          updated = prev.map((n) =>
            n.key === activeKey ? { ...n, text, color, pinned, tags } : n,
          );
        } else {
          const entry: NoteEntry = {
            id: crypto.randomUUID(),
            key: activeKey,
            label: labelFromNoteKey(activeKey),
            text,
            color,
            createdAt: new Date().toISOString(),
            pinned,
            tags,
          };
          updated = [entry, ...prev];
        }

        const filtered = updated.filter((n) => n.text.trim());
        didSave = saveNotes(filtered);
        return filtered;
      });

      if (!didSave) {
        setSaveError('Could not save note. Storage may be full or unavailable.');
      } else {
        setSaveError(null);
      }

      return didSave;
    },
    [activeKey],
  );

  const deleteNote = useCallback(
    (id: string) => {
      setNotes((prev) => {
        const updated = prev.filter((n) => n.id !== id);
        const didSave = saveNotes(updated);
        if (!didSave) {
          setSaveError('Could not delete note. Storage may be unavailable.');
        } else {
          setSaveError(null);
        }
        return updated;
      });
    },
    [],
  );

  const getMonthNotes = useCallback(
    (date: Date) => {
      const prefix = format(date, 'yyyy-MM');
      return notes.filter((n) => n.key.startsWith(prefix));
    },
    [notes],
  );

  return {
    notes,
    activeNote,
    activeKey,
    hydrated,
    saveError,
    upsertNote,
    deleteNote,
    getMonthNotes,
    clearSaveError: () => setSaveError(null),
  };
}
