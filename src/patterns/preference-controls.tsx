"use client";

import * as React from "react";

import {
  appearanceOptions,
  applyConsciaPreferences,
  densityOptions,
  appearanceStorageKey,
  densityStorageKey,
  getConsciaPreferenceBootstrapScript,
  type ConsciaAppearance,
  type ConsciaDensity,
} from "../foundation/preferences";
import { SegmentedControl, SegmentedControlItem } from "../primitives/segmented-control";
import { cn } from "../primitives/utils";

const APPEARANCE_KEY = appearanceStorageKey;
const DENSITY_KEY = densityStorageKey;
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
    const legacyKey = key.endsWith(":v1") ? key.slice(0, -3) : key;
    const value =
      window.localStorage.getItem(key) ??
      window.localStorage.getItem(legacyKey) ??
      volatilePreferences.get(key);

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

function DesignSystemPreferenceScript({ nonce }: { nonce?: string }) {
  return (
    <script
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: getConsciaPreferenceBootstrapScript() }}
    />
  );
}

function AppearanceControl({ className }: { className?: string }) {
  const { appearance } = useConsciaPreferences();

  return (
    <PreferenceSegments
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
    <PreferenceSegments
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

function PreferenceSegments({
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
      <legend className="text-[length:var(--ds-metadata)] font-medium text-text-supporting">
        {label}
      </legend>
      <SegmentedControl
        aria-label={label}
        size="sm"
        value={value}
        onValueChange={onChange}
        className="grid w-full"
        style={{ gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))` }}
      >
        {values.map((item) => (
          // The stored preference is only known in the browser, so the pressed state can differ from the server's.
          <SegmentedControlItem key={item} value={item} suppressHydrationWarning className="px-1.5 text-[length:var(--ds-metadata)] capitalize">
            {item}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
    </fieldset>
  );
}

export {
  AppearanceControl,
  DensityControl,
  DesignPreferenceControls,
  DesignSystemPreferenceScript,
  DesignSystemPreferenceSync,
  useConsciaPreferences,
};
