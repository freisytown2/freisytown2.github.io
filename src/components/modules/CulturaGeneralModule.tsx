import React, { useState } from 'react';
import { playClick, playCorrect, playIncorrect } from '../../utils/audio';
import { fireConfetti } from '../../utils/confetti';
import { Sparkles, Globe2, BookOpen, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface CulturaGeneralModuleProps {
  onAddScore: (isCorrect: boolean, extraPts?: number) => void;
}

interface TriviaCard {
  title: string;
  category: string;
  emoji: string;
  curiosity: string;
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

const CULTURA_TRIVIA: TriviaCard[] = [
  {
    title: 'El Misterio de la Mona Lisa',
    category: 'Arte y Pintura',
    emoji: '🎨',
    curiosity: 'Leonardo da Vinci tardó más de 14 años en perfeccionar los labios y la técnica del sfumato en la Mona Lisa.',
    question: '¿En qué famoso museo parisino se encuentra expuesta la Mona Lisa protegida tras cristal blindado?',
    options: ['Museo del Prado', 'Museo Británico', 'Museo del Louvre', 'Galería Uffizi'],
    correctIdx: 2,
    explanation: 'La obra se conserva en la Sala de los Estados del Museo del Louvre en París.',
  },
  {
    title: 'La Gran Muralla China',
    category: 'Historia y Arquitectura',
    emoji: '🧱',
    curiosity: 'Si se extendieran todos los tramos construidos por las distintas dinastías, la Gran Muralla mediría más de 21,000 kilómetros.',
    question: '¿Para qué propósito principal fue levantada originalmente la Gran Muralla?',
    options: ['Transportar agua dulce', 'Defensa contra invasiones del norte', 'Caminata religiosa', 'Comercio exclusivo'],
    correctIdx: 1,
    explanation: 'Fue erigida para proteger las fronteras del imperio chino de las incursiones de pueblos nómadas.',
  },
  {
    title: 'El Corazón de la Ballena Azul',
    category: 'Mundo Animal',
    emoji: '🐋',
    curiosity: 'El corazón de una ballena azul pesa cerca de 180 kg y tiene el tamaño aproximado de un automóvil pequeño.',
    question: '¿A qué grupo zoológico pertenece la ballena azul?',
    options: ['Peces óseos', 'Reptiles marinos', 'Mamíferos marinos', 'Anfibios gigantes'],
    correctIdx: 2,
    explanation: 'La ballena azul es un mamífero: respira aire con pulmones y amamanta a sus crías con leche materna.',
  },
  {
    title: 'La Biblioteca de Alejandría',
    category: 'Historia y Literatura',
    emoji: '📜',
    curiosity: 'Fue una de las mayores y más significativas bibliotecas del mundo clásico, reuniendo cientos de miles de rollos de papiro.',
    question: '¿En qué país antiguo se encontraba la ciudad de Alejandría?',
    options: ['Grecia', 'Egipto', 'Italia', 'Persia'],
    correctIdx: 1,
    explanation: 'Alejandría fue fundada en Egipto por Alejandro Magno en el año 331 a.C.',
  },
  {
    title: 'El Oxígeno de los Océanos',
    category: 'Ciencia y Planeta',
    emoji: '🌊',
    curiosity: 'Más del 50% del oxígeno que respiramos en la Tierra no es producido por los bosques, sino por microorganismos fotosintéticos marinos.',
    question: '¿Cómo se denominan estos microorganismos vegetales marinos?',
    options: ['Zooplancton', 'Fitoplancton', 'Corales blandos', 'Medusas'],
    correctIdx: 1,
    explanation: 'El fitoplancton oceánico (especialmente las diatomeas) produce la mayor parte del oxígeno biosférico.',
  },
  {
    title: 'El Origen del Cero',
    category: 'Matemáticas y Sabiduría',
    emoji: '0️⃣',
    curiosity: 'El concepto del número cero como número y no solo como espacio vacío fue desarrollado de manera brillante en la India antigua.',
    question: '¿Qué célebre matemático y astrónomo indio formalizó las reglas aritméticas del cero en el siglo VII?',
    options: ['Brahmagupta', 'Pitágoras', 'Arquímedes', 'Euclides'],
    correctIdx: 0,
    explanation: 'Brahmagupta escribió en el 628 d.C. el tratado Brahmasphutasiddhanta formalizando el cero matemático.',
  },
];

export const CulturaGeneralModule: React.FC<CulturaGeneralModuleProps> = ({ onAddScore }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [chosenOpt, setChosenOpt] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'maraton' | 'curiosidades'>('maraton');

  const current = CULTURA_TRIVIA[currentIdx];

  const handleAnswer = (idx: number) => {
    if (chosenOpt !== null) return;
    setChosenOpt(idx);
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

  const nextTrivia = () => {
    playClick();
    setCurrentIdx((prev) => (prev + 1) % CULTURA_TRIVIA.length);
    setChosenOpt(null);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16">
      {/* Title & Tabs */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display flex items-center gap-2">
            <span>🌍</span> Cultura General y Curiosidades
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Datos asombrosos del mundo, historia universal, ciencia y arte.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => {
              playClick();
              setActiveTab('maraton');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'maraton' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Preguntas y Desafío
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveTab('curiosidades');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'curiosidades' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Fichas de Curiosidades
          </button>
        </div>
      </div>

      {activeTab === 'maraton' ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {current.category}
            </span>
            <span className="text-xs text-slate-400">
              Tema {currentIdx + 1} de {CULTURA_TRIVIA.length}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{current.emoji}</span>
              <div>
                <h3 className="text-xl font-black text-slate-900 font-display">{current.title}</h3>
                <p className="text-xs text-slate-500 italic mt-0.5">💡 {current.curiosity}</p>
              </div>
            </div>

            <div className="pt-3">
              <h4 className="text-base font-bold text-slate-800">
                Pregunta: {current.question}
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {current.options.map((opt, idx) => {
              const isChosen = chosenOpt === idx;
              const isTarget = idx === current.correctIdx;
              let style = 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200';

              if (chosenOpt !== null) {
                if (isTarget) style = 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300';
                else if (isChosen) style = 'bg-rose-500 text-white border-rose-600';
                else style = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleAnswer(idx)}
                  disabled={chosenOpt !== null}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left flex items-center justify-between transition-all active:scale-98 ${style}`}
                >
                  <span>{opt}</span>
                  {chosenOpt !== null && isTarget && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                  {chosenOpt !== null && isChosen && !isTarget && <XCircle className="w-5 h-5 shrink-0" />}
                </button>
              );
            })}
          </div>

          {chosenOpt !== null && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700">
                <strong>¿Sabías que...?</strong> {current.explanation}
              </div>

              <div className="text-center">
                <button
                  onClick={nextTrivia}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold active:scale-95 shadow-md"
                >
                  Siguiente Curiosidad →
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CULTURA_TRIVIA.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3 shadow-2xs hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{item.emoji}</span>
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                    {item.category}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 font-display">{item.title}</h4>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                "{item.curiosity}"
              </p>
              <p className="text-[11px] text-slate-500">
                <strong>Dato clave:</strong> {item.explanation}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
