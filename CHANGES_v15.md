# v15 — real-time remedial results

## The problem
After a student finished remedial practice, nothing real happened:
- The "after practice" screen always showed a hard-coded 80% / 4-of-5 / 760 XP.
- The practice score was never saved (the `practice_results` table was never written).
- The teacher dashboard only read diagnostic data and only loaded once.

## What changed
Student side
- `PracticeScreen` now records every answer, locks an answer after the first tap,
  and shuffles option order (the right answer used to be option 1 in 4 of 6 questions).
- `App.handleCompletePractice` computes the real score/percent/XP once and uses it for
  the result screen AND the database save.
- `UpdatedHomeScreen` shows the real score, before-vs-after delta, real XP/level,
  a real save status (Saving / Saved / Failed + Retry), and only unlocks the next
  chapter at >= 80%.
- `savePracticeResult()` writes `practice_results`, updates `learning_progress`
  (mastery + attempts), adds XP to `students.xp`, and marks a pending
  `assigned_tasks` row completed.

Teacher side
- `getClassRoster()` now also returns the latest practice result, before/after delta,
  attempts, live weakest topic (from `learning_progress`), and pending-task state.
- `TeacherPortalScreen` refreshes live: Supabase Realtime + 8-second polling +
  refresh on tab focus (so it works even before Realtime is enabled).
  Shows a Live / Auto-refresh pill with last-updated time.

Also fixed: offline demo teacher login referenced an undefined `employeeId` (TS error).

## You must do this once
Run `supabase/migration_v15_practice_realtime.sql` in Supabase -> SQL Editor.
It is NON-destructive (does not drop tables — do NOT re-run schema.sql, it wipes data).
It adds the missing policy so a student can complete their task, and enables
Realtime on practice_results / diagnostic_results / learning_progress.

## V15 Offline Layer — IndexedDB + Sync Queue

This build adds a minimal real offline-first layer without changing the Supabase schema:

- Native browser IndexedDB stores pending diagnostic/practice sync events.
- Student profile is cached locally so an already-authenticated student can reopen the app offline.
- A Service Worker caches the Vite application shell/assets after the first online visit.
- Practice/diagnostic results are queued locally when the network is unavailable or a cloud save fails.
- Pending events automatically retry when the browser comes back online and can also be sent with **Sync Now**.
- The student dashboard now displays real online/offline state, pending queue count, and last successful sync time.

This is a best-effort sync queue for the hackathon MVP; it is not a replacement for server-side validation or a full conflict-resolution system.


## V16 live two-laptop duel
- Replaced the demo/fake Quiz Duel with a real Supabase-backed duel.
- Two authenticated student accounts can create/join a duel with a shared code.
- Real student UUIDs are stored as participants; answers and points persist in PostgreSQL.
- Supabase Realtime plus a short polling fallback keeps both laptops synchronized.
- Added `supabase/migration_v16_live_duel.sql`; run it once in the Supabase SQL Editor before testing the duel.
- This does not implement Bluetooth/Wi-Fi Direct mesh; the two laptops communicate through the deployed Supabase backend and therefore require internet.
