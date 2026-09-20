import { supabase } from './supabase';

export type DiagnosticSaveInput = {
  studentId: string;
  score: number;
  totalQuestions: number;
  topicScores: Record<string, number>;
};

export async function saveDiagnosticResult(input: DiagnosticSaveInput) {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.'
    );
  }

  const { data, error } = await supabase
    .from('diagnostic_results')
    .insert({
      student_id: input.studentId,
      score: input.score,
      total_questions: input.totalQuestions,
      topic_scores: input.topicScores,
    })
    .select()
    .single();

  if (error) throw error;

  // Keep topic-level mastery available for the teacher dashboard.
  const rows = Object.entries(input.topicScores).map(([topic, mastery]) => ({
    student_id: input.studentId,
    topic,
    mastery: Math.max(0, Math.min(100, Math.round(mastery))),
    attempts: 1,
    last_score: Math.round(mastery),
    updated_at: new Date().toISOString(),
  }));

  if (rows.length) {
    const { error: progressError } = await supabase
      .from('learning_progress')
      .upsert(rows, { onConflict: 'student_id,topic' });

    if (progressError) throw progressError;
  }

  return data;
}

export async function getStudentDiagnosticResults(studentId: string) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('diagnostic_results')
    .select('*')
    .eq('student_id', studentId)
    .order('completed_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getStudentProgress(studentId: string) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('learning_progress')
    .select('*')
    .eq('student_id', studentId)
    .order('topic');

  if (error) throw error;
  return data ?? [];
}

export async function getTeacherStudentOverview() {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('learning_progress')
    .select('student_id, topic, mastery, attempts, last_score, updated_at')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export interface LatestPractice {
  topic: string;
  score: number;
  totalQuestions: number;
  percent: number;
  completedAt: string;
  /** Diagnostic % for the same topic taken BEFORE this practice, if any. */
  beforePercent: number | null;
}

export interface ClassRosterEntry {
  studentId: string;
  name: string;
  rollNo: string | null;
  latestScorePercent: number | null;
  latestCompletedAt: string | null;
  weakestTopic: string | null;
  /** Current mastery (0-100) of weakestTopic — reflects remedial practice. */
  weakestMastery: number | null;
  latestPractice: LatestPractice | null;
  practiceAttempts: number;
  /** True while the teacher's most recent task for this student is still pending. */
  hasPendingTask: boolean;
}

/**
 * Real class roster: every student row for a class, joined (client-side)
 * with each student's most recent diagnostic result — no hardcoded names,
 * no fake "32 students" count. An empty class returns an empty array.
 */
export interface TeacherClass {
  id: string;
  className: string;
  section: string;
  classCode: string;
  createdAt: string;
}

export async function getTeacherClasses(teacherId: string): Promise<TeacherClass[]> {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase
    .from('teacher_classes')
    .select('id, class_name, section, class_code, created_at')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    className: r.class_name,
    section: r.section,
    classCode: r.class_code,
    createdAt: r.created_at,
  }));
}

