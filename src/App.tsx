/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  ViewMode,
  DeviceMode,
  StudentProfile,
  TeacherProfile,
  UserRole,
  DiagnosticAnswerRecord,
  DiagnosticResultData,
  TopicBreakdownEntry,
  PracticeAnswerRecord,
  PracticeResultData,
  PracticeSaveState,
} from './types';
import { mockStudentProfile, diagnosticQuestionsData } from './data';
import { isSupabaseConfigured } from './lib/config';
import { saveDiagnosticResult, savePracticeResult, PracticeSaveInput } from './lib/learningData';
import { getOfflineSyncState, queueDiagnosticForSync, queuePracticeForSync, syncPendingEvents } from './lib/offlineSync';
import { cacheStudentProfile, clearCachedStudentProfile, getCachedStudentProfile } from './lib/offlineDb';
import {
  signInStudent,
  signUpStudent,
  signInTeacher,
  signUpTeacher,
  signOutUser,
  getActiveSessionProfile,
  withXp,
  StudentSignUpInput,
  TeacherSignUpInput,
} from './lib/auth';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SmoothLoader } from './components/SmoothLoader';

// Screens
import { RoleSelectScreen } from './components/screens/RoleSelectScreen';
import { KioskLoginScreen } from './components/screens/KioskLoginScreen';
import { StudentSignupScreen } from './components/screens/StudentSignupScreen';
import { TeacherLoginScreen } from './components/screens/TeacherLoginScreen';
import { TeacherSignupScreen } from './components/screens/TeacherSignupScreen';
import { StudentHomeScreen } from './components/screens/StudentHomeScreen';
import { DiagnosticScreen } from './components/screens/DiagnosticScreen';
import { DiagnosticResultScreen } from './components/screens/DiagnosticResultScreen';
import { PracticeScreen } from './components/screens/PracticeScreen';
import { UpdatedHomeScreen } from './components/screens/UpdatedHomeScreen';
import { TeacherPortalScreen } from './components/screens/TeacherPortalScreen';
import { QuizDuelScreen } from './components/screens/QuizDuelScreen';
import { PrintFallbackScreen } from './components/screens/PrintFallbackScreen';
import { SaarthiBuddyScreen } from './components/screens/SaarthiBuddyScreen';
import { KioskRadarScreen } from './components/screens/KioskRadarScreen';
import { RealWorldScreen } from './components/screens/RealWorldScreen';

