export interface VocalDetail {
  vocal: string;
  lower: string;
  name: string;
  type: 'Abierta (Fuerte)' | 'Cerrada (Débil)';
  acousticInfo: string;
  words: { word: string; icon: string }[];
  exampleSentence: string;
}

export const VOCALES_DATA: VocalDetail[] = [
  {
    vocal: 'A',
    lower: 'a',
    name: 'A',
    type: 'Abierta (Fuerte)',
    acousticInfo: 'Se pronuncia con la boca amplia y la lengua en posición baja central.',
    words: [
      { word: 'Águila', icon: '🦅' },
      { word: 'Astronauta', icon: '🧑‍🚀' },
      { word: 'Amistad', icon: '🤝' },
      { word: 'Arcoíris', icon: '🌈' },
    ],
    exampleSentence: 'La amistad sincera alegra nuestras vidas.',
  },
  {
    vocal: 'E',
    lower: 'e',
    name: 'E',
    type: 'Abierta (Fuerte)',
    acousticInfo: 'La boca se entreabre y la lengua avanza ligeramente hacia los dientes delanteros.',
    words: [
      { word: 'Estudiante', icon: '🎓' },
      { word: 'Energía', icon: '⚡' },
      { word: 'Espacio', icon: '🚀' },
      { word: 'Espejo', icon: '🪞' },
    ],
    exampleSentence: 'El estudiante explora nuevas ideas con curiosidad.',
  },
  {
    vocal: 'I',
    lower: 'i',
    name: 'I',
    type: 'Cerrada (Débil)',
    acousticInfo: 'La abertura bucal es mínima y la lengua asciende hacia el paladar duro.',
    words: [
      { word: 'Invención', icon: '💡' },
      { word: 'Ingenio', icon: '⚙️' },
      { word: 'Ilustración', icon: '🎨' },
      { word: 'Impacto', icon: '💥' },
    ],
    exampleSentence: 'El ingenio humano ha transformado la tecnología.',
  },
  {
    vocal: 'O',
    lower: 'o',
    name: 'O',
    type: 'Abierta (Fuerte)',
    acousticInfo: 'Los labios se redondean y la lengua se retrae hacia la zona posterior de la boca.',
    words: [
      { word: 'Océano', icon: '🌊' },
      { word: 'Oxígeno', icon: '🫧' },
      { word: 'Olimpiada', icon: '🏅' },
      { word: 'Optimismo', icon: '✨' },
    ],
    exampleSentence: 'El oxígeno es vital para la respiración de los seres vivos.',
  },
  {
    vocal: 'U',
    lower: 'u',
    name: 'U',
    type: 'Cerrada (Débil)',
    acousticInfo: 'Abertura muy cerrada con labios redondeados y lengua en el velo del paladar.',
    words: [
      { word: 'Universo', icon: '🌌' },
      { word: 'Unión', icon: '🔗' },
      { word: 'Urgencia', icon: '🚨' },
      { word: 'Uva', icon: '🍇' },
    ],
    exampleSentence: 'La unión y el trabajo en equipo logran grandes metas.',
  },
];

export interface MissingVowelPuzzle {
  wordWithBlank: string;
  missingVocal: string;
  fullWord: string;
  meaning: string;
  options: string[];
}

export const MISSING_VOWEL_PUZZLES: MissingVowelPuzzle[] = [
  { wordWithBlank: 'P _ R R O', missingVocal: 'E', fullWord: 'PERRO', meaning: 'Mamífero canino domesticado y leal.', options: ['A', 'E', 'O', 'U'] },
  { wordWithBlank: 'M _ S A', missingVocal: 'E', fullWord: 'MESA', meaning: 'Mueble con tablero horizontal para trabajar o comer.', options: ['I', 'E', 'A', 'U'] },
  { wordWithBlank: 'L _ N A', missingVocal: 'U', fullWord: 'LUNA', meaning: 'Satélite natural de la Tierra.', options: ['A', 'E', 'O', 'U'] },
  { wordWithBlank: 'C _ S A', missingVocal: 'A', fullWord: 'CASA', meaning: 'Edificación destinada para habitar.', options: ['A', 'I', 'O', 'E'] },
  { wordWithBlank: 'S _ L', missingVocal: 'O', fullWord: 'SOL', meaning: 'Estrella luminosa centro del sistema solar.', options: ['A', 'E', 'O', 'U'] },
  { wordWithBlank: 'P _ N T A', missingVocal: 'I', fullWord: 'PINTA', meaning: 'Acción de aplicar color o apariencia.', options: ['A', 'E', 'I', 'O'] },
  { wordWithBlank: 'F _ E G O', missingVocal: 'U', fullWord: 'FUEGO', meaning: 'Fenómeno de calor y luz producido por combustión.', options: ['A', 'O', 'U', 'I'] },
  { wordWithBlank: 'V _ E N T O', missingVocal: 'I', fullWord: 'VIENTO', meaning: 'Corriente de aire producida en la atmósfera.', options: ['A', 'I', 'E', 'U'] },
  { wordWithBlank: 'B _ S Q U E', missingVocal: 'O', fullWord: 'BOSQUE', meaning: 'Gran extensión de terreno poblada de árboles.', options: ['A', 'E', 'O', 'U'] },
  { wordWithBlank: 'C _ E L O', missingVocal: 'I', fullWord: 'CIELO', meaning: 'Atmósfera que rodea la Tierra vista desde la superficie.', options: ['A', 'E', 'I', 'U'] },
];

export interface DiphthongPuzzle {
  word: string;
  isDiphthong: boolean;
  explanation: string;
}

export const DIPHTHONG_PUZZLES: DiphthongPuzzle[] = [
  { word: 'Tierra (ie)', isDiphthong: true, explanation: 'Unión de vocal cerrada (i) y abierta (e) en la misma sílaba: tie-rra.' },
  { word: 'Fuego (ue)', isDiphthong: true, explanation: 'Unión de vocal cerrada (u) y abierta (e): fue-go.' },
  { word: 'Poeta (o-e)', isDiphthong: false, explanation: 'Dos vocales abiertas contiguas forman hiato y van en sílabas separadas: po-e-ta.' },
  { word: 'Aire (ai)', isDiphthong: true, explanation: 'Vocal abierta (a) más vocal cerrada (i): ai-re.' },
  { word: 'Teatro (e-a)', isDiphthong: false, explanation: 'Dos vocales abiertas (e, a) forman hiato: te-a-tro.' },
  { word: 'Ciudad (iu)', isDiphthong: true, explanation: 'Dos vocales cerradas distintas (i, u) forman diptongo: ciu-dad.' },
];
