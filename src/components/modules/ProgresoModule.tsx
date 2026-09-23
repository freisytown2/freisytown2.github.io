import React from 'react';
import { UserProgress } from '../../types';
import { BADGES } from '../../data/medallasData';
import { resetAllData, calculateLevel } from '../../utils/storage';
import { playClick } from '../../utils/audio';
import { Trophy, Award, Flame, Zap, Target, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';

interface ProgresoModuleProps {
  progress: UserProgress;
  onStatsReset: () => void;
}

export const ProgresoModule: React.FC<ProgresoModuleProps> = ({ progress, onStatsReset }) => {
  const levelInfo = calculateLevel(progress.points);
  const unlockedSet = new Set(progress.unlockedBadges);

  const handleReset = () => {
    if (window.confirm('¿Seguro que deseas reiniciar tu progreso y puntos a cero?')) {
      resetAllData();
      onStatsReset();
      playClick();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Title */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display flex items-center gap-2">
            <span>🏆</span> Mi Progreso y Logros
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Todo tu avance se guarda de forma 100% privada y segura en el almacenamiento de tu dispositivo.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold transition-all self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reiniciar Datos</span>
        </button>
      </div>

      {/* Level & Points Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-20 h-20 rounded-3xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-4xl shadow-inner shrink-0">
              🎖️
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Rango de Estudiante
              </span>
              <h3 className="text-3xl font-black font-display mt-0.5">
                Nivel {levelInfo.level}: {levelInfo.title}
              </h3>
              <p className="text-xs text-indigo-200 mt-1">
                {progress.points} puntos de experiencia acumulados en total
              </p>
            </div>
          </div>

          <div className="w-full sm:w-64 space-y-2 bg-white/10 p-4 rounded-2xl backdrop-blur-xs border border-white/10">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-indigo-200">Próximo Nivel</span>
              <span>{levelInfo.progressPercent}%</span>
            </div>
            <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all duration-500"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-indigo-300 text-center">
              Meta: {levelInfo.nextLevelPoints} puntos para el siguiente rango
            </p>
          </div>
        </div>
      </div>

      {/* 4 Quick Stat Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-slate-200 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Puntos
            </span>
            <span className="text-xl font-black text-slate-900">{progress.points}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Racha de Estudio
            </span>
            <span className="text-xl font-black text-slate-900">{progress.dailyStreak} días</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Ejercicios
            </span>
            <span className="text-xl font-black text-slate-900">{progress.exercisesCompleted}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Medallas
            </span>
            <span className="text-xl font-black text-slate-900">
              {progress.unlockedBadges.length} / {BADGES.length}
            </span>
          </div>
        </div>
      </div>

      {/* Badges / Medallas Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <h3 className="text-lg font-extrabold text-slate-900 font-display flex items-center gap-2">
          <span>🏅</span> Medallas y Conquistas
        </h3>
        <p className="text-xs text-slate-500">
          Supera retos, responde preguntas y juega en los módulos para desbloquear todas las insignias.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {BADGES.map((badge) => {
            const isUnlocked = unlockedSet.has(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
                  isUnlocked
                    ? 'bg-amber-50/50 border-amber-300 shadow-2xs'
                    : 'bg-slate-50/80 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                    isUnlocked ? 'bg-amber-100' : 'bg-slate-200 grayscale'
                  }`}
                >
                  {badge.icon}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900">{badge.title}</h4>
                    {isUnlocked && (
                      <span className="text-[9px] font-bold text-amber-700 bg-amber-200/70 px-1.5 py-0.2 rounded-full">
                        ✓ Desbloqueada
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">{badge.description}</p>
                  <p className="text-[10px] text-slate-400 font-medium italic pt-1">
                    Requisito: {badge.requirement}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* App24 / Offline / Privacy Badge */}
      <div className="bg-emerald-50 rounded-3xl p-5 border border-emerald-200 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-xl shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wide">
            100% Offline y Seguro para Empaquetado Android (App24)
          </h4>
          <p className="text-xs text-emerald-800 mt-0.5">
            Sin recopilación de datos personales, sin cookies de rastreo, sin cuentas de usuario ni conexión obligatoria a internet.
          </p>
        </div>
      </div>
    </div>
  );
};
