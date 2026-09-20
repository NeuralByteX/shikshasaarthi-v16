# Supabase setup for ShikshaSaarthi

1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Copy `.env.example` to `.env.local`.
4. In Supabase Project Settings -> API, copy the Project URL and anon/publishable key.
5. Put them in `.env.local`:
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
6. Run:
   npm install
   npm run dev

The Supabase client is available from `src/lib/supabase.ts`.

IMPORTANT:
The current app's existing screens still use their original demo data. This package adds the real database schema and Supabase client foundation; the next step is wiring diagnostic submission, progress, and teacher dashboard reads/writes to these tables.


## V10 real-account authentication

Student and teacher accounts now use a **real email address + PIN** with Supabase Auth. There are no synthetic `@shikshasaarthi.local` addresses.

For the hackathon demo, in Supabase Dashboard → Authentication → Providers → Email, turn **Confirm email** OFF. Otherwise Supabase will require email verification before the app can create the linked profile row.

The Samagra ID / Employee ID is stored as the school identity, while the Supabase Auth UUID is the actual account identity. Never store PINs in the `students` or `teachers` tables.

Supabase's built-in email sender has rate limits. If you test many new accounts, use a real SMTP provider for a production deployment rather than repeatedly creating test accounts.


## v15 — live remedial results
If your database already exists, DO NOT re-run `schema.sql` (it drops all tables).
Run `supabase/migration_v15_practice_realtime.sql` instead. It is safe to re-run.
See `CHANGES_v15.md`.
