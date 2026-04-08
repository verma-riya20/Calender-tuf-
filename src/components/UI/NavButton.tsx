'use client';
import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface NavButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  direction: 'prev' | 'next';
}

export function NavButton({ direction, className, ...props }: NavButtonProps) {
  return (
    <button
      aria-label={direction === 'prev' ? 'Previous month' : 'Next month'}
      className={clsx(
        'group relative w-9 h-9 rounded-full flex items-center justify-center',
        'border border-white/[0.14] bg-black/30 backdrop-blur-sm',
        'text-white/70 hover:text-white',
        'hover:bg-white/10 hover:border-white/25',
        'active:scale-95 transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
        className,
      )}
      {...props}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="transition-transform duration-150 group-hover:scale-110"
      >
        {direction === 'prev' ? (
          <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}
