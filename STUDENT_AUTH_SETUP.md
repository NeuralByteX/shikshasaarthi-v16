# ShikshaSaarthi V11 — Student ID + PIN authentication

This version removes the student's email field. Students sign up and log in with:

- Student/Samagra ID
- 6-digit PIN

The account is still a **real Supabase Auth account**. A Supabase Edge Function creates the Auth user with an internal, non-mail identity derived from the Student ID, immediately confirms it, and returns a real Supabase session. No email is sent to students.

## 1. Run the database schema

Run `supabase/schema.sql` in the Supabase SQL Editor.

## 2. Deploy the Edge Function

Install/login to the Supabase CLI, link the project, then run:

```bash
supabase functions deploy student-auth
```

Supabase Edge Functions provide these environment variables automatically in the hosted function, including `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `SUPABASE_ANON_KEY`.

**Never put `SUPABASE_SERVICE_ROLE_KEY` in the Vite `.env.local` or frontend code.**

## 3. Frontend environment

`.env.local` needs only:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
```

## 4. Student flow

Student enters:

```text
Student/Samagra ID: 123456789
PIN: 123456
```

The app calls the `student-auth` Edge Function. The function checks the real `students` table, creates/signs in the real Supabase Auth user, and returns the authenticated session.

The internal Auth email is never displayed to the student and no email is sent.

## 5. Teacher flow

Teachers continue using real email + PIN through normal Supabase Auth.

## 6. Why this fixes the previous email-limit problem

Student signup no longer calls the public `auth.signUp()` email flow, so it does not ask Supabase to send confirmation emails. The Edge Function uses the Admin Auth API with `email_confirm: true` and then creates a real authenticated session.

## 7. Important security rule

The service-role key is server-side only. Do not copy it into `.env.local`, GitHub, Vercel frontend environment variables, or any browser code.


## Teacher-to-student enrollment
1. Run the updated `supabase/schema.sql`.
2. A signed-in teacher creates a class in the Teacher Dashboard.
3. The dashboard generates a unique Class Code.
4. Students enter that Class Code during signup.
5. The `teacher_students` table stores the teacher, student, and class relationship.
6. The teacher dashboard loads only students enrolled in the teacher's selected class.
