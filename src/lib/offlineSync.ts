import { supabase } from './supabase';
import { enqueueSyncEvent, getLastSyncAt, getPendingSyncCount, getPendingSyncEvents, removeSyncEvent, setLastSyncAt, updateSyncEventFailure, SyncEvent } from './offlineDb';
import { DiagnosticSaveInput, PracticeSaveInput, saveDiagnosticResult, savePracticeResult } from './learningData';

export async function queueDiagnosticForSync(input: DiagnosticSaveInput) {
  await enqueueSyncEvent('diagnostic', input);
}

export async function queuePracticeForSync(input: PracticeSaveInput) {
  await enqueueSyncEvent('practice', input);
}

export async function getOfflineSyncState() {
  const [pendingCount, lastSyncAt] = await Promise.all([getPendingSyncCount(), getLastSyncAt()]);
  return { pendingCount, lastSyncAt };
}

export async function syncPendingEvents(): Promise<{ synced: number; remaining: number }> {
  if (!navigator.onLine || !supabase) {
    return { synced: 0, remaining: await getPendingSyncCount() };
  }

  const events = await getPendingSyncEvents();
  let synced = 0;

  for (const event of events) {
    try {
      await syncEvent(event);
      await removeSyncEvent(event.id);
      synced += 1;
    } catch (error) {
      await updateSyncEventFailure(event.id, error);
      // Stop here so a temporary network/API problem doesn't hammer Supabase.
      break;
    }
  }

  const remaining = await getPendingSyncCount();
  if (synced > 0) await setLastSyncAt(new Date().toISOString());
  return { synced, remaining };
}

async function syncEvent(event: SyncEvent) {
  if (event.type === 'diagnostic') {
    await saveDiagnosticResult(event.payload as DiagnosticSaveInput);
    return;
  }
  await savePracticeResult(event.payload as PracticeSaveInput);
}
