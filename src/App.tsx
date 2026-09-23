/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { MODULES } from './data/modulesList';
import { CategoryFilter, ModuleId, UserProgress } from './types';
import { loadProgress, addPointsAndExercise, calculateLevel } from './utils/storage';
import { playClick, toggleSound, isSoundEnabled } from './utils/audio';

// Modules
import { AbcModule } from './components/modules/AbcModule';
import { VocalesModule } from './components/modules/VocalesModule';
import { ColoresModule } from './components/modules/ColoresModule';
import { FrutasModule } from './components/modules/FrutasModule';
import { HogarModule } from './components/modules/HogarModule';
import { NumerosModule } from './components/modules/NumerosModule';
import { SumaModule } from './components/modules/SumaModule';
import { RestaModule } from './components/modules/RestaModule';
import { MultiplicacionModule } from './components/modules/MultiplicacionModule';
import { DivisionModule } from './components/modules/DivisionModule';
import { SopaLetrasModule } from './components/modules/SopaLetrasModule';
import { OrtografiaModule } from './components/modules/OrtografiaModule';
import { QuizModule } from './components/modules/QuizModule';
import { GeometriaModule } from './components/modules/GeometriaModule';
import { CulturaGeneralModule } from './components/modules/CulturaGeneralModule';
import { RetosModule } from './components/modules/RetosModule';
import { InglesModule } from './components/modules/InglesModule';
import { CienciasModule } from './components/modules/CienciasModule';
import { HistoriaModule } from './components/modules/HistoriaModule';
import { GeografiaModule } from './components/modules/GeografiaModule';
import { LogicaModule } from './components/modules/LogicaModule';
import { ComprensionModule } from './components/modules/ComprensionModule';
import { ProgresoModule } from './components/modules/ProgresoModule';
import { OfflineIndicator } from './components/OfflineIndicator';

import { ArrowLeft } from 'lucide-react';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress());
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('todos');
  const [activeModuleId, setActiveModuleId] = useState<ModuleId | null>(null);
  const [soundActive, setSoundActive] = useState<boolean>(isSoundEnabled());

  const levelInfo = calculateLevel(progress.points);

  const refreshStats = () => {
    setProgress(loadProgress());
  };

  const handleScoreEvent = (isCorrect: boolean, extraPts = 10) => {
    const updated = addPointsAndExercise(isCorrect, extraPts, activeModuleId || undefined);
    setProgress(updated);
  };

  const handleSelectModule = (moduleId: ModuleId) => {
    playClick();
    setActiveModuleId(moduleId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    playClick();
    setActiveModuleId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundActive(newState);
  };

  // Find active module metadata if one is open
  const activeModuleMeta = MODULES.find((m) => m.id === activeModuleId);

  // Render current module view
  const renderActiveModule = () => {
    switch (activeModuleId) {
      case 'abc':
        return <AbcModule onAddScore={handleScoreEvent} />;
      case 'vocales':
        return <VocalesModule onAddScore={handleScoreEvent} />;
      case 'colores':
        return <ColoresModule onAddScore={handleScoreEvent} />;
      case 'frutas':
        return <FrutasModule onAddScore={handleScoreEvent} />;
      case 'hogar':
        return <HogarModule onAddScore={handleScoreEvent} />;
      case 'numeros':
        return <NumerosModule onAddScore={handleScoreEvent} />;
      case 'suma':
        return <SumaModule onAddScore={handleScoreEvent} />;
      case 'resta':
        return <RestaModule onAddScore={handleScoreEvent} />;
      case 'multiplicacion':
        return <MultiplicacionModule onAddScore={handleScoreEvent} />;
      case 'division':
        return <DivisionModule onAddScore={handleScoreEvent} />;
      case 'sopa':
        return <SopaLetrasModule onAddScore={handleScoreEvent} />;
      case 'ortografia':
        return <OrtografiaModule onAddScore={handleScoreEvent} />;
      case 'quiz':
        return <QuizModule onAddScore={handleScoreEvent} />;
      case 'geometria':
        return <GeometriaModule onAddScore={handleScoreEvent} />;
      case 'cultura':
        return <CulturaGeneralModule onAddScore={handleScoreEvent} />;
      case 'retos':
        return <RetosModule onAddScore={handleScoreEvent} />;
      case 'ingles':
        return <InglesModule onAddScore={handleScoreEvent} />;
      case 'ciencias':
        return <CienciasModule onAddScore={handleScoreEvent} />;
      case 'historia':
        return <HistoriaModule onAddScore={handleScoreEvent} />;
      case 'geografia':
        return <GeografiaModule onAddScore={handleScoreEvent} />;
      case 'logica':
        return <LogicaModule onAddScore={handleScoreEvent} />;
      case 'comprension':
        return <ComprensionModule onAddScore={handleScoreEvent} />;
      case 'progreso':
        return <ProgresoModule progress={progress} onStatsReset={refreshStats} />;
      default:
        return (
          <HomeView
            onSelectModule={handleSelectModule}
            progress={progress}
            levelTitle={levelInfo.title}
            selectedCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Header */}
      <Header
        currentModule={activeModuleId}
        onNavigateHome={handleGoHome}
        onNavigateModule={handleSelectModule}
        points={progress.points}
        level={levelInfo.level}
        levelTitle={levelInfo.title}
        soundEnabled={soundActive}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5">
        {/* Module Navigation Breadcrumb if in module */}
        {activeModuleId && (
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={handleGoHome}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-indigo-600" />
              <span>Volver a Inicio</span>
            </button>

            {activeModuleMeta && (
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white/70 px-3 py-1.5 rounded-xl border border-slate-200">
                <span>{activeModuleMeta.icon}</span>
                <span className="text-slate-800">{activeModuleMeta.name}</span>
              </div>
            )}
          </div>
        )}

        {/* View Component */}
        {renderActiveModule()}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentModule={activeModuleId}
        onNavigateHome={handleGoHome}
        onNavigateModule={handleSelectModule}
        onSelectCategory={setActiveCategory}
        activeCategory={activeCategory}
      />

      {/* Offline Status Notification */}
      <OfflineIndicator />
    </div>
  );
}
