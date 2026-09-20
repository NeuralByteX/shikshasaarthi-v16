# Database wiring added

This version adds real Supabase read/write functions.

## Save a diagnostic

Import:

```ts
import { saveDiagnosticResult } from './lib/learningData';
```

After the existing diagnostic calculates its score:

```ts
await saveDiagnosticResult({
  studentId: student.id,
  score,
  totalQuestions: questions.length,
  topicScores,
});
```

`topicScores` should look like:

```ts
{
  integers: 80,
  fractions: 40,
  lcm: 20
}
```

The function writes to `diagnostic_results` and upserts topic mastery into `learning_progress`.

## Load progress

```ts
import { useStudentProgress } from './hooks/useStudentProgress';

const { progress, loading, error } = useStudentProgress(student.id);
```

## Teacher dashboard

For a teacher overview:

```ts
import { getTeacherStudentOverview } from './lib/learningData';

const rows = await getTeacherStudentOverview();
```

This is intentionally kept as a service layer instead of guessing which existing UI component should be replaced. Your current app has multiple demo screens, and blindly rewriting them could break the polished UI.

The database layer is now real; the remaining UI wiring is a small, targeted change in the existing diagnostic submit handler and teacher dashboard data-loading handler.
