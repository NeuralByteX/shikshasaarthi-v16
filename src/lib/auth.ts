import { supabase } from './supabase';
import { StudentProfile, TeacherProfile } from '../types';

function requireSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.'
    );
  }
  return supabase;
}

function levelFromXp(xp: number) {
  return Math.floor(xp / 100) + 1;
}

/** Returns the student with XP / level / next-level target recomputed consistently. */
export function withXp(student: StudentProfile, xp: number): StudentProfile {
  // The offline demo profile has hand-set level/target values; real profiles
  // derive both from XP (100 XP per level).
  if (student.id === 'offline-demo-student') {
    const levelUp = xp >= student.targetXp;
    return {
      ...student,
      currentXp: xp,
      level: levelUp ? student.level + 1 : student.level,
      targetXp: levelUp ? student.targetXp + 100 : student.targetXp,
    };
  }
  const level = levelFromXp(xp);
  return { ...student, currentXp: xp, level, targetXp: level * 100 };
}

/** Maps a raw `students` row (snake_case, from Supabase) to the app's StudentProfile shape. */
export function mapStudentRow(row: any): StudentProfile {
  const level = levelFromXp(row.xp ?? 0);
  return {
    id: row.id,
    name: row.name,
    nameHi: row.name,
    rollNo: row.roll_no ?? '—',
    className: row.class_name ?? '',
    samagraId: row.samagra_id,
    udiseCode: row.udise_code ?? '',
    schoolName: row.school_name ?? '',
    schoolZone: row.school_name ?? '',
    avatarUrl: '',
    teacherId: row.teacher_id ?? undefined,
    teacherName: row.teacher_name ?? undefined,
    classCode: row.class_code ?? undefined,
    level,
    currentXp: row.xp ?? 0,
    targetXp: level * 100,
    streakDays: row.streak_days ?? 0,
  };
}

export function mapTeacherRow(row: any): TeacherProfile {
  return {
    id: row.id,
    name: row.name,
    employeeId: row.employee_id,
    schoolName: row.school_name ?? '',
    udiseCode: row.udise_code ?? '',
  };
}

export type StudentSignUpInput = {
  name: string;
  samagraId: string;
  rollNo: string;
  schoolName: string;
  udiseCode: string;
  avatarColor: string;
  pin: string;
  preferredLanguage: string;
  classCode: string;
};

/**
 * Student authentication intentionally does NOT ask a child for an email.
 * Supabase Auth still requires an email-shaped identity internally, so the
 * Edge Function creates a non-mail internal alias from the student's Samagra
 * ID and immediately confirms it. The alias is never shown to the student
 * and no email is sent. The real identity remains the Supabase Auth UUID.
 */
export async function signUpStudent(input: StudentSignUpInput): Promise<StudentProfile> {
  const client = requireSupabase();
  const samagraId = input.samagraId.trim();
  if (!samagraId) throw new Error('Samagra ID is required.');

  const { data, error } = await client.functions.invoke('student-auth', {
    body: { action: 'signup', samagraId, pin: input.pin, classCode: input.classCode, profile: {
      name: input.name,
      rollNo: input.rollNo,
      schoolName: input.schoolName,
      udiseCode: input.udiseCode,
      avatarColor: input.avatarColor,
      preferredLanguage: input.preferredLanguage,
    } },
  });
  if (error) throw error;
  if (!data?.session) throw new Error(data?.error ?? 'Student account could not be created.');

  const { error: sessionError } = await client.auth.setSession(data.session);
  if (sessionError) throw sessionError;

  const { data: row, error: profileError } = await client
    .from('students').select('*').eq('id', data.userId).single();
  if (profileError) throw profileError;
  return mapStudentRow(row);
}

export async function signInStudent(samagraId: string, pin: string): Promise<StudentProfile> {
  const client = requireSupabase();
  const { data, error } = await client.functions.invoke('student-auth', {
    body: { action: 'login', samagraId: samagraId.trim(), pin },
  });
  if (error) throw error;
  if (!data?.session) throw new Error(data?.error ?? 'Invalid Student ID or PIN.');

  const { error: sessionError } = await client.auth.setSession(data.session);
  if (sessionError) throw sessionError;

  const userId = data.userId;
  if (!userId) throw new Error('Login succeeded but no user id was returned.');
  const { data: row, error: profileError } = await client
    .from('students').select('*').eq('id', userId).single();
  if (profileError) throw profileError;
  return mapStudentRow(row);
}

export type TeacherSignUpInput = {
  name: string;
  employeeId: string;
  email: string;
  schoolName: string;
  udiseCode: string;
  pin: string;
};

export async function signUpTeacher(input: TeacherSignUpInput): Promise<TeacherProfile> {
  const client = requireSupabase();
  const email = input.email.trim().toLowerCase();

  const { data: authData, error: authError } = await client.auth.signUp({
    email,
    password: input.pin,
  });
  if (authError) throw authError;
  const userId = authData.user?.id;
  if (!userId) throw new Error('Sign up succeeded but no user id was returned.');
  if (!authData.session) {
    throw new Error('Account created, but email confirmation is enabled. Disable email confirmation in Supabase Auth for this PIN-based school demo, or verify the email before logging in.');
  }

  const { data: row, error: profileError } = await client
    .from('teachers')
    .insert({
      id: userId,
      name: input.name,
      employee_id: input.employeeId,
      school_name: input.schoolName,
      udise_code: input.udiseCode,
    })
    .select()
    .single();
  if (profileError) throw profileError;

  return mapTeacherRow(row);
}

export async function signInTeacher(email: string, pin: string): Promise<TeacherProfile> {
  const client = requireSupabase();
  const normalizedEmail = email.trim().toLowerCase();

  const { data: authData, error: authError } = await client.auth.signInWithPassword({
    email: normalizedEmail,
    password: pin,
  });
  if (authError) throw authError;
  const userId = authData.user?.id;
  if (!userId) throw new Error('Login succeeded but no user id was returned.');

  const { data: row, error: profileError } = await client
    .from('teachers')
    .select('*')
    .eq('id', userId)
    .single();
  if (profileError) throw profileError;

  return mapTeacherRow(row);
}

export async function signOutUser(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

/**
 * Checks for an already-signed-in Supabase session (persisted in the
 * browser by supabase-js) and, if found, loads the matching profile so a
 * page refresh doesn't force the person to log in again.
 */
export async function getActiveSessionProfile(): Promise<
  | { role: 'student'; profile: StudentProfile }
  | { role: 'teacher'; profile: TeacherProfile }
  | null
> {
  if (!supabase) return null;

  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) return null;

  const { data: studentRow } = await supabase.from('students').select('*').eq('id', userId).maybeSingle();
  if (studentRow) return { role: 'student', profile: mapStudentRow(studentRow) };

  const { data: teacherRow } = await supabase.from('teachers').select('*').eq('id', userId).maybeSingle();
  if (teacherRow) return { role: 'teacher', profile: mapTeacherRow(teacherRow) };

  return null;
}
