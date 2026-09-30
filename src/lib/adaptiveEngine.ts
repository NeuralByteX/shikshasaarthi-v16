import { DiagnosticAnswerRecord, DiagnosticResultData, PracticeResultData } from '../types';
import { getLocalProgress, upsertLocalProgress } from './offlineDb';

export interface LocalMastery {
  topic: string;
  mastery: number;
  attempts: number;
  status: 'needs-practice' | 'developing' | 'strong';
}

/**
 * Converts a student's answer into evidence of actual understanding.
 *
 * Correct + high confidence is strong evidence. Correct + low confidence is
 * weaker because it may be a lucky guess. An incorrect + high-confidence
 * answer is retained as a small signal because it can indicate a misconception.
 * Very fast answers are down-weighted slightly because they are more likely to
 * be guesses, but speed is never used as a hard pass/fail rule.
 */
export function calculateAnswerEvidence(answer: DiagnosticAnswerRecord): number {
  const confidenceMultiplier = answer.isCorrect
    ? { low: 0.55, medium: 0.8, high: 1 }[answer.confidence]
    : { low: 0, medium: 0.12, high: 0.22 }[answer.confidence];

  const fastGuessPenalty = answer.responseTimeMs < 4000 && answer.confidence === 'low' ? 0.55 :
    answer.responseTimeMs < 2500 ? 0.8 : 1;

  const difficultyBonus = answer.difficulty === 3 ? 1.08 : answer.difficulty === 2 ? 1.02 : 0.95;
  return Math.max(0, Math.min(1, confidenceMultiplier * fastGuessPenalty * difficultyBonus));
}

export function summarizeDiagnosticEvidence(results: DiagnosticAnswerRecord[]) {
  const byTopic = new Map<string, DiagnosticAnswerRecord[]>();
  results.forEach((answer) => {
    const list = byTopic.get(answer.topic) ?? [];
    list.push(answer);
    byTopic.set(answer.topic, list);
  });

  return Array.from(byTopic.entries()).map(([topic, answers]) => {
    const evidence = answers.length
      ? Math.round((answers.reduce((sum, answer) => sum + calculateAnswerEvidence(answer), 0) / answers.length) * 100)
      : 0;
    const confidencePercent = answers.length
      ? Math.round((answers.reduce((sum, answer) => sum + ({ low: 35, medium: 65, high: 95 }[answer.confidence]), 0) / answers.length))
      : 0;
    const likelyGuessCount = answers.filter((answer) => !answer.isCorrect && answer.confidence === 'low' && answer.responseTimeMs < 4000 || answer.isCorrect && answer.confidence === 'low' && answer.responseTimeMs < 2500).length;
    return { topic, evidencePercent: evidence, confidencePercent, likelyGuessCount };
  });
}

export async function updateLocalMastery(
  studentId: string,
  result: DiagnosticResultData,
  answers: DiagnosticAnswerRecord[],
): Promise<LocalMastery[]> {
  const previous = await getLocalProgress(studentId);
  const previousByTopic = new Map(previous.map((p) => [p.topic, p]));
  const evidence = new Map(summarizeDiagnosticEvidence(answers).map((x) => [x.topic, x]));

  for (const topic of result.topicBreakdown) {
    const old = previousByTopic.get(topic.topic);
    const currentEvidence = evidence.get(topic.topic)?.evidencePercent ?? topic.evidencePercent ?? topic.percent;
    const mastery = Math.round(old ? old.mastery * 0.35 + currentEvidence * 0.65 : currentEvidence);
    await upsertLocalProgress({
      studentId,
      topic: topic.topic,
      mastery,
      attempts: (old?.attempts ?? 0) + 1,
      lastScore: currentEvidence,
      updatedAt: new Date().toISOString(),
    });
  }

  return getLocalMastery(studentId);
}

export async function updateLocalPracticeMastery(
  studentId: string,
  result: PracticeResultData,
): Promise<LocalMastery[]> {
  const previous = await getLocalProgress(studentId);
  const old = previous.find((p) => p.topic === result.topic);
  const mastery = Math.round(old ? old.mastery * 0.35 + result.scorePercent * 0.65 : result.scorePercent);
  await upsertLocalProgress({
    studentId,
    topic: result.topic,
    mastery,
    attempts: (old?.attempts ?? 0) + 1,
    lastScore: result.scorePercent,
    updatedAt: new Date().toISOString(),
  });
  return getLocalMastery(studentId);
}

export async function getLocalMastery(studentId: string): Promise<LocalMastery[]> {
  const progress = await getLocalProgress(studentId);
  return progress
    .map((p) => ({
      topic: p.topic,
      mastery: p.mastery,
      attempts: p.attempts,
      status: p.mastery < 60 ? 'needs-practice' : p.mastery < 80 ? 'developing' : 'strong',
    }))
    .sort((a, b) => a.mastery - b.mastery);
}

export function getRecommendedDifficulty(mastery: number): 'foundation' | 'practice' | 'challenge' {
  if (mastery < 60) return 'foundation';
  if (mastery < 80) return 'practice';
  return 'challenge';
}
