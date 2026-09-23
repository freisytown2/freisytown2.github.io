import React, { useState } from 'react';
import { VOCALES_DATA, MISSING_VOWEL_PUZZLES, DIPHTHONG_PUZZLES } from '../../data/vocalesData';
import { playClick, playCorrect, playIncorrect, speak, speakCorrect, speakIncorrect } from '../../utils/audio';
import { fireConfetti } from '../../utils/confetti';
import { CheckCircle2, XCircle, Sparkles, Volume2 } from 'lucide-react';

interface VocalesModuleProps {
  onAddScore: (isCorrect: boolean, extraPts?: number) => void;
}

export const VocalesModule: React.FC<VocalesModuleProps> = ({ onAddScore }) => {
  const [selectedVocal, setSelectedVocal] = useState(VOCALES_DATA[0]);
  const [gameMode, setGameMode] = useState<'explorar' | 'faltante' | 'diptongos'>('explorar');

  // Missing vowel state
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [chosenOption, setChosenOption] = useState<string | null>(null);
  const [puzzleFeedback, setPuzzleFeedback] = useState<string | null>(null);

  // Diphthong state
  const [dipIdx, setDipIdx] = useState(0);
  const [dipAnswer, setDipAnswer] = useState<boolean | null>(null);
  const [dipFeedback, setDipFeedback] = useState<string | null>(null);

  const currentPuzzle = MISSING_VOWEL_PUZZLES[puzzleIndex];
  const currentDip = DIPHTHONG_PUZZLES[dipIdx];

  const handleVocalClick = (v: typeof VOCALES_DATA[0]) => {
    playClick();
    setSelectedVocal(v);
    speak(`Vocal ${v.vocal}`);
  };

  const handleChooseVocalOption = (option: string) => {
    if (chosenOption !== null) return;
    setChosenOption(option);
    const isCorrect = option === currentPuzzle.missingVocal;
    if (isCorrect) {
      playCorrect();
      fireConfetti();
      speakCorrect(currentPuzzle.fullWord);
      setPuzzleFeedback(`¡Correcto! ${currentPuzzle.fullWord}: ${currentPuzzle.meaning}`);
      onAddScore(true);
    } else {
      playIncorrect();
      speakIncorrect();
      setPuzzleFeedback(`Incorrecto. La vocal correcta es ${currentPuzzle.missingVocal} para formar ${currentPuzzle.fullWord}.`);
      onAddScore(false);
    }
  };

  const nextPuzzle = () => {
    playClick();
    setPuzzleIndex((prev) => (prev + 1) % MISSING_VOWEL_PUZZLES.length);
    setChosenOption(null);
    setPuzzleFeedback(null);
  };

  const handleDiphthongAnswer = (choice: boolean) => {
    if (dipAnswer !== null) return;
    setDipAnswer(choice);
    const isCorrect = choice === currentDip.isDiphthong;
    if (isCorrect) {
      playCorrect();
      fireConfetti();
      speakCorrect();
      setDipFeedback(`¡Correcto! ${currentDip.explanation}`);
      onAddScore(true);
    } else {
      playIncorrect();
      speakIncorrect();
      setDipFeedback(`No es correcto. ${currentDip.explanation}`);
      onAddScore(false);
    }
  };

  const nextDiphthong = () => {
    playClick();
    setDipIdx((prev) => (prev + 1) % DIPHTHONG_PUZZLES.length);
    setDipAnswer(null);
    setDipFeedback(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Title & Mode Switcher */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display flex items-center gap-2">
            <span>🗣️</span> Las 5 Vocales del Español
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Vocales abiertas (fuertes) y cerradas (débiles), ejercicios y diptongos.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl self-start sm:self-auto overflow-x-auto">
          <button
            onClick={() => {
              playClick();
              setGameMode('explorar');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              gameMode === 'explorar' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Explorar Vocales
          </button>
          <button
            onClick={() => {
              playClick();
              setGameMode('faltante');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              gameMode === 'faltante' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Vocal Faltante
          </button>
          <button
            onClick={() => {
              playClick();
              setGameMode('diptongos');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              gameMode === 'diptongos' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Diptongos vs Hiatos
          </button>
        </div>
      </div>

      {gameMode === 'explorar' && (
        <div className="space-y-6">
          {/* Big 5 Vocal Cards */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {VOCALES_DATA.map((v) => {
              const isSelected = v.vocal === selectedVocal.vocal;
              return (
                <button
                  key={v.vocal}
                  onClick={() => handleVocalClick(v)}
                  className={`py-4 rounded-2xl flex flex-col items-center justify-center font-extrabold text-2xl sm:text-3xl transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25 ring-2 ring-rose-300'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200'
                  }`}
                >
                  <span>{v.vocal}</span>
                  <span className={`text-xs mt-1 font-semibold ${isSelected ? 'text-rose-100' : 'text-slate-400'}`}>
                    {v.lower}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Vocal Information */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <button
                onClick={() => {
                  playClick();
                  speak(`Vocal ${selectedVocal.vocal}`);
                }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center font-black text-3xl shadow-sm cursor-pointer active:scale-95 transition-transform"
                title={`Escuchar Vocal ${selectedVocal.vocal}`}
              >
                {selectedVocal.vocal}
              </button>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                  Tipo Fonético: {selectedVocal.type}
                </span>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Vocal {selectedVocal.vocal} {selectedVocal.lower}
                </h3>
                <p className="text-xs text-slate-500">{selectedVocal.acousticInfo}</p>
              </div>
            </div>

            {/* Example Words with Icons */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Palabras destacadas con la vocal {selectedVocal.vocal}:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {selectedVocal.words.map((w) => (
                  <button
                    key={w.word}
                    onClick={() => {
                      playClick();
                      speak(w.word);
                    }}
                    className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/70 flex items-center gap-3 text-left hover:bg-rose-100/70 transition-colors cursor-pointer active:scale-95"
                  >
                    <span className="text-2xl">{w.icon}</span>
                    <span className="text-xs font-bold text-rose-950">{w.word}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                📝 Ejemplo: <span className="font-semibold text-slate-800">"{selectedVocal.exampleSentence}"</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {gameMode === 'faltante' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
              Reto {puzzleIndex + 1} de {MISSING_VOWEL_PUZZLES.length}
            </span>
            <span className="text-xs text-slate-400">Identifica la vocal</span>
          </div>

          <div className="text-center py-6 space-y-3">
            <p className="text-xs text-slate-500 font-medium">¿Qué vocal completa correctamente la palabra?</p>
            <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-wider font-display bg-slate-50 py-4 px-6 rounded-2xl inline-block border border-slate-200">
              {currentPuzzle.wordWithBlank}
            </div>
            <p className="text-xs text-slate-400 italic">Pista: {currentPuzzle.meaning}</p>
          </div>

          {/* 4 Options */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto">
            {currentPuzzle.options.map((opt) => {
              const isChosen = chosenOption === opt;
              const isCorrect = opt === currentPuzzle.missingVocal;
              let style = 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200';

              if (chosenOption !== null) {
                if (isCorrect) {
                  style = 'bg-emerald-500 text-white border-emerald-600';
                } else if (isChosen) {
                  style = 'bg-rose-500 text-white border-rose-600';
                } else {
                  style = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleChooseVocalOption(opt)}
                  disabled={chosenOption !== null}
                  className={`py-4 rounded-2xl border text-xl font-black transition-all active:scale-95 ${style}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {puzzleFeedback && (
            <div className="text-center space-y-3 pt-2">
              <p
                className={`text-xs font-bold p-3 rounded-xl ${
                  chosenOption === currentPuzzle.missingVocal
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {puzzleFeedback}
              </p>
              <button
                onClick={nextPuzzle}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold active:scale-95 shadow-md"
              >
                Siguiente Palabra →
              </button>
            </div>
          )}
        </div>
      )}

      {gameMode === 'diptongos' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
              Pregunta {dipIdx + 1} de {DIPHTHONG_PUZZLES.length}
            </span>
            <span className="text-xs text-slate-400">Gramática española</span>
          </div>

          <div className="text-center py-4 space-y-2">
            <p className="text-xs text-slate-500">¿Esta palabra contiene un DIPTONGO o un HIATO?</p>
            <h3 className="text-3xl font-extrabold text-slate-900 font-display">
              {currentDip.word}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <button
              onClick={() => handleDiphthongAnswer(true)}
              disabled={dipAnswer !== null}
              className={`p-4 rounded-2xl border text-sm font-bold transition-all active:scale-95 ${
                dipAnswer !== null
                  ? currentDip.isDiphthong
                    ? 'bg-emerald-500 text-white border-emerald-600'
                    : dipAnswer === true
                    ? 'bg-rose-500 text-white border-rose-600'
                    : 'bg-slate-100 text-slate-400 border-slate-200'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              Es Diptongo (1 sílaba)
            </button>

            <button
              onClick={() => handleDiphthongAnswer(false)}
              disabled={dipAnswer !== null}
              className={`p-4 rounded-2xl border text-sm font-bold transition-all active:scale-95 ${
                dipAnswer !== null
                  ? !currentDip.isDiphthong
                    ? 'bg-emerald-500 text-white border-emerald-600'
                    : dipAnswer === false
                    ? 'bg-rose-500 text-white border-rose-600'
                    : 'bg-slate-100 text-slate-400 border-slate-200'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              Es Hiato (2 sílabas)
            </button>
          </div>

          {dipFeedback && (
            <div className="text-center space-y-3 pt-2">
              <p
                className={`text-xs font-bold p-3 rounded-xl ${
                  dipAnswer === currentDip.isDiphthong
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {dipFeedback}
              </p>
              <button
                onClick={nextDiphthong}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold active:scale-95 shadow-md"
              >
                Siguiente Caso →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
