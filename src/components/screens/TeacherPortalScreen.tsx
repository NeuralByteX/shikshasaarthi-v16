import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TeacherProfile } from '../../types';
import { isSupabaseConfigured } from '../../lib/config';
import { supabase } from '../../lib/supabase';
import { getClassRoster, assignRemedialTask, ClassRosterEntry, getTeacherClasses, createTeacherClass, TeacherClass } from '../../lib/learningData';

interface TeacherPortalScreenProps {
  teacher: TeacherProfile | null;
  onLogout: () => void;
  onPerformSync: () => void;
  isHindi: boolean;
}

const CLASS_OPTIONS = ['6A', '7B', '8C'];

export const TeacherPortalScreen: React.FC<TeacherPortalScreenProps> = ({
  teacher,
  onLogout,
  onPerformSync,
  isHindi,
}) => {
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [newClass, setNewClass] = useState<string>('7');
  const [newSection, setNewSection] = useState<string>('B');
  const [classError, setClassError] = useState<string | null>(null);
  const [roster, setRoster] = useState<ClassRosterEntry[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [assignedIds, setAssignedIds] = useState<Set<string>>(new Set());
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const requestSeq = useRef(0);

  const configured = isSupabaseConfigured();

  const loadClasses = useCallback(async () => {
    if (!configured || !teacher) return;
    setClassError(null);
    const rows = await getTeacherClasses(teacher.id);
    setClasses(rows);
    if (!selectedClassId && rows.length) { setSelectedClassId(rows[0].id); setSelectedClass(`${rows[0].className}${rows[0].section}`); }
  }, [configured, teacher, selectedClassId]);

  // `silent` refreshes (live updates) never blank the list or flash "Loading…";
  // a request counter drops out-of-order responses so a slow older fetch can't
  // overwrite a newer one.
  const loadRoster = useCallback((silent = false) => {
    if (!configured || !teacher || !selectedClassId) return;
    const seq = ++requestSeq.current;
    if (!silent) setLoading(true);
    setLoadError(null);
    getClassRoster(teacher.id, selectedClassId)
      .then((rows) => {
        if (seq !== requestSeq.current) return;
        setRoster(rows);
        // Server is the source of truth for "assigned" — so once a student
        // finishes the task, the button goes back to "Assign Practice".
        setAssignedIds(new Set(rows.filter((r) => r.hasPendingTask).map((r) => r.studentId)));
        setLastUpdated(new Date());
      })
      .catch((err) => {
        if (seq !== requestSeq.current) return;
        if (!silent) setLoadError(err?.message ?? 'Could not load class roster');
      })
      .finally(() => {
        if (seq === requestSeq.current) setLoading(false);
      });
  }, [configured, teacher, selectedClassId]);

  useEffect(() => {
    loadClasses().catch((err) => setClassError(err?.message ?? 'Could not load classes'));
  }, [loadClasses]);

  useEffect(() => {
    setRoster(null);
    if (selectedClassId) loadRoster();
  }, [selectedClassId, loadRoster]);

  // ── Live updates ────────────────────────────────────────────────────
  // 1) Supabase Realtime: refresh the moment a student's diagnostic, practice
  //    result or mastery row changes (RLS still applies, so a teacher only
  //    receives events for their own students).
  // 2) Polling + refresh-on-focus as a safety net, so results still appear
  //    within seconds even if Realtime isn't enabled for those tables yet.
  useEffect(() => {
    if (!configured || !supabase || !teacher || !selectedClassId) return;
    const client = supabase;

    let debounce: ReturnType<typeof setTimeout> | undefined;
    const refresh = () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => loadRoster(true), 400); // one student action = several row events
    };

    const channel = client
      .channel(`teacher-roster-${selectedClassId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'practice_results' }, refresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'diagnostic_results' }, refresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'learning_progress' }, refresh)
      .subscribe((status) => setIsLive(status === 'SUBSCRIBED'));

    const poll = setInterval(() => {
      if (document.visibilityState === 'visible') loadRoster(true);
    }, 8000);
    const onVisible = () => { if (document.visibilityState === 'visible') loadRoster(true); };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearTimeout(debounce);
      clearInterval(poll);
      document.removeEventListener('visibilitychange', onVisible);
      client.removeChannel(channel);
      setIsLive(false);
    };
  }, [configured, teacher, selectedClassId, loadRoster]);

  const handleCreateClass = async () => {
    if (!teacher) return;
    try {
      setClassError(null);
      const created = await createTeacherClass(teacher.id, newClass, newSection.toUpperCase());
      const next = [...classes, created];
      setClasses(next); setSelectedClassId(created.id); setSelectedClass(`${created.className}${created.section}`);
    } catch (err: any) { setClassError(err?.message ?? 'Could not create class'); }
  };

  const handleAssignTask = async (entry: ClassRosterEntry) => {
    if (!teacher || !entry.weakestTopic) return;
    setAssigningId(entry.studentId);
    try {
      await assignRemedialTask(entry.studentId, teacher.id, entry.weakestTopic);
      setAssignedIds((prev) => new Set(prev).add(entry.studentId));
      loadRoster(true);
    } catch (err) {
      console.warn('Could not assign task:', err);
    } finally {
      setAssigningId(null);
    }
  };

  const classAverage =
    roster && roster.length > 0
      ? Math.round(
          roster.reduce((sum, r) => sum + (r.latestScorePercent ?? 0), 0) / roster.length
        )
      : null;
  const attemptedCount = roster ? roster.filter((r) => r.latestScorePercent !== null).length : 0;
  const practicedCount = roster ? roster.filter((r) => r.latestPractice !== null).length : 0;

  return (
    <div className="flex flex-col w-full gap-4 animate-fadeIn pb-6 max-w-2xl mx-auto">
      {/* Teacher Header Bar */}
      <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-surface-container-highest flex items-center justify-between shadow-sm flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[22px]">manage_accounts</span>
          </div>
          <div>
            <h2 className="font-display text-[15px] text-primary font-bold">
              {teacher
                ? isHindi
                  ? `नमस्ते, ${teacher.name}`
                  : `Hi, ${teacher.name}`
                : isHindi
                ? 'शिक्षक डैशबोर्ड'
                : 'Teacher Dashboard'}
            </h2>
            <p className="text-[12px] text-on-surface-variant font-medium">
              {teacher ? `${teacher.schoolName} • ${teacher.employeeId}` : (isHindi ? 'गणित विषय' : 'Mathematics')}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[12px] border border-rose-200 hover:bg-rose-100 transition-all flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[15px]">logout</span>
          {isHindi ? 'लॉग आउट' : 'Logout'}
        </button>
      </div>

      {!configured ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[20px] text-amber-700 shrink-0">wifi_off</span>
          <p className="text-[12px] text-amber-900 leading-snug">
            {isHindi
              ? 'Supabase कॉन्फ़िगर नहीं है, इसलिए कोई वास्तविक कक्षा डेटा नहीं दिखाया जा सकता।'
              : "Supabase isn't configured, so no real class data can be shown here."}
          </p>
        </div>
      ) : (
        <>
          {/* Teacher-owned classes */}
          <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-surface-container-highest shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[13px] font-bold text-primary">{isHindi ? 'मेरी कक्षाएँ' : 'My Classes'}</div>
                <div className="text-[10.5px] text-on-surface-variant">{isHindi ? 'छात्र इसी Class Code से जुड़ते हैं।' : 'Students join using the class code.'}</div>
              </div>
              <button type="button" onClick={loadClasses} className="px-3 py-1.5 rounded-full bg-surface-container-high text-secondary font-bold text-[12px]">↻</button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {classes.map((c) => (
                <button key={c.id} type="button" onClick={() => { setSelectedClassId(c.id); setSelectedClass(`${c.className}${c.section}`); }} className={`px-3 py-2 rounded-xl text-[12px] font-bold ${selectedClassId === c.id ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant'}`}>
                  Class {c.className}{c.section}<span className="block text-[9px] opacity-80">{c.classCode}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <select value={newClass} onChange={(e) => setNewClass(e.target.value)} className="flex-1 rounded-lg bg-surface-container-high p-2 text-[12px] font-bold">{['6','7','8'].map(c => <option key={c} value={c}>Class {c}</option>)}</select>
              <select value={newSection} onChange={(e) => setNewSection(e.target.value)} className="w-20 rounded-lg bg-surface-container-high p-2 text-[12px] font-bold">{['A','B','C'].map(c => <option key={c} value={c}>{c}</option>)}</select>
              <button type="button" onClick={handleCreateClass} className="px-3 rounded-lg bg-secondary text-white text-[11px] font-bold">+ {isHindi ? 'कक्षा' : 'Create'}</button>
            </div>
            {selectedClassId && <div className="text-[11px] bg-secondary-fixed/50 rounded-xl p-2 font-bold text-primary">Class Code: {classes.find(c => c.id === selectedClassId)?.classCode}</div>}
            {classError && <div className="text-[11px] text-rose-700 bg-rose-50 rounded-lg p-2">{classError}</div>}
          </div>

          {/* Class summary */}
          <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-surface-container-highest shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[13px] font-bold text-primary block">
                {isHindi ? `कक्षा ${selectedClass} सारांश` : `Class ${selectedClass} Summary`}
              </span>
              <span className="text-[11.5px] text-on-surface-variant">
                {loading
                  ? isHindi
                    ? 'लोड हो रहा है...'
                    : 'Loading...'
                  : roster
                  ? isHindi
                    ? `${roster.length} पंजीकृत • ${attemptedCount} ने जांच की • ${practicedCount} ने अभ्यास किया`
                    : `${roster.length} registered • ${attemptedCount} diagnosed • ${practicedCount} practiced`
                  : ''}
              </span>
            </div>
            {classAverage !== null && (
              <div className="text-right">
                <span className="font-display text-[20px] font-extrabold text-secondary block leading-none">
                  {classAverage}%
                </span>
                <span className="text-[10.5px] text-on-surface-variant">
                  {isHindi ? 'औसत स्कोर' : 'Class average'}
                </span>
              </div>
            )}
          </div>

          {loadError && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-rose-600 shrink-0">error</span>
              <p className="text-[11.5px] text-rose-800">{loadError}</p>
            </div>
          )}

          {/* Real roster */}
          <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-surface-container-highest shadow-sm flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[13px] font-bold text-primary">
                {isHindi ? 'छात्र सूची' : 'Student Roster'}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-full border ${
                    isLive
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-surface-container text-on-surface-variant border-surface-container-highest'
                  }`}
                  title={isLive ? 'Realtime connected' : 'Auto-refreshing every few seconds'}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-outline'}`} />
                  {isLive ? (isHindi ? 'लाइव' : 'Live') : (isHindi ? 'ऑटो-रिफ्रेश' : 'Auto-refresh')}
                  {lastUpdated ? ` • ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : ''}
                </span>
                <button
                  type="button"
                  onClick={() => loadRoster(true)}
                  className="w-7 h-7 rounded-full bg-surface-container-high text-secondary font-bold text-[13px] flex items-center justify-center active:scale-95"
                  aria-label="Refresh roster"
                >
                  ↻
                </button>
              </div>
            </div>

            {roster && roster.length === 0 && !loading && (
              <p className="text-[12px] text-on-surface-variant py-2 text-center">
                {isHindi
                  ? 'इस कक्षा में अभी कोई छात्र पंजीकृत नहीं है।'
                  : 'No students have signed up for this class yet.'}
              </p>
            )}

            {roster?.map((entry) => {
              const isAssigned = assignedIds.has(entry.studentId) || entry.hasPendingTask;
              const p = entry.latestPractice;
              const pDelta = p && p.beforePercent !== null ? p.percent - p.beforePercent : null;
              return (
                <div
                  key={entry.studentId}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low text-[13px] border border-surface-container gap-2 flex-wrap"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-7 h-7 rounded-full bg-secondary-fixed flex items-center justify-center font-bold text-[11px] text-primary shrink-0">
                      {entry.rollNo ?? '—'}
                    </span>
                    <div className="min-w-0">
                      <span className="font-bold text-primary block truncate">{entry.name}</span>
                      <span className="text-[10.5px] text-on-surface-variant">
                        {entry.latestScorePercent !== null
                          ? isHindi
                            ? `नवीनतम: ${entry.latestScorePercent}%`
                            : `Latest: ${entry.latestScorePercent}%`
                          : isHindi
                          ? 'जांच अभी बाकी'
                          : 'Diagnostic not taken yet'}
                        {entry.weakestTopic
                          ? isHindi
                            ? ` • कमज़ोर: ${entry.weakestTopic}${entry.weakestMastery !== null ? ` (${entry.weakestMastery}%)` : ''}`
                            : ` • Weakest: ${entry.weakestTopic}${entry.weakestMastery !== null ? ` (${entry.weakestMastery}%)` : ''}`
                          : ''}
                      </span>
                      {p && (
                        <span className="mt-0.5 flex items-center gap-1 flex-wrap text-[10.5px] font-bold">
                          <span
                            className={`px-1.5 py-0.5 rounded-full ${
                              p.percent >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isHindi ? 'अभ्यास के बाद' : 'After remedial'}: {p.topic} {p.percent}% ({p.score}/{p.totalQuestions})
                          </span>
                          {pDelta !== null && (
                            <span className={pDelta >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                              {pDelta >= 0 ? '▲' : '▼'} {Math.abs(pDelta)}% {isHindi ? 'बनाम जांच' : 'vs diagnostic'}
                            </span>
                          )}
                          <span className="text-on-surface-variant font-medium">
                            • {new Date(p.completedAt).toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            {entry.practiceAttempts > 1 ? ` • ${entry.practiceAttempts} ${isHindi ? 'प्रयास' : 'attempts'}` : ''}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                  {entry.weakestTopic && (
                    <button
                      type="button"
                      onClick={() => handleAssignTask(entry)}
                      disabled={assigningId === entry.studentId || isAssigned}
                      className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1 shrink-0 transition-all ${
                        isAssigned
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-secondary text-white hover:bg-secondary-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {isAssigned ? 'check_circle' : 'assignment_add'}
                      </span>
                      {isAssigned
                        ? isHindi
                          ? 'सौंपा गया'
                          : 'Assigned'
                        : isHindi
                        ? 'अभ्यास सौंपें'
                        : 'Assign Practice'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onPerformSync}
            className="w-full py-2.5 px-3.5 rounded-xl bg-surface-container-high text-primary font-bold text-[12px] flex items-center justify-center gap-1 shadow-sm hover:bg-surface-container-highest transition-all"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">sync</span>
            <span>{isHindi ? 'कियोस्क सिंक करें' : 'Sync Kiosk Devices'}</span>
          </button>
        </>
      )}
    </div>
  );
};
