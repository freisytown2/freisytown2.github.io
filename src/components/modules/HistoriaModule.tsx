import React, { useState } from 'react';
import { playClick, playCorrect, playIncorrect } from '../../utils/audio';
import { fireConfetti } from '../../utils/confetti';
import { Sparkles, Calendar, BookOpen, CheckCircle2, XCircle } from 'lucide-react';

interface HistoriaModuleProps {
  onAddScore: (isCorrect: boolean, extraPts?: number) => void;
}

interface EraHistory {
  id: string;
  name: string;
  period: string;
  emoji: string;
  milestones: string[];
  keyInventions: string;
  highlight: string;
}

const HISTORIA_ERAS: EraHistory[] = [
  {
    id: 'prehistoria',
    name: 'Prehistoria',
    period: 'Hasta el 3.500 a.C.',
    emoji: '🪨',
    milestones: [
      'Aparición y evolución de los primeros homínidos.',
      'Dominio controlado del fuego (hace unos 400.000 años).',
      'Desarrollo de herramientas talladas en sílex y piedra.',
      'Revolución Neolítica: invención de la agricultura y la ganadería.',
    ],
    keyInventions: 'Fuego, rueda, pintura rupestre, domesticación animal.',
    highlight: 'La invención de la escritura cuneiforme en Mesopotamia marca el fin de la prehistoria y el nacimiento de la historia escrita.',
  },
  {
    id: 'antigua',
    name: 'Edad Antigua',
    period: '3.500 a.C. - 476 d.C.',
    emoji: '🏛️',
    milestones: [
      'Civilización del Antiguo Egipto y las Grandes Pirámides de Giza.',
      'Mesopotamia: código de leyes de Hammurabi.',
      'Antigua Grecia: cuna de la democracia, la filosofía y los Juegos Olímpicos.',
      'Imperio Romano: desarrollo de acueductos, calzadas y el Derecho.',
    ],
    keyInventions: 'Escritura, moneda, hormigón romano, democracia.',
    highlight: 'La caída del Imperio Romano de Occidente en el año 476 d.C. señala el final de la Antigüedad clásica.',
  },
  {
    id: 'media',
    name: 'Edad Media',
    period: '476 d.C. - 1492 d.C.',
    emoji: '🏰',
    milestones: [
      'Consolidación del sistema feudal y los reinos europeos.',
      'Era de oro del Islam: grandes avances en álgebra, astronomía y medicina.',
      'Construcción de las majestuosas catedrales góticas.',
      'Aparición de las primeras universidades (Bolonia, Oxford, Salamanca).',
    ],
    keyInventions: 'Imprenta de tipos móviles (Gutenberg), astrolabio perfeccionado, molinos de viento.',
    highlight: 'La imprenta democratizó el conocimiento y permitió la rápida difusión de las ideas en todo el mundo.',
  },
  {
    id: 'moderna',
    name: 'Edad Moderna',
    period: '1492 - 1789',
    emoji: '⛵',
    milestones: [
      'Renacimiento artístico y cultural en Italia y Europa.',
      'Grandes navegaciones y expediciones oceánicas.',
      'Revolución Científica: Copérnico, Galileo, Newton y el método experimental.',
      'Ilustración: filósofos promueven la razón, la libertad y los derechos humanos.',
    ],
    keyInventions: 'Telescopio, microscopio, reloj de péndulo, máquina de vapor preliminar.',
    highlight: 'La Revolución Francesa de 1789 proclamó la Declaración de los Derechos del Hombre y del Ciudadano.',
  },
  {
    id: 'contemporanea',
    name: 'Edad Contemporánea',
    period: '1789 - Presente',
    emoji: '🚀',
    milestones: [
      'Revolución Industrial: mecanización y desarrollo de ferrocarriles.',
      'Avances médicos masivos: vacunas, antibióticos (penicilina).',
      'Carrera espacial y alunizaje de la misión Apolo 11 en 1969.',
      'Revolución digital, microchips, Internet y telecomunicaciones globales.',
    ],
    keyInventions: 'Electricidad, automóvil, antibióticos, computadoras personales, Internet.',
    highlight: 'Vivimos en la era de la información, donde la ciencia y la tecnología avanzan a un ritmo exponencial.',
  },
];

