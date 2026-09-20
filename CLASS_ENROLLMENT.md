# Teacher → Student enrollment

ShikshaSaarthi now stores a real teacher/student relationship in Supabase.

## Flow
1. Teacher signs in with the real teacher account.
2. Teacher Dashboard → **My Classes** → creates a class (for example Class 7B).
3. Supabase stores the class in `teacher_classes` and generates a unique `class_code`.
4. Teacher gives that code to the intended students.
5. Student signup requires the code.
6. The `student-auth` Edge Function validates the code and creates a row in `teacher_students` linking:
   - `teacher_id`
   - `student_id`
   - `class_id`
7. Teacher Dashboard retrieves only students enrolled in that teacher's class.

## Database relationship

`teachers` 1 → many `teacher_classes`

`teacher_classes` 1 → many `teacher_students`

`students` 1 → many `teacher_students` (historically, if needed)

The student profile also stores `teacher_id` and `class_code` as convenient current-assignment fields. The authoritative enrollment relationship is `teacher_students`.

## Important
Run the updated `supabase/schema.sql` before testing this version. The schema intentionally rebuilds the prototype tables, so existing demo/test rows will be removed.
