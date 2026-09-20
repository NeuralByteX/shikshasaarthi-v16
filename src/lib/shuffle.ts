import { DiagnosticQuestion } from '../types';

/** Fisher-Yates shuffle — returns a new array, never mutates the input. */
export function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Shuffles a single question's options and remaps correctIndex so it still
 * points at the right answer after reordering.
 */
function shuffleQuestionOptions(question: DiagnosticQuestion): DiagnosticQuestion {
  const indices = question.options.map((_, idx) => idx);
  const shuffledIndices = shuffleArray(indices);
  const newOptions = shuffledIndices.map((origIdx) => question.options[origIdx]);
  const newCorrectIndex = shuffledIndices.indexOf(question.correctIndex);
  return { ...question, options: newOptions, correctIndex: newCorrectIndex };
}

/**
 * Returns a fresh, independently-randomized copy of the diagnostic question
 * bank: question order shuffled, AND each question's option order shuffled.
 * Call this once per diagnostic session (e.g. inside useState(() => ...))
 * so two students — even sitting side by side — see different question
 * order and different option order for the same underlying item.
 */
export function getShuffledDiagnostic(questions: DiagnosticQuestion[]): DiagnosticQuestion[] {
  return shuffleArray(questions).map(shuffleQuestionOptions);
}

/**
 * Generic version for any question shape that has `options` + `correctIndex`
 * (used by remedial practice so the right answer isn't always option 1).
 */
export function shuffleOptionsOf<T extends { options: string[]; correctIndex: number }>(question: T): T {
  const shuffledIndices = shuffleArray(question.options.map((_, idx) => idx));
  return {
    ...question,
    options: shuffledIndices.map((origIdx) => question.options[origIdx]),
    correctIndex: shuffledIndices.indexOf(question.correctIndex),
  };
}
