import React, { useState, useEffect } from 'react';
import { playClick, playCorrect, playIncorrect, playFlip, playSuccess, speak } from '../../utils/audio';
import { fireConfetti } from '../../utils/confetti';
import { Timer, RotateCcw, Sparkles, Trophy } from 'lucide-react';

interface MemoriaModuleProps {
  onAddScore: (isCorrect: boolean, extraPts?: number) => void;
}

interface MemoryCard {
  id: number;
  pairId: string;
  icon: string;
  label: string;
  color?: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const THEMES = {
  frutas: [
    { pairId: 'manzana', icon: '🍎', label: 'Manzana' },
    { pairId: 'banana', icon: '🍌', label: 'Banana' },
    { pairId: 'naranja', icon: '🍊', label: 'Naranja' },
    { pairId: 'fresa', icon: '🍓', label: 'Fresa' },
    { pairId: 'uva', icon: '🍇', label: 'Uva' },
    { pairId: 'sandia', icon: '🍉', label: 'Sandía' },
    { pairId: 'pina', icon: '🍍', label: 'Piña' },
    { pairId: 'mango', icon: '🥭', label: 'Mango' },
    { pairId: 'limon', icon: '🍋', label: 'Limón' },
    { pairId: 'coco', icon: '🥥', label: 'Coco' },
  ],
  animales: [
    { pairId: 'leon', icon: '🦁', label: 'León' },
    { pairId: 'delfin', icon: '🐬', label: 'Delfín' },
    { pairId: 'panda', icon: '🐼', label: 'Panda' },
    { pairId: 'aguila', icon: '🦅', label: 'Águila' },
    { pairId: 'buho', icon: '🦉', label: 'Búho' },
    { pairId: 'zorro', icon: '🦊', label: 'Zorro' },
    { pairId: 'lobo', icon: '🐺', label: 'Lobo' },
    { pairId: 'koala', icon: '🐨', label: 'Koala' },
    { pairId: 'tigre', icon: '🐯', label: 'Tigre' },
    { pairId: 'pulpo', icon: '🐙', label: 'Pulpo' },
  ],
  matematicas: [
    { pairId: 'pi', icon: 'π', label: 'Pi' },
    { pairId: 'infinito', icon: '∞', label: 'Infinito' },
    { pairId: 'raiz', icon: '√', label: 'Raíz' },
    { pairId: 'sum', icon: '∑', label: 'Suma' },
    { pairId: 'delta', icon: 'Δ', label: 'Delta' },
    { pairId: 'porcentaje', icon: '%', label: 'Porcentaje' },
    { pairId: 'angulo', icon: '∠', label: 'Ángulo' },
    { pairId: 'integral', icon: '∫', label: 'Integral' },
    { pairId: 'alfa', icon: 'α', label: 'Alfa' },
    { pairId: 'omega', icon: 'Ω', label: 'Omega' },
  ],
  colores: [
    { pairId: 'rojo', icon: '🔴', label: 'Rojo' },
    { pairId: 'azul', icon: '🔵', label: 'Azul' },
    { pairId: 'amarillo', icon: '🟡', label: 'Amarillo' },
    { pairId: 'verde', icon: '🟢', label: 'Verde' },
    { pairId: 'morado', icon: '🟣', label: 'Morado' },
    { pairId: 'naranja', icon: '🟠', label: 'Naranja' },
    { pairId: 'marron', icon: '🟤', label: 'Marrón' },
    { pairId: 'negro', icon: '⚫', label: 'Negro' },
    { pairId: 'blanco', icon: '⚪', label: 'Blanco' },
    { pairId: 'celeste', icon: '💎', label: 'Celeste' },
  ],
};

export const MemoriaModule: React.FC<MemoriaModuleProps> = ({ onAddScore }) => {
  const [theme, setTheme] = useState<keyof typeof THEMES>('frutas');
  const [difficulty, setDifficulty] = useState<'facil' | 'medio' | 'dificil'>('facil');
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Pair counts: facil = 6 pairs (12 cards), medio = 8 pairs (16 cards), dificil = 10 pairs (20 cards)
  const pairCount = difficulty === 'facil' ? 6 : difficulty === 'medio' ? 8 : 10;

  const initGame = () => {
    playClick();
    const sourceItems = THEMES[theme].slice(0, pairCount);
    const deck: MemoryCard[] = [];

    sourceItems.forEach((item, idx) => {
      // 2 identical cards per pair
      deck.push({
        id: idx * 2,
        pairId: item.pairId,
        icon: item.icon,
        label: item.label,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        id: idx * 2 + 1,
        pairId: item.pairId,
        icon: item.icon,
        label: item.label,
        isFlipped: false,
        isMatched: false,
      });
    });

    const shuffled = deck.sort(() => 0.5 - Math.random());
    setCards(shuffled);
    setSelectedCards([]);
    setMoves(0);
    setMatches(0);
    setSeconds(0);
    setIsGameActive(false);
    setIsCompleted(false);
  };

  useEffect(() => {
    initGame();
  }, [theme, difficulty]);

  // Timer effect
  useEffect(() => {
    let timer: any = null;
    if (isGameActive && !isCompleted) {
      timer = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGameActive, isCompleted]);

  const handleCardClick = (index: number) => {
    const card = cards[index];
    if (card.isFlipped || card.isMatched || selectedCards.length === 2) return;

    if (!isGameActive) setIsGameActive(true);
    playFlip();
    speak(card.label);

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const firstIdx = newSelected[0];
      const secondIdx = newSelected[1];
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.pairId === secondCard.pairId) {
        // MATCH!
        setTimeout(() => {
          playCorrect();
          speak('¡Pareja encontrada! ¡Muy bien!');
          const matchedState = [...newCards];
          matchedState[firstIdx].isMatched = true;
          matchedState[secondIdx].isMatched = true;
          setCards(matchedState);
          setSelectedCards([]);
          setMatches((prev) => {
            const nextMatches = prev + 1;
            if (nextMatches === pairCount) {
              // Game Won!
              setIsCompleted(true);
              setIsGameActive(false);
              playSuccess();
              fireConfetti();
              onAddScore(true, pairCount * 5);
            }
            return nextMatches;
          });
        }, 400);
      } else {
        // NO MATCH -> Flip back after delay
        setTimeout(() => {
          playIncorrect();
          const reverted = [...newCards];
          reverted[firstIdx].isFlipped = false;
          reverted[secondIdx].isFlipped = false;
          setCards(reverted);
          setSelectedCards([]);
        }, 900);
      }
    }
  };

