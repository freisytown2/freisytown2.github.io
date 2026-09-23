/**
 * Utilities and Spanish number conversions from 0 to 100
 */

const UNIDADES = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
const DIEZ_A_DIECINUEVE = [
  'diez', 'once', 'doce', 'trece', 'catorce', 'quince',
  'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'
];
const VEINTES = [
  'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro',
  'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'
];
const DECENAS = [
  '', '', '', 'treinta', 'cuarenta', 'cincuenta',
  'sesenta', 'setenta', 'ochenta', 'noventa'
];

export function numberToSpanish(n: number): string {
  if (n < 0 || n > 100) return String(n);
  if (n === 100) return 'cien';
  if (n < 10) return UNIDADES[n];
  if (n < 20) return DIEZ_A_DIECINUEVE[n - 10];
  if (n < 30) return VEINTES[n - 20];

  const decena = Math.floor(n / 10);
  const unidad = n % 10;

  if (unidad === 0) return DECENAS[decena];
  return `${DECENAS[decena]} y ${UNIDADES[unidad]}`;
}

export interface NumberFact {
  n: number;
  word: string;
  isEven: boolean;
  decenas: number;
  unidades: number;
}

export function getNumberFact(n: number): NumberFact {
  return {
    n,
    word: numberToSpanish(n),
    isEven: n % 2 === 0,
    decenas: Math.floor(n / 10),
    unidades: n % 10,
  };
}

export function generateRandomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
