# ShikshaSaarthi V17 — Offline-first architecture

## Source of truth

- **Offline:** IndexedDB is the local source of truth for questions, local results, learning progress, cached profile, and the sync queue.
- **Online:** Supabase remains the cloud source of truth.
- **AI:** n8n + Gemini is an online enhancement. It is never required for the core assessment flow.

## Flow

```text
Student UI
   |
   v
Learning / Question Repository
   |
   +-------------------+
   |                   |
   v                   v
IndexedDB            Supabase
   |                   |
   |              n8n -> Gemini
   |
Local adaptive engine
   |
Personalized practice
   |
Sync queue ----------> Supabase (when online)
```

## V17 changes in this first pass

- IndexedDB upgraded to version 2.
- Added stores for questions, results, learning progress and assignments.
- Existing sync queue is preserved and expanded with future event types.
- Added a local question repository that seeds the bundled question bank into IndexedDB.
- Diagnostic screen now reads its questions through the local repository instead of directly importing the data at runtime.
- Added a deterministic local adaptive/mastery engine as the offline intelligence layer.
- Service-worker cache name updated from the stale V15 name to V17.

## Important limitation

This is the first V17 foundation pass, not the finished production offline system. Authentication, practice-screen repository migration, teacher offline dashboards, conflict resolution and n8n integration still need to be wired against these storage contracts.