export async function createTeacherClass(teacherId: string, className: string, section: string): Promise<TeacherClass> {
  if (!supabase) throw new Error('Supabase is not configured.');
  const code = `SHK-${className.replace(/[^0-9A-Za-z]/g, '').toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const { data, error } = await supabase
    .from('teacher_classes')
    .insert({ teacher_id: teacherId, class_name: className, section, class_code: code })
    .select('id, class_name, section, class_code, created_at')
    .single();
  if (error) throw error;
  return { id: data.id, className: data.class_name, section: data.section, classCode: data.class_code, createdAt: data.created_at };
}

export async function getClassRoster(teacherId: string, classId: string): Promise<ClassRosterEntry[]> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data: enrollments, error: enrollmentError } = await supabase
    .from('teacher_students')
    .select('student_id')
    .eq('teacher_id', teacherId)
    .eq('class_id', classId);
  if (enrollmentError) throw enrollmentError;
  const studentIds = (enrollments ?? []).map((r) => r.student_id);
  if (studentIds.length === 0) return [];

  // Everything the dashboard needs, fetched in parallel so a refresh is one
  // round-trip long, not five.
  const [studentsRes, diagRes, practiceRes, progressRes, tasksRes] = await Promise.all([
    supabase.from('students').select('id, name, roll_no').in('id', studentIds),
    supabase
      .from('diagnostic_results')
      .select('student_id, score, total_questions, topic_scores, completed_at')
      .in('student_id', studentIds)
      .order('completed_at', { ascending: false }),
    supabase
      .from('practice_results')
      .select('student_id, topic, score, total_questions, completed_at')
      .in('student_id', studentIds)
      .order('completed_at', { ascending: false }),
    supabase
      .from('learning_progress')
      .select('student_id, topic, mastery')
      .in('student_id', studentIds),
    supabase
      .from('assigned_tasks')
      .select('student_id, topic, status, created_at')
      .eq('assigned_by', teacherId)
      .in('student_id', studentIds)
      .order('created_at', { ascending: false }),
  ]);
  if (studentsRes.error) throw studentsRes.error;
  if (diagRes.error) throw diagRes.error;
  if (practiceRes.error) throw practiceRes.error;
  if (progressRes.error) throw progressRes.error;
  // assigned_tasks is a nice-to-have on the dashboard; don't fail the roster over it.
  const tasks = tasksRes.error ? [] : tasksRes.data ?? [];

  const latestDiagByStudent = new Map<string, NonNullable<typeof diagRes.data>[number]>();
  (diagRes.data ?? []).forEach((r) => { if (!latestDiagByStudent.has(r.student_id)) latestDiagByStudent.set(r.student_id, r); });

  const latestPracticeByStudent = new Map<string, NonNullable<typeof practiceRes.data>[number]>();
  const practiceCount = new Map<string, number>();
  (practiceRes.data ?? []).forEach((r) => {
    if (!latestPracticeByStudent.has(r.student_id)) latestPracticeByStudent.set(r.student_id, r);
    practiceCount.set(r.student_id, (practiceCount.get(r.student_id) ?? 0) + 1);
  });

  const masteryByStudent = new Map<string, Record<string, number>>();
  (progressRes.data ?? []).forEach((r) => {
    const m = masteryByStudent.get(r.student_id) ?? {};
    m[r.topic] = r.mastery;
    masteryByStudent.set(r.student_id, m);
  });

  const latestTaskByStudent = new Map<string, (typeof tasks)[number]>();
  tasks.forEach((t) => { if (!latestTaskByStudent.has(t.student_id)) latestTaskByStudent.set(t.student_id, t); });

  return (studentsRes.data ?? []).map((s) => {
    const diag = latestDiagByStudent.get(s.id);
    const practice = latestPracticeByStudent.get(s.id);

    let latestScorePercent: number | null = null;
    if (diag) {
      latestScorePercent = diag.total_questions > 0 ? Math.round((diag.score / diag.total_questions) * 100) : 0;
    }

    // Weakest topic comes from live mastery (learning_progress), which is
    // updated by BOTH diagnostics and remedial practice — so once a student
    // clears their weak topic it stops showing up as weak. Falls back to the
    // diagnostic's topic scores if no progress rows exist yet.
    const mastery = masteryByStudent.get(s.id) ?? ((diag?.topic_scores ?? {}) as Record<string, number>);
    const entries = Object.entries(mastery);
    let weakestTopic: string | null = null;
    let weakestMastery: number | null = null;
    if (entries.length > 0) {
      const min = entries.reduce((a, b) => (b[1] < a[1] ? b : a));
      weakestTopic = min[0];
      weakestMastery = min[1];
    }

    let latestPractice: LatestPractice | null = null;
    if (practice) {
      const diagTopicScores = (diag?.topic_scores ?? {}) as Record<string, number>;
      const diagIsBefore = diag && new Date(diag.completed_at).getTime() <= new Date(practice.completed_at).getTime();
      latestPractice = {
        topic: practice.topic,
        score: practice.score,
        totalQuestions: practice.total_questions,
        percent: practice.total_questions > 0 ? Math.round((practice.score / practice.total_questions) * 100) : 0,
        completedAt: practice.completed_at,
        beforePercent: diagIsBefore && diagTopicScores[practice.topic] !== undefined ? diagTopicScores[practice.topic] : null,
      };
    }

    return {
      studentId: s.id,
      name: s.name,
      rollNo: s.roll_no,
      latestScorePercent,
      latestCompletedAt: diag?.completed_at ?? null,
      weakestTopic,
      weakestMastery,
      latestPractice,
      practiceAttempts: practiceCount.get(s.id) ?? 0,
      hasPendingTask: latestTaskByStudent.get(s.id)?.status === 'pending',
    };
  });
}

export interface PracticeSaveInput {
  studentId: string;
  topic: string;
  score: number;
  totalQuestions: number;
  xpEarned: number;
}

/**
 * Persists a finished remedial practice session so the teacher dashboard
 * (and the student's own next login) see it:
 *   1. practice_results  – the attempt itself           (essential: throws on failure)
 *   2. learning_progress – topic mastery + attempt count (best effort)
 *   3. students.xp       – XP earned                     (best effort)
 *   4. assigned_tasks    – mark a pending task done      (best effort)
 * Returns the student's new persisted XP total when it could be updated.
 */
export async function savePracticeResult(input: PracticeSaveInput): Promise<{ newXp: number | null }> {
  if (!supabase) throw new Error('Supabase is not configured.');
  const client = supabase;
  const percent = input.totalQuestions > 0 ? Math.round((input.score / input.totalQuestions) * 100) : 0;
  const nowIso = new Date().toISOString();

  const { error: insertError } = await client.from('practice_results').insert({
    student_id: input.studentId,
    topic: input.topic,
    score: input.score,
    total_questions: input.totalQuestions,
    completed_at: nowIso,
  });
  if (insertError) throw insertError;

  const progressStep = (async () => {
    const { data: existing } = await client
      .from('learning_progress')
      .select('attempts')
      .eq('student_id', input.studentId)
      .eq('topic', input.topic)
      .maybeSingle();
    const { error } = await client.from('learning_progress').upsert(
      {
        student_id: input.studentId,
        topic: input.topic,
        mastery: Math.max(0, Math.min(100, percent)),
        attempts: (existing?.attempts ?? 0) + 1,
        last_score: percent,
        updated_at: nowIso,
      },
      { onConflict: 'student_id,topic' }
    );
    if (error) throw error;
  })();

  const xpStep = (async (): Promise<number> => {
    const { data: row, error: readError } = await client
      .from('students').select('xp').eq('id', input.studentId).single();
    if (readError) throw readError;
    const newXp = (row?.xp ?? 0) + input.xpEarned;
    const { error } = await client.from('students').update({ xp: newXp }).eq('id', input.studentId);
    if (error) throw error;
    return newXp;
  })();

  const taskStep = (async () => {
    const { error } = await client
      .from('assigned_tasks')
      .update({ status: 'completed' })
      .eq('student_id', input.studentId)
      .eq('topic', input.topic)
      .eq('status', 'pending');
    if (error) throw error;
  })();

  const [progressRes, xpRes, taskRes] = await Promise.allSettled([progressStep, xpStep, taskStep]);
  if (progressRes.status === 'rejected') console.warn('learning_progress update failed:', progressRes.reason);
  if (taskRes.status === 'rejected') console.warn('assigned_tasks update failed:', taskRes.reason);
  if (xpRes.status === 'rejected') console.warn('XP update failed:', xpRes.reason);

  return { newXp: xpRes.status === 'fulfilled' ? xpRes.value : null };
}

export async function assignRemedialTask(studentId: string, teacherId: string, topic: string) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('assigned_tasks')
    .insert({ student_id: studentId, assigned_by: teacherId, topic })
    .select()
    .single();

  if (error) throw error;
  return data;
}
