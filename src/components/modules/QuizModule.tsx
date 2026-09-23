import React, { useState, useEffect } from 'react';
import { QUIZ_QUESTIONS } from '../../data/quizData';
import { QuizQuestion } from '../../types';
import { playClick, playCorrect, playIncorrect, playSuccess, speakCorrect, speakIncorrect } from '../../utils/audio';
import { fireConfetti } from '../../utils/confetti';
import { Sparkles, CheckCircle2, XCircle, RotateCcw, Award, BookOpen } from 'lucide-react';

interface QuizModuleProps {
  onAddScore: (isCorrect: boolean, extraPts?: number) => void;
}

export const QuizModule: React.FC<QuizModuleProps> = ({ onAddScore }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [questionDeck, setQuestionDeck] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [chosenAnswer, setChosenAnswer] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  const categories = [
    { id: 'todas', label: 'Todas las 8 Materias (104)' },
    { id: 'matematicas', label: '📐 Matemáticas' },
    { id: 'lenguaje', label: '📖 Lenguaje' },
    { id: 'ciencias', label: '🔬 Ciencias' },
    { id: 'geografia', label: '🌍 Geografía' },
    { id: 'historia', label: '🏛️ Historia' },
    { id: 'cultura', label: '🎭 Cultura General' },
    { id: 'animales', label: '🐾 Animales' },
    { id: 'tecnologia', label: '💻 Tecnología' },
  ];

  const initDeck = (cat = selectedCategory) => {
    playClick();
    const filtered = cat === 'todas'
      ? [...QUIZ_QUESTIONS]
      : QUIZ_QUESTIONS.filter((q) => q.category === cat);
    // Shuffle
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    setQuestionDeck(shuffled);
    setCurrentIdx(0);
    setChosenAnswer(null);
  };

  useEffect(() => {
    initDeck(selectedCategory);
  }, [selectedCategory]);

  const currentQ = questionDeck[currentIdx];

  const handleSelectAnswer = (idx: number) => {
    if (chosenAnswer !== null || !currentQ) return;
    setChosenAnswer(idx);
    const isOk = idx === currentQ.correctAnswerIndex;

    if (isOk) {
      playCorrect();
      fireConfetti();
      speakCorrect();
      setCorrectCount((c) => c + 1);
      onAddScore(true, 15);
    } else {
      playIncorrect();
      speakIncorrect('Inténtalo de nuevo.');
      setIncorrectCount((c) => c + 1);
      onAddScore(false);
    }
  };

  const nextQuestion = () => {
    playClick();
    if (currentIdx + 1 < questionDeck.length) {
      setCurrentIdx((i) => i + 1);
      setChosenAnswer(null);
    } else {
      // Finished deck
      playSuccess();
      fireConfetti();
      initDeck(selectedCategory);
    }
  };

  if (!currentQ) return null;

  const totalAnswered = correctCount + incorrectCount;
  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 100;

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16">
      {/* Header & Categories */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display flex items-center gap-2">
            <span>🎯</span> Gran Quiz del Conocimiento
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Banco de 104 preguntas aleatorias en 8 categorías educativas.
          </p>
        </div>

        {/* Restart deck */}
        <button
          onClick={() => {
            setCorrectCount(0);
            setIncorrectCount(0);
            initDeck();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reiniciar Contador</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === c.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-3 gap-3 bg-white p-4 rounded-3xl border border-slate-200 text-center shadow-2xs">
        <div>
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
            Correctas
          </span>
          <span className="text-xl font-black text-emerald-600 tabular-nums">{correctCount}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">
            Incorrectas
          </span>
          <span className="text-xl font-black text-rose-600 tabular-nums">{incorrectCount}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
            Precisión
          </span>
          <span className="text-xl font-black text-indigo-600 tabular-nums">{accuracy}%</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            {currentQ.categoryLabel}
          </span>
          <span className="text-xs font-medium text-slate-400">
            Pregunta {currentIdx + 1} de {questionDeck.length}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-black text-slate-900 font-display leading-snug">
          {currentQ.question}
        </h3>

        {/* 4 Answers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQ.options.map((opt, idx) => {
            const isChosen = chosenAnswer === idx;
            const isTarget = idx === currentQ.correctAnswerIndex;
            let style = 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200';

            if (chosenAnswer !== null) {
              if (isTarget) style = 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300';
              else if (isChosen) style = 'bg-rose-500 text-white border-rose-600';
              else style = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
            }

            return (
              <button
                key={opt}
                onClick={() => handleSelectAnswer(idx)}
                disabled={chosenAnswer !== null}
                className={`p-4 rounded-2xl border text-sm font-bold text-left flex items-center justify-between transition-all active:scale-98 ${style}`}
              >
                <span>{opt}</span>
                {chosenAnswer !== null && isTarget && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                {chosenAnswer !== null && isChosen && !isTarget && <XCircle className="w-5 h-5 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Explanation & Next */}
        {chosenAnswer !== null && (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Explicación didáctica:
              </span>
              <p className="text-slate-600 leading-relaxed">{currentQ.explanation}</p>
            </div>

            <div className="text-center">
              <button
                onClick={nextQuestion}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all active:scale-95 shadow-md"
              >
                Siguiente Pregunta →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
