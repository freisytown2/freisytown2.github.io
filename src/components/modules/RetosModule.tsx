import React, { useState, useEffect } from 'react';
import { LOGIC_RIDDLES, WORD_ANAGRAMS } from '../../data/retosData';
import { playClick, playCorrect, playIncorrect, playSuccess, speak, speakCorrect, speakIncorrect } from '../../utils/audio';
import { fireConfetti } from '../../utils/confetti';
import { Zap, Brain, Type, Calculator, HelpCircle, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface RetosModuleProps {
  onAddScore: (isCorrect: boolean, extraPts?: number) => void;
}

export const RetosModule: React.FC<RetosModuleProps> = ({ onAddScore }) => {
  const [activeReto, setActiveReto] = useState<'logica' | 'anagrama' | 'secuencia' | 'calculo'>('logica');

  // Reto 1: Lógica
  const [logicIdx, setLogicIdx] = useState(0);
  const [logicChosen, setLogicChosen] = useState<number | null>(null);

  // Reto 2: Anagrama de Palabras
  const [anaIdx, setAnaIdx] = useState(0);
  const [anaUserLetters, setAnaUserLetters] = useState<string[]>([]);
  const [anaChecked, setAnaChecked] = useState(false);
  const [anaCorrect, setAnaCorrect] = useState(false);

  // Reto 3: Memoria Secuencial (Simon)
  const [simonSequence, setSimonSequence] = useState<number[]>([]);
  const [simonUserStep, setSimonUserStep] = useState(0);
  const [simonActiveLight, setSimonActiveLight] = useState<number | null>(null);
  const [simonPlaying, setSimonPlaying] = useState(false);
  const [simonLevel, setSimonLevel] = useState(1);
  const [simonFailed, setSimonFailed] = useState(false);

  // Reto 4: Cálculo Rápido
  const [calcA, setCalcA] = useState(12);
  const [calcB, setCalcB] = useState(15);
  const [calcOp, setCalcOp] = useState<'+' | '-' | '×'>('+');
  const [calcOpts, setCalcOpts] = useState<number[]>([]);
  const [calcChosen, setCalcChosen] = useState<number | null>(null);

  const currentLogic = LOGIC_RIDDLES[logicIdx];
  const currentAna = WORD_ANAGRAMS[anaIdx];

  // Setup Anagram letters
  const setupAnagram = (idx = anaIdx) => {
    const letters = WORD_ANAGRAMS[idx].solution.split('').sort(() => 0.5 - Math.random());
    setAnaUserLetters([]);
    setAnaChecked(false);
    setAnaCorrect(false);
  };

  // Setup Quick Calc
  const setupCalc = () => {
    const ops: ('+' | '-' | '×')[] = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a = 0;
    let b = 0;
    let target = 0;

    if (op === '+') {
      a = Math.floor(Math.random() * 50) + 15;
      b = Math.floor(Math.random() * 50) + 15;
      target = a + b;
    } else if (op === '-') {
      a = Math.floor(Math.random() * 60) + 40;
      b = Math.floor(Math.random() * 35) + 10;
      target = a - b;
    } else {
      a = Math.floor(Math.random() * 12) + 2;
      b = Math.floor(Math.random() * 12) + 2;
      target = a * b;
    }

    setCalcA(a);
    setCalcB(b);
    setCalcOp(op);
    setCalcChosen(null);

    const opts = new Set<number>([target]);
    while (opts.size < 4) {
      const delta = (Math.floor(Math.random() * 4) + 1) * (Math.random() > 0.5 ? 1 : -1) * (op === '×' ? 2 : 5);
      opts.add(Math.max(1, target + delta));
    }
    setCalcOpts(Array.from(opts).sort(() => 0.5 - Math.random()));
  };

  useEffect(() => {
    setupAnagram();
    setupCalc();
  }, []);

  // Simon Game Engine
  const startSimon = () => {
    playClick();
    setSimonFailed(false);
    const newSeq = [Math.floor(Math.random() * 4)];
    setSimonSequence(newSeq);
    setSimonLevel(1);
    playSimonSequence(newSeq);
  };

  const playSimonSequence = (seq: number[]) => {
    setSimonPlaying(false);
    setSimonUserStep(0);
    seq.forEach((colorIdx, step) => {
      setTimeout(() => {
        setSimonActiveLight(colorIdx);
        playClick();
        setTimeout(() => {
          setSimonActiveLight(null);
          if (step === seq.length - 1) {
            setSimonPlaying(true);
          }
        }, 400);
      }, (step + 1) * 700);
    });
  };

  const handleSimonClick = (colorIdx: number) => {
    if (!simonPlaying) return;
    playClick();
    setSimonActiveLight(colorIdx);
    setTimeout(() => setSimonActiveLight(null), 200);

    if (simonSequence[simonUserStep] === colorIdx) {
      const nextStep = simonUserStep + 1;
      setSimonUserStep(nextStep);

      if (nextStep === simonSequence.length) {
        // Round passed!
        playCorrect();
        if (simonLevel >= 5) {
          // Completed Master Level
          fireConfetti();
          speakCorrect();
          onAddScore(true, 30);
          setSimonPlaying(false);
        } else {
          setSimonLevel((l) => l + 1);
          const nextSeq = [...simonSequence, Math.floor(Math.random() * 4)];
          setSimonSequence(nextSeq);
          setTimeout(() => playSimonSequence(nextSeq), 1000);
        }
      }
    } else {
      // Failed!
      playIncorrect();
      speakIncorrect('Inténtalo de nuevo.');
      setSimonFailed(true);
      setSimonPlaying(false);
      onAddScore(false);
    }
  };

  // Logic answer
  const handleLogic = (idx: number) => {
    if (logicChosen !== null) return;
    setLogicChosen(idx);
    const ok = idx === currentLogic.correctIndex;
    if (ok) {
      playCorrect();
      fireConfetti();
      speakCorrect();
      onAddScore(true, 20);
    } else {
      playIncorrect();
      speakIncorrect('Inténtalo de nuevo.');
      onAddScore(false);
    }
  };

  // Anagram
  const handleAnaLetterClick = (letter: string) => {
    playClick();
    speak(letter);
    const updated = [...anaUserLetters, letter];
    setAnaUserLetters(updated);

    if (updated.length === currentAna.solution.length) {
      const formed = updated.join('');
      const ok = formed === currentAna.solution;
      setAnaChecked(true);
      setAnaCorrect(ok);
      if (ok) {
        playCorrect();
        fireConfetti();
        speakCorrect(currentAna.solution);
        onAddScore(true, 20);
      } else {
        playIncorrect();
        speakIncorrect('Inténtalo de nuevo.');
        onAddScore(false);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16">
      {/* Title & Challenge Tabs */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display flex items-center gap-2">
            <span>⚡</span> Retos y Desafíos Mentales
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            4 pruebas independientes para ejercitar lógica, memoria secuencial y agilidad de cálculo.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl overflow-x-auto self-start sm:self-auto">
          <button
            onClick={() => {
              playClick();
              setActiveReto('logica');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeReto === 'logica' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            🧠 Lógica
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveReto('anagrama');
              setupAnagram();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeReto === 'anagrama' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            🔤 Anagrama
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveReto('secuencia');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeReto === 'secuencia' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            💡 Secuencia Simon
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveReto('calculo');
              setupCalc();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeReto === 'calculo' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            ⚡ Cálculo Rápido
          </button>
        </div>
      </div>

      {/* RETO 1: LÓGICA */}
      {activeReto === 'logica' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              Acertijo de Deducción
            </span>
            <span className="text-xs text-slate-400">
              Reto {logicIdx + 1} de {LOGIC_RIDDLES.length}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900 font-display">
              {currentLogic.title}
            </h3>
            <p className="text-base font-semibold text-slate-800 leading-relaxed bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
              "{currentLogic.riddle}"
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentLogic.options.map((opt, idx) => {
              const isChosen = logicChosen === idx;
              const isTarget = idx === currentLogic.correctIndex;
              let style = 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200';

              if (logicChosen !== null) {
                if (isTarget) style = 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300';
                else if (isChosen) style = 'bg-rose-500 text-white border-rose-600';
                else style = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleLogic(idx)}
                  disabled={logicChosen !== null}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left flex items-center justify-between transition-all active:scale-98 ${style}`}
                >
                  <span>{opt}</span>
                  {logicChosen !== null && isTarget && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                  {logicChosen !== null && isChosen && !isTarget && <XCircle className="w-5 h-5 shrink-0" />}
                </button>
              );
            })}
          </div>

          {logicChosen !== null && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700">
                <strong>Razonamiento:</strong> {currentLogic.explanation}
              </div>

              <div className="text-center">
                <button
                  onClick={() => {
                    playClick();
                    setLogicIdx((prev) => (prev + 1) % LOGIC_RIDDLES.length);
                    setLogicChosen(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold active:scale-95 shadow-md"
                >
                  Siguiente Acertijo →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RETO 2: ANAGRAMA */}
      {activeReto === 'anagrama' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              Descifra la Palabra
            </span>
            <span className="text-xs text-slate-400">Categoría: {currentAna.category}</span>
          </div>

          <div className="text-center space-y-2">
            <p className="text-xs text-slate-500">Ordena las letras para formar la palabra correcta:</p>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-widest bg-slate-50 py-3 px-6 rounded-2xl inline-block border border-slate-200">
              {currentAna.scrambled}
            </div>
            <p className="text-xs text-slate-400 italic">Pista: {currentAna.hint}</p>
          </div>

          {/* User Formed Word Display */}
          <div className="flex items-center justify-center gap-2 min-h-14">
            {Array.from({ length: currentAna.solution.length }).map((_, i) => (
              <div
                key={i}
                className="w-11 h-11 rounded-xl border-2 border-dashed border-orange-300 bg-orange-50/50 flex items-center justify-center font-bold text-lg text-orange-950 font-mono"
              >
                {anaUserLetters[i] || ''}
              </div>
            ))}
          </div>

          {/* Scrambled Available Letters */}
          <div className="flex flex-wrap justify-center gap-2">
            {currentAna.solution.split('').map((letter, i) => {
              // Count occurrences used
              const countUsed = anaUserLetters.filter((l) => l === letter).length;
              const countTotal = currentAna.solution.split('').filter((l) => l === letter).length;
              const isExhausted = countUsed >= countTotal;

              return (
                <button
                  key={i}
                  onClick={() => handleAnaLetterClick(letter)}
                  disabled={isExhausted || anaChecked}
                  className={`w-12 h-12 rounded-2xl border font-black text-lg transition-all active:scale-90 ${
                    isExhausted
                      ? 'bg-slate-100 text-slate-300 border-slate-200'
                      : 'bg-white hover:bg-orange-50 text-slate-900 border-slate-300 shadow-xs'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>

          {anaUserLetters.length > 0 && !anaChecked && (
            <div className="text-center">
              <button
                onClick={() => setAnaUserLetters([])}
                className="text-xs text-rose-600 font-bold hover:underline"
              >
                Borrar letras
              </button>
            </div>
          )}

          {anaChecked && (
            <div className="text-center space-y-3 pt-2">
              <p className={`text-xs font-bold ${anaCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                {anaCorrect
                  ? `¡Correcto! Formaste la palabra "${currentAna.solution}".`
                  : `Incorrecto. La palabra correcta era "${currentAna.solution}".`}
              </p>
              <button
                onClick={() => {
                  playClick();
                  const nextI = (anaIdx + 1) % WORD_ANAGRAMS.length;
                  setAnaIdx(nextI);
                  setupAnagram(nextI);
                }}
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold active:scale-95 shadow-md"
              >
                Siguiente Anagrama →
              </button>
            </div>
          )}
        </div>
      )}

      {/* RETO 3: SECUENCIA SIMON */}
      {activeReto === 'secuencia' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 max-w-md mx-auto">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              Memoria Secuencial
            </span>
            <span className="text-xs font-bold text-slate-600">Nivel {simonLevel}</span>
          </div>

          <div className="text-center space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              {simonPlaying
                ? '¡Tu turno! Repite la secuencia de colores'
                : simonFailed
                ? '¡Ups, te equivocaste!'
                : 'Observa y memoriza el patrón luminoso'}
            </h3>
          </div>

          {/* 4 Colored Panels */}
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto aspect-square p-2">
            {[
              { id: 0, color: 'bg-rose-500', active: 'ring-8 ring-rose-300 scale-95 brightness-125' },
              { id: 1, color: 'bg-sky-500', active: 'ring-8 ring-sky-300 scale-95 brightness-125' },
              { id: 2, color: 'bg-emerald-500', active: 'ring-8 ring-emerald-300 scale-95 brightness-125' },
              { id: 3, color: 'bg-amber-500', active: 'ring-8 ring-amber-300 scale-95 brightness-125' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => handleSimonClick(btn.id)}
                disabled={!simonPlaying}
                className={`rounded-3xl transition-all duration-150 ${btn.color} ${
                  simonActiveLight === btn.id ? btn.active : 'opacity-85 hover:opacity-100'
                }`}
              />
            ))}
          </div>

          {/* Start / Restart Button */}
          <div className="text-center pt-2">
            {!simonPlaying && (
              <button
                onClick={startSimon}
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold active:scale-95 shadow-md"
              >
                {simonFailed ? 'Reintentar' : 'Comenzar Secuencia'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* RETO 4: CÁLCULO RÁPIDO */}
      {activeReto === 'calculo' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 max-w-md mx-auto">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              Velocidad de Reacción
            </span>
            <div className="text-5xl font-black text-slate-900 font-display py-4 font-mono">
              {calcA} {calcOp} {calcB} = ?
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {calcOpts.map((opt) => {
              const target = calcOp === '+' ? calcA + calcB : calcOp === '-' ? calcA - calcB : calcA * calcB;
              const isTarget = opt === target;
              let style = 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200';

              if (calcChosen !== null) {
                if (isTarget) style = 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300';
                else style = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
              }

              return (
                <button
                  key={opt}
                  onClick={() => {
                    if (calcChosen !== null) return;
                    setCalcChosen(opt);
                    const ok = opt === target;
                    if (ok) {
                      playCorrect();
                      fireConfetti();
                      speakCorrect();
                      onAddScore(true, 15);
                    } else {
                      playIncorrect();
                      speakIncorrect('Inténtalo de nuevo.');
                      onAddScore(false);
                    }
                  }}
                  disabled={calcChosen !== null}
                  className={`py-4 rounded-2xl border text-xl font-bold font-mono transition-all active:scale-95 ${style}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {calcChosen !== null && (
            <div className="text-center pt-2">
              <button
                onClick={setupCalc}
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold active:scale-95 shadow-md"
              >
                Siguiente Reto Aritmético →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
