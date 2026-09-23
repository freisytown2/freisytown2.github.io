import React from 'react';
import { Home, BookOpen, Gamepad2, Zap, Trophy } from 'lucide-react';
import { ModuleId, CategoryFilter } from '../types';

interface BottomNavProps {
  currentModule: ModuleId | null;
  onNavigateHome: () => void;
  onNavigateModule: (id: ModuleId) => void;
  onSelectCategory: (cat: CategoryFilter) => void;
  activeCategory: CategoryFilter;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentModule,
  onNavigateHome,
  onNavigateModule,
  onSelectCategory,
  activeCategory,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg md:hidden">
      <div className="grid grid-cols-5 items-center h-15 max-w-lg mx-auto px-2">
        <button
          onClick={() => {
            onNavigateHome();
            onSelectCategory('todos');
          }}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentModule === null && activeCategory === 'todos'
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Inicio</span>
        </button>

        <button
          onClick={() => {
            if (currentModule !== null) onNavigateHome();
            onSelectCategory('estudio');
          }}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentModule === null && activeCategory === 'estudio'
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Estudio</span>
        </button>

        <button
          onClick={() => {
            if (currentModule !== null) onNavigateHome();
            onSelectCategory('juegos');
          }}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentModule === null && activeCategory === 'juegos'
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Gamepad2 className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Juegos</span>
        </button>

        <button
          onClick={() => onNavigateModule('retos')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentModule === 'retos'
              ? 'text-orange-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Zap className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Retos</span>
        </button>

        <button
          onClick={() => onNavigateModule('progreso')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentModule === 'progreso'
              ? 'text-amber-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Progreso</span>
        </button>
      </div>
    </nav>
  );
};
