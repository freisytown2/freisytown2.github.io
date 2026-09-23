export interface LogicRiddle {
  id: string;
  title: string;
  riddle: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const LOGIC_RIDDLES: LogicRiddle[] = [
  {
    id: 'lr1',
    title: 'El paso del tiempo',
    riddle: 'Si ayer fue dos días después del lunes, ¿qué día será mañana?',
    options: ['Jueves', 'Viernes', 'Sábado', 'Miércoles'],
    correctIndex: 1,
    explanation: 'Dos días después del lunes es miércoles (eso fue ayer). Por lo tanto hoy es jueves, y mañana será viernes.',
  },
  {
    id: 'lr2',
    title: 'Familia numerosa',
    riddle: 'Una madre tiene 4 hijas, y cada hija tiene 1 hermano. ¿Cuántos hijos tiene en total la madre?',
    options: ['4 hijos', '5 hijos', '8 hijos', '9 hijos'],
    correctIndex: 1,
    explanation: 'El hermano es el mismo para todas las 4 hermanas. En total son 4 hijas + 1 hijo = 5 hijos.',
  },
  {
    id: 'lr3',
    title: 'Carrera veloz',
    riddle: 'Estás corriendo una carrera y adelantas a la persona que va en segundo lugar. ¿En qué posición quedas?',
    options: ['Primer lugar', 'Segundo lugar', 'Tercer lugar', 'Último lugar'],
    correctIndex: 1,
    explanation: 'Al adelantar al que iba segundo, tú tomas su puesto, por lo que quedas en el segundo lugar.',
  },
  {
    id: 'lr4',
    title: 'Los meses del año',
    riddle: 'Algunos meses tienen 31 días y otros tienen 30 días. ¿Cuántos meses del año tienen al menos 28 días?',
    options: ['1 mes', '2 meses', '6 meses', 'Todos los 12 meses'],
    correctIndex: 3,
    explanation: 'Todos los 12 meses del año tienen como mínimo 28 días.',
  },
  {
    id: 'lr5',
    title: 'La vela encendida',
    riddle: 'Hay 10 velas encendidas en una mesa. Una ráfaga de viento apaga 3 de ellas. Las demás siguen encendidas hasta consumirse por completo. ¿Cuántas velas quedan al final?',
    options: ['7 velas', '3 velas', '0 velas', '10 velas'],
    correctIndex: 1,
    explanation: 'Las 7 velas encendidas se consumieron por completo hasta derretirse; las 3 que se apagaron quedaron intactas.',
  },
];

export interface WordAnagram {
  scrambled: string;
  solution: string;
  hint: string;
  category: string;
}

export const WORD_ANAGRAMS: WordAnagram[] = [
  { scrambled: 'I C E N C I A', solution: 'CIENCIA', hint: 'Búsqueda sistemática del conocimiento', category: 'Conocimiento' },
  { scrambled: 'E N T A P L A', solution: 'PLANETA', hint: 'Cuerpo celeste que orbita una estrella', category: 'Astronomía' },
  { scrambled: 'I B L O R', solution: 'LIBRO', hint: 'Hojas encuadernadas llenas de historias o ideas', category: 'Educación' },
  { scrambled: 'U M I S C A', solution: 'MUSICA', hint: 'Arte de combinar sonidos y silencios armónicamente', category: 'Arte' },
  { scrambled: 'N G E I N O I', solution: 'INGENIO', hint: 'Capacidad creativa para resolver problemas', category: 'Mente' },
  { scrambled: 'C L E U S A E', solution: 'ESCUELA', hint: 'Lugar donde aprendemos y compartimos', category: 'Educación' },
  { scrambled: 'G U I L A A', solution: 'AGUILA', hint: 'Ave rapaz de vuelo majestuoso y vista aguda', category: 'Animales' },
  { scrambled: 'G A L I A X A', solution: 'GALAXIA', hint: 'Agrupación inmensa de estrellas, polvo y gas', category: 'Cosmos' },
];
