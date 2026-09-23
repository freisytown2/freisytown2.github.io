export type ModuleId =
  | 'abc'
  | 'vocales'
  | 'colores'
  | 'frutas'
  | 'hogar'
  | 'numeros'
  | 'suma'
  | 'resta'
  | 'multiplicacion'
  | 'division'
  | 'memoria'
  | 'sopa'
  | 'ortografia'
  | 'quiz'
  | 'geometria'
  | 'cultura'
  | 'retos'
  | 'ingles'
  | 'ciencias'
  | 'historia'
  | 'geografia'
  | 'logica'
  | 'comprension'
  | 'progreso';

export type CategoryFilter = 'todos' | 'estudio' | 'matematicas' | 'juegos' | 'retos';

export interface ModuleItem {
  id: ModuleId;
  name: string;
  subtitle: string;
  category: 'estudio' | 'matematicas' | 'juegos' | 'retos';
  icon: string; // Lucide icon name or emoji
  bgColor: string;
  accentColor: string;
  description: string;
}

export interface UserProgress {
  points: number;
  exercisesCompleted: number;
  correctAnswers: number;
  incorrectAnswers: number;
  stars: number;
  level: number;
  unlockedBadges: string[];
  moduleVisits: Record<string, number>;
  dailyStreak: number;
  lastActiveDate: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  requirement: string;
}

export interface LetterInfo {
  letter: string;
  lower: string;
  word: string;
  phonetic: string;
  exampleSentence: string;
  svgName: string;
  options: string[];
  correctIndex: number;
}

export interface ColorItem {
  name: string;
  hex: string;
  textColor: string;
  category: 'primario' | 'secundario' | 'neutro' | 'otro';
  description: string;
}

export interface FruitItem {
  id: string;
  name: string;
  latinName: string;
  color: string;
  taste: string;
  trivia: string;
  origin: string;
}

export interface HomeItem {
  id: string;
  name: string;
  room: 'Cocina' | 'Sala' | 'Dormitorio' | 'Comedor' | 'Baño/General';
  function: string;
  hint: string;
}

export interface QuizQuestion {
  id: number;
  category: 'matematicas' | 'lenguaje' | 'ciencias' | 'geografia' | 'historia' | 'cultura' | 'animales' | 'tecnologia';
  categoryLabel: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface GeometricShape {
  id: string;
  name: string;
  sides: number;
  vertices: number;
  description: string;
  perimeterFormula: string;
  areaFormula: string;
  samplePerimeter: string;
  sampleArea: string;
}
