import { UserProgress } from '../types';
import { BADGES } from '../data/medallasData';

const STORAGE_KEY = 'mi_espacio_estudio_progress_v1';

const defaultProgress: UserProgress = {
  points: 0,
  exercisesCompleted: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  stars: 0,
  level: 1,
  unlockedBadges: [],
  moduleVisits: {},
  dailyStreak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    const parsed = JSON.parse(raw);
    return {
      ...defaultProgress,
      ...parsed,
      moduleVisits: parsed.moduleVisits || {},
      unlockedBadges: parsed.unlockedBadges || [],
    };
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage might be full or disabled
  }
}

export function resetProgress(): UserProgress {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
  return defaultProgress;
}

export function calculateLevel(points: number): { level: number; title: string; nextLevelPoints: number; progressPercent: number } {
  const levels = [
    { level: 1, title: 'Iniciante Curioso', min: 0, max: 50 },
    { level: 2, title: 'Aprendiz Entusiasta', min: 50, max: 150 },
    { level: 3, title: 'Explorador Ágil', min: 150, max: 300 },
    { level: 4, title: 'Estudiante Avanzado', min: 300, max: 500 },
    { level: 5, title: 'Mente Brillante', min: 500, max: 800 },
    { level: 6, title: 'Maestro del Saber', min: 800, max: 1200 },
    { level: 7, title: 'Erudito Legendario', min: 1200, max: 2000 },
  ];

  for (let i = 0; i < levels.length; i++) {
    const lvl = levels[i];
    if (points < lvl.max || i === levels.length - 1) {
      const span = lvl.max - lvl.min;
      const currentInLvl = Math.max(0, points - lvl.min);
      const progressPercent = Math.min(100, Math.round((currentInLvl / span) * 100));
      return {
        level: lvl.level,
        title: lvl.title,
        nextLevelPoints: lvl.max,
        progressPercent,
      };
    }
  }

  return {
    level: 7,
    title: 'Erudito Legendario',
    nextLevelPoints: 2000,
    progressPercent: 100,
  };
}

export function recordExercise(
  current: UserProgress,
  isCorrect: boolean,
  moduleId?: string,
  extraPoints = 0
): { updated: UserProgress; newlyUnlocked: string[] } {
  const pointsDelta = isCorrect ? 10 + extraPoints : 0;
  const newPoints = current.points + pointsDelta;
  const newCompleted = current.exercisesCompleted + 1;
  const newCorrect = current.correctAnswers + (isCorrect ? 1 : 0);
  const newIncorrect = current.incorrectAnswers + (isCorrect ? 0 : 1);
  const newStars = current.stars + (isCorrect ? 1 : 0);

  const moduleVisits = { ...current.moduleVisits };
  if (moduleId) {
    moduleVisits[moduleId] = (moduleVisits[moduleId] || 0) + 1;
  }

  const { level: newLevel } = calculateLevel(newPoints);

  // Check badges to unlock
  const newlyUnlocked: string[] = [];
  const currentBadges = new Set(current.unlockedBadges);

  const checkAndUnlock = (badgeId: string, condition: boolean) => {
    if (condition && !currentBadges.has(badgeId)) {
      currentBadges.add(badgeId);
      newlyUnlocked.push(badgeId);
    }
  };

  checkAndUnlock('first_step', newCompleted >= 1);
  checkAndUnlock('century_points', newPoints >= 250);
  checkAndUnlock('grand_scholar', newPoints >= 500);
  checkAndUnlock('abc_master', (moduleVisits['abc'] || 0) + (moduleVisits['vocales'] || 0) >= 10);
  checkAndUnlock(
    'speed_math',
    (moduleVisits['suma'] || 0) + (moduleVisits['resta'] || 0) + (moduleVisits['multiplicacion'] || 0) >= 15
  );
  checkAndUnlock('memory_ace', (moduleVisits['logica'] || 0) + (moduleVisits['retos'] || 0) >= 3);
  checkAndUnlock('word_seeker', (moduleVisits['sopa'] || 0) >= 1);
  checkAndUnlock('color_expert', (moduleVisits['colores'] || 0) >= 8);
  checkAndUnlock('geometry_wiz', (moduleVisits['geometria'] || 0) >= 6);
  checkAndUnlock('quiz_champion', (moduleVisits['quiz'] || 0) >= 15);
  checkAndUnlock('challenger', (moduleVisits['retos'] || 0) >= 5);

  const updated: UserProgress = {
    ...current,
    points: newPoints,
    exercisesCompleted: newCompleted,
    correctAnswers: newCorrect,
    incorrectAnswers: newIncorrect,
    stars: newStars,
    level: newLevel,
    unlockedBadges: Array.from(currentBadges),
    moduleVisits,
  };

  saveProgress(updated);
  return { updated, newlyUnlocked };
}

export const getUserStats = loadProgress;
export const resetAllData = resetProgress;

export function addPointsAndExercise(
  isCorrect: boolean,
  extraPoints = 10,
  moduleId?: string
): UserProgress {
  const current = loadProgress();
  return recordExercise(current, isCorrect, moduleId, extraPoints).updated;
}

