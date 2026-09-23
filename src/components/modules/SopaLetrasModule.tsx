import React, { useState, useEffect } from 'react';
import { playClick, playCorrect, playIncorrect, playSuccess, speak } from '../../utils/audio';
import { fireConfetti } from '../../utils/confetti';
import { RotateCcw, Lightbulb, Timer, Sparkles, Check } from 'lucide-react';

interface SopaLetrasModuleProps {
  onAddScore: (isCorrect: boolean, extraPts?: number) => void;
}

const SOPA_THEMES = {
  frutas: {
    label: '🍎 Frutas',
    words: ['MANZANA', 'PLATANO', 'FRESA', 'LIMON', 'PERA', 'MANGO'],
  },
  animales: {
    label: '🦁 Animales',
    words: ['LEON', 'DELFIN', 'AGUILA', 'TIGRE', 'PANDA', 'ZORRO'],
  },
  colores: {
    label: '🎨 Colores',
    words: ['AZUL', 'VERDE', 'ROJO', 'MORADO', 'AMARILLO', 'ROSA'],
  },
  escuela: {
    label: '📚 Escuela',
    words: ['LIBRO', 'LAPIZ', 'AULA', 'REGLA', 'MAESTRO', 'TAREA'],
  },
  hogar: {
    label: '🏠 Cosas del Hogar',
    words: ['MESA', 'SILLA', 'CAMA', 'SOFA', 'PUERTA', 'RELOJ'],
  },
  paises: {
    label: '🌎 Países',
    words: ['MEXICO', 'ESPAÑA', 'PERU', 'CHILE', 'COLOMBIA', 'ARGENTINA'],
  },
};

interface PlacedWord {
  word: string;
  cells: { r: number; c: number }[];
  found: boolean;
}

