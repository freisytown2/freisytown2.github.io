import React, { useState } from 'react';
import { playClick, playCorrect, playIncorrect } from '../../utils/audio';
import { fireConfetti } from '../../utils/confetti';
import { Sparkles, Globe, MapPin, Flag, CheckCircle2, XCircle } from 'lucide-react';

interface GeografiaModuleProps {
  onAddScore: (isCorrect: boolean, extraPts?: number) => void;
}

const CONTINENTS = [
  {
    name: 'América',
    emoji: '🌎',
    area: '42.55 millones km²',
    countries: '35 países soberanos',
    highestPoint: 'Aconcagua (6.961 m)',
    longestRiver: 'Río Amazonas (el más caudaloso y largo del mundo)',
    fact: 'Se extiende de polo a polo a lo largo de más de 14.000 kilómetros.',
  },
  {
    name: 'Europa',
    emoji: '🌍',
    area: '10.18 millones km²',
    countries: '50 países',
    highestPoint: 'Monte Elbrús (5.642 m)',
    longestRiver: 'Río Volga (3.530 km)',
    fact: 'Posee una de las costas más recortadas del planeta, con numerosos mares interiores y golfos.',
  },
  {
    name: 'Asia',
    emoji: '🌏',
    area: '44.58 millones km²',
    countries: '48 países',
    highestPoint: 'Monte Everest (8.848 m - Techo del Mundo)',
    longestRiver: 'Río Yangtsé (6.300 km)',
    fact: 'Es el continente más extenso y más poblado, albergando a más del 59% de la población mundial.',
  },
  {
    name: 'África',
    emoji: '🌍',
    area: '30.37 millones km²',
    countries: '54 países',
    highestPoint: 'Monte Kilimanjaro (5.895 m)',
    longestRiver: 'Río Nilo (6.650 km)',
    fact: 'Contiene el desierto cálido más grande del mundo (el Sahara) y la mayor diversidad de grandes mamíferos.',
  },
  {
    name: 'Oceanía',
    emoji: '🏝️',
    area: '8.52 millones km²',
    countries: '14 países insulares',
    highestPoint: 'Puncak Jaya (4.884 m)',
    longestRiver: 'Río Murray-Darling',
    fact: 'Formado principalmente por la masa continental australiana y miles de islas en el océano Pacífico.',
  },
  {
    name: 'Antártida',
    emoji: '❄️',
    area: '14.20 millones km²',
    countries: 'Tratado Antártico (uso científico)',
    highestPoint: 'Macizo Vinson (4.892 m)',
    longestRiver: 'Glaciares de casquete continuo',
    fact: 'Contiene el 70% del agua dulce del planeta en forma de hielo y es el lugar más frío de la Tierra (-89.2 °C registrado).',
  },
];

