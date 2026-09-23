import React, { useState, useEffect } from 'react';
import { numberToSpanish, getNumberFact, generateRandomBetween } from '../../data/numerosData';
import { playClick, playCorrect, playIncorrect, speak, speakCorrect, speakIncorrect } from '../../utils/audio';
import { fireConfetti } from '../../utils/confetti';
import { Sparkles, CheckCircle2, XCircle, ArrowUpDown, HelpCircle } from 'lucide-react';

interface NumerosModuleProps {
  onAddScore: (isCorrect: boolean, extraPts?: number) => void;
}

export const NumerosModule: React.FC<NumerosModuleProps> = ({ onAddScore }) => {
  const [activeTab, setActiveTab] = useState<'explorar' | 'identifica' | 'ordenar' | 'anterior' | 'mayor' | 'pares' | 'secuencias'>('explorar');

  // Selected for explore
  const [exploreNum, setExploreNum] = useState(42);

  // Mode 1: Identifica (palabra a número)
  const [identTarget, setIdentTarget] = useState(25);
  const [identOptions, setIdentOptions] = useState<number[]>([]);
  const [identChosen, setIdentChosen] = useState<number | null>(null);

  // Mode 2: Ordenar 4 números
  const [orderItems, setOrderItems] = useState<number[]>([]);
  const [userOrdered, setUserOrdered] = useState<number[]>([]);
  const [orderChecked, setOrderChecked] = useState(false);
  const [orderCorrect, setOrderCorrect] = useState(false);

  // Mode 3: Anterior y siguiente
  const [antTarget, setAntTarget] = useState(38);
  const [antPrevInput, setAntPrevInput] = useState('');
  const [antNextInput, setAntNextInput] = useState('');
  const [antChecked, setAntChecked] = useState(false);
  const [antCorrect, setAntCorrect] = useState(false);

  // Mode 4: Mayor o menor
  const [compA, setCompA] = useState(45);
  const [compB, setCompB] = useState(62);
  const [compChosen, setCompChosen] = useState<string | null>(null);

  // Mode 5: Pares o impares
  const [parTarget, setParTarget] = useState(57);
  const [parChosen, setParChosen] = useState<'par' | 'impar' | null>(null);

  // Mode 6: Secuencias
  const [seqNumbers, setSeqNumbers] = useState<number[]>([]);
  const [seqMissing, setSeqMissing] = useState<number>(0);
  const [seqOptions, setSeqOptions] = useState<number[]>([]);
  const [seqChosen, setSeqChosen] = useState<number | null>(null);

  // Init Identifica
  const setupIdentifica = () => {
    const target = generateRandomBetween(0, 100);
    setIdentTarget(target);
    const opts = new Set<number>([target]);
    while (opts.size < 4) {
      opts.add(generateRandomBetween(Math.max(0, target - 20), Math.min(100, target + 20)));
    }
    setIdentOptions(Array.from(opts).sort(() => 0.5 - Math.random()));
    setIdentChosen(null);
  };

  // Init Ordenar
  const setupOrdenar = () => {
    const nums = new Set<number>();
    while (nums.size < 4) {
      nums.add(generateRandomBetween(1, 99));
    }
    const arr = Array.from(nums).sort(() => 0.5 - Math.random());
    setOrderItems(arr);
    setUserOrdered([]);
    setOrderChecked(false);
    setOrderCorrect(false);
  };

  // Init Anterior/Siguiente
  const setupAnt = () => {
    setAntTarget(generateRandomBetween(2, 98));
    setAntPrevInput('');
    setAntNextInput('');
    setAntChecked(false);
    setAntCorrect(false);
  };

  // Init Mayor/Menor
  const setupMayor = () => {
    const a = generateRandomBetween(0, 100);
    let b = generateRandomBetween(0, 100);
    while (b === a) b = generateRandomBetween(0, 100);
    setCompA(a);
    setCompB(b);
    setCompChosen(null);
  };

  // Init Par/Impar
  const setupPar = () => {
    setParTarget(generateRandomBetween(0, 100));
    setParChosen(null);
  };

  // Init Secuencias
  const setupSecuencias = () => {
    const step = [2, 3, 5, 10][Math.floor(Math.random() * 4)];
    const start = generateRandomBetween(1, 40);
    const seq = [start, start + step, start + step * 2, start + step * 3];
    const missing = seq[3];
    setSeqNumbers(seq.slice(0, 3));
    setSeqMissing(missing);

    const opts = new Set<number>([missing]);
    while (opts.size < 4) {
      opts.add(missing + generateRandomBetween(-4, 6) * step);
    }
    setSeqOptions(Array.from(opts).sort(() => 0.5 - Math.random()));
    setSeqChosen(null);
  };

  useEffect(() => {
    setupIdentifica();
    setupOrdenar();
    setupAnt();
    setupMayor();
    setupPar();
    setupSecuencias();
  }, []);

  const handleIdent = (n: number) => {
    if (identChosen !== null) return;
    setIdentChosen(n);
    const isCorrect = n === identTarget;
    if (isCorrect) {
      playCorrect();
      fireConfetti();
      speakCorrect(numberToSpanish(n));
      onAddScore(true);
    } else {
      playIncorrect();
      speakIncorrect();
      onAddScore(false);
    }
  };

  const handleSelectOrderItem = (n: number) => {
    if (userOrdered.includes(n) || orderChecked) return;
    playClick();
    speak(numberToSpanish(n));
    const updated = [...userOrdered, n];
    setUserOrdered(updated);

    if (updated.length === orderItems.length) {
      // Check if correctly sorted ascending
      const sorted = [...orderItems].sort((a, b) => a - b);
      const isOk = updated.every((val, idx) => val === sorted[idx]);
      setOrderChecked(true);
      setOrderCorrect(isOk);
      if (isOk) {
        playCorrect();
        fireConfetti();
        speakCorrect();
        onAddScore(true, 10);
      } else {
        playIncorrect();
        speakIncorrect();
        onAddScore(false);
      }
    }
  };

  const checkAnt = () => {
    const prevNum = parseInt(antPrevInput, 10);
    const nextNum = parseInt(antNextInput, 10);
    const isOk = prevNum === antTarget - 1 && nextNum === antTarget + 1;
    setAntChecked(true);
    setAntCorrect(isOk);
    if (isOk) {
      playCorrect();
      fireConfetti();
      speakCorrect();
      onAddScore(true);
    } else {
      playIncorrect();
      speakIncorrect();
      onAddScore(false);
    }
  };

  const handleComp = (symbol: '>' | '<' | '=') => {
    if (compChosen !== null) return;
    setCompChosen(symbol);
    const actual = compA > compB ? '>' : compA < compB ? '<' : '=';
    const isCorrect = symbol === actual;
    if (isCorrect) {
      playCorrect();
      fireConfetti();
      speakCorrect();
      onAddScore(true);
    } else {
      playIncorrect();
      speakIncorrect();
      onAddScore(false);
    }
  };

  const handlePar = (choice: 'par' | 'impar') => {
    if (parChosen !== null) return;
    setParChosen(choice);
    const isEven = parTarget % 2 === 0;
    const isCorrect = (choice === 'par' && isEven) || (choice === 'impar' && !isEven);
    if (isCorrect) {
      playCorrect();
      fireConfetti();
      speakCorrect(isEven ? 'Número par' : 'Número impar');
      onAddScore(true);
    } else {
      playIncorrect();
      speakIncorrect();
      onAddScore(false);
    }
  };

  const handleSeq = (n: number) => {
    if (seqChosen !== null) return;
    setSeqChosen(n);
    const isCorrect = n === seqMissing;
    if (isCorrect) {
      playCorrect();
      fireConfetti();
      speakCorrect(numberToSpanish(n));
      onAddScore(true);
    } else {
      playIncorrect();
      speakIncorrect();
      onAddScore(false);
    }
  };

  const fact = getNumberFact(exploreNum);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Title & Tabs */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display flex items-center gap-2">
            <span>🔢</span> Los Números del 0 al 100
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Explora valores, decenas, unidades, pares/impares, orden y series matemáticas.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl overflow-x-auto self-start sm:self-auto">
          <button
            onClick={() => {
              playClick();
              setActiveTab('explorar');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'explorar' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Tabla 0-100
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveTab('identifica');
              setupIdentifica();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'identifica' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Identificar
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveTab('ordenar');
              setupOrdenar();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'ordenar' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Ordenar
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveTab('anterior');
              setupAnt();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'anterior' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Anterior y Siguiente
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveTab('mayor');
              setupMayor();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'mayor' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Mayor o Menor
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveTab('pares');
              setupPar();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'pares' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Pares / Impares
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveTab('secuencias');
              setupSecuencias();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'secuencias' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Secuencias
          </button>
        </div>
      </div>

      {/* TAB 1: TABLA 0-100 */}
      {activeTab === 'explorar' && (
        <div className="space-y-6">
          {/* Detail card of active number */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-3xl shadow-sm">
                {fact.n}
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                  En palabras en español
                </span>
                <h3 className="text-2xl font-black text-slate-900 font-display capitalize">
                  {fact.word}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    fact.isEven ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {fact.isEven ? 'Número Par' : 'Número Impar'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {fact.decenas} decenas, {fact.unidades} unidades
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 italic text-center sm:text-right">
              Toca cualquier casilla para inspeccionar su nombre y propiedades.
            </p>
          </div>

          {/* 101 cells from 0 to 100 */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200">
            <div className="grid grid-cols-10 gap-1.5">
              {Array.from({ length: 101 }).map((_, i) => {
                const isSelected = i === exploreNum;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      playClick();
                      setExploreNum(i);
                      speak(numberToSpanish(i));
                    }}
                    className={`aspect-square rounded-xl text-xs font-bold transition-all active:scale-90 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300 scale-105 z-10'
                        : i % 2 === 0
                        ? 'bg-slate-50 hover:bg-indigo-50 text-slate-700'
                        : 'bg-white hover:bg-indigo-50 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {i}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: IDENTIFICA */}
      {activeTab === 'identifica' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Lectura y Escritura
            </span>
            <p className="text-xs text-slate-500">¿Qué número corresponde a esta palabra escrita?</p>
            <h3 className="text-3xl font-extrabold text-slate-900 font-display capitalize">
              "{numberToSpanish(identTarget)}"
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {identOptions.map((n) => {
              const isChosen = identChosen === n;
              const isCorrect = n === identTarget;
              let style = 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200';

              if (identChosen !== null) {
                if (isCorrect) style = 'bg-emerald-500 text-white border-emerald-600';
                else if (isChosen) style = 'bg-rose-500 text-white border-rose-600';
                else style = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
              }

              return (
                <button
                  key={n}
                  onClick={() => handleIdent(n)}
                  disabled={identChosen !== null}
                  className={`p-4 rounded-2xl border text-xl font-black transition-all active:scale-95 ${style}`}
                >
                  {n}
                </button>
              );
            })}
          </div>

          {identChosen && (
            <div className="text-center pt-2">
              <button
                onClick={setupIdentifica}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold active:scale-95 shadow-md"
              >
                Siguiente Número →
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ORDENAR NÚMEROS */}
      {activeTab === 'ordenar' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Orden Ascendente
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Toca los números en orden: del <strong className="text-indigo-600">MENOR al MAYOR</strong>
            </h3>
          </div>

          {/* User selected slots */}
          <div className="flex justify-center gap-3 py-2">
            {[0, 1, 2, 3].map((slot) => {
              const num = userOrdered[slot];
              return (
                <div
                  key={slot}
                  className="w-16 h-16 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 flex items-center justify-center text-xl font-black text-indigo-900"
                >
                  {num !== undefined ? num : ''}
                </div>
              );
            })}
          </div>

          {/* Available numbers */}
          <div className="flex justify-center gap-3">
            {orderItems.map((n) => {
              const isUsed = userOrdered.includes(n);
              return (
                <button
                  key={n}
                  onClick={() => handleSelectOrderItem(n)}
                  disabled={isUsed || orderChecked}
                  className={`w-16 h-16 rounded-2xl border text-xl font-bold transition-all active:scale-95 ${
                    isUsed
                      ? 'bg-slate-100 text-slate-300 border-slate-200'
                      : 'bg-white hover:bg-indigo-50 text-slate-900 border-slate-300 shadow-xs'
                  }`}
                >
                  {n}
                </button>
              );
            })}
          </div>

          {orderChecked && (
            <div className="text-center space-y-3 pt-2">
              <p className={`text-xs font-bold ${orderCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                {orderCorrect
                  ? '¡Excelente! Los ordenaste correctamente de menor a mayor.'
                  : `Secuencia incorrecta. El orden correcto era: ${[...orderItems].sort((a, b) => a - b).join(', ')}`}
              </p>
              <button
                onClick={setupOrdenar}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold active:scale-95 shadow-md"
              >
                Nueva Secuencia →
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ANTERIOR Y SIGUIENTE */}
      {activeTab === 'anterior' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Sucesión Numérica
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Escribe el número anterior y el número siguiente:
            </h3>
          </div>

          <div className="flex items-center justify-center gap-3 max-w-md mx-auto py-4">
            <input
              type="number"
              placeholder="Antes"
              value={antPrevInput}
              onChange={(e) => setAntPrevInput(e.target.value)}
              disabled={antChecked}
              className="w-24 p-3 rounded-2xl border-2 border-slate-300 text-center font-bold text-lg focus:border-indigo-500 focus:outline-none"
            />

            <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-3xl font-black shadow-md">
              {antTarget}
            </div>

            <input
              type="number"
              placeholder="Después"
              value={antNextInput}
              onChange={(e) => setAntNextInput(e.target.value)}
              disabled={antChecked}
              className="w-24 p-3 rounded-2xl border-2 border-slate-300 text-center font-bold text-lg focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="text-center">
            {!antChecked ? (
              <button
                onClick={checkAnt}
                disabled={!antPrevInput || !antNextInput}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold active:scale-95 disabled:opacity-50"
              >
                Comprobar
              </button>
            ) : (
              <div className="space-y-3">
                <p className={`text-xs font-bold ${antCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {antCorrect
                    ? `¡Correcto! ${antTarget - 1} < ${antTarget} < ${antTarget + 1}`
                    : `No es correcto. El anterior es ${antTarget - 1} y el siguiente es ${antTarget + 1}.`}
                </p>
                <button
                  onClick={setupAnt}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold active:scale-95 shadow-md"
                >
                  Otro Número →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: MAYOR O MENOR */}
      {activeTab === 'mayor' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Comparación Numérica
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              ¿Qué signo corresponde entre ambos números?
            </h3>
          </div>

          <div className="flex items-center justify-center gap-6 py-4">
            <div className="w-24 h-24 rounded-3xl bg-slate-100 border border-slate-300 flex items-center justify-center text-3xl font-black text-slate-900">
              {compA}
            </div>

            <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-indigo-400 flex items-center justify-center text-3xl font-black text-indigo-600">
              {compChosen || '?'}
            </div>

            <div className="w-24 h-24 rounded-3xl bg-slate-100 border border-slate-300 flex items-center justify-center text-3xl font-black text-slate-900">
              {compB}
            </div>
          </div>

          <div className="flex justify-center gap-3">
            {[
              { sym: '>', label: 'Mayor que (>)' },
              { sym: '<', label: 'Menor que (<)' },
              { sym: '=', label: 'Igual a (=)' },
            ].map((btn) => (
              <button
                key={btn.sym}
                onClick={() => handleComp(btn.sym as any)}
                disabled={compChosen !== null}
                className="px-4 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-indigo-50 text-xs font-bold text-slate-800 transition-all active:scale-95"
              >
                {btn.label}
              </button>
            ))}
          </div>

          {compChosen && (
            <div className="text-center pt-2">
              <button
                onClick={setupMayor}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold active:scale-95 shadow-md"
              >
                Siguiente Comparación →
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: PARES / IMPARES */}
      {activeTab === 'pares' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Paridad
            </span>
            <p className="text-xs text-slate-500">¿Este número es par o impar?</p>
            <h3 className="text-6xl font-black text-indigo-600 font-display py-4">
              {parTarget}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            <button
              onClick={() => handlePar('par')}
              disabled={parChosen !== null}
              className={`p-4 rounded-2xl border text-sm font-bold transition-all active:scale-95 ${
                parChosen !== null
                  ? parTarget % 2 === 0
                    ? 'bg-emerald-500 text-white border-emerald-600'
                    : parChosen === 'par'
                    ? 'bg-rose-500 text-white border-rose-600'
                    : 'bg-slate-100 text-slate-400 border-slate-200'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              Es PAR
            </button>

            <button
              onClick={() => handlePar('impar')}
              disabled={parChosen !== null}
              className={`p-4 rounded-2xl border text-sm font-bold transition-all active:scale-95 ${
                parChosen !== null
                  ? parTarget % 2 !== 0
                    ? 'bg-emerald-500 text-white border-emerald-600'
                    : parChosen === 'impar'
                    ? 'bg-rose-500 text-white border-rose-600'
                    : 'bg-slate-100 text-slate-400 border-slate-200'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              Es IMPAR
            </button>
          </div>

          {parChosen && (
            <div className="text-center space-y-3 pt-2">
              <p className="text-xs text-slate-600">
                💡 Todo número terminado en 0, 2, 4, 6 u 8 es par. Si termina en 1, 3, 5, 7 o 9 es impar.
              </p>
              <button
                onClick={setupPar}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold active:scale-95 shadow-md"
              >
                Siguiente Número →
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 7: SECUENCIAS */}
      {activeTab === 'secuencias' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Patrones Numéricos
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              ¿Cuál es el siguiente número que completa la serie?
            </h3>
          </div>

          <div className="flex items-center justify-center gap-3 py-4">
            {seqNumbers.map((n, i) => (
              <div
                key={i}
                className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-300 flex items-center justify-center text-xl font-black text-slate-800"
              >
                {n}
              </div>
            ))}
            <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-indigo-400 flex items-center justify-center text-xl font-black text-indigo-600">
              {seqChosen !== null ? seqChosen : '?'}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto">
            {seqOptions.map((opt) => {
              const isChosen = seqChosen === opt;
              const isCorrect = opt === seqMissing;
              let style = 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200';

              if (seqChosen !== null) {
                if (isCorrect) style = 'bg-emerald-500 text-white border-emerald-600';
                else if (isChosen) style = 'bg-rose-500 text-white border-rose-600';
                else style = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSeq(opt)}
                  disabled={seqChosen !== null}
                  className={`p-3.5 rounded-2xl border font-black text-lg transition-all active:scale-95 ${style}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {seqChosen && (
            <div className="text-center pt-2">
              <button
                onClick={setupSecuencias}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold active:scale-95 shadow-md"
              >
                Siguiente Secuencia →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
