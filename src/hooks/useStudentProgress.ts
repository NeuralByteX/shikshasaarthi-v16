import { useEffect, useState } from 'react';
import { getStudentProgress } from '../lib/learningData';

export function useStudentProgress(studentId?: string) {
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(Boolean(studentId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId) {
      setProgress([]);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    getStudentProgress(studentId)
      .then((rows) => {
        if (active) setProgress(rows);
      })
      .catch((err) => {
        if (active) setError(err?.message ?? 'Unable to load progress');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [studentId]);

  return { progress, loading, error };
}
