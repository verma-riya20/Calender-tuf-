import { WallCalendar } from '@/components/Layout/WallCalendar';
import { AppErrorBoundary } from '@/components/UI/AppErrorBoundary';

export default function Home() {
  return (
    <main
      className="min-h-dvh flex flex-col items-center justify-center px-4 py-10"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.07) 0%, transparent 60%), #0a0a0a',
      }}
    >
      <AppErrorBoundary>
        <WallCalendar />
      </AppErrorBoundary>

      {/* Subtle footer */}
      <p
        className="mt-6 text-center text-[11px] tracking-wide"
        style={{ color: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-body)' }}
      >
        Click a day to start · Click again to end range · Notes auto-saved
      </p>
    </main>
  );
}