const isOfflineMode = !isSupabaseConfigured();

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('role-select');
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('mobile');
  const [isHindi, setIsHindi] = useState<boolean>(false);

  // Real accounts: null until an actual login/signup succeeds. Nothing here
  // is a shared mock profile once Supabase is configured — each person who
  // logs in sees their own row.
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);

  const [teacherLoginReturnView, setTeacherLoginReturnView] = useState<ViewMode>('role-select');
  const [lastDiagnosticResult, setLastDiagnosticResult] = useState<DiagnosticResultData | null>(null);
  const [lastPracticeResult, setLastPracticeResult] = useState<PracticeResultData | null>(null);
  const [practiceSaveState, setPracticeSaveState] = useState<PracticeSaveState>('idle');
  const [pendingPracticeSave, setPendingPracticeSave] = useState<PracticeSaveInput | null>(null);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator === 'undefined' ? true : navigator.onLine);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [restoringSession, setRestoringSession] = useState<boolean>(isSupabaseConfigured());

  // Smooth loader state
  const [loaderOpen, setLoaderOpen] = useState<boolean>(false);
  const [loaderTitle, setLoaderTitle] = useState<string>('');
  const [loaderSubtitle, setLoaderSubtitle] = useState<string>('');

  // On load, if Supabase is configured and the browser already has a signed-in
  // session (supabase-js persists this), restore it instead of forcing a
  // fresh login every time the page refreshes.
  useEffect(() => {
    let active = true;

    const refreshOfflineState = async () => {
      try {
        const state = await getOfflineSyncState();
        if (!active) return;
        setPendingSyncCount(state.pendingCount);
        setLastSyncAt(state.lastSyncAt);
      } catch (err) {
        console.warn('Offline storage unavailable:', err);
      }
    };

    const handleOnline = async () => {
      setIsOnline(true);
      try {
        await syncPendingEvents();
      } catch (err) {
        console.warn('Automatic offline sync failed:', err);
      }
      await refreshOfflineState();
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    if (navigator.onLine) {
      syncPendingEvents().catch((err) => console.warn('Initial offline sync failed:', err));
    }
    refreshOfflineState();

    return () => {
      active = false;
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let active = true;
    getActiveSessionProfile()
      .then(async (result) => {
        if (!active) return;
        if (result?.role === 'student') {
          setStudent(result.profile);
          setUserRole('student');
          setCurrentView('student-home');
          await cacheStudentProfile(result.profile);
          return;
        }
        if (result?.role === 'teacher') {
          setTeacher(result.profile);
          setUserRole('teacher');
          setCurrentView('teacher-portal');
          return;
        }

        // If the network is unavailable, restore the last authenticated
        // student's cached profile so the learning experience can continue.
        if (!navigator.onLine) {
          const cachedStudent = await getCachedStudentProfile<StudentProfile>();
          if (cachedStudent) {
            setStudent(cachedStudent);
            setUserRole('student');
            setCurrentView('student-home');
          }
        }
      })
      .catch(async (err) => {
        console.warn('Session restore failed:', err);
        if (!active || navigator.onLine) return;
        try {
          const cachedStudent = await getCachedStudentProfile<StudentProfile>();
          if (cachedStudent) {
            setStudent(cachedStudent);
            setUserRole('student');
            setCurrentView('student-home');
          }
        } catch (cacheErr) {
          console.warn('Cached offline profile restore failed:', cacheErr);
        }
      })
      .finally(() => {
        if (active) setRestoringSession(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const triggerLoaderTransition = (
    nextView: ViewMode,
    title: string,
    subtitle: string,
    delayMs: number = 450
  ) => {
    setLoaderTitle(title);
    setLoaderSubtitle(subtitle);
    setLoaderOpen(true);
    setTimeout(() => {
      setCurrentView(nextView);
      setLoaderOpen(false);
    }, delayMs);
  };

  // Navigations
  const handleSelectRole = (role: UserRole) => {
    setUserRole(role);
    if (role === 'teacher') {
      setTeacherLoginReturnView('role-select');
    }
    setCurrentView(role === 'student' ? 'kiosk-login' : 'teacher-login');
  };

  const handleLogout = () => {
    if (isSupabaseConfigured()) {
      signOutUser().catch((err) => console.warn('Sign out failed:', err));
    }
    setStudent(null);
    clearCachedStudentProfile().catch((err) => console.warn('Could not clear cached student profile:', err));
    setTeacher(null);
    setUserRole(null);
    setCurrentView('role-select');
  };

  // ── Student auth ────────────────────────────────────────────────────

  const handleStudentLogin = async (samagraId: string, pin: string) => {
    if (isSupabaseConfigured()) {
      const profile = await signInStudent(samagraId, pin); // throws on bad credentials
      setStudent(profile);
      cacheStudentProfile(profile).catch((err) => console.warn('Could not cache student profile:', err));
    } else {
      // No backend configured — fall back to the offline demo profile so
      // the app is still explorable, clearly labeled as demo mode in the UI.
      setStudent(mockStudentProfile);
    }
    setUserRole('student');
    triggerLoaderTransition(
      'student-home',
      'Loading Class Missions...',
      'ऑफ़लाइन अध्ययन केंद्र लोड हो रहा है...'
    );
  };

  const handleStudentSignup = async (input: StudentSignUpInput) => {
    if (isSupabaseConfigured()) {
      const profile = await signUpStudent(input); // throws e.g. if samagraId taken
      setStudent(profile);
      cacheStudentProfile(profile).catch((err) => console.warn('Could not cache student profile:', err));
    } else {
      setStudent({
        ...mockStudentProfile,
        name: input.name,
        nameHi: input.name,
        samagraId: input.samagraId,
        rollNo: input.rollNo || mockStudentProfile.rollNo,
        className: 'Assigned by Class Code',
        schoolName: input.schoolName,
        udiseCode: input.udiseCode || mockStudentProfile.udiseCode,
      });
    }
    setUserRole('student');
    triggerLoaderTransition(
      'student-home',
      'Loading Class Missions...',
      'ऑफ़लाइन अध्ययन केंद्र लोड हो रहा है...'
    );
  };

  // ── Teacher auth ────────────────────────────────────────────────────

  const handleTeacherLoginSubmit = async (email: string, pin: string) => {
    if (isSupabaseConfigured()) {
      const profile = await signInTeacher(email, pin); // throws on bad credentials
      setTeacher(profile);
    } else {
      setTeacher({
        id: 'offline-demo-teacher',
        name: email,
        employeeId: email,
        schoolName: mockStudentProfile.schoolName,
        udiseCode: mockStudentProfile.udiseCode,
      });
    }
    setUserRole('teacher');
    triggerLoaderTransition(
      'teacher-portal',
      'Loading Teacher Dashboard...',
      'शिक्षक डैशबोर्ड लोड हो रहा है...'
    );
  };

  const handleTeacherSignupSubmit = async (input: TeacherSignUpInput) => {
    if (isSupabaseConfigured()) {
      const profile = await signUpTeacher(input); // throws e.g. if employeeId taken
      setTeacher(profile);
    } else {
      setTeacher({
        id: 'offline-demo-teacher',
        name: input.name,
        employeeId: input.employeeId,
        schoolName: input.schoolName,
        udiseCode: input.udiseCode,
      });
    }
    setUserRole('teacher');
    triggerLoaderTransition(
      'teacher-portal',
      'Loading Teacher Dashboard...',
      'शिक्षक डैशबोर्ड लोड हो रहा है...'
    );
  };

  const handleStartDiagnostic = () => {
    triggerLoaderTransition(
      'diagnostic-flow',
      'Launching AI Diagnostic...',
      'निदानात्मक जांच तैयार हो रही है (5 Questions)...'
    );
  };

  const handleCompleteDiagnostic = (results: DiagnosticAnswerRecord[]) => {
    // Single source of truth: this same computation feeds BOTH the result
    // screen the student sees AND the row saved to Supabase, so they can
    // never disagree with each other.
    const score = results.filter((r) => r.isCorrect).length;
    const totalQuestions = results.length;
    const scorePercent = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    const topicTally: Record<string, { topicHi: string; correct: number; total: number }> = {};
    results.forEach((r) => {
      const bucket = topicTally[r.topic] ?? { topicHi: r.topicHi, correct: 0, total: 0 };
      bucket.total += 1;
      if (r.isCorrect) bucket.correct += 1;
      topicTally[r.topic] = bucket;
    });

    const topicBreakdown: TopicBreakdownEntry[] = Object.entries(topicTally).map(
      ([topic, { topicHi, correct, total }]) => ({
        topic,
        topicHi,
        correct,
        total,
        percent: total > 0 ? Math.round((correct / total) * 100) : 0,
      })
    );

    const sortedByPercent = [...topicBreakdown].sort((a, b) => b.percent - a.percent);
    const strongestTopic = sortedByPercent.length > 0 && sortedByPercent[0].percent > 0
      ? sortedByPercent[0]
      : null;
    const weakestTopic = sortedByPercent.length > 0 && sortedByPercent[sortedByPercent.length - 1].percent < 100
      ? sortedByPercent[sortedByPercent.length - 1]
      : null;
    const sampleMistake = weakestTopic
      ? results.find((r) => r.topic === weakestTopic.topic && !r.isCorrect) ?? null
      : null;

    setLastDiagnosticResult({
      score,
      totalQuestions,
      scorePercent,
      topicBreakdown,
      strongestTopic,
      weakestTopic,
      sampleMistake,
    });

    // Real save to Supabase — only possible for a real logged-in student
    // (student.id is a real auth-linked uuid, never the offline demo id).
    if (isSupabaseConfigured() && student && student.id !== 'offline-demo-student') {
      const topicScores: Record<string, number> = {};
      topicBreakdown.forEach((t) => {
        topicScores[t.topic] = t.percent;
      });

      const diagnosticInput = {
        studentId: student.id,
        score,
        totalQuestions,
        topicScores,
      };

      saveDiagnosticResult(diagnosticInput).then(async () => {
        const state = await getOfflineSyncState();
        setPendingSyncCount(state.pendingCount);
        setLastSyncAt(new Date().toISOString());
      }).catch(async (err) => {
        console.warn('Supabase diagnostic save failed; queueing for offline sync:', err);
        try {
          await queueDiagnosticForSync(diagnosticInput);
          const state = await getOfflineSyncState();
          setPendingSyncCount(state.pendingCount);
        } catch (queueErr) {
          console.warn('Could not queue diagnostic result locally:', queueErr);
        }
      });
    }

    triggerLoaderTransition(
      'diagnostic-result',
      'Analyzing Concept Strengths & Gaps...',
      'अवधारणा विश्लेषण पूर्ण हो रहा है...'
    );
  };

  const handleStartPractice = () => {
    triggerLoaderTransition(
      'practice-flow',
      'Preparing Remedial Lessons...',
      'उपचारात्मक अभ्यास तैयार किया जा रहा है...'
    );
  };

  const runPracticeSave = (input: PracticeSaveInput) => {
    setPracticeSaveState('saving');

    if (!navigator.onLine) {
      queuePracticeForSync(input)
        .then(async () => {
          setPracticeSaveState('saved');
          setPendingPracticeSave(null);
          const state = await getOfflineSyncState();
          setPendingSyncCount(state.pendingCount);
        })
        .catch((err) => {
          console.warn('Could not queue practice result locally:', err);
          setPracticeSaveState('failed');
          setPendingPracticeSave(input);
        });
      return;
    }

    savePracticeResult(input)
      .then(async ({ newXp }) => {
        setPracticeSaveState('saved');
        setPendingPracticeSave(null);
        if (newXp !== null) setStudent((prev) => (prev ? withXp(prev, newXp) : prev));
        const state = await getOfflineSyncState();
        setPendingSyncCount(state.pendingCount);
        setLastSyncAt(new Date().toISOString());
      })
      .catch(async (err) => {
        console.warn('Supabase practice save failed; queueing for offline sync:', err);
        try {
          await queuePracticeForSync(input);
          setPracticeSaveState('saved');
          setPendingPracticeSave(null);
          const state = await getOfflineSyncState();
          setPendingSyncCount(state.pendingCount);
        } catch (queueErr) {
          console.warn('Could not queue practice result locally:', queueErr);
          setPracticeSaveState('failed');
          setPendingPracticeSave(input);
        }
      });
  };

  const handleCompletePractice = (answers: PracticeAnswerRecord[]) => {
    // Same single-source-of-truth approach as the diagnostic: one computation
    // feeds the result screen, the XP, AND the row saved for the teacher.
    const totalQuestions = answers.length;
    const score = answers.filter((a) => a.isCorrect).length;
    const scorePercent = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const topic = answers[0]?.topic ?? 'Fractions';
    const topicHi = diagnosticQuestionsData.find((q) => q.topic === topic)?.topicHi ?? topic;
    const xpEarned = score * 16; // matches the "+16 XP / correct" badge in practice
    const previousPercent =
      lastDiagnosticResult?.topicBreakdown.find((t) => t.topic === topic)?.percent ?? null;

    setLastPracticeResult({
      topic,
      topicHi,
      score,
      totalQuestions,
      scorePercent,
      xpEarned,
      previousPercent,
      completedAt: new Date().toISOString(),
    });

    // Update XP on screen immediately and keep the cached offline profile in sync.
    if (student) {
      const updatedStudent = withXp(student, student.currentXp + xpEarned);
      setStudent(updatedStudent);
      cacheStudentProfile(updatedStudent).catch((err) => console.warn('Could not update cached student profile:', err));
    }

    if (isSupabaseConfigured() && student && student.id !== 'offline-demo-student') {
      runPracticeSave({ studentId: student.id, topic, score, totalQuestions, xpEarned });
    } else {
      setPracticeSaveState('local-only');
    }

    triggerLoaderTransition(
      'updated-home',
      'Saving your practice result...',
      'आपका अभ्यास परिणाम सहेजा जा रहा है...'
    );
  };

  const handleSyncData = () => {
    triggerLoaderTransition(
      currentView,
      isOnline ? 'Syncing saved learning data...' : 'Waiting for internet connection...',
      isOnline ? 'स्थानीय डेटा क्लाउड से सिंक हो रहा है...' : 'इंटरनेट कनेक्शन वापस आने पर डेटा सिंक होगा...',
      500
    );
    if (!isOnline) return;

    syncPendingEvents()
      .then(async () => {
        const state = await getOfflineSyncState();
        setPendingSyncCount(state.pendingCount);
        setLastSyncAt(state.lastSyncAt);
      })
      .catch((err) => console.warn('Manual sync failed:', err));
  };

  const handleNavigateDirect = (view: ViewMode) => {
    // Teacher Portal is off-limits until a teacher has actually signed in —
    // anyone tapping their way there (bottom nav, header toggle, etc.) gets
    // sent to the credentials screen instead, and back to where they were
    // once they either log in or cancel.
    if (view === 'teacher-portal' && userRole !== 'teacher') {
      setTeacherLoginReturnView(currentView);
      setCurrentView('teacher-login');
      return;
    }
    setCurrentView(view);
  };

  const isLoginView =
    currentView === 'kiosk-login' ||
    currentView === 'student-signup' ||
    currentView === 'teacher-login' ||
    currentView === 'teacher-signup' ||
    currentView === 'role-select';

  // Screens that assume a logged-in student profile fall back to the
  // offline demo profile only for *display* purposes if somehow reached
  // without one (e.g. dev nav) — real writes always check `student` itself.
  const displayStudent = student ?? mockStudentProfile;

  if (restoringSession) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <span className="material-symbols-outlined text-[28px] text-secondary animate-spin">sync</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center select-none">
      {/* Responsive Viewport Simulator Container */}
      <div
        className={`w-full flex-1 flex flex-col items-center justify-start transition-all duration-300 py-3 px-2 ${
          deviceMode === 'mobile' ? 'max-w-[440px]' : 'max-w-4xl'
        }`}
      >
        {/* Device Wrapper */}
        <div
          className={`w-full bg-surface-container-lowest flex flex-col min-h-[740px] relative transition-all duration-300 ${
            deviceMode === 'mobile'
              ? 'rounded-[32px] shadow-2xl border-4 border-slate-700/80 overflow-hidden'
              : 'rounded-2xl shadow-xl border border-surface-container-highest overflow-hidden'
          }`}
        >
          {/* Student header is shown only for an authenticated student.
              Teacher mode has its own dashboard header with Logout. This prevents
              teacher sessions from exposing the old dummy student view. */}
          {!isLoginView && userRole === 'student' && currentView !== 'teacher-portal' && (
            <Header
              student={student ?? mockStudentProfile}
              currentView={currentView}
              onNavigate={handleNavigateDirect}
              onOpenSyncModal={() => setCurrentView('kiosk-radar')}
              pendingSyncCount={pendingSyncCount}
              onAvatarClick={handleLogout}
              isHindi={isHindi}
            />
          )}

          {/* Screen Content Body */}
          <main className="flex-1 w-full px-3.5 pt-3 pb-2 flex flex-col overflow-y-auto">
            {currentView === 'role-select' && (
              <RoleSelectScreen
                onSelectRole={handleSelectRole}
                isHindi={isHindi}
                onToggleLang={() => setIsHindi((prev) => !prev)}
              />
            )}

            {currentView === 'kiosk-login' && (
              <KioskLoginScreen
                onLogin={handleStudentLogin}
                onBack={() => setCurrentView('role-select')}
                onGoToSignup={() => setCurrentView('student-signup')}
                isHindi={isHindi}
                isOfflineMode={isOfflineMode}
              />
            )}

            {currentView === 'student-signup' && (
              <StudentSignupScreen
                onSignup={handleStudentSignup}
                onBack={() => setCurrentView('kiosk-login')}
                isHindi={isHindi}
                isOfflineMode={isOfflineMode}
              />
            )}

            {currentView === 'teacher-login' && (
              <TeacherLoginScreen
                onLogin={handleTeacherLoginSubmit}
                onBack={() => setCurrentView(teacherLoginReturnView)}
                onGoToSignup={() => setCurrentView('teacher-signup')}
                isHindi={isHindi}
                isOfflineMode={isOfflineMode}
              />
            )}

            {currentView === 'teacher-signup' && (
              <TeacherSignupScreen
                onSignup={handleTeacherSignupSubmit}
                onBack={() => setCurrentView('teacher-login')}
                isHindi={isHindi}
                isOfflineMode={isOfflineMode}
              />
            )}

            {currentView === 'student-home' && (
              <StudentHomeScreen
                student={displayStudent}
                onStartDiagnostic={handleStartDiagnostic}
                onStartPractice={handleStartPractice}
                onOpenDuel={() => setCurrentView('quiz-duel')}
                onOpenRealWorld={() => setCurrentView('real-world')}
                onPerformSync={handleSyncData}
                isSyncing={loaderOpen}
                pendingCount={pendingSyncCount}
                isOnline={isOnline}
                lastSyncAt={lastSyncAt}
                isHindi={isHindi}
              />
            )}

            {currentView === 'diagnostic-flow' && (
              <DiagnosticScreen
                onComplete={handleCompleteDiagnostic}
                onExit={() => setCurrentView('student-home')}
                isHindi={isHindi}
              />
            )}

            {currentView === 'diagnostic-result' && (
              <DiagnosticResultScreen
                student={displayStudent}
                result={lastDiagnosticResult}
                onStartPractice={handleStartPractice}
                onStartDiagnostic={handleStartDiagnostic}
                isHindi={isHindi}
              />
            )}

            {currentView === 'practice-flow' && (
              <PracticeScreen
                onCompletePractice={handleCompletePractice}
                isHindi={isHindi}
              />
            )}

            {currentView === 'updated-home' && (
              <UpdatedHomeScreen
                student={displayStudent}
                practiceResult={lastPracticeResult}
                saveState={practiceSaveState}
                onRetrySave={() => pendingPracticeSave && runPracticeSave(pendingPracticeSave)}
                onOpenTeacherPortal={() => handleNavigateDirect('teacher-portal')}
                onViewReport={() => setCurrentView('diagnostic-result')}
                onStartDecimals={() => setCurrentView('practice-flow')}
                onRetryPractice={() => setCurrentView('practice-flow')}
                isHindi={isHindi}
              />
            )}

            {currentView === 'teacher-portal' && (
              <TeacherPortalScreen
                teacher={teacher}
                onLogout={handleLogout}
                onPerformSync={handleSyncData}
                isHindi={isHindi}
              />
            )}

            {currentView === 'quiz-duel' && (
              <QuizDuelScreen student={displayStudent} isHindi={isHindi} />
            )}

            {currentView === 'print-fallback' && (
              <PrintFallbackScreen student={displayStudent} isHindi={isHindi} />
            )}

            {currentView === 'saarthi-buddy' && (
              <SaarthiBuddyScreen student={displayStudent} isHindi={isHindi} />
            )}

            {currentView === 'kiosk-radar' && (
              <KioskRadarScreen
                student={displayStudent}
                onSyncComplete={handleSyncData}
                isHindi={isHindi}
              />
            )}

            {currentView === 'real-world' && (
              <RealWorldScreen
                onStartPractice={handleStartPractice}
                isHindi={isHindi}
              />
            )}
          </main>

          {/* Student navigation is hidden in teacher mode. Teacher mode has a
              dedicated dashboard and logout button instead of switching into
              the old prototype student view. */}
          {!isLoginView && userRole === 'student' && currentView !== 'teacher-portal' && (
            <BottomNav
              currentView={currentView}
              onNavigate={handleNavigateDirect}
              isHindi={isHindi}
            />
          )}
        </div>
      </div>

      {/* Smooth Screen Transition Loader */}
      <SmoothLoader
        isOpen={loaderOpen}
        title={loaderTitle}
        subtitle={loaderSubtitle}
      />
    </div>
  );
}
