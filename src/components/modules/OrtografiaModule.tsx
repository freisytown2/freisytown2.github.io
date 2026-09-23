import React, { useState } from 'react';
import { ORTOGRAFIA_DATA, OrthographyExercise } from '../../data/ortografiaData';
import { playClick, playCorrect, playIncorrect, speakCorrect, speakIncorrect } from '../../utils/audio';
import { fireConfetti } from '../../utils/confetti';
import { Sparkles, CheckCircle2, XCircle, BookOpen, RotateCcw } from 'lucide-react';

interface OrtografiaModuleProps {
  onAddScore: (isCorrect: boolean, extraPts?: number) => void;
}

export const OrtografiaModule: React.FC<OrtografiaModuleProps> = ({ onAddScore }) => {
  const [activeCat, setActiveCat] = useState<string>('todas');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const categories = [
    { id: 'todas', label: 'Todas las Reglas' },
    { id: 'completa', label: 'Completa la Palabra' },
    { id: 'b_v', label: 'B vs V' },
    { id: 'c_s_z', label: 'C, S y Z' },
    { id: 'g_j', label: 'G vs J' },
    { id: 'acentuacion', label: 'Acentuación y Tildes' },
    { id: 'confusas', label: 'Palabras Confusas' },
  ];

  const filteredData = ORTOGRAFIA_DATA.filter(
    (ex) => activeCat === 'todas' || ex.category === activeCat
  );

  const currentExercise = filteredData[currentIndex % filteredData.length];

  const handleSelectOption = (opt: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(opt);
    setShowFeedback(true);
    const ok = opt.toLowerCase() === currentExercise.correctOption.toLowerCase();

    if (ok) {
      playCorrect();
      fireConfetti();
      speakCorrect(opt);
      onAddScore(true, 10);
    } else {
      playIncorrect();
      speakIncorrect('Inténtalo de nuevo.');
      onAddScore(false);
    }
  };

  const nextExercise = () => {
    playClick();
    setCurrentIndex((prev) => (prev + 1) % filteredData.length);
    setSelectedOption(null);
    setShowFeedback(false);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16">
      {/* Title & Categories */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display flex items-center gap-2">
            <span>✍️</span> Taller de Ortografía y Reglas
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Acentuación, grafías dudosas (B/V, C/S/Z, G/J) y explicación fundamentada de cada regla.
          </p>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              playClick();
              setActiveCat(cat.id);
              setCurrentIndex(0);
              setSelectedOption(null);
              setShowFeedback(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCat === cat.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Exercise Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            {currentExercise.categoryLabel}
          </span>
          <span className="text-xs font-medium text-slate-400">
            Ejercicio {(currentIndex % filteredData.length) + 1} de {filteredData.length}
          </span>
        </div>

        <div className="text-center space-y-3 py-4">
          <p className="text-xs font-medium text-slate-500">{currentExercise.sentencePrompt}</p>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-display bg-slate-50 p-6 rounded-2xl border border-slate-200 inline-block max-w-full">
            {currentExercise.targetWord}
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto">
          {currentExercise.options.map((opt) => {
            const isChosen = selectedOption === opt;
            const isTarget = opt.toLowerCase() === currentExercise.correctOption.toLowerCase();
            let style = 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200';

            if (selectedOption !== null) {
              if (isTarget) style = 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300';
              else if (isChosen) style = 'bg-rose-500 text-white border-rose-600';
              else style = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
            }

            return (
              <button
                key={opt}
                onClick={() => handleSelectOption(opt)}
                disabled={selectedOption !== null}
                className={`py-3.5 px-4 rounded-2xl border text-sm font-bold transition-all active:scale-95 text-center flex items-center justify-center gap-2 ${style}`}
              >
                <span>{opt}</span>
                {selectedOption !== null && isTarget && <CheckCircle2 className="w-4 h-4" />}
                {selectedOption !== null && isChosen && !isTarget && <XCircle className="w-4 h-4" />}
              </button>
            );
          })}
        </div>

        {/* Educational Feedback Rule */}
        {showFeedback && (
          <div className="space-y-4 pt-2">
            <div
              className={`p-4 rounded-2xl text-xs space-y-1 ${
                selectedOption?.toLowerCase() === currentExercise.correctOption.toLowerCase()
                  ? 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                  : 'bg-rose-50 text-rose-950 border border-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                <BookOpen className="w-4 h-4" />
                <span>Regla Ortográfica:</span>
              </div>
              <p className="leading-relaxed font-medium mt-1">{currentExercise.ruleExplanation}</p>
            </div>

            <div className="text-center">
              <button
                onClick={nextExercise}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all active:scale-95 shadow-md"
              >
                Siguiente Ejercicio →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
