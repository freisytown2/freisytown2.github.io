import React, { useState } from 'react';
import { playClick, playCorrect, playIncorrect } from '../../utils/audio';
import { fireConfetti } from '../../utils/confetti';
import { Sparkles, Brain, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface LogicaModuleProps {
  onAddScore: (isCorrect: boolean, extraPts?: number) => void;
}

interface LogicQuestion {
  id: number;
  category: string;
  premise: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

const LOGIC_QUESTIONS: LogicQuestion[] = [
  {
    id: 1,
    category: 'Silogismo Deductivo',
    premise: 'Premisa 1: Todos los mamíferos respiran oxígeno.\nPremisa 2: Todos los delfines son mamíferos.\n¿Qué conclusión es lógicamente necesaria?',
    options: [
      'Los delfines respiran oxígeno.',
      'Los delfines son peces marinos.',
      'Algunos mamíferos no viven en el mar.',
      'El oxígeno solo existe en la atmósfera.',
    ],
    correctIdx: 0,
    explanation: 'Por deducción formal (modus barbara), si todo A es B y todo C es A, forzosamente todo C es B.',
  },
  {
    id: 2,
    category: 'Secuencia Geométrica / Patrón',
    premise: 'Observa la serie de figuras: Cuadrado (4 lados) → Pentágono (5 lados) → Hexágono (6 lados) → ¿Qué figura sigue?',
    options: ['Triángulo (3 lados)', 'Heptágono (7 lados)', 'Octógono (8 lados)', 'Círculo'],
    correctIdx: 1,
    explanation: 'La serie incrementa en 1 el número de lados de cada polígono regular (4, 5, 6, 7 = Heptágono).',
  },
  {
    id: 3,
    category: 'Problema de Balanza y Peso',
    premise: 'Una manzana y una pera pesan juntas 300 gramos. Dos manzanas y una pera pesan juntas 420 gramos. ¿Cuánto pesa una manzana?',
    options: ['100 gramos', '120 gramos', '150 gramos', '180 gramos'],
    correctIdx: 1,
    explanation: 'Restando la primera balanza a la segunda: (2 manzanas + 1 pera) - (1 manzana + 1 pera) = 1 manzana. 420g - 300g = 120 gramos.',
  },
  {
    id: 4,
    category: 'Pensamiento Lateral',
    premise: 'Un granjero tiene 17 ovejas. Todas mueren menos 9. ¿Cuántas ovejas le quedan al granjero?',
    options: ['8 ovejas', '9 ovejas', '0 ovejas', '17 ovejas'],
    correctIdx: 1,
    explanation: 'El enunciado dice literalmente: "todas mueren menos 9", por lo tanto quedan exactamente esas 9 ovejas con vida.',
  },
  {
    id: 5,
    category: 'Orden Temporal y Posición',
    premise: 'En una carrera de atletismo adelantas al corredor que va en segundo lugar justo antes de la meta. ¿En qué puesto quedas clasificado?',
    options: ['Primer lugar', 'Segundo lugar', 'Tercer lugar', 'Último lugar'],
    correctIdx: 1,
    explanation: 'Al adelantar al segundo, tomas su puesto, por lo que pasas a estar en el segundo lugar (el primero sigue adelante).',
  },
];

export const LogicaModule: React.FC<LogicaModuleProps> = ({ onAddScore }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [chosenIdx, setChosenIdx] = useState<number | null>(null);

  const current = LOGIC_QUESTIONS[currentIdx % LOGIC_QUESTIONS.length];

  const handleAnswer = (idx: number) => {
    if (chosenIdx !== null) return;
    setChosenIdx(idx);
    const ok = idx === current.correctIdx;
    if (ok) {
      playCorrect();
      fireConfetti();
      onAddScore(true, 15);
    } else {
      playIncorrect();
      onAddScore(false);
    }
  };

  const nextProblem = () => {
    playClick();
    setCurrentIdx((prev) => (prev + 1) % LOGIC_QUESTIONS.length);
    setChosenIdx(null);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16">
      {/* Title */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display flex items-center gap-2">
            <span>🧩</span> Lógica y Razonamiento Deductivo
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Silogismos, patrones de sucesión, balanzas de cálculo y acertijos de pensamiento crítico.
          </p>
        </div>
      </div>

      {/* Logic Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            {current.category}
          </span>
          <span className="text-xs text-slate-400">
            Problema {(currentIdx % LOGIC_QUESTIONS.length) + 1} de {LOGIC_QUESTIONS.length}
          </span>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed whitespace-pre-line">
            {current.premise}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {current.options.map((opt, idx) => {
            const isChosen = chosenIdx === idx;
            const isTarget = idx === current.correctIdx;
            let style = 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200';

            if (chosenIdx !== null) {
              if (isTarget) style = 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300';
              else if (isChosen) style = 'bg-rose-500 text-white border-rose-600';
              else style = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
            }

            return (
              <button
                key={opt}
                onClick={() => handleAnswer(idx)}
                disabled={chosenIdx !== null}
                className={`p-4 rounded-2xl border text-sm font-bold text-left flex items-center justify-between transition-all active:scale-98 ${style}`}
              >
                <span>{opt}</span>
                {chosenIdx !== null && isTarget && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                {chosenIdx !== null && isChosen && !isTarget && <XCircle className="w-5 h-5 shrink-0" />}
              </button>
            );
          })}
        </div>

        {chosenIdx !== null && (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700">
              <strong>Demostración lógica:</strong> {current.explanation}
            </div>

            <div className="text-center">
              <button
                onClick={nextProblem}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold active:scale-95 shadow-md"
              >
                Siguiente Reto de Lógica →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
