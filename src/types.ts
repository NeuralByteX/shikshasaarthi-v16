export type ViewMode =
  | 'role-select'
  | 'kiosk-login'
  | 'student-signup'
  | 'teacher-login'
  | 'teacher-signup'
  | 'student-home'
  | 'diagnostic-flow'
  | 'diagnostic-result'
  | 'practice-flow'
  | 'updated-home'
  | 'teacher-portal'
  | 'quiz-duel'
  | 'print-fallback'
  | 'saarthi-buddy'
  | 'kiosk-radar'
  | 'real-world';

export type DeviceMode = 'mobile' | 'laptop';

export interface StudentProfile {
  id: string;
  name: string;
  nameHi: string;
  rollNo: string;
  className: string;
  samagraId: string;
  udiseCode: string;
  schoolName: string;
  teacherId?: string;
  teacherName?: string;
  classCode?: string;
  schoolZone: string;
  avatarUrl: string;
  level: number;
  currentXp: number;
  targetXp: number;
  streakDays: number;
}

export interface TeacherProfile {
  id: string;
  name: string;
  employeeId: string;
  schoolName: string;
  udiseCode: string;
}

export interface DiagnosticQuestion {
  id: number;
  topic: string;
  topicHi: string;
  badge: string;
  question: string;
  questionHi: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  explanationHi: string;
}

/** One resolved answer from a completed diagnostic session, after shuffling. */
export interface DiagnosticAnswerRecord {
  questionId: number;
  topic: string;
  topicHi: string;
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
  explanation: string;
  explanationHi: string;
}

/** Per-topic rollup used to render the result screen and to save to Supabase. */
export interface TopicBreakdownEntry {
  topic: string;
  topicHi: string;
  correct: number;
  total: number;
  percent: number;
}

/** Fully computed diagnostic outcome — the single source of truth for both
 *  the result screen UI and the Supabase save, so they can never disagree. */
export interface DiagnosticResultData {
  score: number;
  totalQuestions: number;
  scorePercent: number;
  topicBreakdown: TopicBreakdownEntry[];
  weakestTopic: TopicBreakdownEntry | null;
  strongestTopic: TopicBreakdownEntry | null;
  sampleMistake: DiagnosticAnswerRecord | null;
}

export interface PracticeQuestion {
  step: number;
  topic: string;
  title: string;
  titleHi: string;
  question: string;
  questionHi: string;
  options: string[];
  correctIndex: number;
  hint: string;
  hintHi: string;
}

/** One answered question from a remedial practice session. */
export interface PracticeAnswerRecord {
  step: number;
  topic: string;
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
}

/** Real, computed outcome of a remedial practice session — feeds the
 *  post-practice screen AND the Supabase save so they can never disagree. */
export interface PracticeResultData {
  topic: string;
  topicHi: string;
  score: number;
  totalQuestions: number;
  scorePercent: number;
  xpEarned: number;
  /** Diagnostic % for this topic from the same session (or null if unknown). */
  previousPercent: number | null;
  completedAt: string;
}

export type PracticeSaveState = 'idle' | 'saving' | 'saved' | 'failed' | 'local-only';

export interface RealWorldExample {
  id: string;
  topic: string;
  topicHi: string;
  category: string;
  categoryHi: string;
  icon: string;
  title: string;
  titleHi: string;
  scenario: string;
  scenarioHi: string;
  howItWorks: string;
  howItWorksHi: string;
  example: string;
  exampleHi: string;
  xp: number;
  videoId?: string;
}

export interface PracticalVideo {
  id: string;
  topic: string;
  topicHi: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  durationLabel: string;
  sizeLabel: string;
  videoUrl: string;
  thumbIcon: string;
  thumbColor: string;
}

export type UserRole = 'student' | 'teacher';

export interface PeerUser {
  id: string;
  name: string;
  className: string;
  status: string;
  statusHi: string;
  score: number;
  avatarUrl: string;
  accuracy: string;
}
