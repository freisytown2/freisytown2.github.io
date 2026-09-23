import React, { useState, useEffect } from 'react';
import { FRUTAS_DATA, FruitDetail } from '../../data/frutasData';
import { playClick, playCorrect, playIncorrect, speak, speakCorrect, speakIncorrect } from '../../utils/audio';
import { fireConfetti } from '../../utils/confetti';
import { Sparkles, CheckCircle2, XCircle } from 'lucide-react';

interface FrutasModuleProps {
  onAddScore: (isCorrect: boolean, extraPts?: number) => void;
}

export const FrutasModule: React.FC<FrutasModuleProps> = ({ onAddScore }) => {
  const [activeTab, setActiveTab] = useState<'galeria' | 'adivina' | 'rapidez' | 'relacionar'>('galeria');

  // Game 1: ¿Qué fruta es? (por descripción / silueta / pistas nutricionales)
  const [adivinaIdx, setAdivinaIdx] = useState(0);
  const [adivinaChosen, setAdivinaChosen] = useState<string | null>(null);

  // Game 2: Encuentra la fruta correcta
  const [targetFruit, setTargetFruit] = useState<FruitDetail>(FRUTAS_DATA[0]);
  const [fruitChoices, setFruitChoices] = useState<FruitDetail[]>([]);
  const [foundFruit, setFoundFruit] = useState<string | null>(null);

  // Game 3: Relaciona imagen y nombre (mini puzzle de 3 parejas)
  const [selectedImageFruit, setSelectedImageFruit] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [relateBatch, setRelateBatch] = useState<FruitDetail[]>([]);

  const currentAdivina = FRUTAS_DATA[adivinaIdx];

  // Setup Encuentra la fruta
  const setupEncuentra = () => {
    const target = FRUTAS_DATA[Math.floor(Math.random() * FRUTAS_DATA.length)];
    setTargetFruit(target);
    const others = FRUTAS_DATA.filter((f) => f.id !== target.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const all = [target, ...others].sort(() => 0.5 - Math.random());
    setFruitChoices(all);
    setFoundFruit(null);
  };

  // Setup Relacionar
  const setupRelacionar = () => {
    const subset = [...FRUTAS_DATA].sort(() => 0.5 - Math.random()).slice(0, 4);
    setRelateBatch(subset);
    setMatchedPairs([]);
    setSelectedImageFruit(null);
  };

  useEffect(() => {
    setupEncuentra();
    setupRelacionar();
  }, []);

  const handleAdivina = (id: string) => {
    if (adivinaChosen !== null) return;
    setAdivinaChosen(id);
    const isCorrect = id === currentAdivina.id;
    if (isCorrect) {
      playCorrect();
      fireConfetti();
      speakCorrect(currentAdivina.name);
      onAddScore(true);
    } else {
      playIncorrect();
      speakIncorrect();
      onAddScore(false);
    }
  };

  const nextAdivina = () => {
    playClick();
    setAdivinaIdx((prev) => (prev + 1) % FRUTAS_DATA.length);
    setAdivinaChosen(null);
  };

  const handleEncuentra = (id: string) => {
    if (foundFruit !== null) return;
    setFoundFruit(id);
    const isCorrect = id === targetFruit.id;
    if (isCorrect) {
      playCorrect();
      fireConfetti();
      speakCorrect(targetFruit.name);
      onAddScore(true);
    } else {
      playIncorrect();
      speakIncorrect();
      onAddScore(false);
    }
  };

  const handleNameMatch = (id: string) => {
    if (!selectedImageFruit) return;
    if (selectedImageFruit === id) {
      playCorrect();
      const matchedFruit = relateBatch.find((f) => f.id === id);
      speakCorrect(matchedFruit ? matchedFruit.name : '');
      const newMatches = [...matchedPairs, id];
      setMatchedPairs(newMatches);
      setSelectedImageFruit(null);
      if (newMatches.length === relateBatch.length) {
        fireConfetti();
        onAddScore(true, 15);
      }
    } else {
      playIncorrect();
      speakIncorrect();
      setSelectedImageFruit(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Title & Tabs */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display flex items-center gap-2">
            <span>🍎</span> Frutas: Nutrición y Juegos
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            12 deliciosas frutas, propiedades alimenticias, trivias botánicas y retos visuales.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl overflow-x-auto self-start sm:self-auto">
          <button
            onClick={() => {
              playClick();
              setActiveTab('galeria');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'galeria' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Galería 12 Frutas
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveTab('adivina');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'adivina' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            ¿Qué fruta es?
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveTab('rapidez');
              setupEncuentra();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'rapidez' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Encuéntrala
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveTab('relacionar');
              setupRelacionar();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'relacionar' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Relacionar
          </button>
        </div>
      </div>

      {/* TAB 1: GALERÍA */}
      {activeTab === 'galeria' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FRUTAS_DATA.map((fruit) => (
            <div
              key={fruit.id}
              onClick={() => {
                playClick();
                speak(fruit.name);
              }}
              className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-emerald-300 transition-all space-y-3 cursor-pointer active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-slate-100"
                  style={{ backgroundColor: `${fruit.colorHex}15` }}
                >
                  {fruit.emoji}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">{fruit.name}</h3>
                  <span className="text-[11px] font-semibold text-emerald-600 block">{fruit.taste}</span>
                  <span className="text-[10px] text-slate-400 font-mono">Color: {fruit.colorName}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{fruit.description}</p>

              <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px]">
                <p className="text-slate-700">
                  <strong className="text-slate-900">Aporte:</strong> {fruit.vitamins}
                </p>
                <p className="text-slate-500 italic">💡 {fruit.trivia}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: ¿QUÉ FRUTA ES? */}
      {activeTab === 'adivina' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Acertijo {adivinaIdx + 1} de {FRUTAS_DATA.length}
            </span>
            <span className="text-xs text-slate-400">Adivina por pistas</span>
          </div>

          <div className="text-center py-4 space-y-3 max-w-lg mx-auto">
            <span className="text-6xl block">❓</span>
            <h3 className="text-base font-bold text-slate-800">
              ¿A qué fruta corresponden estas características?
            </h3>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1.5 text-left">
              <p>• <strong>Sabor:</strong> {currentAdivina.taste}</p>
              <p>• <strong>Nutrientes:</strong> {currentAdivina.vitamins}</p>
              <p>• <strong>Curiosidad:</strong> {currentAdivina.trivia}</p>
            </div>
          </div>

          {/* 4 Choices */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
            {FRUTAS_DATA.slice(0, 8)
              .filter(
                (f, idx, arr) =>
                  f.id === currentAdivina.id ||
                  arr.indexOf(f) < 3 ||
                  Math.random() > 0.5
              )
              .slice(0, 4)
              .map((f) => {
                const isChosen = adivinaChosen === f.id;
                const isCorrect = f.id === currentAdivina.id;
                let style = 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200';

                if (adivinaChosen !== null) {
                  if (isCorrect) style = 'bg-emerald-500 text-white border-emerald-600';
                  else if (isChosen) style = 'bg-rose-500 text-white border-rose-600';
                  else style = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
                }

                return (
                  <button
                    key={f.id}
                    onClick={() => handleAdivina(f.id)}
                    disabled={adivinaChosen !== null}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1 font-bold text-xs transition-all active:scale-95 ${style}`}
                  >
                    <span className="text-2xl">{f.emoji}</span>
                    <span>{f.name}</span>
                  </button>
                );
              })}
          </div>

          {adivinaChosen && (
            <div className="text-center pt-2">
              <button
                onClick={nextAdivina}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold active:scale-95 shadow-md"
              >
                Siguiente Acertijo →
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ENCUENTRA LA FRUTA CORRECTA */}
      {activeTab === 'rapidez' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Rapidez Visual
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 font-display">
              Toca la fruta: <span className="text-emerald-600">{targetFruit.name}</span>
            </h3>
            <p className="text-xs text-slate-500">
              Identifica rápidamente la imagen que corresponde a este nombre.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto py-4">
            {fruitChoices.map((f) => {
              const isChosen = foundFruit === f.id;
              const isCorrect = f.id === targetFruit.id;
              let style = 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200';

              if (foundFruit !== null) {
                if (isCorrect) style = 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300';
                else if (isChosen) style = 'bg-rose-500 text-white border-rose-600';
                else style = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
              }

              return (
                <button
                  key={f.id}
                  onClick={() => handleEncuentra(f.id)}
                  disabled={foundFruit !== null}
                  className={`p-6 rounded-3xl border flex flex-col items-center justify-center transition-all active:scale-90 shadow-2xs ${style}`}
                >
                  <span className="text-5xl block mb-2">{f.emoji}</span>
                  {foundFruit !== null && <span className="text-xs font-bold">{f.name}</span>}
                </button>
              );
            })}
          </div>

          {foundFruit && (
            <div className="text-center pt-2">
              <button
                onClick={setupEncuentra}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold active:scale-95 shadow-md"
              >
                Buscar Otra Fruta →
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: RELACIONA IMAGEN Y NOMBRE */}
      {activeTab === 'relacionar' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Juego de Emparejamiento
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              1. Toca una fruta → 2. Toca su nombre correspondiente
            </h3>
            <p className="text-xs text-slate-500">
              Parejas encontradas: {matchedPairs.length} / {relateBatch.length}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
            {/* Left: Images */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 block">Frutas (Imágenes):</span>
              <div className="grid grid-cols-2 gap-2">
                {relateBatch.map((f) => {
                  const isMatched = matchedPairs.includes(f.id);
                  const isSelected = selectedImageFruit === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => {
                        if (isMatched) return;
                        playClick();
                        speak(f.name);
                        setSelectedImageFruit(f.id);
                      }}
                      disabled={isMatched}
                      className={`p-4 rounded-2xl border text-center transition-all active:scale-95 ${
                        isMatched
                          ? 'bg-emerald-50 border-emerald-300 opacity-50'
                          : isSelected
                          ? 'bg-emerald-500 text-white ring-2 ring-emerald-300 scale-102'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <span className="text-4xl block">{f.emoji}</span>
                      {isMatched && <span className="text-[10px] text-emerald-700 font-bold">✓ Emparejado</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Names (Shuffled) */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 block">Nombres:</span>
              <div className="flex flex-col gap-2">
                {[...relateBatch]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((f) => {
                    const isMatched = matchedPairs.includes(f.id);
                    return (
                      <button
                        key={f.id}
                        onClick={() => handleNameMatch(f.id)}
                        disabled={isMatched || !selectedImageFruit}
                        className={`p-3.5 rounded-2xl border text-xs font-bold text-left transition-all active:scale-95 flex items-center justify-between ${
                          isMatched
                            ? 'bg-emerald-100/60 text-emerald-800 border-emerald-300'
                            : selectedImageFruit
                            ? 'bg-white hover:bg-emerald-50 border-slate-200 text-slate-800'
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                      >
                        <span>{f.name}</span>
                        {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>

          {matchedPairs.length === relateBatch.length && relateBatch.length > 0 && (
            <div className="text-center pt-2 space-y-3">
              <p className="text-xs font-bold text-emerald-700">
                ¡Todas las parejas fueron relacionadas con éxito! (+15 pts)
              </p>
              <button
                onClick={setupRelacionar}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold active:scale-95 shadow-md"
              >
                Nueva Ronda con Otras Frutas →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
