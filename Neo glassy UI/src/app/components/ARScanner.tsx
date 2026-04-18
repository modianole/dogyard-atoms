export function ARScanner() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Scanning Grid Lines */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scan-vertical" />
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-emerald-400 to-transparent animate-scan-horizontal" />
      </div>

      {/* Corner Brackets */}
      <div className="absolute top-12 left-12 w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-400 to-transparent" />
        <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-emerald-400 to-transparent" />
      </div>
      <div className="absolute top-12 right-12 w-16 h-16">
        <div className="absolute top-0 right-0 w-full h-0.5 bg-gradient-to-l from-emerald-400 to-transparent" />
        <div className="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-emerald-400 to-transparent" />
      </div>
      <div className="absolute bottom-12 left-12 w-16 h-16">
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-400 to-transparent" />
        <div className="absolute bottom-0 left-0 w-0.5 h-full bg-gradient-to-t from-emerald-400 to-transparent" />
      </div>
      <div className="absolute bottom-12 right-12 w-16 h-16">
        <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-emerald-400 to-transparent" />
        <div className="absolute bottom-0 right-0 w-0.5 h-full bg-gradient-to-t from-emerald-400 to-transparent" />
      </div>

      {/* Center Crosshair */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-2 border-emerald-400/40 rounded-full animate-ping" />
          <div className="absolute inset-2 border border-emerald-400/60 rounded-full" />
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-400/50" />
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-emerald-400/50" />
        </div>
      </div>

      <style>{`
        @keyframes scan-vertical {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(100vh); }
        }
        @keyframes scan-horizontal {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(100vw); }
        }
        .animate-scan-vertical {
          animation: scan-vertical 4s ease-in-out infinite;
        }
        .animate-scan-horizontal {
          animation: scan-horizontal 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
