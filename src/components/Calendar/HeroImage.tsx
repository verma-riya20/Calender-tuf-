'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { MonthTheme } from '@/types';
import type { AnimDirection } from '@/types';
import { NavButton } from '@/components/UI/NavButton';
import clsx from 'clsx';

interface HeroImageProps {
  theme: MonthTheme;
  year: number;
  animDir: AnimDirection;
  onPrev: () => void;
  onNext: () => void;
}

export function HeroImage({ theme, year, animDir, onPrev, onNext }: HeroImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [prevSrc, setPrevSrc] = useState(theme.heroImage);

  useEffect(() => {
    if (theme.heroImage !== prevSrc) {
      setLoaded(false);
      setImageFailed(false);
      setPrevSrc(theme.heroImage);
    }
  }, [theme.heroImage]);

  const monthFirstLetter = theme.name.slice(0, 1);
  const monthRest = theme.name.slice(1);

  return (
    <div
      className={clsx('relative w-full overflow-hidden hero-stage', loaded && !imageFailed && 'hero-stage-ready')}
      style={{ height: 'clamp(200px, 28vw, 290px)' }}
    >
      {/* Photo */}
      {!imageFailed && (
        <div
          className={clsx(
            'absolute inset-0 transition-opacity duration-500',
            loaded ? 'opacity-100' : 'opacity-0',
          )}
        >
          <Image
            src={theme.heroImage}
            alt={`${theme.name} landscape`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 65vw"
            className="object-cover object-center"
            style={{ filter: 'brightness(0.72) saturate(1.05)' }}
            onLoad={() => setLoaded(true)}
            onError={() => {
              setImageFailed(true);
              setLoaded(true);
            }}
          />
        </div>
      )}

      {imageFailed && (
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(120% 90% at 70% 0%, ${theme.accent}55 0%, transparent 55%),
              linear-gradient(160deg, rgba(255,255,255,0.08) 0%, transparent 45%),
              ${theme.bg}
            `,
          }}
        />
      )}

      {/* Skeleton shimmer while loading */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-pulse" />
      )}

      {/* Bottom gradient bleed into calendar */}
      <div
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, ${theme.bg} 100%)`,
        }}
      />

      {/* Diagonal accent shape (reference-inspired) */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: '72px' }}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <polygon
            points="0,100 0,40 42,100"
            fill={theme.accent}
            opacity="0.9"
          />
          <polygon
            points="0,100 42,100 55,60 100,100"
            fill={theme.accent}
            opacity="0.7"
          />
        </svg>
      </div>

      {/* Month + year badge */}
      <div className="absolute bottom-5 right-6 text-right z-10">
        <div
          className="text-[11px] tracking-[0.22em] uppercase font-light mb-0.5"
          style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-body)' }}
        >
          {year}
        </div>
        <div
          className="leading-none"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 900,
            color: '#fff',
            textShadow: '0 2px 16px rgba(0,0,0,0.4)',
            letterSpacing: '-0.02em',
          }}
        >
          {monthFirstLetter}
          <span style={{ color: theme.accentText }}>{monthRest}</span>
        </div>
      </div>

      {/* Nav buttons */}
      <div className="absolute top-3 left-4 flex gap-2 z-10">
        <NavButton direction="prev" onClick={onPrev} />
        <NavButton direction="next" onClick={onNext} />
      </div>

      {/* Season pill */}
      <div
        className="absolute top-3 right-4 z-10 px-3 py-1 rounded-full text-[10px] tracking-widest uppercase"
        style={{
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(8px)',
          color: theme.accentText,
          border: `1px solid ${theme.accent}40`,
          fontFamily: 'var(--font-body)',
        }}
      >
        {theme.season} · {theme.mood}
      </div>
    </div>
  );
}
