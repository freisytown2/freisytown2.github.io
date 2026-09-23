import React, { useState } from 'react';
import { GEOMETRIA_DATA, GeometricDetail } from '../../data/geometriaData';
import { playClick, playCorrect, playIncorrect, speak, speakCorrect, speakIncorrect } from '../../utils/audio';
import { fireConfetti } from '../../utils/confetti';
import { Sparkles, Calculator, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface GeometriaModuleProps {
  onAddScore: (isCorrect: boolean, extraPts?: number) => void;
}

export const GeometriaModule: React.FC<GeometriaModuleProps> = ({ onAddScore }) => {
  const [selectedShape, setSelectedShape] = useState<GeometricDetail>(GEOMETRIA_DATA[0]);
  const [activeTab, setActiveTab] = useState<'explorar' | 'calculadora' | 'quiz'>('explorar');

  // Calculator inputs
  const [calcParam, setCalcParam] = useState<number>(6);

  // Quiz state
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizChosen, setQuizChosen] = useState<number | null>(null);

  const GEOMETRIA_QUIZ = [
    {
      question: '¿Cuántos vértices tiene un hexágono regular?',
      options: ['5 vértices', '6 vértices', '7 vértices', '8 vértices'],
      correctIdx: 1,
      explanation: 'Un hexágono tiene exactamente 6 lados y 6 vértices.',
    },
    {
      question: '¿Cuál es la fórmula para calcular el área de un triángulo de base b y altura h?',
      options: ['b × h', '(b × h) / 2', '2 × (b + h)', 'π × r²'],
      correctIdx: 1,
      explanation: 'El área del triángulo es la mitad del paralelogramo correspondiente: (base × altura) / 2.',
    },
    {
      question: '¿Cuánto suman siempre los tres ángulos interiores de cualquier triángulo plano?',
      options: ['90°', '180°', '360°', '540°'],
      correctIdx: 1,
      explanation: 'En geometría euclidiana plana, la suma de los ángulos internos de un triángulo siempre es 180°.',
    },
    {
      question: '¿Qué figura geométrica no tiene vértices ni lados rectos?',
      options: ['Cuadrado', 'Pentágono', 'Círculo', 'Rectángulo'],
      correctIdx: 2,
      explanation: 'El círculo está delimitado por una curva continua donde todos los puntos equidistan del centro.',
    },
  ];

  const currentQuiz = GEOMETRIA_QUIZ[quizIdx];

  const handleSelectShape = (shape: GeometricDetail) => {
    playClick();
    speak(shape.name);
    setSelectedShape(shape);
  };

  const handleQuizAnswer = (idx: number) => {
    if (quizChosen !== null) return;
    setQuizChosen(idx);
    const isOk = idx === currentQuiz.correctIdx;
    if (isOk) {
      playCorrect();
      fireConfetti();
      speakCorrect();
      onAddScore(true, 15);
    } else {
      playIncorrect();
      speakIncorrect('Inténtalo de nuevo.');
      onAddScore(false);
    }
  };

  const nextQuiz = () => {
    playClick();
    setQuizIdx((prev) => (prev + 1) % GEOMETRIA_QUIZ.length);
    setQuizChosen(null);
  };

  // SVG Shape visual renderer
  const renderShapeSvg = (id: string, color: string) => {
    const size = 160;
    switch (id) {
      case 'circulo':
        return (
          <circle cx="80" cy="80" r="60" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="6" />
        );
      case 'triangulo':
        return (
          <polygon points="80,20 20,135 140,135" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="6" />
        );
      case 'cuadrado':
        return (
          <rect x="25" y="25" width="110" height="110" rx="8" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="6" />
        );
      case 'rectangulo':
        return (
          <rect x="15" y="45" width="130" height="70" rx="8" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="6" />
        );
      case 'pentagono':
        return (
          <polygon points="80,20 142,65 118,135 42,135 18,65" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="6" />
        );
      case 'hexagono':
        return (
          <polygon points="80,18 135,48 135,112 80,142 25,112 25,48" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="6" />
        );
      default:
        return null;
    }
  };

  // Calculator logic for active shape
  const calculateMetrics = () => {
    const p = Math.max(1, calcParam);
    if (selectedShape.id === 'circulo') {
      const perim = 2 * Math.PI * p;
      const area = Math.PI * p * p;
      return {
        label: 'Radio r',
        perim: perim.toFixed(2) + ' cm',
        area: area.toFixed(2) + ' cm²',
        stepP: `2 × π × ${p} = ${perim.toFixed(2)} cm`,
        stepA: `π × ${p}² = ${area.toFixed(2)} cm²`,
      };
    } else if (selectedShape.id === 'cuadrado') {
      const perim = 4 * p;
      const area = p * p;
      return {
        label: 'Lado L',
        perim: perim + ' cm',
        area: area + ' cm²',
        stepP: `4 × ${p} = ${perim} cm`,
        stepA: `${p} × ${p} = ${area} cm²`,
      };
    } else if (selectedShape.id === 'triangulo') {
      const perim = 3 * p;
      const area = (p * (p * 0.866)) / 2; // equilateral
      return {
        label: 'Lado base L',
        perim: perim + ' cm (equilátero)',
        area: area.toFixed(2) + ' cm²',
        stepP: `3 × ${p} = ${perim} cm`,
        stepA: `(${p} × ${(p * 0.866).toFixed(2)}) / 2 = ${area.toFixed(2)} cm²`,
      };
    } else if (selectedShape.id === 'rectangulo') {
      const b = p;
      const h = Math.max(1, Math.round(p / 2));
      const perim = 2 * (b + h);
      const area = b * h;
      return {
        label: 'Base (altura = mitad)',
        perim: perim + ' cm',
        area: area + ' cm²',
        stepP: `2 × (${b} + ${h}) = ${perim} cm`,
        stepA: `${b} × ${h} = ${area} cm²`,
      };
    } else if (selectedShape.id === 'pentagono') {
      const perim = 5 * p;
      const apotema = p / (2 * Math.tan(Math.PI / 5));
      const area = (perim * apotema) / 2;
      return {
        label: 'Lado regular',
        perim: perim + ' cm',
        area: area.toFixed(2) + ' cm²',
        stepP: `5 × ${p} = ${perim} cm`,
        stepA: `(${perim} × ${apotema.toFixed(2)}) / 2 = ${area.toFixed(2)} cm²`,
      };
    } else {
      // Hexágono
      const perim = 6 * p;
      const apotema = (p * Math.sqrt(3)) / 2;
      const area = (perim * apotema) / 2;
      return {
        label: 'Lado regular',
        perim: perim + ' cm',
        area: area.toFixed(2) + ' cm²',
        stepP: `6 × ${p} = ${perim} cm`,
        stepA: `(${perim} × ${apotema.toFixed(2)}) / 2 = ${area.toFixed(2)} cm²`,
      };
    }
  };

  const metrics = calculateMetrics();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Title & Tabs */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display flex items-center gap-2">
            <span>📐</span> Geometría: 6 Figuras Clave
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Lados, vértices, fórmulas de perímetro y área, ejemplos prácticos y calculadora interactiva.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl overflow-x-auto self-start sm:self-auto">
          <button
            onClick={() => {
              playClick();
              setActiveTab('explorar');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'explorar' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Explorar Figuras
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveTab('calculadora');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'calculadora' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Calculadora en Vivo
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveTab('quiz');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'quiz' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Quiz Geométrico
          </button>
        </div>
      </div>

      {/* Shape Selector Ribbon */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {GEOMETRIA_DATA.map((s) => {
          const isSelected = s.id === selectedShape.id;
          return (
            <button
              key={s.id}
              onClick={() => handleSelectShape(s)}
              className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 font-bold text-xs transition-all active:scale-95 ${
                isSelected
                  ? 'bg-white border-indigo-500 text-indigo-600 shadow-sm ring-2 ring-indigo-200'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <svg width="40" height="40" viewBox="0 0 160 160">
                {renderShapeSvg(s.id, s.color)}
              </svg>
              <span>{s.name}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXPLORAR FIGURAS */}
      {activeTab === 'explorar' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
            <div className="w-44 h-44 rounded-3xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
              <svg width="150" height="150" viewBox="0 0 160 160">
                {renderShapeSvg(selectedShape.id, selectedShape.color)}
              </svg>
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedShape.color }}
                />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Polígono Regular / Figura Plana
                </span>
              </div>
              <h3 className="text-3xl font-black text-slate-900 font-display">
                {selectedShape.name}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                {selectedShape.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold">
                  {selectedShape.sides} Lados
                </span>
                <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold">
                  {selectedShape.vertices} Vértices
                </span>
                <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold">
                  Ángulos: {selectedShape.anglesSum}
                </span>
              </div>
            </div>
          </div>

          {/* Formulas and Solved Examples */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Perímetro */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                Perímetro (P)
              </span>
              <div className="text-lg font-black text-slate-900 font-mono">
                {selectedShape.perimeterFormula}
              </div>
              <p className="text-xs text-slate-600">
                <strong>Ejemplo resuelto:</strong> {selectedShape.samplePerimeter}
              </p>
            </div>

            {/* Área */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
                Área (A)
              </span>
              <div className="text-lg font-black text-slate-900 font-mono">
                {selectedShape.areaFormula}
              </div>
              <p className="text-xs text-slate-600">
                <strong>Ejemplo resuelto:</strong> {selectedShape.sampleArea}
              </p>
            </div>
          </div>

          {/* Real World Applications */}
          <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 space-y-1 text-xs">
            <p className="font-bold text-indigo-950">🌍 ¿Dónde la vemos en el mundo real?</p>
            <p className="text-slate-600">
              • <strong>Objetos cotidianos:</strong> {selectedShape.realWorldExample}
            </p>
            <p className="text-slate-600">
              • <strong>Aplicaciones técnicas:</strong> {selectedShape.exampleUse}
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: CALCULADORA EN VIVO */}
      {activeTab === 'calculadora' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full inline-flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5" /> Calculadora Geométrica en Tiempo Real
            </span>
            <h3 className="text-xl font-black text-slate-900 font-display">
              Cálculo de Perímetro y Área para: {selectedShape.name}
            </h3>
          </div>

          {/* Slider input */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 max-w-md mx-auto">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>{metrics.label}:</span>
              <span className="text-base font-black text-indigo-600 font-mono">{calcParam} cm</span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              value={calcParam}
              onChange={(e) => setCalcParam(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1 cm</span>
              <span>12 cm</span>
              <span>25 cm</span>
            </div>
          </div>

          {/* Live computed results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-200 text-center space-y-1">
              <span className="text-xs font-bold text-indigo-700 block uppercase">Perímetro Total</span>
              <div className="text-2xl font-black text-indigo-950 font-mono">{metrics.perim}</div>
              <p className="text-[11px] text-indigo-800/80 font-mono">{metrics.stepP}</p>
            </div>

            <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 text-center space-y-1">
              <span className="text-xs font-bold text-emerald-700 block uppercase">Área Superficial</span>
              <div className="text-2xl font-black text-emerald-950 font-mono">{metrics.area}</div>
              <p className="text-[11px] text-emerald-800/80 font-mono">{metrics.stepA}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QUIZ GEOMÉTRICO */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Pregunta {quizIdx + 1} de {GEOMETRIA_QUIZ.length}
            </span>
            <span className="text-xs text-slate-400">Propiedades de las Figuras</span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 font-display">
            {currentQuiz.question}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQuiz.options.map((opt, idx) => {
              const isChosen = quizChosen === idx;
              const isTarget = idx === currentQuiz.correctIdx;
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
            <div className="space-y-4 pt-2">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700">
                <strong>Explicación:</strong> {currentQuiz.explanation}
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
