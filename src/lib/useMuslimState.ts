"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  EMPTY_PROGRESS,
  loadProgress,
  markSaveEventsSeen,
  saveProgress,
  unseenSaveEvents,
  type Progress,
} from "./progress";
import {
  loadQuests,
  saveQuests,
  type QuestStore,
} from "./quests";
import { newlyUnlocked } from "./achievements";
import { unlockAchievements } from "./progress";
import { STORAGE_KEYS, subscribeStorage } from "./storage";

/**
 * Single hook owning the persisted Muslim state (progress + quests).
 * - SSR-safe (returns empty state until hydrated)
 * - Listens for storage changes (cross-component AND cross-tab sync)
 * - Returns dispatchers that mutate + persist + auto-unlock achievements
 *
 * Achievement unlocks are re-evaluated after every mutation; newly unlocked
 * IDs are appended to progress.unlockedAchievements and surfaced via the
 * `unlockedNow` field — components can show a toast or notification.
 *
 * Streak save events (lives consumed to cover missed days) are surfaced
 * via `pendingSaves` — all unseen save dates. Components can pop stacked
 * toasts and call acknowledgeSave() to persist all as seen.
 */
export type MuslimState = {
  hydrated: boolean;
  progress: Progress;
  quests: QuestStore;
  /** IDs unlocked since last `clearUnlockedNow()` call. */
  unlockedNow: string[];
  /** All unseen save event dates (YYYY-MM-DD). */
  pendingSaves: string[];
  setProgress: (mutator: (p: Progress) => Progress) => void;
  setQuests: (mutator: (q: QuestStore) => QuestStore) => void;
  clearUnlockedNow: () => void;
  acknowledgeSave: () => void;
};

export function useMuslimState(): MuslimState {
  const [progress, setProgressState] = useState<Progress>(EMPTY_PROGRESS);
  const [quests, setQuestsState] = useState<QuestStore>({
    daily: {},
    weekly: {},
    completionHistory: {},
  });
  const [unlockedNow, setUnlockedNow] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Refs to current values so subscribers don't capture stale state.
  const progressRef = useRef(progress);
  const questsRef = useRef(quests);
  progressRef.current = progress;
  questsRef.current = quests;

  // Hydrate once + subscribe to storage events.
  useEffect(() => {
    const refresh = () => {
      setProgressState(loadProgress());
      setQuestsState(loadQuests());
    };
    refresh();
    setHydrated(true);

    const unsub = subscribeStorage((key) => {
      if (key === STORAGE_KEYS.progress || key === STORAGE_KEYS.quests) {
        refresh();
      }
    });
    return unsub;
  }, []);

  /** Run after any mutation: detect newly-unlocked achievements & persist. */
  const finalizeProgress = useCallback(
    (next: Progress, q: QuestStore): Progress => {
      const fresh = newlyUnlocked(next, q);
      let final = next;
      if (fresh.length > 0) {
        final = unlockAchievements(next, fresh);
        setUnlockedNow((prev) => Array.from(new Set([...prev, ...fresh])));
      }
      saveProgress(final);
      return final;
    },
    [],
  );

  const setProgress = useCallback(
    (mutator: (p: Progress) => Progress) => {
      const current = progressRef.current;
      const next = mutator(current);
      const final = finalizeProgress(next, questsRef.current);
      setProgressState(final);
    },
    [finalizeProgress],
  );

  const setQuests = useCallback(
    (mutator: (q: QuestStore) => QuestStore) => {
      const current = questsRef.current;
      const next = mutator(current);
      saveQuests(next);
      setQuestsState(next);

      // Quest changes can unlock achievements that depend on quest state.
      const fresh = newlyUnlocked(progressRef.current, next);
      if (fresh.length > 0) {
        const final = unlockAchievements(progressRef.current, fresh);
        saveProgress(final);
        setProgressState(final);
        setUnlockedNow((prev) => Array.from(new Set([...prev, ...fresh])));
      }
    },
    [],
  );

  const clearUnlockedNow = useCallback(() => setUnlockedNow([]), []);

  /** Mark the most-recent unseen save event as seen (and persist). */
  const acknowledgeSave = useCallback(() => {
    const unseen = unseenSaveEvents(progressRef.current);
    if (unseen.length === 0) return;
    const updated = markSaveEventsSeen(progressRef.current, unseen);
    saveProgress(updated);
    setProgressState(updated);
  }, []);

  // The pending saves = all unseen save dates.
  const pendingSaves = unseenSaveEvents(progress);

  return {
    hydrated,
    progress,
    quests,
    unlockedNow,
    pendingSaves,
    setProgress,
    setQuests,
    clearUnlockedNow,
    acknowledgeSave,
  };
}