  const gridColsClass =
    difficulty === 'facil'
      ? 'grid-cols-3 sm:grid-cols-4'
      : difficulty === 'medio'
      ? 'grid-cols-4'
      : 'grid-cols-4 sm:grid-cols-5';

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16">
      {/* Title & Controls */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display flex items-center gap-2">
            <span>🧠</span> Juego de Memoria (3D Flip)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Encuentra todas las parejas volteando las cartas.
          </p>
        </div>

        {/* Theme and Difficulty Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Difficulty */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            {(['facil', 'medio', 'dificil'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                  difficulty === d ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                {d === 'facil' ? '12 cartas' : d === 'medio' ? '16 cartas' : '20 cartas'}
              </button>
            ))}
          </div>

          {/* Restart */}
          <button
            onClick={initGame}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Reiniciar tablero"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Theme Selector Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-500">Temática:</span>
        {(Object.keys(THEMES) as (keyof typeof THEMES)[]).map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              theme === t
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t === 'frutas' ? '🍎 Frutas' : t === 'animales' ? '🦁 Animales' : t === 'colores' ? '🎨 Colores' : '📐 Matemáticas'}
          </button>
        ))}
      </div>

      {/* Status Bar */}
      <div className="grid grid-cols-3 gap-3 bg-white p-3 rounded-2xl border border-slate-200 text-center">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Parejas
          </span>
          <span className="text-base font-black text-indigo-600">
            {matches} / {pairCount}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Intentos
          </span>
          <span className="text-base font-black text-slate-900">{moves}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Tiempo
          </span>
          <span className="text-base font-black text-slate-900 font-mono">
            {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* 3D Flip Card Grid */}
      <div className={`grid ${gridColsClass} gap-2.5 sm:gap-3`}>
        {cards.map((card, idx) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(idx)}
            className="aspect-square cursor-pointer perspective-1000"
          >
            <div
              className={`relative w-full h-full duration-500 preserve-3d rounded-2xl shadow-xs transition-transform ${
                card.isFlipped || card.isMatched ? 'rotate-y-180' : ''
              }`}
            >
              {/* Card Back (Hidden pattern) */}
              <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-sky-600 flex items-center justify-center text-white font-extrabold text-xl shadow-xs border-2 border-white/20 select-none hover:scale-[1.02] transition-transform">
                <span className="text-2xl drop-shadow-sm">❓</span>
              </div>

              {/* Card Front (Revealed Content) */}
              <div
                className={`absolute inset-0 w-full h-full rotate-y-180 backface-hidden rounded-2xl border-2 flex flex-col items-center justify-center p-2 select-none shadow-sm ${
                  card.isMatched
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-200'
                    : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <span className="text-3xl sm:text-4xl block leading-none drop-shadow-2xs">
                  {card.icon}
                </span>
                <span className="text-[10px] sm:text-xs font-bold mt-1.5 truncate max-w-full text-center">
                  {card.label}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Completion Modal / Banner */}
      {isCompleted && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-3xl p-6 text-center space-y-3 shadow-md">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl mx-auto shadow-sm">
            🏆
          </div>
          <h3 className="text-2xl font-black text-emerald-950 font-display">
            ¡Felicitaciones! ¡Completaste el Memorama!
          </h3>
          <p className="text-xs text-emerald-800">
            Encontraste todas las {pairCount} parejas en {moves} intentos y {seconds} segundos.
          </p>
          <button
            onClick={initGame}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold active:scale-95 shadow-md"
          >
            Jugar Otra Partida
          </button>
        </div>
      )}
    </div>
  );
};
