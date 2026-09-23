import React, { useState } from 'react';
import { MODULES } from '../data/modulesList';
import { ModuleId, CategoryFilter, UserProgress } from '../types';
import { Search, Sparkles, Trophy, Award, Flame, CheckCircle2 } from 'lucide-react';
import { playClick } from '../utils/audio';

interface HomeViewProps {
  onSelectModule: (id: ModuleId) => void;
  progress: UserProgress;
  levelTitle: string;
  selectedCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectModule,
  progress,
  levelTitle,
  selectedCategory,
  onSelectCategory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredModules = MODULES.filter((mod) => {
    const matchesCategory =
      selectedCategory === 'todos' || mod.category === selectedCategory;
    const matchesSearch =
      mod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: { id: CategoryFilter; label: string }[] = [
    { id: 'todos', label: 'Todos (18)' },
    { id: 'estudio', label: 'Estudio y Lengua' },
    { id: 'matematicas', label: 'Matemáticas' },
    { id: 'juegos', label: 'Juegos y Memoria' },
    { id: 'retos', label: 'Retos y Progreso' },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-sky-600 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-indigo-100 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Espacio Educativo Autónomo y 100% Offline</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display leading-tight">
            MI ESPACIO DE ESTUDIO
          </h1>

          <p className="text-base sm:text-lg text-indigo-100 font-medium leading-relaxed">
            Aprende, practica y juega. Explora 18 áreas interactivas diseñadas para reforzar tus conocimientos y agilidad mental.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-900">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg">
                ⭐
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Puntos
                </span>
                <span className="text-lg font-extrabold text-slate-900 tabular-nums">
                  {progress.points}
                </span>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
                🎓
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Nivel {progress.level}
                </span>
                <span className="text-sm font-bold text-slate-900 truncate max-w-[110px] block" title={levelTitle}>
                  {levelTitle}
                </span>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Ejercicios
                </span>
                <span className="text-lg font-extrabold text-slate-900 tabular-nums">
                  {progress.exercisesCompleted}
                </span>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-lg">
                <Award className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Medallas
                </span>
                <span className="text-lg font-extrabold text-slate-900 tabular-nums">
                  {progress.unlockedBadges.length} / 12
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-12 w-64 h-64 rounded-full bg-sky-400/20 blur-2xl pointer-events-none" />
      </section>

      {/* Search and Category Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar actividad (ej: tablas, suma, frutas, quiz)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-2xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Activity Count indicator */}
          <div className="text-xs font-medium text-slate-500 self-center sm:self-auto">
            Mostrando <span className="font-bold text-slate-800">{filteredModules.length}</span> módulos
          </div>
        </div>

        {/* Segmented category controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                playClick();
                onSelectCategory(cat.id);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 18 Actionable Big Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModules.map((mod, index) => {
          const visits = progress.moduleVisits[mod.id] || 0;
          return (
            <button
              key={mod.id}
              onClick={() => {
                playClick();
                onSelectModule(mod.id);
              }}
              className="text-left group relative flex flex-col justify-between p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all duration-200 active:scale-[0.98] overflow-hidden"
            >
              {/* Top Row: Icon + Ordinal index badge */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mod.bgColor} text-white flex items-center justify-center text-2xl shadow-sm group-hover:scale-108 transition-transform duration-200`}
                >
                  {mod.icon}
                </div>
                <div className="flex items-center gap-1.5">
                  {visits > 0 && (
                    <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ {visits} {visits === 1 ? 'vez' : 'veces'}
                    </span>
                  )}
                  <span className="text-xs font-bold text-slate-400 tabular-nums">
                    #{index + 1}
                  </span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1 mb-3">
                <h3 className="text-lg font-bold text-slate-900 font-display group-hover:text-indigo-600 transition-colors">
                  {mod.name}
                </h3>
                <p className="text-xs font-semibold text-indigo-600">
                  {mod.subtitle}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {mod.description}
                </p>
              </div>

              {/* Card Footer Button Indicator */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                <span>Entrar y aprender</span>
                <span className="w-6 h-6 rounded-full bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors">
                  →
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {filteredModules.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <span className="text-4xl block">🔍</span>
          <h3 className="text-base font-bold text-slate-800">
            No se encontraron actividades con ese criterio
          </h3>
          <p className="text-xs text-slate-500">
            Intenta buscar con otra palabra clave o selecciona la categoría "Todos".
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              onSelectCategory('todos');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
          >
            Ver todas las 18 secciones
          </button>
        </div>
      )}
    </div>
  );
};
