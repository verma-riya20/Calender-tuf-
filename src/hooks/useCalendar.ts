'use client';
import { useState, useCallback } from 'react';
import { addMonths, subMonths, isSameDay } from 'date-fns';
import type { DateRange, AnimDirection } from '@/types';

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [animDir, setAnimDir] = useState<AnimDirection>(null);
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const navigate = useCallback(
    (dir: 'prev' | 'next') => {
      if (isAnimating) return;
      setIsAnimating(true);
      setAnimDir(dir === 'prev' ? 'right' : 'left');

      setTimeout(() => {
        setCurrentDate((d) => dir === 'prev' ? subMonths(d, 1) : addMonths(d, 1));
        setAnimDir(null);
        setIsAnimating(false);
        setRange({ start: null, end: null });
        setHoverDate(null);
      }, 320);
    },
    [isAnimating],
  );

  const goToMonth = useCallback(
    (month: number) => {
      if (isAnimating) return;
      const targetMonth = new Date(currentDate.getFullYear(), month, 1);
      const dir = month > currentDate.getMonth() ? 'left' : 'right';
      if (month === currentDate.getMonth()) return;

      setIsAnimating(true);
      setAnimDir(dir);

      setTimeout(() => {
        setCurrentDate(targetMonth);
        setAnimDir(null);
        setIsAnimating(false);
        setRange({ start: null, end: null });
        setHoverDate(null);
      }, 320);
    },
    [currentDate, isAnimating],
  );

  const handleDayClick = useCallback(
    (date: Date) => {
      setRange((prev) => {
        // No start yet → set start
        if (!prev.start) return { start: date, end: null };

        // Already have complete range → reset and start fresh
        if (prev.start && prev.end) return { start: date, end: null };

        // Same day as start → single-day range
        if (isSameDay(date, prev.start)) return { start: date, end: date };

        // Set end
        return { start: prev.start, end: date };
      });
    },
    [],
  );

  const resetRange = useCallback(() => {
    setRange({ start: null, end: null });
    setHoverDate(null);
  }, []);

  return {
    currentDate,
    animDir,
    isAnimating,
    range,
    hoverDate,
    setHoverDate,
    navigate,
    goToMonth,
    handleDayClick,
    resetRange,
  };
}
