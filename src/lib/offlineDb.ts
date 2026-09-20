/**
 * Minimal offline-first storage for ShikshaSaarthi.
 * Uses the browser's native IndexedDB API so no extra dependency is required.
 */

const DB_NAME = 'shikshasaarthi-offline';
const DB_VERSION = 1;
const QUEUE_STORE = 'sync_queue';
const META_STORE = 'meta';
const PROFILE_STORE = 'profiles';

export type SyncEventType = 'diagnostic' | 'practice';

export interface SyncEvent<T = unknown> {
  id: string;
  type: SyncEventType;
  payload: T;
  createdAt: string;
  attempts: number;
  lastError?: string;
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
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not open IndexedDB.'));
  });
}

function makeId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function enqueueSyncEvent<T>(type: SyncEventType, payload: T): Promise<string> {
  const db = await openDb();
  const event: SyncEvent<T> = {
    id: makeId(),
    type,
    payload,
    createdAt: new Date().toISOString(),
    attempts: 0,
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
