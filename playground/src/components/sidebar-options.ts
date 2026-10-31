"use client";

import { useSyncExternalStore } from "react";

/*
 * Sidebar props for the playground shell. The Moods page changes them to
 * preview each combination, and resets them when it unmounts.
 */
export type SidebarOptions = {
  variant: "auto" | "light" | "dark" | "brand";
  activeStyle: "auto" | "tint" | "solid";
  layout: "auto" | "flush" | "floating";
};

export const defaultSidebarOptions: SidebarOptions = { variant: "auto", activeStyle: "auto", layout: "auto" };

let options = defaultSidebarOptions;
const listeners = new Set<() => void>();

export function setSidebarOptions(next: Partial<SidebarOptions>) {
  options = { ...options, ...next };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSidebarOptions() {
  return useSyncExternalStore(subscribe, () => options, () => defaultSidebarOptions);
}
