// ---------------------------------------------------------------------
// Minimal outbox for pending writes. In production this would be
// backed by IndexedDB so entries survive a tab close/crash; this demo
// uses an in-memory Map to keep the example runnable without extra
// dependencies.
// ---------------------------------------------------------------------

export interface OutboxEntry<T = unknown> {
  idempotencyKey: string;
  payload: T;
}

const store = new Map<string, OutboxEntry>();

export const outbox = {
  add<T>(entry: OutboxEntry<T>) {
    store.set(entry.idempotencyKey, entry);
  },
  remove(idempotencyKey: string) {
    store.delete(idempotencyKey);
  },
  getAll(): OutboxEntry[] {
    return Array.from(store.values());
  },
};

export function generateIdempotencyKey(): string {
  return crypto.randomUUID();
}