const CAPITALS_QUIZ = [
  { country: 'Francia', flag: '🇫🇷', capital: 'París', options: ['París', 'Lyon', 'Marsella', 'Burdeos'] },
  { country: 'Japón', flag: '🇯🇵', capital: 'Tokio', options: ['Kioto', 'Osaka', 'Tokio', 'Yokohama'] },
  { country: 'Brasil', flag: '🇧🇷', capital: 'Brasilia', options: ['Río de Janeiro', 'São Paulo', 'Brasilia', 'Salvador'] },
  { country: 'Canadá', flag: '🇨🇦', capital: 'Ottawa', options: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'] },
  { country: 'España', flag: '🇪🇸', capital: 'Madrid', options: ['Barcelona', 'Sevilla', 'Valencia', 'Madrid'] },
  { country: 'Argentina', flag: '🇦🇷', capital: 'Buenos Aires', options: ['Córdoba', 'Rosario', 'Buenos Aires', 'Mendoza'] },
  { country: 'Egipto', flag: '🇪🇬', capital: 'El Cairo', options: ['Alejandría', 'Giza', 'Lúxor', 'El Cairo'] },
  { country: 'Australia', flag: '🇦🇺', capital: 'Camberra', options: ['Sídney', 'Melbourne', 'Brisbane', 'Camberra'] },
];

export const GeografiaModule: React.FC<GeografiaModuleProps> = ({ onAddScore }) => {
  const [activeTab, setActiveTab] = useState<'continentes' | 'capitales'>('continentes');
  const [selectedCont, setSelectedCont] = useState(CONTINENTS[0]);

  // Capitals Quiz state
  const [capIdx, setCapIdx] = useState(0);
  const [capChosen, setCapChosen] = useState<string | null>(null);

  const currentCap = CAPITALS_QUIZ[capIdx % CAPITALS_QUIZ.length];

  const handleCapAnswer = (opt: string) => {
    if (capChosen !== null) return;
    setCapChosen(opt);
    const ok = opt === currentCap.capital;
    if (ok) {
      playCorrect();
      fireConfetti();
      onAddScore(true, 10);
    } else {
      playIncorrect();
      onAddScore(false);
    }
  };

  const nextCap = () => {
    playClick();
    setCapIdx((prev) => (prev + 1) % CAPITALS_QUIZ.length);
    setCapChosen(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Title & Tabs */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display flex items-center gap-2">
            <span>🌍</span> Geografía del Mundo y Continentes
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Continentes, capitales mundiales, banderas, relieves y datos geográficos.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => {
              playClick();
              setActiveTab('continentes');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'continentes' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Los 6 Continentes
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveTab('capitales');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'capitales' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Quiz de Capitales
          </button>
        </div>
      </div>

      {activeTab === 'continentes' ? (
        <div className="space-y-6">
          {/* Continent Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {CONTINENTS.map((c) => {
              const isSelected = c.name === selectedCont.name;
              return (
                <button
                  key={c.name}
                  onClick={() => {
                    playClick();
                    setSelectedCont(c);
                  }}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1 text-xs font-bold transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm ring-2 ring-indigo-200'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="text-2xl">{c.emoji}</span>
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>

          {/* Detailed Continent Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                  Ficha Geográfica Continental
                </span>
                <h3 className="text-3xl font-black text-slate-900 font-display mt-0.5">
                  {selectedCont.name}
                </h3>
              </div>
              <span className="text-5xl">{selectedCont.emoji}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Superficie Total
                </span>
                <span className="text-sm font-bold text-slate-800">{selectedCont.area}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  División Política
                </span>
                <span className="text-sm font-bold text-slate-800">{selectedCont.countries}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Punto Más Elevado
                </span>
                <span className="text-sm font-bold text-slate-800">{selectedCont.highestPoint}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Río / Hidrografía
                </span>
                <span className="text-sm font-bold text-slate-800">{selectedCont.longestRiver}</span>
              </div>
            </div>

            <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100 text-xs space-y-1">
              <span className="font-bold text-indigo-950 block">💡 Dato Geográfico Relevante:</span>
              <p className="text-indigo-900 leading-relaxed">{selectedCont.fact}</p>
            </div>
          </div>
        </div>
      ) : (
        /* Capitals Quiz */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 max-w-xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Pregunta {(capIdx % CAPITALS_QUIZ.length) + 1} de {CAPITALS_QUIZ.length}
            </span>
            <span className="text-xs text-slate-400">Capitales del Mundo</span>
          </div>

          <div className="text-center space-y-2">
            <span className="text-5xl block">{currentCap.flag}</span>
            <h3 className="text-2xl font-black text-slate-900 font-display">
              ¿Cuál es la capital de {currentCap.country}?
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentCap.options.map((opt) => {
              const isChosen = capChosen === opt;
              const isTarget = opt === currentCap.capital;
              let style = 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200';

              if (capChosen !== null) {
                if (isTarget) style = 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300';
                else if (isChosen) style = 'bg-rose-500 text-white border-rose-600';
                else style = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleCapAnswer(opt)}
                  disabled={capChosen !== null}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left flex items-center justify-between transition-all active:scale-98 ${style}`}
                >
                  <span>{opt}</span>
                  {capChosen !== null && isTarget && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                  {capChosen !== null && isChosen && !isTarget && <XCircle className="w-5 h-5 shrink-0" />}
                </button>
              );
            })}
          </div>

          {capChosen !== null && (
            <div className="text-center pt-2">
              <button
                onClick={nextCap}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold active:scale-95 shadow-md"
              >
                Siguiente País →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
