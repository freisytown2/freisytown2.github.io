import React, { useState, useEffect } from 'react';
import { COLORES_DATA, COLOR_MIXTURES } from '../../data/coloresData';
import { playClick, playCorrect, playIncorrect, speak, speakCorrect, speakIncorrect } from '../../utils/audio';
import { fireConfetti } from '../../utils/confetti';
import { Sparkles, CheckCircle2, XCircle, Shuffle, Eye } from 'lucide-react';

interface ColoresModuleProps {
  onAddScore: (isCorrect: boolean, extraPts?: number) => void;
}

export const ColoresModule: React.FC<ColoresModuleProps> = ({ onAddScore }) => {
  const [activeGame, setActiveGame] = useState<'paleta' | 'identifica' | 'stroop' | 'mezclas' | 'diferente'>('paleta');

  // Game 1: Identifica el color
  const [targetColorIdx, setTargetColorIdx] = useState(0);
  const [identOptions, setIdentOptions] = useState<string[]>([]);
  const [identChosen, setIdentChosen] = useState<string | null>(null);

  // Game 2: Efecto Stroop (Nombre correcto)
  const [stroopWord, setStroopWord] = useState(COLORES_DATA[0]);
  const [stroopInk, setStroopInk] = useState(COLORES_DATA[1]);
  const [stroopOptions, setStroopOptions] = useState<string[]>([]);
  const [stroopChosen, setStroopChosen] = useState<string | null>(null);

  // Game 3: Mezclas
  const [mixIdx, setMixIdx] = useState(0);
  const [mixChosen, setMixChosen] = useState<string | null>(null);

  // Game 4: Encuentra el diferente
  const [diffGrid, setDiffGrid] = useState<{ isOdd: boolean; color: string }[]>([]);
  const [diffFound, setDiffFound] = useState(false);
  const [diffRound, setDiffRound] = useState(1);

  // Init Identifica Game
  const startIdentifica = () => {
    const target = Math.floor(Math.random() * COLORES_DATA.length);
    setTargetColorIdx(target);
    const targetName = COLORES_DATA[target].name;
    const others = COLORES_DATA.filter((_, i) => i !== target)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((c) => c.name);
    const shuffled = [targetName, ...others].sort(() => 0.5 - Math.random());
    setIdentOptions(shuffled);
    setIdentChosen(null);
  };

  // Init Stroop Game
  const startStroop = () => {
    const wordIndex = Math.floor(Math.random() * COLORES_DATA.length);
    let inkIndex = Math.floor(Math.random() * COLORES_DATA.length);
    while (inkIndex === wordIndex) {
      inkIndex = Math.floor(Math.random() * COLORES_DATA.length);
    }
    const inkColor = COLORES_DATA[inkIndex];
    setStroopWord(COLORES_DATA[wordIndex]);
    setStroopInk(inkColor);

    const otherInks = COLORES_DATA.filter((_, i) => i !== inkIndex)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((c) => c.name);
    const options = [inkColor.name, ...otherInks].sort(() => 0.5 - Math.random());
    setStroopOptions(options);
    setStroopChosen(null);
  };

  // Init Diff Game
  const startDiff = (round = 1) => {
    setDiffFound(false);
    // Base color random hue
    const baseHue = Math.floor(Math.random() * 360);
    const baseSat = 65;
    const baseLight = 50;
    // Difference gets smaller as round increases
    const diffDelta = Math.max(7, 24 - round * 3);
    const oddIndex = Math.floor(Math.random() * 16);

    const tiles = Array.from({ length: 16 }).map((_, i) => {
      const isOdd = i === oddIndex;
      const l = isOdd ? baseLight + diffDelta : baseLight;
      return {
        isOdd,
        color: `hsl(${baseHue}, ${baseSat}%, ${l}%)`,
      };
    });
    setDiffGrid(tiles);
  };

  useEffect(() => {
    startIdentifica();
    startStroop();
    startDiff(1);
  }, []);

  const handleIdentAnswer = (name: string) => {
    if (identChosen !== null) return;
    setIdentChosen(name);
    const isCorrect = name === COLORES_DATA[targetColorIdx].name;
    if (isCorrect) {
      playCorrect();
      fireConfetti();
      speakCorrect(name);
      onAddScore(true);
    } else {
      playIncorrect();
      speakIncorrect();
      onAddScore(false);
    }
  };

  const handleStroopAnswer = (name: string) => {
    if (stroopChosen !== null) return;
    setStroopChosen(name);
    const isCorrect = name === stroopInk.name;
    if (isCorrect) {
      playCorrect();
      fireConfetti();
      speakCorrect();
      onAddScore(true, 5);
    } else {
      playIncorrect();
      speakIncorrect();
      onAddScore(false);
    }
  };

  const handleMixAnswer = (res: string) => {
    if (mixChosen !== null) return;
    setMixChosen(res);
    const isCorrect = res === COLOR_MIXTURES[mixIdx].result;
    if (isCorrect) {
      playCorrect();
      fireConfetti();
      speakCorrect(res);
      onAddScore(true);
    } else {
      playIncorrect();
      speakIncorrect();
      onAddScore(false);
    }
  };

  const handleTileClick = (isOdd: boolean) => {
    if (diffFound) return;
    if (isOdd) {
      playCorrect();
      fireConfetti();
      speakCorrect();
      setDiffFound(true);
      onAddScore(true, 5);
    } else {
      playIncorrect();
      speakIncorrect();
      onAddScore(false);
    }
  };

  const nextDiffRound = () => {
    playClick();
    const nextR = diffRound + 1;
    setDiffRound(nextR);
    startDiff(nextR);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Title & Game Tabs */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display flex items-center gap-2">
            <span>🎨</span> Los 12 Colores y Percepción Visual
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Rojo, azul, amarillo, verde, naranja, morado, rosa, negro, blanco, gris, marrón y celeste.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl overflow-x-auto self-start sm:self-auto">
          <button
            onClick={() => {
              playClick();
              setActiveGame('paleta');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeGame === 'paleta' ? 'bg-white text-purple-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            12 Colores
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveGame('identifica');
              startIdentifica();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeGame === 'identifica' ? 'bg-white text-purple-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Identificar
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveGame('stroop');
              startStroop();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeGame === 'stroop' ? 'bg-white text-purple-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Efecto Stroop
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveGame('mezclas');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeGame === 'mezclas' ? 'bg-white text-purple-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Mezclas
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveGame('diferente');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeGame === 'diferente' ? 'bg-white text-purple-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Ojo de Lince
          </button>
        </div>
      </div>

      {/* MODE 1: PALETTE EXPLORATION */}
      {activeGame === 'paleta' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {COLORES_DATA.map((col) => (
              <button
                key={col.name}
                onClick={() => {
                  playClick();
                  speak(col.name);
                }}
                className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs space-y-3 text-left transition-all hover:border-purple-300 active:scale-95 cursor-pointer"
              >
                <div
                  className="w-full h-20 rounded-2xl border border-slate-300/40 shadow-inner flex items-center justify-center font-black text-sm"
                  style={{ backgroundColor: col.hex, color: col.textColor }}
                >
                  {col.name}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-800">{col.name}</h4>
                    <span className="text-[10px] font-semibold text-slate-400 font-mono">{col.hex}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">{col.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MODE 2: IDENTIFICA EL COLOR */}
      {activeGame === 'identifica' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              Juego de Reconocimiento
            </span>
            <h3 className="text-lg font-bold text-slate-800">
              ¿Cómo se llama este color?
            </h3>
          </div>

          {/* Color Display */}
          <div className="flex justify-center py-4">
            <div
              className="w-36 h-36 rounded-full shadow-lg border-4 border-white ring-4 ring-slate-100 transition-transform duration-300"
              style={{ backgroundColor: COLORES_DATA[targetColorIdx].hex }}
            />
          </div>

          {/* 4 Options */}
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {identOptions.map((name) => {
              const isChosen = identChosen === name;
              const isCorrect = name === COLORES_DATA[targetColorIdx].name;
              let style = 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200';

              if (identChosen !== null) {
                if (isCorrect) style = 'bg-emerald-500 text-white border-emerald-600';
                else if (isChosen) style = 'bg-rose-500 text-white border-rose-600';
                else style = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
              }

              return (
                <button
                  key={name}
                  onClick={() => handleIdentAnswer(name)}
                  disabled={identChosen !== null}
                  className={`p-3.5 rounded-2xl border text-sm font-bold transition-all active:scale-95 ${style}`}
                >
                  {name}
                </button>
              );
            })}
          </div>

          {identChosen && (
            <div className="text-center pt-2">
              <button
                onClick={startIdentifica}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all active:scale-95 shadow-md"
              >
                Siguiente Color →
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODE 3: EFECTO STROOP */}
      {activeGame === 'stroop' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
              Desafío de Inhibición y Atención (Efecto Stroop)
            </span>
            <h3 className="text-sm font-medium text-slate-600">
              ¡Cuidado! Ignora la palabra escrita y selecciona el <strong className="text-slate-900">COLOR DE LA TINTA</strong>:
            </h3>
          </div>

          {/* Stroop Word in Different Ink Color */}
          <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-200">
            <span
              className="text-4xl sm:text-5xl font-black tracking-widest font-display drop-shadow-xs"
              style={{ color: stroopInk.hex }}
            >
              {stroopWord.name.toUpperCase()}
            </span>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {stroopOptions.map((name) => {
              const isChosen = stroopChosen === name;
              const isCorrect = name === stroopInk.name;
              let style = 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200';

              if (stroopChosen !== null) {
                if (isCorrect) style = 'bg-emerald-500 text-white border-emerald-600';
                else if (isChosen) style = 'bg-rose-500 text-white border-rose-600';
                else style = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
              }

              return (
                <button
                  key={name}
                  onClick={() => handleStroopAnswer(name)}
                  disabled={stroopChosen !== null}
                  className={`p-3.5 rounded-2xl border text-sm font-bold transition-all active:scale-95 ${style}`}
                >
                  {name}
                </button>
              );
            })}
          </div>

          {stroopChosen && (
            <div className="text-center pt-2">
              <button
                onClick={startStroop}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all active:scale-95 shadow-md"
              >
                Siguiente Reto Stroop →
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODE 4: MEZCLA DE COLORES */}
      {activeGame === 'mezclas' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              Fórmula {mixIdx + 1} de {COLOR_MIXTURES.length}
            </span>
            <span className="text-xs text-slate-400">Teoría del color</span>
          </div>

          {/* Mixing visual equation */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 py-4">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-16 h-16 rounded-2xl border-2 border-slate-200 shadow-sm"
                style={{
                  backgroundColor: COLORES_DATA.find((c) => c.name === COLOR_MIXTURES[mixIdx].color1)?.hex,
                }}
              />
              <span className="text-xs font-bold text-slate-700">{COLOR_MIXTURES[mixIdx].color1}</span>
            </div>

            <span className="text-2xl font-black text-slate-400">+</span>

            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-16 h-16 rounded-2xl border-2 border-slate-200 shadow-sm"
                style={{
                  backgroundColor: COLORES_DATA.find((c) => c.name === COLOR_MIXTURES[mixIdx].color2)?.hex,
                }}
              />
              <span className="text-xs font-bold text-slate-700">{COLOR_MIXTURES[mixIdx].color2}</span>
            </div>

            <span className="text-2xl font-black text-slate-400">=</span>

            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-16 h-16 rounded-2xl border-2 border-dashed border-purple-300 flex items-center justify-center font-bold text-xl text-purple-600"
                style={{
                  backgroundColor: mixChosen !== null ? COLOR_MIXTURES[mixIdx].resultHex : 'transparent',
                }}
              >
                {mixChosen === null && '?'}
              </div>
              <span className="text-xs font-bold text-purple-700">
                {mixChosen !== null ? COLOR_MIXTURES[mixIdx].result : '¿Resultado?'}
              </span>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto">
            {['Naranja', 'Verde', 'Morado', 'Rosa', 'Gris', 'Celeste'].map((res) => {
              const isChosen = mixChosen === res;
              const isCorrect = res === COLOR_MIXTURES[mixIdx].result;
              let style = 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200';

              if (mixChosen !== null) {
                if (isCorrect) style = 'bg-emerald-500 text-white border-emerald-600';
                else if (isChosen) style = 'bg-rose-500 text-white border-rose-600';
                else style = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
              }

              return (
                <button
                  key={res}
                  onClick={() => handleMixAnswer(res)}
                  disabled={mixChosen !== null}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all active:scale-95 ${style}`}
                >
                  {res}
                </button>
              );
            })}
          </div>

          {mixChosen && (
            <div className="text-center space-y-3 pt-2">
              <p className="text-xs text-slate-600 font-medium bg-purple-50 p-3 rounded-xl border border-purple-200">
                💡 {COLOR_MIXTURES[mixIdx].explanation}
              </p>
              <button
                onClick={() => {
                  playClick();
                  setMixIdx((prev) => (prev + 1) % COLOR_MIXTURES.length);
                  setMixChosen(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold active:scale-95 shadow-md"
              >
                Siguiente Mezcla →
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODE 5: ENCUENTRA EL COLOR DIFERENTE (OJO DE LINCE) */}
      {activeGame === 'diferente' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
              Ronda {diffRound}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> Agudeza Visual
            </span>
          </div>

          <div className="text-center space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Encuentra el recuadro con un tono ligeramente diferente
            </h3>
            <p className="text-xs text-slate-500">
              Toca el cuadro que no coincide exactamente con los demás.
            </p>
          </div>

          {/* 4x4 Grid */}
          <div className="grid grid-cols-4 gap-2.5 max-w-xs mx-auto aspect-square">
            {diffGrid.map((tile, i) => (
              <button
                key={i}
                onClick={() => handleTileClick(tile.isOdd)}
                disabled={diffFound}
                style={{ backgroundColor: tile.color }}
                className={`rounded-2xl transition-transform active:scale-90 shadow-2xs ${
                  diffFound && tile.isOdd ? 'ring-4 ring-emerald-500 scale-105' : ''
                }`}
                title="¿Es este?"
              />
            ))}
          </div>

          {diffFound && (
            <div className="text-center space-y-3 pt-2">
              <p className="text-xs font-bold text-emerald-700">
                ¡Ojo de lince! Has detectado la sutil diferencia de tonalidad.
              </p>
              <button
                onClick={nextDiffRound}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold active:scale-95 shadow-md"
              >
                Ronda Siguiente (+Dificultad) →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
