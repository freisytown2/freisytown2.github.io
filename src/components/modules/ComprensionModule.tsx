import React, { useState } from 'react';
import { playClick, playCorrect, playIncorrect } from '../../utils/audio';
import { fireConfetti } from '../../utils/confetti';
import { Sparkles, BookOpen, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface ComprensionModuleProps {
  onAddScore: (isCorrect: boolean, extraPts?: number) => void;
}

interface ReadingArticle {
  id: string;
  title: string;
  theme: string;
  readingTime: string;
  paragraphs: string[];
  questions: {
    question: string;
    options: string[];
    correctIdx: number;
    explanation: string;
  }[];
}

const READINGS: ReadingArticle[] = [
  {
    id: 'james_webb',
    title: 'El Telescopio Espacial James Webb y los Orígenes del Cosmos',
    theme: 'Astronomía y Exploración',
    readingTime: '2 min',
    paragraphs: [
      'Lanzado en diciembre de 2021, el Telescopio Espacial James Webb (JWST) es el observatorio espacial más potente jamás construido por la humanidad. A diferencia de su célebre predecesor, el Hubble, que observaba primordialmente en luz visible y ultravioleta, el telescopio Webb está especializado en la radiación infrarroja. Esto le permite atravesar las densas nubes de polvo interestelar que ocultan el nacimiento de estrellas y contemplar galaxias primitivas formadas hace más de 13.000 millones de años.',
      'Para detectar estas señales térmicas increíblemente débiles y lejanas, los instrumentos del James Webb deben mantenerse a temperaturas extremadamente gélidas, cercanas a los -233 °C. Para lograrlo, el telescopio orbita en el punto de Lagrange L2, a 1.5 millones de kilómetros de la Tierra, protegido de la radiación directa del Sol por un escudo térmico de cinco capas del tamaño aproximado de una cancha de tenis.',
    ],
    questions: [
      {
        question: '¿Por qué el telescopio James Webb observa principalmente en el espectro infrarrojo?',
        options: [
          'Porque el infrarrojo permite atravesar nubes de polvo y captar galaxias muy tempranas.',
          'Porque la luz visible daña las cámaras electrónicas.',
          'Porque en el punto L2 no llega ninguna luz solar.',
          'Para emitir señales de radio hacia planetas habitados.',
        ],
        correctIdx: 0,
        explanation: 'La radiación infrarroja atraviesa el polvo cósmico y recoge la luz de galaxias lejanas corrida al rojo por la expansión del cosmos.',
      },
      {
        question: '¿Dónde está ubicado el telescopio para mantener sus instrumentos gélidos?',
        options: [
          'En la órbita baja terrestre junto a la Estación Espacial.',
          'En el punto de Lagrange L2, a 1.5 millones de kilómetros de la Tierra.',
          'En el cráter sur de la Luna.',
          'En la atmósfera superior de Marte.',
        ],
        correctIdx: 1,
        explanation: 'El telescopio se encuentra en el punto L2, donde la gravedad solar y terrestre se equilibran.',
      },
    ],
  },
  {
    id: 'neuroplasticidad',
    title: 'La Neuroplasticidad y el Cerebro en Desarrollo',
    theme: 'Neurociencia y Aprendizaje',
    readingTime: '2 min',
    paragraphs: [
      'Durante siglos se creyó que la estructura del cerebro humano adulto era rígida e inmutable una vez superada la infancia temprana. Sin embargo, la neurociencia moderna ha demostrado que el cerebro posee una capacidad extraordinaria llamada neuroplasticidad: la habilidad de reorganizar sus redes neuronales, formar nuevas sinapsis y fortalecer circuitos en respuesta al aprendizaje, la experiencia y la práctica constante.',
      'En la adolescencia y juventud temprana, el cerebro atraviesa una de sus mayores ventanas de remodelación sináptica, conocida como "poda sináptica". Las conexiones que se utilizan con frecuencia —como resolver problemas matemáticos, aprender idiomas o tocar un instrumento musical— se refuerzan con mielina haciéndose veloces y eficientes, mientras que las vías neuronales en desuso se desvanecen gradualmente.',
    ],
    questions: [
      {
        question: '¿Qué es la neuroplasticidad según el texto?',
        options: [
          'Un material sintético para reparar neuronas dañadas.',
          'La capacidad del cerebro de reorganizar sus conexiones mediante la experiencia y el aprendizaje.',
          'La pérdida inevitable de memoria a partir de los 20 años.',
          'Una enfermedad degenerativa del sistema nervioso.',
        ],
        correctIdx: 1,
        explanation: 'La neuroplasticidad es la propiedad biológica del tejido neural de adaptarse funcional y estructuralmente a los estímulos.',
      },
      {
        question: '¿Qué ocurre con las conexiones neuronales que se ejercitan activamente?',
        options: [
          'Se eliminan durante la poda sináptica.',
          'Se refuerzan haciéndose más veloces y eficientes.',
          'Pierden su capa de mielina.',
          'Disminuyen su velocidad de transmisión.',
        ],
        correctIdx: 1,
        explanation: 'Las sinapsis estimuladas con frecuencia se consolidan y aceleran su transmisión nerviosa gracias a la mielinización.',
      },
    ],
  },
];

export const ComprensionModule: React.FC<ComprensionModuleProps> = ({ onAddScore }) => {
  const [selectedArticleIdx, setSelectedArticleIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [chosenAnswer, setChosenAnswer] = useState<number | null>(null);

  const article = READINGS[selectedArticleIdx];
  const question = article.questions[qIdx];

  const handleSelectAnswer = (idx: number) => {
    if (chosenAnswer !== null) return;
    setChosenAnswer(idx);
    const ok = idx === question.correctIdx;
    if (ok) {
      playCorrect();
      fireConfetti();
      onAddScore(true, 15);
    } else {
      playIncorrect();
      onAddScore(false);
    }
  };

  const nextQuestion = () => {
    playClick();
    if (qIdx + 1 < article.questions.length) {
      setQIdx((q) => q + 1);
      setChosenAnswer(null);
    } else {
      // Next article
      const nextA = (selectedArticleIdx + 1) % READINGS.length;
      setSelectedArticleIdx(nextA);
      setQIdx(0);
      setChosenAnswer(null);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16">
      {/* Title & Article Selector */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display flex items-center gap-2">
            <span>📖</span> Taller de Comprensión Lectora
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Lectura analítica de textos divulgativos y preguntas de comprensión inferencial.
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto self-start sm:self-auto">
          {READINGS.map((r, i) => (
            <button
              key={r.id}
              onClick={() => {
                playClick();
                setSelectedArticleIdx(i);
                setQIdx(0);
                setChosenAnswer(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedArticleIdx === i
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Texto {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Reading Article Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            {article.theme}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Lectura: {article.readingTime}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
          {article.title}
        </h3>

        <div className="space-y-3 text-slate-700 leading-relaxed text-sm sm:text-base font-normal">
          {article.paragraphs.map((p, idx) => (
            <p key={idx} className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
              {p}
            </p>
          ))}
        </div>
      </div>

      {/* Comprehension Question Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Pregunta de Comprensión {qIdx + 1} de {article.questions.length}
          </span>
        </div>

        <h4 className="text-base sm:text-lg font-bold text-slate-900 font-display">
          {question.question}
        </h4>

        <div className="grid grid-cols-1 gap-2.5">
          {question.options.map((opt, idx) => {
            const isChosen = chosenAnswer === idx;
            const isTarget = idx === question.correctIdx;
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
                className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold text-left flex items-center justify-between transition-all active:scale-98 ${style}`}
              >
                <span>{opt}</span>
                {chosenAnswer !== null && isTarget && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                {chosenAnswer !== null && isChosen && !isTarget && <XCircle className="w-5 h-5 shrink-0" />}
              </button>
            );
          })}
        </div>

        {chosenAnswer !== null && (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700">
              <strong>Justificación en el texto:</strong> {question.explanation}
            </div>

            <div className="text-center">
              <button
                onClick={nextQuestion}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold active:scale-95 shadow-md"
              >
                {qIdx + 1 < article.questions.length ? 'Siguiente Pregunta →' : 'Siguiente Lectura →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