export const SopaLetrasModule: React.FC<SopaLetrasModuleProps> = ({ onAddScore }) => {
  const [selectedThemeKey, setSelectedThemeKey] = useState<keyof typeof SOPA_THEMES>('frutas');
  const [gridSize, setGridSize] = useState<number>(8);
  const [grid, setGrid] = useState<string[][]>([]);
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
  const [selectedCells, setSelectedCells] = useState<{ r: number; c: number }[]>([]);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hintCell, setHintCell] = useState<{ r: number; c: number } | null>(null);

  const SPANISH_ALPHABET = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';

  const generateBoard = () => {
    playClick();
    const size = gridSize;
    const theme = SOPA_THEMES[selectedThemeKey];
    const wordsToPlace = [...theme.words];

    // Create empty board
    const board: string[][] = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => '')
    );

    const placed: PlacedWord[] = [];

    const directions = [
      { dr: 0, dc: 1 },  // Horizontal right
      { dr: 1, dc: 0 },  // Vertical down
      { dr: 1, dc: 1 },  // Diagonal down-right
      { dr: 0, dc: -1 }, // Horizontal left
    ];

    for (const rawWord of wordsToPlace) {
      const word = rawWord.toUpperCase();
      let placedSuccess = false;
      let attempts = 0;

      while (!placedSuccess && attempts < 150) {
        attempts++;
        const dir = directions[Math.floor(Math.random() * directions.length)];
        const startR = Math.floor(Math.random() * size);
        const startC = Math.floor(Math.random() * size);

        // Check bounds
        const endR = startR + dir.dr * (word.length - 1);
        const endC = startC + dir.dc * (word.length - 1);

        if (endR < 0 || endR >= size || endC < 0 || endC >= size) continue;

        // Check collisions
        let canPlace = true;
        const candidateCells: { r: number; c: number }[] = [];

        for (let i = 0; i < word.length; i++) {
          const currR = startR + dir.dr * i;
          const currC = startC + dir.dc * i;
          const existing = board[currR][currC];
          if (existing !== '' && existing !== word[i]) {
            canPlace = false;
            break;
          }
          candidateCells.push({ r: currR, c: currC });
        }

        if (canPlace) {
          // Place word
          for (let i = 0; i < word.length; i++) {
            board[candidateCells[i].r][candidateCells[i].c] = word[i];
          }
          placed.push({
            word,
            cells: candidateCells,
            found: false,
          });
          placedSuccess = true;
        }
      }
    }

    // Fill remaining empty cells with random letters
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (board[r][c] === '') {
          board[r][c] = SPANISH_ALPHABET[Math.floor(Math.random() * SPANISH_ALPHABET.length)];
        }
      }
    }

    setGrid(board);
    setPlacedWords(placed);
    setSelectedCells([]);
    setTimerSeconds(0);
    setIsCompleted(false);
    setHintCell(null);
  };

  useEffect(() => {
    generateBoard();
  }, [selectedThemeKey, gridSize]);

  // Timer loop
  useEffect(() => {
    let interval: any = null;
    if (!isCompleted) {
      interval = setInterval(() => {
        setTimerSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCompleted]);

  const handleCellClick = (r: number, c: number) => {
    playClick();
    const alreadySelected = selectedCells.some((cell) => cell.r === r && cell.c === c);

    let updatedSelection: { r: number; c: number }[];
    if (alreadySelected) {
      updatedSelection = selectedCells.filter((cell) => !(cell.r === r && cell.c === c));
    } else {
      updatedSelection = [...selectedCells, { r, c }];
    }
    setSelectedCells(updatedSelection);

    // Build the string formed by currently selected cells
    const selectedString = updatedSelection.map((cell) => grid[cell.r][cell.c]).join('');
    const reversedString = selectedString.split('').reverse().join('');

    // Check if matches any placed word
    const match = placedWords.find(
      (pw) => !pw.found && (pw.word === selectedString || pw.word === reversedString)
    );

    if (match) {
      playCorrect();
      speak(`¡${match.word.toLowerCase()}! ¡Muy bien!`);
      const updatedPlaced = placedWords.map((pw) =>
        pw.word === match.word ? { ...pw, found: true } : pw
      );
      setPlacedWords(updatedPlaced);
      setSelectedCells([]);
      onAddScore(true, 15);

      const allFound = updatedPlaced.every((pw) => pw.found);
      if (allFound) {
        setIsCompleted(true);
        playSuccess();
        fireConfetti();
        onAddScore(true, 30);
      }
    }
  };

  const handleHint = () => {
    playClick();
    const unfound = placedWords.find((pw) => !pw.found);
    if (!unfound) return;
    const firstCell = unfound.cells[0];
    setHintCell(firstCell);
    setTimeout(() => {
      setHintCell(null);
    }, 2500);
  };

  // Helper to test if cell is part of an already found word
  const isCellFound = (r: number, c: number) => {
    return placedWords.some(
      (pw) => pw.found && pw.cells.some((cell) => cell.r === r && cell.c === c)
    );
  };

  const isCellSelected = (r: number, c: number) => {
    return selectedCells.some((cell) => cell.r === r && cell.c === c);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header & Controls */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display flex items-center gap-2">
            <span>🔍</span> Sopa de Letras Interactiva
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Generador algorítmico 100% funcional. Toca las letras para formar las palabras.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleHint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-all active:scale-95"
            title="Mostrar la primera letra de una palabra oculta"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            <span>Pista</span>
          </button>
          <button
            onClick={generateBoard}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all active:scale-95"
            title="Nuevo tablero"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar</span>
          </button>
        </div>
      </div>

      {/* Theme Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-500">Temática:</span>
        {(Object.keys(SOPA_THEMES) as (keyof typeof SOPA_THEMES)[]).map((key) => (
          <button
            key={key}
            onClick={() => setSelectedThemeKey(key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedThemeKey === key
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {SOPA_THEMES[key].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Board (Left 2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
            <span className="font-bold text-indigo-600">
              Palabras encontradas: {placedWords.filter((w) => w.found).length} / {placedWords.length}
            </span>
            <span className="font-mono flex items-center gap-1 font-bold">
              <Timer className="w-3.5 h-3.5" />
              {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>

          {/* Letter Matrix */}
          <div
            className="grid gap-1.5 max-w-sm sm:max-w-md mx-auto aspect-square select-none"
            style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
          >
            {grid.map((row, r) =>
              row.map((letter, c) => {
                const isFound = isCellFound(r, c);
                const isSelected = isCellSelected(r, c);
                const isHinted = hintCell?.r === r && hintCell?.c === c;

                let cellStyle = 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200';
                if (isFound) {
                  cellStyle = 'bg-emerald-500 text-white border-emerald-600 font-black shadow-xs';
                } else if (isSelected) {
                  cellStyle = 'bg-indigo-600 text-white border-indigo-700 font-black scale-105 shadow-sm';
                } else if (isHinted) {
                  cellStyle = 'bg-amber-400 text-amber-950 font-black ring-4 ring-amber-300 animate-pulse';
                }

                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`aspect-square rounded-xl border flex items-center justify-center font-bold text-base sm:text-lg transition-transform active:scale-90 ${cellStyle}`}
                  >
                    {letter}
                  </button>
                );
              })
            )}
          </div>

          {selectedCells.length > 0 && (
            <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-2xl border border-indigo-200 text-xs">
              <span className="text-indigo-900 font-bold">
                Letras seleccionadas:{' '}
                <strong className="tracking-widest">
                  {selectedCells.map((c) => grid[c.r][c.c]).join('')}
                </strong>
              </span>
              <button
                onClick={() => setSelectedCells([])}
                className="text-rose-600 font-bold hover:underline"
              >
                Limpiar selección
              </button>
            </div>
          )}
        </div>

        {/* Word Checklist (Right Col) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 font-display pb-2 border-b border-slate-100">
            Lista de Palabras ({placedWords.length})
          </h3>
          <div className="flex flex-col gap-2">
            {placedWords.map((pw) => (
              <div
                key={pw.word}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                  pw.found
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 line-through opacity-70'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <span>{pw.word}</span>
                {pw.found && <Check className="w-4 h-4 text-emerald-600" />}
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl space-y-1">
            <p className="font-semibold text-slate-700">💡 Instrucciones:</p>
            <p>1. Toca en orden las letras de una palabra.</p>
            <p>2. Al completar la palabra correcta, se iluminará en verde.</p>
            <p>3. Las palabras pueden estar en horizontal, vertical o diagonal.</p>
          </div>
        </div>
      </div>

      {isCompleted && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-3xl p-6 text-center space-y-3 shadow-md">
          <span className="text-4xl block">🎉</span>
          <h3 className="text-2xl font-black text-emerald-950 font-display">
            ¡Sopa de Letras Completada!
          </h3>
          <p className="text-xs text-emerald-800">
            Descubriste todas las palabras ocultas en {timerSeconds} segundos.
          </p>
          <button
            onClick={generateBoard}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold active:scale-95 shadow-md"
          >
            Nuevo Tablero con Palabras Diferentes
          </button>
        </div>
      )}
    </div>
  );
};
