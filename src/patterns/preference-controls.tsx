"use client";

import * as React from "react";

import {
  appearanceOptions,
  applyConsciaPreferences,
  densityOptions,
  type ConsciaAppearance,
  type ConsciaDensity,
} from "../foundation/preferences";
import { cn } from "../primitives/utils";

const APPEARANCE_KEY = "conscia-appearance:v1";
const DENSITY_KEY = "conscia-density:v1";
const PREFERENCE_EVENT = "conscia-preferences";
const volatilePreferences = new Map<string, string>();

function readPreference<T extends string>(
  key: string,
  fallback: T,
  allowedValues: readonly T[],
): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value =
      window.localStorage.getItem(key) ?? volatilePreferences.get(key);

    return value && allowedValues.includes(value as T)
      ? (value as T)
      : fallback;
  } catch {
    const value = volatilePreferences.get(key);

    return value && allowedValues.includes(value as T)
      ? (value as T)
      : fallback;
  }
}

function writePreference(key: string, value: string) {
  volatilePreferences.set(key, value);

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Preferences still apply for this session when storage is unavailable.
  }

  window.dispatchEvent(new Event(PREFERENCE_EVENT));
}

function useStoredPreference<T extends string>(
  key: string,
  fallback: T,
  allowedValues: readonly T[],
): T {
  return React.useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange);
      window.addEventListener(PREFERENCE_EVENT, onStoreChange);
      return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener(PREFERENCE_EVENT, onStoreChange);
      };
    },
    () => readPreference(key, fallback, allowedValues),
    () => fallback,
  );
}

function useConsciaPreferences() {
  const appearance = useStoredPreference<ConsciaAppearance>(
    APPEARANCE_KEY,
    "system",
    appearanceOptions,
  );
  const density = useStoredPreference<ConsciaDensity>(
    DENSITY_KEY,
    "comfortable",
    densityOptions,
  );

  return { appearance, density };
}

function DesignSystemPreferenceSync() {
  const { appearance, density } = useConsciaPreferences();

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () =>
      applyConsciaPreferences(
        document.documentElement,
        appearance,
        density,
        media.matches,
      );

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [appearance, density]);

  return null;
}

function AppearanceControl({ className }: { className?: string }) {
  const { appearance } = useConsciaPreferences();

  return (
    <SegmentedControl
      className={className}
      label="Appearance"
      value={appearance}
      values={appearanceOptions}
      onChange={(value) => writePreference(APPEARANCE_KEY, value)}
    />
  );
}

function DensityControl({ className }: { className?: string }) {
  const { density } = useConsciaPreferences();

  return (
    <SegmentedControl
      className={className}
      label="Density"
      value={density}
      values={densityOptions}
      onChange={(value) => writePreference(DENSITY_KEY, value)}
    />
  );
}

function DesignPreferenceControls({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3 text-sm", className)}>
      <AppearanceControl />
      <DensityControl />
    </div>
  );
}

function SegmentedControl({
  className,
  label,
  value,
  values,
  onChange,
}: {
  className?: string;
  label: string;
  value: string;
  values: string[];
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className={cn("flex flex-col gap-2", className)}>
      <legend className="text-[var(--ds-metadata)] font-medium text-text-supporting">
        {label}
      </legend>
      <div className="grid w-full grid-cols-3 rounded-[var(--ds-radius-control)] bg-surface-muted p-1">
        {values.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={value === item}
            suppressHydrationWarning
            onClick={() => onChange(item)}
            className="min-w-0 h-7 rounded-[calc(var(--ds-radius-control)-2px)] px-1.5 text-[var(--ds-metadata)] font-medium capitalize text-text-supporting outline-none transition-colors hover:text-text-primary focus-visible:ring-[3px] focus-visible:ring-focus/50 aria-pressed:bg-canvas aria-pressed:text-text-primary aria-pressed:shadow-xs"
          >
            {item}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export {
  AppearanceControl,
  DensityControl,
  DesignPreferenceControls,
  DesignSystemPreferenceSync,
  useConsciaPreferences,
};
