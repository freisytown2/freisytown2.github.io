import React, { useState } from 'react';
import { playClick, playCorrect, playIncorrect, speak, speakCorrect, speakIncorrect } from '../../utils/audio';
import { fireConfetti } from '../../utils/confetti';
import { Sparkles, Volume2, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface InglesModuleProps {
  onAddScore: (isCorrect: boolean, extraPts?: number) => void;
}

interface EnglishItem {
  en: string;
  es: string;
  phonetic: string;
  category: string;
  emoji: string;
}

const ENGLISH_ITEMS: EnglishItem[] = [
  // Saludos
  { en: 'Hello', es: 'Hola', phonetic: 'je-lóu', category: 'Saludos', emoji: '👋' },
  { en: 'Good morning', es: 'Buenos días', phonetic: 'gud mór-ning', category: 'Saludos', emoji: '🌅' },
  { en: 'Thank you', es: 'Gracias', phonetic: 'zenk iu', category: 'Saludos', emoji: '🙏' },
  { en: 'You are welcome', es: 'De nada', phonetic: 'iur uél-kam', category: 'Saludos', emoji: '🤝' },
  { en: 'Goodbye', es: 'Adiós', phonetic: 'gud-bái', category: 'Saludos', emoji: '👋' },

  // Familia
  { en: 'Father', es: 'Padre / Papá', phonetic: 'fá-der', category: 'Familia', emoji: '👨' },
  { en: 'Mother', es: 'Madre / Mamá', phonetic: 'má-der', category: 'Familia', emoji: '👩' },
  { en: 'Brother', es: 'Hermano', phonetic: 'brá-der', category: 'Familia', emoji: '👦' },
  { en: 'Sister', es: 'Hermana', phonetic: 'sís-ter', category: 'Familia', emoji: '👧' },

  // Días
  { en: 'Monday', es: 'Lunes', phonetic: 'mán-dei', category: 'Días y Tiempo', emoji: '📅' },
  { en: 'Friday', es: 'Viernes', phonetic: 'frái-dei', category: 'Días y Tiempo', emoji: '🎉' },
  { en: 'Sunday', es: 'Domingo', phonetic: 'sán-dei', category: 'Días y Tiempo', emoji: '☀️' },

  // Escuela
  { en: 'Book', es: 'Libro', phonetic: 'buk', category: 'Escuela', emoji: '📖' },
  { en: 'Pencil', es: 'Lápiz', phonetic: 'pén-sil', category: 'Escuela', emoji: '✏️' },
  { en: 'Teacher', es: 'Profesor / Maestro', phonetic: 'tí-cher', category: 'Escuela', emoji: '🧑‍🏫' },
  { en: 'Classroom', es: 'Aula / Salón', phonetic: 'klás-rum', category: 'Escuela', emoji: '🏫' },
];

export const InglesModule: React.FC<InglesModuleProps> = ({ onAddScore }) => {
  const [activeTab, setActiveTab] = useState<'tarjetas' | 'quiz'>('tarjetas');
  const [selectedCat, setSelectedCat] = useState<string>('Todos');

  // Quiz state
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizChosen, setQuizChosen] = useState<string | null>(null);

  const categories = ['Todos', 'Saludos', 'Familia', 'Días y Tiempo', 'Escuela'];

  const filteredItems = ENGLISH_ITEMS.filter(
    (item) => selectedCat === 'Todos' || item.category === selectedCat
  );

  const currentQuizItem = ENGLISH_ITEMS[quizIdx % ENGLISH_ITEMS.length];

  // Pick 4 choices for current quiz item
  const quizChoices = [
    currentQuizItem.es,
    ...ENGLISH_ITEMS.filter((i) => i.es !== currentQuizItem.es)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((i) => i.es),
  ].sort(() => 0.5 - Math.random());

  const handleQuizAnswer = (choice: string) => {
    if (quizChosen !== null) return;
    setQuizChosen(choice);
    const ok = choice === currentQuizItem.es;
    if (ok) {
      playCorrect();
      fireConfetti();
      speakCorrect();
      onAddScore(true, 10);
    } else {
      playIncorrect();
      speakIncorrect('Inténtalo de nuevo.');
      onAddScore(false);
    }
  };

  const nextQuiz = () => {
    playClick();
    setQuizIdx((prev) => (prev + 1) % ENGLISH_ITEMS.length);
    setQuizChosen(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Title & Tabs */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display flex items-center gap-2">
            <span>🇬🇧</span> Inglés Básico: Vocabulario Esencial
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tarjetas de pronunciación aproximada, vocabulario cotidiano y retos de traducción.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => {
              playClick();
              setActiveTab('tarjetas');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tarjetas' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Vocabulario
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveTab('quiz');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'quiz' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Quiz Inglés → Español
          </button>
        </div>
      </div>

      {activeTab === 'tarjetas' ? (
        <div className="space-y-4">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => {
                  playClick();
                  setSelectedCat(c);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCat === c
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  playClick();
                  speak(item.en, { lang: 'en-US' });
                }}
                className="bg-white rounded-3xl p-5 border border-slate-200 space-y-2 shadow-2xs hover:border-indigo-300 transition-all cursor-pointer active:scale-98"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{item.emoji}</span>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                    {item.category}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 font-display flex items-center justify-between">
                    <span>{item.en}</span>
                    <Volume2 className="w-4 h-4 text-indigo-500 opacity-60" />
                  </h3>
                  <p className="text-xs font-bold text-indigo-600">{item.es}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Pronunciación:</span>
                  <span className="font-mono text-slate-600 font-medium italic">/{item.phonetic}/</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Quiz Tab */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 max-w-xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Pregunta {(quizIdx % ENGLISH_ITEMS.length) + 1} de {ENGLISH_ITEMS.length}
            </span>
            <span className="text-4xl block pt-2">{currentQuizItem.emoji}</span>
            <button
              onClick={() => {
                playClick();
                speak(currentQuizItem.en, { lang: 'en-US' });
              }}
              className="inline-flex items-center gap-2 text-3xl font-black text-slate-900 font-display hover:text-indigo-600 transition-colors"
            >
              <span>"{currentQuizItem.en}"</span>
              <Volume2 className="w-5 h-5 text-indigo-500" />
            </button>
            <p className="text-xs text-slate-400 italic">
              Pronunciación aproximada: /{currentQuizItem.phonetic}/
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quizChoices.map((choice) => {
              const isChosen = quizChosen === choice;
              const isTarget = choice === currentQuizItem.es;
              let style = 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200';

              if (quizChosen !== null) {
                if (isTarget) style = 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300';
                else if (isChosen) style = 'bg-rose-500 text-white border-rose-600';
                else style = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
              }

              return (
                <button
                  key={choice}
                  onClick={() => handleQuizAnswer(choice)}
                  disabled={quizChosen !== null}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left flex items-center justify-between transition-all active:scale-98 ${style}`}
                >
                  <span>{choice}</span>
                  {quizChosen !== null && isTarget && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                  {quizChosen !== null && isChosen && !isTarget && <XCircle className="w-5 h-5 shrink-0" />}
                </button>
              );
            })}
          </div>

          {quizChosen !== null && (
            <div className="text-center pt-2">
              <button
                onClick={nextQuiz}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold active:scale-95 shadow-md"
              >
                Siguiente Palabra →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
