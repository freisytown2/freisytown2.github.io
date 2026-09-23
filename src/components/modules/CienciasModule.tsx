import React, { useState } from 'react';
import { playClick, playCorrect, playIncorrect } from '../../utils/audio';
import { fireConfetti } from '../../utils/confetti';
import { Sparkles, CheckCircle2, XCircle, Atom, Globe, Heart, Droplets } from 'lucide-react';

interface CienciasModuleProps {
  onAddScore: (isCorrect: boolean, extraPts?: number) => void;
}

interface ScienceTopic {
  id: string;
  title: string;
  icon: string;
  category: string;
  summary: string;
  keyPoints: string[];
  curiousFact: string;
}

const SCIENCE_TOPICS: ScienceTopic[] = [
  {
    id: 'sistema_solar',
    title: 'El Sistema Solar',
    icon: '🪐',
    category: 'Astronomía',
    summary: 'Nuestro sistema planetario consta de una estrella central (el Sol) y 8 planetas principales que orbitan a su alrededor.',
    keyPoints: [
      'Planetas rocosos interiores: Mercurio, Venus, Tierra y Marte.',
      'Gigantes gaseosos y helados exteriores: Júpiter, Saturno, Urano y Neptuno.',
      'Júpiter es el planeta de mayor masa (más de 300 veces la Tierra).',
      'Venus es el planeta más caliente debido al intenso efecto invernadero en su atmósfera.',
    ],
    curiousFact: 'Un día en Venus dura más que un año entero en Venus, porque tarda 243 días terrestres en girar sobre su propio eje.',
  },
  {
    id: 'cuerpo_humano',
    title: 'Aparatos del Cuerpo Humano',
    icon: '🫀',
    category: 'Biología y Anatomía',
    summary: 'El cuerpo humano es una máquina biológica integrada por sistemas coordinados que permiten la vida.',
    keyPoints: [
      'Sistema Circulatorio: el corazón bombea cerca de 5 litros de sangre por minuto a través de arterias y venas.',
      'Sistema Respiratorio: los pulmones absorben oxígeno (O₂) y expulsan dióxido de carbono (CO₂).',
      'Sistema Digestivo: transforma alimentos en nutrientes absorbibles.',
      'Sistema Nervioso: el cerebro y la médula transmiten impulsos eléctricos a más de 300 km/h.',
    ],
    curiousFact: 'Los vasos sanguíneos de un adulto humano extenderían más de 100,000 kilómetros si se pusieran en fila recta, ¡suficiente para dar 2.5 vueltas al ecuador terrestre!',
  },
  {
    id: 'estados_materia',
    title: 'Estados de la Materia',
    icon: '🧊',
    category: 'Física y Química',
    summary: 'La materia se presenta en diferentes fases según la temperatura y la energía cinética de sus moléculas.',
    keyPoints: [
      'Sólido: forma y volumen definidos; partículas fuertemente unidas.',
      'Líquido: volumen definido pero forma adaptable al recipiente.',
      'Gaseoso: sin forma ni volumen fijo; partículas muy dispersas.',
      'Plasma: gas ionizado a altísimas temperaturas presente en las estrellas y relámpagos.',
    ],
    curiousFact: 'El plasma es en realidad el estado de la materia más abundante en el universo observable, conformando más del 99% de las estrellas y el medio interestelar.',
  },
  {
    id: 'ciclo_agua',
    title: 'El Ciclo del Agua',
    icon: '💧',
    category: 'Ecología y Clima',
    summary: 'El movimiento continuo e ininterrumpido del agua en la hidrosfera de la Tierra.',
    keyPoints: [
      '1. Evaporación: el calor solar calienta ríos y mares, convirtiendo el agua en vapor.',
      '2. Condensación: el vapor asciende y se enfría formando nubes.',
      '3. Precipitación: las gotas se condensan y caen como lluvia, nieve o granizo.',
      '4. Filtración y Escorrentía: el agua regresa a ríos, acuíferos subterráneos y océanos.',
    ],
    curiousFact: 'El agua que bebes hoy es exactamente la misma molécula de H₂O que existía hace millones de años y que probablemente bebió algún dinosaurio.',
  },
];

const SCIENCE_QUIZ = [
  {
    question: '¿Cuál es el planeta más grande de nuestro Sistema Solar?',
    options: ['Saturno', 'Júpiter', 'Neptuno', 'Urano'],
    correctIdx: 1,
    explanation: 'Júpiter posee más del doble de la masa de todos los demás planetas juntos.',
  },
  {
    question: '¿Qué órgano del cuerpo humano se encarga de purificar y filtrar la sangre, produciendo orina?',
    options: ['Pulmones', 'Riñones', 'Páncreas', 'Estómago'],
    correctIdx: 1,
    explanation: 'Los riñones filtran aproximadamente 200 litros de sangre al día para eliminar desechos.',
  },
  {
    question: '¿Cómo se llama el proceso por el cual el agua líquida pasa a estado gaseoso por acción del calor?',
    options: ['Condensación', 'Sublimación', 'Evaporación', 'Solidificación'],
    correctIdx: 2,
    explanation: 'La evaporación ocurre cuando las moléculas líquidas ganan suficiente energía térmica para escapar a la fase gaseosa.',
  },
];

export const CienciasModule: React.FC<CienciasModuleProps> = ({ onAddScore }) => {
  const [selectedTopic, setSelectedTopic] = useState<ScienceTopic>(SCIENCE_TOPICS[0]);
  const [activeTab, setActiveTab] = useState<'temas' | 'quiz'>('temas');
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizChosen, setQuizChosen] = useState<number | null>(null);

  const currentQ = SCIENCE_QUIZ[quizIdx];

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
    setQuizIdx((prev) => (prev + 1) % SCIENCE_QUIZ.length);
    setQuizChosen(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Title & Mode */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display flex items-center gap-2">
            <span>🔬</span> Ciencias Naturales y Planeta
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Astronomía, biología humana, estados de la materia y el ciclo hidrológico.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => {
              playClick();
              setActiveTab('temas');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'temas' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Temas de Estudio
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveTab('quiz');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'quiz' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Quiz Científico
          </button>
        </div>
      </div>

      {activeTab === 'temas' ? (
        <div className="space-y-6">
          {/* Topic Selector Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SCIENCE_TOPICS.map((t) => {
              const isSelected = t.id === selectedTopic.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    playClick();
                    setSelectedTopic(t);
                  }}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-200 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="text-3xl">{t.icon}</span>
                  <span className="text-xs font-bold">{t.title}</span>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Topic Display */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                {selectedTopic.category}
              </span>
              <span className="text-2xl">{selectedTopic.icon}</span>
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900 font-display">
                {selectedTopic.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {selectedTopic.summary}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Conceptos Fundamentales:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedTopic.keyPoints.map((point, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed font-medium"
                  >
                    • {point}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 text-xs space-y-1">
              <span className="font-bold text-emerald-950 block">💡 Curiosidad Asombrosa:</span>
              <p className="text-emerald-900 leading-relaxed">{selectedTopic.curiousFact}</p>
            </div>
          </div>
        </div>
      ) : (
        /* Quiz Mode */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 max-w-xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Pregunta {quizIdx + 1} de {SCIENCE_QUIZ.length}
            </span>
            <span className="text-xs text-slate-400">Ciencias Naturales</span>
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
                <strong>Explicación:</strong> {currentQ.explanation}
              </div>

              <div className="text-center">
                <button
                  onClick={nextQuiz}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold active:scale-95 shadow-md"
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
