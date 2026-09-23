import React, { useState, useEffect } from 'react';
import { playClick, playCorrect, playIncorrect, speakCorrect, speakIncorrect } from '../../utils/audio';
import { fireConfetti } from '../../utils/confetti';
import { Sparkles, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface RestaModuleProps {
  onAddScore: (isCorrect: boolean, extraPts?: number) => void;
}

export const RestaModule: React.FC<RestaModuleProps> = ({ onAddScore }) => {
  const [difficulty, setDifficulty] = useState<'facil' | 'medio' | 'dificil'>('facil');
  const [numA, setNumA] = useState(15);
  const [numB, setNumB] = useState(7);
  const [userInput, setUserInput] = useState('');
  const [options, setOptions] = useState<number[]>([]);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wrongOptions, setWrongOptions] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);

  const generateExercise = (diff = difficulty) => {
    let a = 0;
    let b = 0;
    if (diff === 'facil') {
      a = Math.floor(Math.random() * 15) + 5;
      b = Math.floor(Math.random() * a);
    } else if (diff === 'medio') {
      a = Math.floor(Math.random() * 70) + 20;
      b = Math.floor(Math.random() * (a - 10)) + 5;
    } else {
      a = Math.floor(Math.random() * 800) + 100;
      b = Math.floor(Math.random() * (a - 50)) + 25;
    }

    setNumA(a);
    setNumB(b);
    setUserInput('');
    setAnswered(false);
    setIsCorrect(false);
    setWrongOptions([]);

    const diffVal = a - b;
    const opts = new Set<number>([diffVal]);
    while (opts.size < 4) {
      const delta = (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const val = diffVal + delta;
      if (val >= 0) opts.add(val);
    }
    setOptions(Array.from(opts).sort(() => 0.5 - Math.random()));
  };

  useEffect(() => {
    generateExercise();
  }, [difficulty]);

  const handleSelectOption = (opt: number) => {
    if (answered || wrongOptions.includes(opt)) return;
    setUserInput(String(opt));
    const correctVal = numA - numB;
    const ok = opt === correctVal;

    if (ok) {
      setAnswered(true);
      setIsCorrect(true);
      playCorrect();
      fireConfetti();
      speakCorrect('Respuesta correcta.');
      setStreak((s) => s + 1);
      onAddScore(true, difficulty === 'dificil' ? 15 : 10);
    } else {
      playIncorrect();
      speakIncorrect('Inténtalo de nuevo.');
      setWrongOptions((prev) => [...prev, opt]);
      setStreak(0);
      onAddScore(false);
    }
  };


  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-16">
      {/* Title & Difficulty */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display flex items-center gap-2">
            <span>➖</span> Práctica de Resta
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Diferencia de números de 1, 2 y 3 cifras con y sin préstamo.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl self-start sm:self-auto">
          {(['facil', 'medio', 'dificil'] as const).map((d) => (
            <button
              key={d}
              onClick={() => {
                playClick();
                setDifficulty(d);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                difficulty === d ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              {d === 'facil' ? 'Básico' : d === 'medio' ? 'Medio' : 'Avanzado'}
            </button>
          ))}
        </div>
      </div>

      {/* Streak badge */}
      <div className="flex justify-center">
        <span className="text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          🔥 Racha actual: {streak} aciertos seguidos
        </span>
      </div>

      {/* Resta Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        {/* Arithmetic display */}
        <div className="flex flex-col items-center">
          <div className="font-mono text-4xl sm:text-5xl font-black text-slate-900 tracking-wider space-y-1 text-right inline-block">
            <div>{numA}</div>
            <div className="flex items-center justify-end gap-3 border-b-4 border-slate-800 pb-1">
              <span className="text-orange-600 text-3xl font-sans font-bold">−</span>
              <span>{numB}</span>
            </div>
            <div className="pt-2 text-center text-indigo-600 font-display">
              {answered ? numA - numB : userInput || '?'}
            </div>
          </div>
        </div>

        {/* 4 Quick Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto">
          {options.map((opt) => {
            const isChosen = userInput === String(opt);
            const isTarget = opt === numA - numB;
            const isWrong = wrongOptions.includes(opt);
            let style = 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200';

            if (answered) {
              if (isTarget) style = 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300';
              else if (isChosen) style = 'bg-rose-500 text-white border-rose-600';
              else style = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
            } else if (isWrong) {
              style = 'bg-rose-50 text-rose-500 border-rose-200 opacity-60 cursor-not-allowed';
            }

            return (
              <button
                key={opt}
                onClick={() => handleSelectOption(opt)}
                disabled={answered || isWrong}
                className={`py-4 rounded-2xl border text-xl font-bold font-mono transition-all active:scale-95 ${style}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Step-by-step breakdown */}
        {answered && (
          <div className="space-y-4 pt-2">
            <div
              className={`p-4 rounded-2xl text-xs font-semibold space-y-1 ${
                isCorrect ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}
            >
              <p className="font-bold">
                {isCorrect ? '¡Resta correcta!' : `Respuesta incorrecta. El resultado es ${numA - numB}.`}
              </p>
              <p className="text-slate-600 font-normal">
                Comprobación: si sumas el resultado ({numA - numB}) + el sustraendo ({numB}) obtienes el minuendo ({numA}).
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={() => generateExercise()}
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all active:scale-95 shadow-md inline-flex items-center gap-2"
              >
                <span>Siguiente Resta</span>
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
