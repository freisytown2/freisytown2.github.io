import React, { useState } from 'react';
import { HOGAR_DATA, HomeDetail } from '../../data/hogarData';
import { playClick, playCorrect, playIncorrect, speak, speakCorrect, speakIncorrect } from '../../utils/audio';
import { fireConfetti } from '../../utils/confetti';
import { Sparkles, CheckCircle2, XCircle, Home, Utensils, Tv, BedDouble } from 'lucide-react';

const MesaIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
    aria-label="Mesa"
  >
    {/* Patas traseras con sombra en perspectiva */}
    <rect x="14" y="24" width="4.5" height="25" rx="2" fill="#78350F" />
    <rect x="45.5" y="24" width="4.5" height="25" rx="2" fill="#78350F" />
    {/* Faldón / travesaño inferior */}
    <rect x="12" y="24" width="40" height="4.5" rx="1.5" fill="#92400E" />
    {/* Patas delanteras */}
    <rect x="8" y="26" width="5.5" height="28" rx="2" fill="#B45309" />
    <rect x="50.5" y="26" width="5.5" height="28" rx="2" fill="#B45309" />
    {/* Brillo en patas delanteras */}
    <rect x="9" y="27" width="1.5" height="26" rx="0.75" fill="#D97706" />
    <rect x="51.5" y="27" width="1.5" height="26" rx="0.75" fill="#D97706" />
    {/* Canto frontal grueso del tablero */}
    <rect x="4" y="22" width="56" height="5.5" rx="2" fill="#D97706" />
    {/* Superficie superior del tablero de madera en perspectiva */}
    <polygon points="12,13 52,13 60,22 4,22" fill="#F59E0B" />
    {/* Vetas y brillo de madera en el tablero */}
    <line x1="17" y1="16" x2="47" y2="16" stroke="#FEF08A" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
    <line x1="13" y1="19" x2="51" y2="19" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
  </svg>
);

const renderHogarIcon = (item: HomeDetail, size: 'sm' | 'md' | 'lg' = 'md') => {
  if (item.id === 'mesa') {
    const sizeClasses = {
      sm: 'w-6 h-6',
      md: 'w-8 h-8',
      lg: 'w-20 h-20',
    };
    return <MesaIcon className={sizeClasses[size]} />;
  }
  return <span>{item.icon}</span>;
};

interface HogarModuleProps {
  onAddScore: (isCorrect: boolean, extraPts?: number) => void;
}