const HISTORIA_QUIZ = [
  {
    question: '¿Qué gran acontecimiento marca el paso de la Prehistoria a la Historia escrita?',
    options: ['La invención de la escritura', 'La caída de Roma', 'La invención del telescopio', 'El descubrimiento de América'],
    correctIdx: 0,
    explanation: 'La aparición de la escritura hacia el 3500 a.C. permitió registrar hechos y leyes por primera vez de forma perdurable.',
  },
  {
    question: '¿Quién perfeccionó la imprenta con tipos móviles metálicos en Europa hacia 1440?',
    options: ['Leonardo da Vinci', 'Johannes Gutenberg', 'Isaac Newton', 'Galileo Galilei'],
    correctIdx: 1,
    explanation: 'Johannes Gutenberg revolucionó la difusión del saber al crear la imprenta moderna en Maguncia.',
  },
  {
    question: '¿En qué año el ser humano pisó la Luna por primera vez con la misión Apolo 11?',
    options: ['1955', '1969', '1981', '1999'],
    correctIdx: 1,
    explanation: 'Neil Armstrong y Buzz Aldrin alunizaron el 20 de julio de 1969 a bordo del módulo lunar Eagle.',
  },
];

export const HistoriaModule: React.FC<HistoriaModuleProps> = ({ onAddScore }) => {
  const [selectedEra, setSelectedEra] = useState<EraHistory>(HISTORIA_ERAS[0]);
  const [activeTab, setActiveTab] = useState<'linea' | 'quiz'>('linea');
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizChosen, setQuizChosen] = useState<number | null>(null);

  const currentQ = HISTORIA_QUIZ[quizIdx];

  const handleQuizAnswer = (idx: number) => {
    if (quizChosen !== null) return;
    setQuizChosen(idx);
    const ok = idx === currentQ.correctIdx;
    if (ok) {
      playCorrect();
      fireConfetti();
      onAddScore(true, 15);
    } else {
      playIncorrect();
      onAddScore(false);
    }
  };

  const nextQuiz = () => {
    playClick();
    setQuizIdx((prev) => (prev + 1) % HISTORIA_QUIZ.length);
    setQuizChosen(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Title & Mode */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display flex items-center gap-2">
            <span>🏛️</span> Historia Universal y Línea del Tiempo
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Desde la Prehistoria y las grandes civilizaciones antiguas hasta la era moderna y espacial.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => {
              playClick();
              setActiveTab('linea');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'linea' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Línea del Tiempo
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
            Quiz Histórico
          </button>
        </div>
      </div>

      {activeTab === 'linea' ? (
        <div className="space-y-6">
          {/* Era Horizontal Timeline Tracker */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {HISTORIA_ERAS.map((era) => {
              const isSelected = era.id === selectedEra.id;
              return (
                <button
                  key={era.id}
                  onClick={() => {
                    playClick();
                    setSelectedEra(era);
                  }}
                  className={`px-4 py-2.5 rounded-2xl border flex items-center gap-2 shrink-0 transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm ring-2 ring-indigo-200 font-bold'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-medium'
                  }`}
                >
                  <span className="text-xl">{era.emoji}</span>
                  <div className="text-left">
                    <div className="text-xs font-bold">{era.name}</div>
                    <div className={`text-[10px] ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {era.period}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Era Detailed Presentation */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                  Época Histórica ({selectedEra.period})
                </span>
                <h3 className="text-3xl font-black text-slate-900 font-display mt-0.5">
                  {selectedEra.name}
                </h3>
              </div>
              <span className="text-5xl">{selectedEra.emoji}</span>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Hitos y Sucesos Trascendentales:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedEra.milestones.map((ms, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed font-medium"
                  >
                    • {ms}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200 text-xs space-y-1">
                <span className="font-bold text-amber-950 block">⚙️ Inventos y Logros Clave:</span>
                <p className="text-amber-900">{selectedEra.keyInventions}</p>
              </div>

              <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-200 text-xs space-y-1">
                <span className="font-bold text-indigo-950 block">💡 Transición Histórica:</span>
                <p className="text-indigo-900">{selectedEra.highlight}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Quiz Mode */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 max-w-xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Pregunta {quizIdx + 1} de {HISTORIA_QUIZ.length}
            </span>
            <span className="text-xs text-slate-400">Historia Universal</span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 font-display">
            {currentQ.question}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, idx) => {
              const isChosen = quizChosen === idx;
              const isTarget = idx === currentQ.correctIdx;
              let style = 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200';

              if (quizChosen !== null) {
                if (isTarget) style = 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300';
                else if (isChosen) style = 'bg-rose-500 text-white border-rose-600';
                else style = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleQuizAnswer(idx)}
                  disabled={quizChosen !== null}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left flex items-center justify-between transition-all active:scale-98 ${style}`}
                >
                  <span>{opt}</span>
                  {quizChosen !== null && isTarget && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                  {quizChosen !== null && isChosen && !isTarget && <XCircle className="w-5 h-5 shrink-0" />}
                </button>
              );
            })}
          </div>

          {quizChosen !== null && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700">
                <strong>Dato Histórico:</strong> {currentQ.explanation}
              </div>

              <div className="text-center">
                <button
                  onClick={nextQuiz}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold active:scale-95 shadow-md"
                >
                  Siguiente Pregunta →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
