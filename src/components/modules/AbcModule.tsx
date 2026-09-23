import React, { useState } from 'react';
import { ABC_DATA, AbcLetter } from '../../data/abcData';
import { playClick, playCorrect, playIncorrect, playStar, speak, speakCorrect, speakIncorrect } from '../../utils/audio';
import { fireConfetti } from '../../utils/confetti';
import { Sparkles, CheckCircle, XCircle, ArrowLeft, ArrowRight, Volume2 } from 'lucide-react';

interface AbcModuleProps {
  onAddScore: (isCorrect: boolean, extraPts?: number) => void;
}

export const AbcModule: React.FC<AbcModuleProps> = ({ onAddScore }) => {
  const [selectedLetter, setSelectedLetter] = useState<AbcLetter>(ABC_DATA[0]);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'alfabeto' | 'desafio'>('alfabeto');

  // Quick challenge state
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [challengeSelected, setChallengeSelected] = useState<number | null>(null);
  const [challengeSolved, setChallengeSolved] = useState(false);

  const currentChallenge = ABC_DATA[challengeIdx];

  const handleSelectLetter = (item: AbcLetter) => {
    playClick();
    setSelectedLetter(item);
    setQuizAnswer(null);
    setQuizFeedback(null);
    speak(`Letra ${item.letter}`);
  };

  const handleAnswerQuiz = (index: number) => {
    if (quizAnswer !== null) return;
    setQuizAnswer(index);
    const isCorrect = index === selectedLetter.correctIndex;
    if (isCorrect) {
      playCorrect();
      fireConfetti();
      speakCorrect('Respuesta correcta.');
      setQuizFeedback('¡Excelente! Respuesta correcta (+10 pts)');
      onAddScore(true);
    } else {
      playIncorrect();
      speakIncorrect();
      setQuizFeedback(`Respuesta incorrecta. La opción correcta era: ${selectedLetter.quizOptions[selectedLetter.correctIndex]}`);
      onAddScore(false);
    }
  };

  const handleChallengeAnswer = (idx: number) => {
    if (challengeSelected !== null) return;
    setChallengeSelected(idx);
    const isCorrect = idx === currentChallenge.correctIndex;
    if (isCorrect) {
      playCorrect();
      fireConfetti();
      speakCorrect('Respuesta correcta.');
      setChallengeSolved(true);
      onAddScore(true, 5);
    } else {
      playIncorrect();
      speakIncorrect();
      setChallengeSolved(true);
      onAddScore(false);
    }
  };


  const nextChallenge = () => {
    playClick();
    setChallengeIdx((prev) => (prev + 1) % ABC_DATA.length);
    setChallengeSelected(null);
    setChallengeSolved(false);
  };

  const currentIndex = ABC_DATA.findIndex((l) => l.letter === selectedLetter.letter);
  const prevLetter = ABC_DATA[(currentIndex - 1 + ABC_DATA.length) % ABC_DATA.length];
  const nextLetter = ABC_DATA[(currentIndex + 1) % ABC_DATA.length];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display flex items-center gap-2">
            <span>🔤</span> El Abecedario en Español (27 letras)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Toca cualquier letra para ver su pronunciación, palabras de ejemplo y ejercicios.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => {
              playClick();
              setActiveTab('alfabeto');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'alfabeto' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Explorar 27 Letras
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveTab('desafio');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'desafio' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Modo Desafío
          </button>
        </div>
      </div>

      {activeTab === 'alfabeto' ? (
        <div className="space-y-6">
          {/* Alphabet 27 Grid */}
          <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
            {ABC_DATA.map((item) => {
              const isSelected = item.letter === selectedLetter.letter;
              return (
                <button
                  key={item.letter}
                  onClick={() => handleSelectLetter(item)}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center font-bold text-lg transition-all active:scale-90 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-105 ring-2 ring-indigo-300'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200'
                  }`}
                >
                  <span className="leading-none">{item.letter}</span>
                  <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {item.lower}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Letter Detail Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    playClick();
                    speak(`Letra ${selectedLetter.letter}`);
                  }}
                  className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-extrabold text-4xl shadow-md cursor-pointer active:scale-95 transition-transform"
                  title={`Escuchar Letra ${selectedLetter.letter}`}
                >
                  {selectedLetter.letter}
                  <span className="text-2xl text-amber-200 ml-1">{selectedLetter.lower}</span>
                </button>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block">
                    Palabra Clave
                  </span>
                  <h3
                    onClick={() => {
                      playClick();
                      speak(selectedLetter.word);
                    }}
                    className="text-2xl font-black text-slate-900 font-display flex items-center gap-2 cursor-pointer hover:text-amber-600 transition-colors"
                    title={`Escuchar palabra: ${selectedLetter.word}`}
                  >
                    {selectedLetter.word} <span className="text-3xl">{selectedLetter.icon}</span>
                  </h3>
                  <p className="text-xs text-slate-500">{selectedLetter.sentence}</p>
                </div>
              </div>

              {/* Navigation arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSelectLetter(prevLetter)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 active:scale-95"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{prevLetter.letter}</span>
                </button>
                <button
                  onClick={() => handleSelectLetter(nextLetter)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 active:scale-95"
                >
                  <span>{nextLetter.letter}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Other words with this letter */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Otras palabras que empiezan o contienen {selectedLetter.letter}:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedLetter.otherWords.map((word) => (
                  <button
                    key={word}
                    onClick={() => {
                      playClick();
                      speak(word);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold cursor-pointer hover:bg-amber-100 transition-colors active:scale-95"
                    title={`Escuchar ${word}`}
                  >
                    {word}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 italic mt-2">💡 Curiosidad: {selectedLetter.funFact}</p>
            </div>

            {/* Mini Exercise for Selected Letter */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-800">
                  Ejercicio: {selectedLetter.quizQuestion}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {selectedLetter.quizOptions.map((opt, idx) => {
                  const isChosen = quizAnswer === idx;
                  const isCorrect = idx === selectedLetter.correctIndex;
                  let btnStyle = 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200';

                  if (quizAnswer !== null) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-500 text-white border-emerald-600';
                    } else if (isChosen) {
                      btnStyle = 'bg-rose-500 text-white border-rose-600';
                    } else {
                      btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => handleAnswerQuiz(idx)}
                      disabled={quizAnswer !== null}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between active:scale-98 ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {quizAnswer !== null && isCorrect && <CheckCircle className="w-4 h-4 text-white" />}
                      {quizAnswer !== null && isChosen && !isCorrect && <XCircle className="w-4 h-4 text-white" />}
                    </button>
                  );
                })}
              </div>

              {quizFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold ${
                    quizAnswer === selectedLetter.correctIndex
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {quizFeedback}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Mode Desafío Continuo */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Desafío {challengeIdx + 1} de {ABC_DATA.length}
            </span>
            <span className="text-xs text-slate-400 font-semibold">Letra {currentChallenge.letter}</span>
          </div>

          <div className="text-center py-4 space-y-2">
            <span className="text-6xl block font-extrabold text-indigo-600 font-display">
              {currentChallenge.letter} {currentChallenge.lower}
            </span>
            <h3 className="text-lg font-bold text-slate-800">
              ¿Cuál de estas 4 palabras comienza con la letra <span className="text-indigo-600">{currentChallenge.letter}</span>?
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
            {currentChallenge.quizOptions.map((opt, idx) => {
              const isChosen = challengeSelected === idx;
              const isCorrect = idx === currentChallenge.correctIndex;
              let style = 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200';

              if (challengeSelected !== null) {
                if (isCorrect) {
                  style = 'bg-emerald-500 text-white border-emerald-600 shadow-sm';
                } else if (isChosen) {
                  style = 'bg-rose-500 text-white border-rose-600 shadow-sm';
                } else {
                  style = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleChallengeAnswer(idx)}
                  disabled={challengeSelected !== null}
                  className={`p-4 rounded-2xl border text-sm font-bold flex items-center justify-between transition-all active:scale-95 ${style}`}
                >
                  <span>{opt}</span>
                  {challengeSelected !== null && isCorrect && <CheckCircle className="w-5 h-5 text-white" />}
                  {challengeSelected !== null && isChosen && !isCorrect && <XCircle className="w-5 h-5 text-white" />}
                </button>
              );
            })}
          </div>

          {challengeSolved && (
            <div className="pt-4 flex flex-col items-center gap-3">
              <p className="text-xs text-slate-600 font-medium">
                {challengeSelected === currentChallenge.correctIndex
                  ? '¡Excelente deducción! Cada acierto suma puntos a tu nivel.'
                  : `La respuesta era ${currentChallenge.quizOptions[currentChallenge.correctIndex]}. ¡Sigue practicando!`}
              </p>
              <button
                onClick={nextChallenge}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all active:scale-95 shadow-md"
              >
                Siguiente Letra →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
