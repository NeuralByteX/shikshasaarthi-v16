/**
 * Offline-first storage for ShikshaSaarthi.
 * Native IndexedDB only — no extra dependency required.
 *
 * V17 goal: IndexedDB is the local source of truth while offline. Supabase
 * remains the cloud source of truth when connectivity is available.
 */

const DB_NAME = 'shikshasaarthi-offline';
const DB_VERSION = 2;

const QUEUE_STORE = 'sync_queue';
const META_STORE = 'meta';
const PROFILE_STORE = 'profiles';
const QUESTIONS_STORE = 'questions';
const RESULTS_STORE = 'results';
const PROGRESS_STORE = 'learning_progress';
const ASSIGNMENTS_STORE = 'assignments';

export type SyncEventType =
  | 'diagnostic'
  | 'practice'
  | 'assessment_completed'
  | 'mastery_updated'
  | 'assignment_completed';

export interface SyncEvent<T = unknown> {
  id: string;
  type: SyncEventType;
  payload: T;
  createdAt: string;
  attempts: number;
  lastError?: string;
}

export interface LocalResult {
  id: string;
  kind: 'diagnostic' | 'practice';
  studentId: string;
  payload: unknown;
  createdAt: string;
  synced: boolean;
}

export interface LocalLearningProgress {
  key: string;
  studentId: string;
  topic: string;
  mastery: number;
  attempts: number;
  lastScore: number;
  updatedAt: string;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available in this browser.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(QUEUE_STORE)) {
        const store = db.createObjectStore(QUEUE_STORE, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt');
      }
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(PROFILE_STORE)) {
        db.createObjectStore(PROFILE_STORE, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(QUESTIONS_STORE)) {
        const store = db.createObjectStore(QUESTIONS_STORE, { keyPath: 'id' });
        store.createIndex('topic', 'topic');
      }
      if (!db.objectStoreNames.contains(RESULTS_STORE)) {
        const store = db.createObjectStore(RESULTS_STORE, { keyPath: 'id' });
        store.createIndex('studentId', 'studentId');
        store.createIndex('kind', 'kind');
      }
      if (!db.objectStoreNames.contains(PROGRESS_STORE)) {
        const store = db.createObjectStore(PROGRESS_STORE, { keyPath: 'key' });
        store.createIndex('studentId', 'studentId');
        store.createIndex('topic', 'topic');
      }
      if (!db.objectStoreNames.contains(ASSIGNMENTS_STORE)) {
        const store = db.createObjectStore(ASSIGNMENTS_STORE, { keyPath: 'id' });
        store.createIndex('studentId', 'studentId');
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not open IndexedDB.'));
  });
}

function makeId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function putQuestions<T extends { id: number | string }>(questions: T[]): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(QUESTIONS_STORE, 'readwrite');
    const store = tx.objectStore(QUESTIONS_STORE);
    questions.forEach((question) => store.put(question));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Could not save offline questions.'));
  });
  db.close();
}

export async function getQuestions<T>(): Promise<T[]> {
  const db = await openDb();
  const questions = await new Promise<T[]>((resolve, reject) => {
    const tx = db.transaction(QUESTIONS_STORE, 'readonly');
    const request = tx.objectStore(QUESTIONS_STORE).getAll();
    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error ?? new Error('Could not read offline questions.'));
  });
  db.close();
  return questions;
}

export async function saveLocalResult(result: Omit<LocalResult, 'id' | 'createdAt'> & { id?: string }): Promise<string> {
  const db = await openDb();
  const id = result.id ?? makeId();
  const record: LocalResult = { ...result, id, createdAt: new Date().toISOString() };
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(RESULTS_STORE, 'readwrite');
    tx.objectStore(RESULTS_STORE).put(record);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Could not save local result.'));
  });
  db.close();
  return id;
}

export async function getLocalResults<T = LocalResult>(studentId: string, kind?: LocalResult['kind']): Promise<T[]> {
  const db = await openDb();
  const results = await new Promise<LocalResult[]>((resolve, reject) => {
    const tx = db.transaction(RESULTS_STORE, 'readonly');
    const request = tx.objectStore(RESULTS_STORE).index('studentId').getAll(studentId);
    request.onsuccess = () => resolve(request.result as LocalResult[]);
    request.onerror = () => reject(request.error ?? new Error('Could not read local results.'));
  });
  db.close();
  return results
    .filter((result) => !kind || result.kind === kind)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)) as T[];
}

