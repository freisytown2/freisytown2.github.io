import React, { useState, useEffect } from 'react';
import { playClick, playCorrect, playIncorrect, speakCorrect, speakIncorrect } from '../../utils/audio';
import { fireConfetti } from '../../utils/confetti';
import { Sparkles, CheckCircle2, XCircle, RotateCcw, HelpCircle } from 'lucide-react';

interface DivisionModuleProps {
  onAddScore: (isCorrect: boolean, extraPts?: number) => void;
}

interface DivisionProblem {
  dividend: number;
  divisor: number;
  quotient: number;
  remainder: number;
  isWordProblem?: boolean;
  textPrompt?: string;
}

export const DivisionModule: React.FC<DivisionModuleProps> = ({ onAddScore }) => {
  const [level, setLevel] = useState<'basico' | 'intermedio' | 'problemas'>('basico');
  const [problem, setProblem] = useState<DivisionProblem>({ dividend: 24, divisor: 4, quotient: 6, remainder: 0 });
  const [options, setOptions] = useState<number[]>([]);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wrongOptions, setWrongOptions] = useState<number[]>([]);

  const generateProblem = (l = level) => {
    let div = 0;
    let dsor = 0;
    let quo = 0;
    let rem = 0;
    let text = '';

    if (l === 'basico') {
      dsor = Math.floor(Math.random() * 8) + 2; // 2 to 9
      quo = Math.floor(Math.random() * 9) + 2;  // 2 to 10
      div = dsor * quo;
      rem = 0;
    } else if (l === 'intermedio') {
      dsor = Math.floor(Math.random() * 8) + 3;
      quo = Math.floor(Math.random() * 12) + 2;
      rem = Math.floor(Math.random() * (dsor - 1)) + 1; // has remainder
      div = dsor * quo + rem;
    } else {
      // Real life word problem
      const scenarios = [
        { item: 'galletas', container: 'bolsas' },
        { item: 'libros', container: 'estantes' },
        { item: 'chocolates', container: 'cajas' },
        { item: 'estudiantes', container: 'equipos iguales' },
      ];
      const sc = scenarios[Math.floor(Math.random() * scenarios.length)];
      dsor = Math.floor(Math.random() * 5) + 3;
      quo = Math.floor(Math.random() * 8) + 3;
      div = dsor * quo;
      rem = 0;
      text = `Se tienen ${div} ${sc.item} y se desean repartir en partes iguales en ${dsor} ${sc.container}. ¿Cuántos ${sc.item} habrá en cada grupo?`;
    }

    const newProb: DivisionProblem = {
      dividend: div,
      divisor: dsor,
      quotient: quo,
      remainder: rem,
      isWordProblem: l === 'problemas',
      textPrompt: text,
    };
    setProblem(newProb);
    setSelectedOpt(null);
    setAnswered(false);
    setIsCorrect(false);
    setWrongOptions([]);

    const opts = new Set<number>([quo]);
    while (opts.size < 4) {
      const delta = (Math.floor(Math.random() * 4) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const val = quo + delta;
      if (val > 0) opts.add(val);
    }
    setOptions(Array.from(opts).sort(() => 0.5 - Math.random()));
  };

  useEffect(() => {
    generateProblem();
  }, [level]);

  const handleAnswer = (opt: number) => {
    if (answered || wrongOptions.includes(opt)) return;
    setSelectedOpt(opt);
    const ok = opt === problem.quotient;

    if (ok) {
      setAnswered(true);
      setIsCorrect(true);
      playCorrect();
      fireConfetti();
      speakCorrect('Respuesta correcta.');
      onAddScore(true, level === 'problemas' ? 15 : 10);
    } else {
      playIncorrect();
      speakIncorrect('Inténtalo de nuevo.');
      setWrongOptions((prev) => [...prev, opt]);
      onAddScore(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-16">
      {/* Title & Levels */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display flex items-center gap-2">
            <span>➗</span> Práctica de División
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Divisiones exactas, reparto proporcional y resolución de problemas.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl self-start sm:self-auto">
          {(['basico', 'intermedio', 'problemas'] as const).map((l) => (
            <button
              key={l}
              onClick={() => {
                playClick();
                setLevel(l);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                level === l ? 'bg-white text-cyan-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              {l === 'basico' ? 'Exactas' : l === 'intermedio' ? 'Con Resto' : 'Problemas'}
            </button>
          ))}
        </div>
      </div>

      {/* Division Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        {level === 'problemas' && problem.textPrompt ? (
          <div className="text-center space-y-4">
            <span className="text-5xl block">📦</span>
            <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed bg-cyan-50/50 p-4 rounded-2xl border border-cyan-100">
              {problem.textPrompt}
            </p>
            <div className="text-2xl font-black text-cyan-700 font-mono">
              {problem.dividend} ÷ {problem.divisor} = ?
            </div>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">
              {level === 'basico' ? 'División Exacta' : 'Halla el Cociente Entero'}
            </span>
            <div className="text-5xl font-black text-slate-900 font-display font-mono py-2">
              {problem.dividend} ÷ {problem.divisor} = ?
            </div>
            {level === 'intermedio' && (
              <p className="text-xs text-slate-500">
                (Nota: El dividendo {problem.dividend} no es múltiplo exacto de {problem.divisor})
              </p>
            )}
          </div>
        )}

        {/* 4 Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto">
          {options.map((opt) => {
            const isChosen = selectedOpt === opt;
            const isTarget = opt === problem.quotient;
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
                onClick={() => handleAnswer(opt)}
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
                {isCorrect ? '¡Cociente correcto!' : `No es correcto. El cociente es ${problem.quotient}.`}
              </p>
              <p className="text-slate-600 font-normal">
                Explicación: {problem.divisor} × {problem.quotient} = {problem.divisor * problem.quotient}
                {problem.remainder > 0 ? ` + ${problem.remainder} de resto = ${problem.dividend}` : ` = ${problem.dividend}`}.
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={() => generateProblem()}
                className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all active:scale-95 shadow-md inline-flex items-center gap-2"
              >
                <span>Siguiente División</span>
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
