import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff, Check } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <aside
      aria-label="Notificación de estado sin conexión"
      className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 flex items-center justify-between sm:justify-start gap-3 rounded-2xl bg-slate-900/95 text-white px-4 py-2.5 text-xs font-semibold shadow-xl backdrop-blur-md border border-slate-700/60 transition-all animate-in slide-in-from-bottom-2"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
          <WifiOff className="w-4 h-4" />
        </span>
        <div>
          <p className="font-bold text-slate-100 flex items-center gap-1.5">
            Modo Sin Internet (Offline)
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </p>
          <p className="text-[11px] text-slate-300 font-normal">
            Todos los módulos, juegos y progreso funcionan sin conexión.
          </p>
        </div>
      </div>
    </aside>
  );
};
