/**
 * Web Audio API Sound Synthesizer
 * 100% offline, zero external audio assets, works seamlessly in browser & Android WebView.
 */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

// Initialize sound preference from localStorage
try {
  const saved = localStorage.getItem('mee_sound_enabled');
  if (saved !== null) {
    soundEnabled = saved === 'true';
  }
} catch {
  soundEnabled = true;
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function toggleSound(): boolean {
  soundEnabled = !soundEnabled;
  try {
    localStorage.setItem('mee_sound_enabled', String(soundEnabled));
  } catch {
    // Ignore storage errors
  }
  if (!soundEnabled) {
    stopSpeech();
  } else {
    playClick();
  }
  return soundEnabled;
}

/* =========================================================================
 * Text-to-Speech (TTS) Engine via Web Speech API (SpeechSynthesis)
 * ========================================================================= */

let selectedVoice: SpeechSynthesisVoice | null = null;
let englishVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

function loadVoices(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return;

  // Prefer es-ES, then any Spanish (es-*), fallback to default
  const esEsVoice = voices.find((v) => v.lang === 'es-ES');
  const esVoice = voices.find((v) => v.lang.startsWith('es'));
  selectedVoice = esEsVoice || esVoice || voices[0] || null;

  // English voice for InglesModule
  englishVoice = voices.find((v) => v.lang === 'en-US' || v.lang === 'en-GB') || voices.find((v) => v.lang.startsWith('en')) || null;

  voicesLoaded = true;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      loadVoices();
    };
  }
}

/**
 * Cancels any currently playing speech.
 */
export function stopSpeech(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // Ignore
  }
}

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
  onEnd?: () => void;
}

/**
 * Pronounces a given text in Spanish (or specified lang) using the Web Speech API.
 * Adheres strictly to the global mute toggle.
 */
export function speak(text: string, options?: SpeakOptions): void {
  if (!soundEnabled || !text) return;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    // Cancel prior utterance to prevent audio overlap
    window.speechSynthesis.cancel();

    if (!voicesLoaded) {
      loadVoices();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang = options?.lang ?? 'es-ES';
    utterance.lang = targetLang;
    utterance.rate = options?.rate ?? 0.88;
    utterance.pitch = options?.pitch ?? 1.0;
    utterance.volume = options?.volume ?? 1.0;

    if (targetLang.startsWith('en') && englishVoice) {
      utterance.voice = englishVoice;
    } else if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    if (options?.onEnd) {
      utterance.onend = options.onEnd;
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    // Speech synthesis may fail gracefully in unsupported environments
  }
}

/**
 * Spoken feedback helpers
 */
export function speakCorrect(extraMessage?: string): void {
  const praises = ['¡Muy bien!', '¡Excelente!'];
  const base = praises[Math.floor(Math.random() * praises.length)];
  if (extraMessage) {
    speak(`${base} ${extraMessage}`);
  } else {
    speak(base);
  }
}

export function speakIncorrect(customMessage?: string): void {
  speak(customMessage || 'Inténtalo de nuevo.');
}


export function playClick(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch {
    // Audio context may fail if blocked
  }
}

export function playCorrect(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Upward cheerful chime (E5 -> A5)
    [
      { freq: 659.25, time: 0 },
      { freq: 880.00, time: 0.1 }
    ].forEach(({ freq, time }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + time);

      gain.gain.setValueAtTime(0.15, now + time);
      gain.gain.exponentialRampToValueAtTime(0.001, now + time + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + 0.25);
    });
  } catch {
    // Ignore
  }
}

export function playIncorrect(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.2);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  } catch {
    // Ignore
  }
}

export function playCardFlip(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch {
    // Ignore
  }
}

export const playFlip = playCardFlip;
export const playSuccess = playVictory;

export function playVictory(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Victory fanfare notes: C5, E5, G5, C6
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + idx * 0.12;
      const duration = idx === notes.length - 1 ? 0.6 : 0.18;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch {
    // Ignore
  }
}

export function playStar(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.15); // E6

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  } catch {
    // Ignore
  }
}
