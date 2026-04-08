export function CalendarBinding() {
  return (
    <div className="relative flex items-center justify-center py-4 px-8 overflow-hidden select-none">
      <div
        className="absolute top-0 left-0 right-0 h-6 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.07), transparent)',
          opacity: 0.7,
        }}
      />
      {/* bar */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[4px] bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      {/* rings */}
      <div className="relative flex items-center gap-[12px]">
        {Array.from({ length: 19 }).map((_, i) => (
          <div
            key={i}
            className="w-[18px] h-[18px] rounded-full border-[2.5px] flex-shrink-0"
            style={{
              borderColor: 'rgba(255,255,255,0.2)',
              background:
                'radial-gradient(circle at 38% 32%, rgba(255,255,255,0.22) 0%, rgba(0,0,0,0.35) 70%)',
              boxShadow:
                'inset 0 1px 3px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.08), 0 0 10px rgba(255,255,255,0.03)',
            }}
          />
        ))}
      </div>
      {/* center hook shadow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[4px] h-4 rounded-b-full"
        style={{ background: 'rgba(255,255,255,0.16)' }}
      />
    </div>
  );
}
