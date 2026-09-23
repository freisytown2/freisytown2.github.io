import React from 'react';
import { Volume2, VolumeX, ArrowLeft, Home, Award, Sparkles } from 'lucide-react';
import { ModuleId } from '../types';

interface HeaderProps {
  currentModule: ModuleId | null;
  onNavigateHome: () => void;
  onNavigateModule: (id: ModuleId) => void;
  points: number;
  level: number;
  levelTitle: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentModule,
  onNavigateHome,
  onNavigateModule,
  points,
  level,
  levelTitle,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-15 flex items-center justify-between gap-2">
        {/* Left: Brand or Back */}
        <div className="flex items-center gap-2">
          {currentModule ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onNavigateHome}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors active:scale-95"
                title="Volver al menú principal"
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Inicio</span>
              </button>
              <button
                onClick={onNavigateHome}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors active:scale-95"
                title="Atrás"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Atrás</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onNavigateHome}
              className="text-left flex items-center gap-2 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                📚
              </div>
              <div>
                <span className="text-base font-extrabold tracking-tight text-slate-900 block leading-tight font-display">
                  MI ESPACIO DE ESTUDIO
                </span>
                <span className="text-[11px] font-medium text-slate-500 block leading-none">
                  Aprende, practica y juega
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Right: Quick Stats & Controls */}
        <div className="flex items-center gap-2">
          {/* Level / Points pill button to open progress */}
          <button
            onClick={() => onNavigateModule('progreso')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/70 hover:border-amber-300 text-amber-900 transition-all active:scale-95"
            title={`Nivel ${level}: ${levelTitle} - Ver Mi Progreso`}
          >
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="font-bold text-xs tabular-nums text-amber-800">
              {points} <span className="font-normal text-[11px] text-amber-700">pts</span>
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors active:scale-95 ${
              soundEnabled
                ? 'bg-slate-100 hover:bg-slate-200 text-indigo-600'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-400'
            }`}
            title={soundEnabled ? 'Sonido activado (clic para silenciar)' : 'Sonido silenciado (clic para activar)'}
            aria-label="Alternar sonido"
          >
            {soundEnabled ? (
              <Volume2 className="w-4.5 h-4.5" />
            ) : (
              <VolumeX className="w-4.5 h-4.5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
