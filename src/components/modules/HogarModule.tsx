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

const NeveraIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
    aria-label="Nevera"
  >
    {/* Patas de la nevera */}
    <rect x="18" y="58" width="5" height="3" rx="1.5" fill="#334155" />
    <rect x="41" y="58" width="5" height="3" rx="1.5" fill="#334155" />

    {/* Cuerpo principal / Carcasa exterior */}
    <rect x="15" y="6" width="34" height="52" rx="5" fill="#0284C7" />
    <rect x="15" y="6" width="34" height="52" rx="5" stroke="#0369A1" strokeWidth="1.5" />
    <rect x="15" y="6" width="4" height="52" rx="2" fill="#0369A1" opacity="0.3" />

    {/* Puerta superior (Congelador) */}
    <rect x="17" y="8" width="30" height="17" rx="3.5" fill="#38BDF8" />
    <path d="M19 10 L25 10 L21 23 L18 23 Z" fill="#FFFFFF" opacity="0.45" />
    {/* Manija congelador */}
    <rect x="42" y="13" width="2.5" height="8" rx="1.25" fill="#0F172A" />
    <rect x="42.5" y="14" width="1" height="6" rx="0.5" fill="#94A3B8" />

    {/* Ranura divisoria entre puertas */}
    <rect x="15" y="26" width="34" height="2" fill="#0369A1" />

    {/* Puerta inferior (Refrigerador) */}
    <rect x="17" y="29" width="30" height="27" rx="3.5" fill="#38BDF8" />
    <path d="M19 31 L26 31 L20 54 L18 54 Z" fill="#FFFFFF" opacity="0.4" />

    {/* Dispensador de agua/hielo en puerta */}
    <rect x="22" y="33" width="8" height="11" rx="2" fill="#0284C7" />
    <rect x="23.5" y="34.5" width="5" height="8" rx="1.5" fill="#E0F2FE" />
    <path d="M26 37 C26 37 24.5 39 24.5 40 C24.5 40.8 25.2 41.5 26 41.5 C26.8 41.5 27.5 40.8 27.5 40 C27.5 39 26 37 26 37 Z" fill="#0284C7" />

    {/* Manija refrigerador */}
    <rect x="42" y="33" width="2.5" height="14" rx="1.25" fill="#0F172A" />
    <rect x="42.5" y="34.5" width="1" height="11" rx="0.5" fill="#94A3B8" />
  </svg>
);

const EstufaIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
    aria-label="Estufa"
  >
    {/* Patas de la estufa */}
    <rect x="15" y="58" width="5" height="3" rx="1.5" fill="#1E293B" />
    <rect x="44" y="58" width="5" height="3" rx="1.5" fill="#1E293B" />

    {/* Cuerpo principal de la estufa */}
    <rect x="12" y="16" width="40" height="42" rx="4" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />

    {/* Copete superior con reloj digital */}
    <path d="M12 18 L12 9 C12 7.5 13.5 6 15 6 L49 6 C50.5 6 52 7.5 52 9 L52 18 Z" fill="#64748B" />
    <rect x="27" y="9" width="10" height="5" rx="1.5" fill="#0F172A" />
    <text x="32" y="13" textAnchor="middle" fill="#38BDF8" fontSize="3.5" fontFamily="sans-serif" fontWeight="bold">12:00</text>

    {/* Plancha de cocina con quemadores de fuego */}
    <rect x="10" y="16" width="44" height="4" rx="2" fill="#334155" />
    <ellipse cx="20" cy="18" rx="5" ry="1.5" fill="#F97316" />
    <ellipse cx="32" cy="18" rx="4" ry="1.2" fill="#F97316" />
    <ellipse cx="44" cy="18" rx="5" ry="1.5" fill="#F97316" />

    {/* Panel de perillas giratorias */}
    <rect x="14" y="21" width="36" height="7" rx="2" fill="#CBD5E1" />
    <circle cx="19" cy="24.5" r="2" fill="#0F172A" />
    <circle cx="26" cy="24.5" r="2" fill="#0F172A" />
    <circle cx="38" cy="24.5" r="2" fill="#0F172A" />
    <circle cx="45" cy="24.5" r="2" fill="#0F172A" />
    <circle cx="26" cy="24.5" r="0.75" fill="#EF4444" />

    {/* Puerta del horno */}
    <rect x="15" y="30" width="34" height="23" rx="3" fill="#475569" />
    {/* Manija del horno */}
    <rect x="19" y="32" width="26" height="2.5" rx="1.25" fill="#F8FAFC" />
    {/* Ventana de cristal del horno */}
    <rect x="19" y="36.5" width="26" height="14" rx="2" fill="#0F172A" />
    <rect x="21" y="38.5" width="22" height="10" rx="1.5" fill="#EA580C" opacity="0.35" />
    <line x1="21" y1="43.5" x2="43" y2="43.5" stroke="#FED7AA" strokeWidth="1" strokeDasharray="2 2" />

    {/* Cajón inferior */}
    <rect x="15" y="54" width="34" height="3" rx="1" fill="#94A3B8" />
  </svg>
);

const LamparaIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
    aria-label="Lámpara"
  >
    {/* Resplandor cálido difuso */}
    <polygon points="21,29 43,29 55,56 9,56" fill="#FEF08A" opacity="0.35" />

    {/* Remate superior */}
    <circle cx="32" cy="7" r="2" fill="#D97706" />

    {/* Pantalla de lámpara cónica */}
    <polygon points="23,9 41,9 47,29 17,29" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
    <polygon points="20.5,21 43.5,21 45.5,26 18.5,26" fill="#FBBF24" opacity="0.8" />
    <ellipse cx="32" cy="29" rx="15" ry="3" fill="#FDE047" stroke="#D97706" strokeWidth="1" />

    {/* Cordón / Interruptor */}
    <line x1="39" y1="29" x2="39" y2="37" stroke="#78350F" strokeWidth="1" strokeDasharray="1.5 1" />
    <circle cx="39" cy="38" r="1.5" fill="#D97706" />

    {/* Portalámparas */}
    <rect x="30" y="30" width="4" height="4" fill="#92400E" />

    {/* Mástil */}
    <rect x="30.5" y="34" width="3" height="19" rx="1.5" fill="#D97706" />
    <ellipse cx="32" cy="42" rx="3.5" ry="1.5" fill="#F59E0B" />

    {/* Base de la lámpara */}
    <ellipse cx="32" cy="55" rx="13" ry="4" fill="#B45309" />
    <ellipse cx="32" cy="53" rx="12" ry="3.5" fill="#D97706" />
    <ellipse cx="32" cy="52" rx="9" ry="2.5" fill="#F59E0B" />

    {/* Rayos de luz exteriores */}
    <line x1="12" y1="18" x2="6" y2="16" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="10" y1="26" x2="4" y2="28" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="52" y1="18" x2="58" y2="16" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="54" y1="26" x2="60" y2="28" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const VentiladorIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
    aria-label="Ventilador"
  >
    {/* Ráfagas de brisa */}
    <path d="M50 15 C54 13 58 17 56 22" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M53 26 C57 26 60 29 58 33" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M51 38 C55 40 57 44 54 48" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />

    {/* Rejilla protectora circular (Jaula del abanico) */}
    <circle cx="29" cy="24" r="19" fill="#F0FDF4" stroke="#0D9488" strokeWidth="2" />
    <circle cx="29" cy="24" r="14" stroke="#14B8A6" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
    <circle cx="29" cy="24" r="9" stroke="#14B8A6" strokeWidth="1" opacity="0.5" />

    {/* Varillas radiales */}
    <line x1="29" y1="5" x2="29" y2="43" stroke="#0D9488" strokeWidth="1" opacity="0.45" />
    <line x1="10" y1="24" x2="48" y2="24" stroke="#0D9488" strokeWidth="1" opacity="0.45" />
    <line x1="15" y1="10" x2="43" y2="38" stroke="#0D9488" strokeWidth="1" opacity="0.45" />
    <line x1="15" y1="38" x2="43" y2="10" stroke="#0D9488" strokeWidth="1" opacity="0.45" />

    {/* Aspas curvadas del abanico */}
    <path d="M29 24 C27 15 35 10 37 12 C39 14 36 21 29 24 Z" fill="#0284C7" />
    <path d="M29 24 C37 27 41 35 39 37 C37 39 30 35 29 24 Z" fill="#0369A1" />
    <path d="M29 24 C22 28 17 22 17 19 C17 16 25 18 29 24 Z" fill="#38BDF8" />

    {/* Eje central */}
    <circle cx="29" cy="24" r="4.5" fill="#0F172A" />
    <circle cx="29" cy="24" r="2" fill="#38BDF8" />

    {/* Cuello y poste */}
    <rect x="27" y="42" width="4" height="4" rx="1" fill="#475569" />
    <rect x="27.5" y="45" width="3" height="10" rx="1.5" fill="#64748B" />

    {/* Base con botones de velocidad */}
    <ellipse cx="29" cy="57" rx="15" ry="4" fill="#334155" />
    <ellipse cx="29" cy="55.5" rx="13" ry="3.5" fill="#475569" />
    <circle cx="24" cy="55.5" r="1.25" fill="#EF4444" />
    <circle cx="27.5" cy="55.5" r="1.25" fill="#3B82F6" />
    <circle cx="31" cy="55.5" r="1.25" fill="#10B981" />
    <circle cx="34.5" cy="55.5" r="1.25" fill="#F59E0B" />
  </svg>
);

const renderHogarIcon = (item: HomeDetail, size: 'sm' | 'md' | 'lg' = 'md') => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-20 h-20',
  };

  if (item.id === 'mesa') {
    return <MesaIcon className={sizeClasses[size]} />;
  }
  if (item.id === 'nevera') {
    return <NeveraIcon className={sizeClasses[size]} />;
  }
  if (item.id === 'estufa') {
    return <EstufaIcon className={sizeClasses[size]} />;
  }
  if (item.id === 'lampara') {
    return <LamparaIcon className={sizeClasses[size]} />;
  }
  if (item.id === 'ventilador') {
    return <VentiladorIcon className={sizeClasses[size]} />;
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
