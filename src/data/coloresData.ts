import { ColorItem } from '../types';

export const COLORES_DATA: ColorItem[] = [
  { name: 'Rojo', hex: '#EF4444', textColor: '#FFFFFF', category: 'primario', description: 'Color primario cálido que evoca energía, pasión y dinamismo.' },
  { name: 'Azul', hex: '#3B82F6', textColor: '#FFFFFF', category: 'primario', description: 'Color primario frío asociado a la serenidad, el cielo y el mar.' },
  { name: 'Amarillo', hex: '#EAB308', textColor: '#1E293B', category: 'primario', description: 'Color primario luminoso que representa el sol, la alegría y la creatividad.' },
  { name: 'Verde', hex: '#22C55E', textColor: '#FFFFFF', category: 'secundario', description: 'Color secundario (azul + amarillo) símbolo de naturaleza, esperanza y frescura.' },
  { name: 'Naranja', hex: '#F97316', textColor: '#FFFFFF', category: 'secundario', description: 'Color secundario cálido (rojo + amarillo) que transmite vitalidad y entusiasmo.' },
  { name: 'Morado', hex: '#9333EA', textColor: '#FFFFFF', category: 'secundario', description: 'Color secundario profundo (rojo + azul) asociado al misterio y la sabiduría.' },
  { name: 'Rosa', hex: '#EC4899', textColor: '#FFFFFF', category: 'otro', description: 'Mezcla de rojo con blanco, evoca afecto, delicadeza y creatividad.' },
  { name: 'Negro', hex: '#0F172A', textColor: '#FFFFFF', category: 'neutro', description: 'Ausencia o absorción de luz visible en síntesis sustractiva, representa elegancia.' },
  { name: 'Blanco', hex: '#F8FAFC', textColor: '#0F172A', category: 'neutro', description: 'Suma de todos los colores del espectro luminoso, evoca claridad y pureza.' },
  { name: 'Gris', hex: '#64748B', textColor: '#FFFFFF', category: 'neutro', description: 'Tono neutral intermedio entre blanco y negro que aporta equilibrio.' },
  { name: 'Marrón', hex: '#78350F', textColor: '#FFFFFF', category: 'otro', description: 'Tono terroso cálido (rojo + amarillo + pizca de azul/negro), evoca solidez y naturaleza.' },
  { name: 'Celeste', hex: '#38BDF8', textColor: '#0F172A', category: 'otro', description: 'Azul claro suave obtenido al aclarar el azul con blanco, similar al cielo diurno.' },
];

export interface ColorMix {
  color1: string;
  color2: string;
  result: string;
  resultHex: string;
  explanation: string;
}

export const COLOR_MIXTURES: ColorMix[] = [
  { color1: 'Rojo', color2: 'Amarillo', result: 'Naranja', resultHex: '#F97316', explanation: 'Al mezclar dos colores primarios cálidos (rojo y amarillo) se crea el color naranja.' },
  { color1: 'Azul', color2: 'Amarillo', result: 'Verde', resultHex: '#22C55E', explanation: 'La combinación del azul con el amarillo produce el color secundario verde.' },
  { color1: 'Rojo', color2: 'Azul', result: 'Morado', resultHex: '#9333EA', explanation: 'La mezcla de rojo y azul origina el color secundario morado o violeta.' },
  { color1: 'Rojo', color2: 'Blanco', result: 'Rosa', resultHex: '#EC4899', explanation: 'Aclarar el pigmento rojo con blanco genera tonalidades de rosa.' },
  { color1: 'Negro', color2: 'Blanco', result: 'Gris', resultHex: '#64748B', explanation: 'La combinación de blanco y negro genera una escala de tonos grises neutros.' },
  { color1: 'Azul', color2: 'Blanco', result: 'Celeste', resultHex: '#38BDF8', explanation: 'Al atenuar el azul profundo con pigmento blanco se obtiene el celeste cielo.' },
];
