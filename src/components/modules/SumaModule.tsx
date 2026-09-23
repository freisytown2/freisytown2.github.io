import React, { useState, useEffect } from 'react';
import { playClick, playCorrect, playIncorrect, speakCorrect, speakIncorrect } from '../../utils/audio';
import { fireConfetti } from '../../utils/confetti';
import { Sparkles, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface SumaModuleProps {
  onAddScore: (isCorrect: boolean, extraPts?: number) => void;
}

export const SumaModule: React.FC<SumaModuleProps> = ({ onAddScore }) => {
  const [difficulty, setDifficulty] = useState<'facil' | 'medio' | 'dificil'>('facil');
  const [numA, setNumA] = useState(7);
  const [numB, setNumB] = useState(5);
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
      a = Math.floor(Math.random() * 10) + 1;
      b = Math.floor(Math.random() * 10) + 1;
    } else if (diff === 'medio') {
      a = Math.floor(Math.random() * 45) + 10;
      b = Math.floor(Math.random() * 45) + 10;
    } else {
      a = Math.floor(Math.random() * 450) + 50;
      b = Math.floor(Math.random() * 450) + 50;
    }

    setNumA(a);
    setNumB(b);
    setUserInput('');
    setAnswered(false);
    setIsCorrect(false);
    setWrongOptions([]);

    const sum = a + b;
    const opts = new Set<number>([sum]);
    while (opts.size < 4) {
      const delta = (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
      opts.add(Math.max(1, sum + delta));
    }
    setOptions(Array.from(opts).sort(() => 0.5 - Math.random()));
  };

  useEffect(() => {
    generateExercise();
  }, [difficulty]);

  const handleSelectOption = (opt: number) => {
    if (answered || wrongOptions.includes(opt)) return;
    setUserInput(String(opt));
    checkAnswer(opt);
  };

  const checkAnswer = (val: number) => {
    const correctVal = numA + numB;
    const ok = val === correctVal;

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
      setWrongOptions((prev) => [...prev, val]);
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
            <span>➕</span> Práctica de Suma
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Resuelve cálculos aritméticos de 1, 2 y 3 cifras.
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
                difficulty === d ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              {d === 'facil' ? 'Básico' : d === 'medio' ? 'Medio' : 'Avanzado'}
            </button>
          ))}
        </div>
      </div>

      {/* Streak badge */}
      <div className="flex justify-center">
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          🔥 Racha actual: {streak} aciertos seguidos
        </span>
      </div>

      {/* Sum Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        {/* Arithmetic display */}
        <div className="flex flex-col items-center">
          <div className="font-mono text-4xl sm:text-5xl font-black text-slate-900 tracking-wider space-y-1 text-right inline-block">
            <div>{numA}</div>
            <div className="flex items-center justify-end gap-3 border-b-4 border-slate-800 pb-1">
              <span className="text-emerald-600 text-3xl font-sans font-bold">+</span>
              <span>{numB}</span>
            </div>
            <div className="pt-2 text-center text-indigo-600 font-display">
              {answered ? numA + numB : userInput || '?'}
            </div>
          </div>
        </div>

        {/* 4 Quick Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto">
          {options.map((opt) => {
            const isChosen = userInput === String(opt);
            const isTarget = opt === numA + numB;
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
                {isCorrect ? '¡Cálculo correcto!' : `No es correcto. El resultado es ${numA + numB}.`}
              </p>
              <p className="text-slate-600 font-normal">
                Paso a paso: {numA} + {numB} = {numA + numB}.
                {numA >= 10 && ` (Unidades: ${(numA % 10) + (numB % 10)}, Decenas: ${Math.floor(numA / 10) + Math.floor(numB / 10)})`}
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={() => generateExercise()}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all active:scale-95 shadow-md inline-flex items-center gap-2"
              >
                <span>Siguiente Suma</span>
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