export const HogarModule: React.FC<HogarModuleProps> = ({ onAddScore }) => {
  const [activeTab, setActiveTab] = useState<'explorar' | 'reconocer' | 'habitacion'>('explorar');
  const [selectedRoomFilter, setSelectedRoomFilter] = useState<string>('Todos');

  // Game 1: Reconocimiento por función
  const [recogIdx, setRecogIdx] = useState(0);
  const [recogChosen, setRecogChosen] = useState<string | null>(null);

  // Game 2: Clasificar por habitación
  const [habIdx, setHabIdx] = useState(0);
  const [habChosen, setHabChosen] = useState<string | null>(null);

  const currentRecog = HOGAR_DATA[recogIdx];
  const currentHab = HOGAR_DATA[habIdx];

  const rooms = ['Todos', 'Cocina', 'Comedor', 'Sala', 'Dormitorio', 'Baño/General'];

  const filteredItems = HOGAR_DATA.filter(
    (item) => selectedRoomFilter === 'Todos' || item.room === selectedRoomFilter
  );

  const handleRecogAnswer = (id: string) => {
    if (recogChosen !== null) return;
    setRecogChosen(id);
    const isCorrect = id === currentRecog.id;
    if (isCorrect) {
      playCorrect();
      fireConfetti();
      speakCorrect(currentRecog.name);
      onAddScore(true);
    } else {
      playIncorrect();
      speakIncorrect();
      onAddScore(false);
    }
  };

  const nextRecog = () => {
    playClick();
    setRecogIdx((prev) => (prev + 1) % HOGAR_DATA.length);
    setRecogChosen(null);
  };

  const handleHabAnswer = (room: string) => {
    if (habChosen !== null) return;
    setHabChosen(room);
    const isCorrect = room === currentHab.room;
    if (isCorrect) {
      playCorrect();
      fireConfetti();
      speakCorrect(currentHab.name);
      onAddScore(true);
    } else {
      playIncorrect();
      speakIncorrect();
      onAddScore(false);
    }
  };

  const nextHab = () => {
    playClick();
    setHabIdx((prev) => (prev + 1) % HOGAR_DATA.length);
    setHabChosen(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Title & Nav Tabs */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display flex items-center gap-2">
            <span>🏠</span> 18 Cosas del Hogar
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Muebles, electrodomésticos y utensilios cotidianos: utilidades y ubicación.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl overflow-x-auto self-start sm:self-auto">
          <button
            onClick={() => {
              playClick();
              setActiveTab('explorar');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'explorar' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Explorar (18)
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveTab('reconocer');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'reconocer' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            ¿Qué objeto es?
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveTab('habitacion');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'habitacion' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            ¿En qué estancia?
          </button>
        </div>
      </div>

      {/* TAB 1: EXPLORAR */}
      {activeTab === 'explorar' && (
        <div className="space-y-4">
          {/* Room filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {rooms.map((room) => (
              <button
                key={room}
                onClick={() => {
                  playClick();
                  setSelectedRoomFilter(room);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedRoomFilter === room
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {room}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  playClick();
                  speak(item.name);
                }}
                className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs space-y-2 hover:border-blue-300 transition-all cursor-pointer active:scale-98"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-2xl">
                    {renderHogarIcon(item, 'md')}
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    {item.room}
                  </span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 font-display">{item.name}</h4>
                  <p className="text-xs text-slate-600 mt-1">{item.function}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{item.category}</span>
                  <span className="italic">{item.hint}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: RECONOCER POR FUNCIÓN */}
      {activeTab === 'reconocer' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Ejercicio {recogIdx + 1} de {HOGAR_DATA.length}
            </span>
            <span className="text-xs text-slate-400">Reconocimiento</span>
          </div>

          <div className="text-center py-4 space-y-3 max-w-lg mx-auto">
            <span className="text-6xl block">🧐</span>
            <h3 className="text-base font-bold text-slate-800">
              ¿A qué objeto del hogar se refiere esta descripción?
            </h3>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium">
              "{currentRecog.function}"
            </div>
            <p className="text-xs text-slate-400 italic">Pista: {currentRecog.hint}</p>
          </div>

          {/* 4 Choices */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
            {HOGAR_DATA.filter(
              (it, idx, arr) =>
                it.id === currentRecog.id ||
                arr.indexOf(it) < 3 ||
                Math.random() > 0.5
            )
              .slice(0, 4)
              .map((it) => {
                const isChosen = recogChosen === it.id;
                const isCorrect = it.id === currentRecog.id;
                let style = 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200';

                if (recogChosen !== null) {
                  if (isCorrect) style = 'bg-emerald-500 text-white border-emerald-600';
                  else if (isChosen) style = 'bg-rose-500 text-white border-rose-600';
                  else style = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
                }

                return (
                  <button
                    key={it.id}
                    onClick={() => handleRecogAnswer(it.id)}
                    disabled={recogChosen !== null}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1 font-bold text-xs transition-all active:scale-95 ${style}`}
                  >
                    <span className="text-2xl flex items-center justify-center h-8">
                      {renderHogarIcon(it, 'sm')}
                    </span>
                    <span>{it.name}</span>
                  </button>
                );
              })}
          </div>

          {recogChosen && (
            <div className="text-center pt-2">
              <button
                onClick={nextRecog}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold active:scale-95 shadow-md"
              >
                Siguiente Objeto →
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ¿EN QUÉ ESTANCIA SE ENCUENTRA? */}
      {activeTab === 'habitacion' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Caso {habIdx + 1} de {HOGAR_DATA.length}
            </span>
            <span className="text-xs text-slate-400">Distribución de la casa</span>
          </div>

          <div className="text-center py-6 space-y-2">
            <span className="text-6xl block flex items-center justify-center min-h-[4.5rem]">
              {renderHogarIcon(currentHab, 'lg')}
            </span>
            <h3 className="text-2xl font-black text-slate-900 font-display">
              {currentHab.name}
            </h3>
            <p className="text-xs text-slate-500">
              ¿En qué habitación o espacio de la casa se sitúa primordialmente?
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto">
            {['Cocina', 'Comedor', 'Sala', 'Dormitorio'].map((r) => {
              const isChosen = habChosen === r;
              const isCorrect = r === currentHab.room;
              let style = 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200';

              if (habChosen !== null) {
                if (isCorrect) style = 'bg-emerald-500 text-white border-emerald-600';
                else if (isChosen) style = 'bg-rose-500 text-white border-rose-600';
                else style = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
              }

              return (
                <button
                  key={r}
                  onClick={() => handleHabAnswer(r)}
                  disabled={habChosen !== null}
                  className={`p-4 rounded-2xl border font-bold text-xs transition-all active:scale-95 ${style}`}
                >
                  {r}
                </button>
              );
            })}
          </div>

          {habChosen && (
            <div className="text-center pt-2 space-y-2">
              <p className="text-xs text-slate-500">
                Ubicación habitual: <strong className="text-slate-800">{currentHab.typicalRoom}</strong>
              </p>
              <button
                onClick={nextHab}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold active:scale-95 shadow-md"
              >
                Siguiente Objeto →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