export async function upsertLocalProgress(input: Omit<LocalLearningProgress, 'key'>): Promise<void> {
  const db = await openDb();
  const record: LocalLearningProgress = {
    ...input,
    key: `${input.studentId}:${input.topic}`,
  };
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(PROGRESS_STORE, 'readwrite');
    tx.objectStore(PROGRESS_STORE).put(record);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Could not save local learning progress.'));
  });
  db.close();
}

export async function getLocalProgress(studentId: string): Promise<LocalLearningProgress[]> {
  const db = await openDb();
  const progress = await new Promise<LocalLearningProgress[]>((resolve, reject) => {
    const tx = db.transaction(PROGRESS_STORE, 'readonly');
    const request = tx.objectStore(PROGRESS_STORE).index('studentId').getAll(studentId);
    request.onsuccess = () => resolve(request.result as LocalLearningProgress[]);
    request.onerror = () => reject(request.error ?? new Error('Could not read local learning progress.'));
  });
  db.close();
  return progress;
}

export async function enqueueSyncEvent<T>(type: SyncEventType, payload: T): Promise<string> {
  const db = await openDb();
  const event: SyncEvent<T> = {
    id: makeId(), type, payload, createdAt: new Date().toISOString(), attempts: 0,
  };
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(QUEUE_STORE, 'readwrite');
    tx.objectStore(QUEUE_STORE).put(event);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Could not queue offline event.'));
  });
  db.close();
  return event.id;
}

export async function getPendingSyncEvents(): Promise<SyncEvent[]> {
  const db = await openDb();
  const events = await new Promise<SyncEvent[]>((resolve, reject) => {
    const tx = db.transaction(QUEUE_STORE, 'readonly');
    const request = tx.objectStore(QUEUE_STORE).getAll();
    request.onsuccess = () => resolve((request.result as SyncEvent[]).sort((a, b) => a.createdAt.localeCompare(b.createdAt)));
    request.onerror = () => reject(request.error ?? new Error('Could not read sync queue.'));
  });
  db.close();
  return events;
}

export async function getPendingSyncCount(): Promise<number> {
  const db = await openDb();
  const count = await new Promise<number>((resolve, reject) => {
    const tx = db.transaction(QUEUE_STORE, 'readonly');
    const request = tx.objectStore(QUEUE_STORE).count();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not count sync queue.'));
  });
  db.close();
  return count;
}

export async function removeSyncEvent(id: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(QUEUE_STORE, 'readwrite');
    tx.objectStore(QUEUE_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Could not remove sync event.'));
  });
  db.close();
}

export async function updateSyncEventFailure(id: string, error: unknown): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(QUEUE_STORE, 'readwrite');
    const store = tx.objectStore(QUEUE_STORE);
    const request = store.get(id);
    request.onsuccess = () => {
      const event = request.result as SyncEvent | undefined;
      if (!event) return;
      event.attempts += 1;
      event.lastError = error instanceof Error ? error.message : String(error);
      store.put(event);
    };
    request.onerror = () => reject(request.error ?? new Error('Could not update sync event.'));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Could not update sync event.'));
  });
  db.close();
}

export async function setLastSyncAt(value: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(META_STORE, 'readwrite');
    tx.objectStore(META_STORE).put({ key: 'lastSyncAt', value });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Could not save sync time.'));
  });
  db.close();
}

export async function getLastSyncAt(): Promise<string | null> {
  const db = await openDb();
  const value = await new Promise<string | null>((resolve, reject) => {
    const tx = db.transaction(META_STORE, 'readonly');
    const request = tx.objectStore(META_STORE).get('lastSyncAt');
    request.onsuccess = () => resolve(request.result?.value ?? null);
    request.onerror = () => reject(request.error ?? new Error('Could not read sync time.'));
  });
  db.close();
  return value;
}

export async function cacheStudentProfile<T>(profile: T): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(PROFILE_STORE, 'readwrite');
    tx.objectStore(PROFILE_STORE).put({ key: 'student', profile });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Could not cache student profile.'));
  });
  db.close();
}

export async function getCachedStudentProfile<T>(): Promise<T | null> {
  const db = await openDb();
  const profile = await new Promise<T | null>((resolve, reject) => {
    const tx = db.transaction(PROFILE_STORE, 'readonly');
    const request = tx.objectStore(PROFILE_STORE).get('student');
    request.onsuccess = () => resolve(request.result?.profile ?? null);
    request.onerror = () => reject(request.error ?? new Error('Could not read cached student profile.'));
  });
  db.close();
  return profile;
}

export async function clearCachedStudentProfile(): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(PROFILE_STORE, 'readwrite');
    tx.objectStore(PROFILE_STORE).delete('student');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Could not clear cached student profile.'));
  });
  db.close();
}
