// Tiny safe localStorage wrapper. Returns fallback if unavailable (SSR / disabled).

export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    // Notify other components in the same tab. The native 'storage' event
    // doesn't fire on the same window, so we use a custom event.
    window.dispatchEvent(
      new CustomEvent("mt:storage-changed", { detail: { key } }),
    );
  } catch {
    /* quota / disabled — ignore */
  }
}

export function remove(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
    window.dispatchEvent(
      new CustomEvent("mt:storage-changed", { detail: { key } }),
    );
  } catch {
    /* ignore */
  }
}

/**
 * Subscribe to storage changes for a specific key (or any key).
 * Returns an unsubscribe function. Listens to both same-tab custom events
 * and cross-tab native 'storage' events.
 */
export function subscribeStorage(
  callback: (key: string) => void,
  filterKey?: string,
): () => void {
  if (typeof window === "undefined") return () => {};

  const customHandler = (e: Event) => {
    const detail = (e as CustomEvent<{ key: string }>).detail;
    if (!filterKey || detail.key === filterKey) callback(detail.key);
  };
  const nativeHandler = (e: StorageEvent) => {
    if (!e.key) return;
    if (!filterKey || e.key === filterKey) callback(e.key);
  };

  window.addEventListener("mt:storage-changed", customHandler);
  window.addEventListener("storage", nativeHandler);
  return () => {
    window.removeEventListener("mt:storage-changed", customHandler);
    window.removeEventListener("storage", nativeHandler);
  };
}

export const STORAGE_KEYS = {
  location: "mt:location",
  progress: "mt:progress", // streak, xp, level, history, achievements
  quests: "mt:quests",
  settings: "mt:settings",
} as const;
