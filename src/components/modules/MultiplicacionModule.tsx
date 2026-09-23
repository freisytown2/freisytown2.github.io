import React, { useState, useEffect } from 'react';
import { playClick, playCorrect, playIncorrect, speak, speakCorrect, speakIncorrect } from '../../utils/audio';
import { fireConfetti } from '../../utils/confetti';
import { Sparkles, Timer, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';

interface MultiplicacionModuleProps {
  onAddScore: (isCorrect: boolean, extraPts?: number) => void;
}

export const MultiplicacionModule: React.FC<MultiplicacionModuleProps> = ({ onAddScore }) => {
  const [activeTab, setActiveTab] = useState<'estudiar' | 'practicar' | 'reloj'>('estudiar');
  const [selectedTable, setSelectedTable] = useState(7);
  const [visualMultiplier, setVisualMultiplier] = useState(4);

  // Practice state
  const [practA, setPractA] = useState(7);
  const [practB, setPractB] = useState(6);
  const [practOptions, setPractOptions] = useState<number[]>([]);
  const [practAnswered, setPractAnswered] = useState(false);
  const [practCorrect, setPractCorrect] = useState(false);
  const [practWrongOptions, setPractWrongOptions] = useState<number[]>([]);

  // Contrarreloj state
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [relojScore, setRelojScore] = useState(0);
  const [relojA, setRelojA] = useState(8);
  const [relojB, setRelojB] = useState(7);
  const [relojOptions, setRelojOptions] = useState<number[]>([]);

  // Setup practice
  const setupPractice = () => {
    const a = selectedTable === 0 ? Math.floor(Math.random() * 12) + 1 : selectedTable;
    const b = Math.floor(Math.random() * 12) + 1;
    setPractA(a);
    setPractB(b);
    setPractAnswered(false);
    setPractCorrect(false);
    setPractWrongOptions([]);

    const product = a * b;
    const opts = new Set<number>([product]);
    while (opts.size < 4) {
      const delta = (Math.floor(Math.random() * 4) + 1) * a * (Math.random() > 0.5 ? 1 : -1);
      const val = product + delta;
      if (val > 0 && val !== product) opts.add(val);
      else opts.add(Math.max(1, product + (Math.floor(Math.random() * 10) - 5)));
    }
    setPractOptions(Array.from(opts).sort(() => 0.5 - Math.random()));
  };

  // Setup reloj question
  const nextRelojQuestion = () => {
    const a = Math.floor(Math.random() * 10) + 2;
    const b = Math.floor(Math.random() * 10) + 2;
    setRelojA(a);
    setRelojB(b);

    const prod = a * b;
    const opts = new Set<number>([prod]);
    while (opts.size < 4) {
      const delta = (Math.floor(Math.random() * 3) + 1) * (Math.random() > 0.5 ? 1 : -1) * 2;
      opts.add(Math.max(2, prod + delta));
    }
    setRelojOptions(Array.from(opts).sort(() => 0.5 - Math.random()));
  };

  useEffect(() => {
    setupPractice();
  }, [selectedTable]);

  // Timer loop for contrarreloj
  useEffect(() => {
    let timer: any = null;
    if (timerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      fireConfetti();
      onAddScore(true, relojScore * 5);
    }
    return () => clearInterval(timer);
  }, [timerRunning, timeLeft]);

  const startContrarreloj = () => {
    playClick();
    setTimeLeft(60);
    setRelojScore(0);
    setTimerRunning(true);
    nextRelojQuestion();
  };

  const handleRelojAnswer = (opt: number) => {
    if (!timerRunning) return;
    const ok = opt === relojA * relojB;
    if (ok) {
      playCorrect();
      speakCorrect();
      setRelojScore((s) => s + 1);
      onAddScore(true, 5);
    } else {
      playIncorrect();
      speakIncorrect('Inténtalo de nuevo.');
    }
    nextRelojQuestion();
  };

  const handlePractAnswer = (opt: number) => {
    if (practAnswered || practWrongOptions.includes(opt)) return;
    const ok = opt === practA * practB;
    if (ok) {
      setPractAnswered(true);
      setPractCorrect(true);
      playCorrect();
      fireConfetti();
      speakCorrect('Respuesta correcta.');
      onAddScore(true);
    } else {
      playIncorrect();
      speakIncorrect('Inténtalo de nuevo.');
      setPractWrongOptions((prev) => [...prev, opt]);
      onAddScore(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Title & Modes */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display flex items-center gap-2">
            <span>✖️</span> Tablas de Multiplicar (1 al 12)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Visualización geométrica, ejercicios específicos y modo contrarreloj de 60s.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl overflow-x-auto self-start sm:self-auto">
          <button
            onClick={() => {
              playClick();
              setActiveTab('estudiar');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'estudiar' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Estudiar Tablas
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveTab('practicar');
              setupPractice();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'practicar' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Practicar
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveTab('reloj');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'reloj' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            ⏱️ Contrarreloj (60s)
          </button>
        </div>
      </div>

      {/* Select Table Pills (for Estudiar & Practicar) */}
      {activeTab !== 'reloj' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-500 mr-1">Tabla:</span>
          {Array.from({ length: 12 }).map((_, i) => {
            const num = i + 1;
            const isSel = selectedTable === num;
            return (
              <button
                key={num}
                onClick={() => {
                  playClick();
                  setSelectedTable(num);
                }}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all active:scale-95 shrink-0 ${
                  isSel
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>
      )}

      {/* TAB 1: ESTUDIAR */}
      {activeTab === 'estudiar' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: 12 Lines */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-2 shadow-2xs">
            <h3 className="text-base font-extrabold text-slate-900 font-display pb-2 border-b border-slate-100">
              Tabla del {selectedTable}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Array.from({ length: 12 }).map((_, i) => {
                const multiplier = i + 1;
                const isVisual = visualMultiplier === multiplier;
                return (
                  <button
                    key={multiplier}
                    onClick={() => {
                      playClick();
                      setVisualMultiplier(multiplier);
                      speak(`${selectedTable} por ${multiplier} igual a ${selectedTable * multiplier}`);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-mono font-bold flex items-center justify-between transition-all ${
                      isVisual
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-900 ring-1 ring-indigo-400'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <span>{selectedTable} × {multiplier}</span>
                    <span className="text-indigo-600">= {selectedTable * multiplier}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Visual Matrix Grid */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                Explicación Visual y Geométrica
              </span>
              <h4 className="text-xl font-black text-slate-900 font-display mt-1">
                {selectedTable} × {visualMultiplier} = {selectedTable * visualMultiplier}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Representa {selectedTable} filas de {visualMultiplier} elementos cada una (o {visualMultiplier} grupos de {selectedTable}).
              </p>
            </div>

            {/* Dot Matrix */}
            <div className="py-4 flex justify-center items-center bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto p-4">
              <div
                className="grid gap-1.5"
                style={{ gridTemplateColumns: `repeat(${visualMultiplier}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: selectedTable * visualMultiplier }).map((_, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-full bg-gradient-to-tr from-indigo-600 to-sky-400 shadow-2xs"
                  />
                ))}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center italic">
              💡 Propiedad conmutativa: {selectedTable} × {visualMultiplier} es exactamente igual a {visualMultiplier} × {selectedTable}.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: PRACTICAR */}
      {activeTab === 'practicar' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6 max-w-xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Práctica de la Tabla del {selectedTable}
            </span>
            <div className="text-5xl font-black text-slate-900 font-display py-4 font-mono">
              {practA} × {practB} = ?
            </div>
          </div>

          {/* 4 Options */}
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {practOptions.map((opt) => {
              const isCorrect = opt === practA * practB;
              const isWrong = practWrongOptions.includes(opt);
              let style = 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200';

              if (practAnswered) {
                if (isCorrect) style = 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300';
                else style = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
              } else if (isWrong) {
                style = 'bg-rose-50 text-rose-500 border-rose-200 opacity-60 cursor-not-allowed';
              }

              return (
                <button
                  key={opt}
                  onClick={() => handlePractAnswer(opt)}
                  disabled={practAnswered || isWrong}
                  className={`py-4 rounded-2xl border text-xl font-bold font-mono transition-all active:scale-95 ${style}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {practAnswered && (
            <div className="text-center space-y-3 pt-2">
              <p className={`text-xs font-bold ${practCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                {practCorrect
                  ? '¡Excelente cálculo!'
                  : `Incorrecto. El resultado de ${practA} × ${practB} es ${practA * practB}.`}
              </p>
              <button
                onClick={setupPractice}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold active:scale-95 shadow-md"
              >
                Siguiente Multiplicación →
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CONTRARRELOJ (60s) */}
      {activeTab === 'reloj' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6 max-w-xl mx-auto">
          {!timerRunning && timeLeft === 60 && (
            <div className="text-center space-y-4 py-6">
              <span className="text-6xl block">⚡</span>
              <h3 className="text-2xl font-black text-slate-900 font-display">
                Desafío Contrarreloj 60 Segundos
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                ¿Cuántas multiplicaciones puedes resolver antes de que el reloj llegue a cero? ¡Prueba tu velocidad mental!
              </p>
              <button
                onClick={startContrarreloj}
                className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all active:scale-95"
              >
                ¡Comenzar Desafío Ahora!
              </button>
            </div>
          )}

          {timerRunning && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg font-mono">
                  <Timer className="w-5 h-5 animate-spin" />
                  <span>{timeLeft}s</span>
                </div>
                <div className="text-xs font-bold text-slate-600">
                  Aciertos: <span className="text-indigo-600 text-base">{relojScore}</span>
                </div>
              </div>

              <div className="text-center py-4">
                <div className="text-5xl font-black text-slate-900 font-display font-mono">
                  {relojA} × {relojB}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                {relojOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleRelojAnswer(opt)}
                    className="py-4 rounded-2xl border border-slate-200 bg-white hover:bg-indigo-50 text-xl font-bold font-mono transition-all active:scale-95"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!timerRunning && timeLeft === 0 && (
            <div className="text-center space-y-4 py-6">
              <span className="text-6xl block">🏆</span>
              <h3 className="text-2xl font-black text-slate-900 font-display">
                ¡Tiempo Cumplido!
              </h3>
              <p className="text-base font-extrabold text-indigo-600">
                Resolviste {relojScore} multiplicaciones correctas (+{relojScore * 5} pts ganados).
              </p>
              <button
                onClick={startContrarreloj}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold active:scale-95 shadow-md inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Intentar de Nuevo</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
