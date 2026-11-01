"use client";

import { useSyncExternalStore } from "react";
import type { ConsciaMood } from "@conscia-labs/design-system";

import { defaultPlaygroundMood, playgroundMoodStorageKey } from "@/components/playground-mood-script";

export { playgroundMoodLabels, playgroundMoodOptions } from "@/components/playground-mood-script";

const listeners = new Set<() => void>();

function isMood(value: string | null): value is ConsciaMood {
  return value === "airy" || value === "balanced" || value === "current";
}

export function readPlaygroundMood(): ConsciaMood {
  try {
    const stored = localStorage.getItem(playgroundMoodStorageKey);
    if (isMood(stored)) return stored;
  } catch {}
  return defaultPlaygroundMood;
}

/** Puts a mood on the root; pages that preview another mood restore the playground's with this. */
export function applyMood(mood: ConsciaMood) {
  const root = document.documentElement;
  if (mood === "current") delete root.dataset.mood;
  else root.dataset.mood = mood;
}

export function setPlaygroundMood(mood: ConsciaMood) {
  try {
    localStorage.setItem(playgroundMoodStorageKey, mood);
  } catch {}
  applyMood(mood);
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // A change in another tab moves this one too.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== playgroundMoodStorageKey) return;
    applyMood(readPlaygroundMood());
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function usePlaygroundMood() {
  return useSyncExternalStore<ConsciaMood>(subscribe, readPlaygroundMood, () => defaultPlaygroundMood);
}
