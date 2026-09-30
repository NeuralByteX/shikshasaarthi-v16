import { diagnosticQuestionsData, practiceQuestionsData } from '../data';
import { DiagnosticQuestion, PracticeQuestion } from '../types';
import { getQuestions, putQuestions } from './offlineDb';

const DIAGNOSTIC_PREFIX = 'diagnostic:';
const PRACTICE_PREFIX = 'practice:';

function inferDifficulty(badge: string): 1 | 2 | 3 {
  const normalized = badge.toLowerCase();
  if (normalized.includes('challenge') || normalized.includes('multi-step') || normalized.includes('reverse percentage') || normalized.includes('area & reasoning')) return 3;
  if (normalized.includes('reasoning') || normalized.includes('problem solving') || normalized.includes('comparison') || normalized.includes('application') || normalized.includes('real-world') || normalized.includes('scaling')) return 2;
  return 1;
}

function normalizeDiagnosticQuestion(q: DiagnosticQuestion): DiagnosticQuestion {
  return { ...q, difficulty: q.difficulty ?? inferDifficulty(q.badge) };
}

/**
 * Seeds the local question bank once. The bundled data is the bootstrap/fallback
 * source; assessments read from IndexedDB after seeding.
 */
export async function ensureOfflineQuestionBank(): Promise<void> {
  const existing = await getQuestions<DiagnosticQuestion | PracticeQuestion & { _kind?: string }>();
  const hasDiagnostic = existing.some((q) => typeof q.id === 'number');
  // Always normalize the bundled diagnostic bank so upgrades also repair older
  // IndexedDB records that were seeded before difficulty metadata existed.
  await putQuestions(diagnosticQuestionsData.map(normalizeDiagnosticQuestion));

  const refreshed = await getQuestions<PracticeQuestion & { _kind?: string }>();
  const hasPractice = refreshed.some((q) => typeof q.id !== 'number' && 'step' in q);
  if (!hasPractice) {
    await putQuestions(practiceQuestionsData.map((q) => ({ ...q, id: `${PRACTICE_PREFIX}${q.step}` })));
  }
}

export async function getOfflineDiagnosticQuestions(): Promise<DiagnosticQuestion[]> {
  await ensureOfflineQuestionBank();
  const questions = await getQuestions<DiagnosticQuestion>();
  const diagnostic = questions.filter((q) => typeof q.id === 'number');
  return diagnostic.length ? diagnostic.map(normalizeDiagnosticQuestion) : diagnosticQuestionsData.map(normalizeDiagnosticQuestion);
}

export async function getOfflinePracticeQuestions(): Promise<PracticeQuestion[]> {
  await ensureOfflineQuestionBank();
  const questions = await getQuestions<PracticeQuestion & { id: string }>();
  const practice = questions.filter((q) => typeof q.id === 'string' && q.id.startsWith(PRACTICE_PREFIX));
  return practice.length ? practice : practiceQuestionsData;
}
