export type ConsciaAppearance = "light" | "dark" | "system";
export type ConsciaDensity = "compact" | "comfortable" | "operational";
/**
 * How open a page feels, set with a `data-mood` attribute on the root or a
 * subtree. `current` means no attribute. Unlike appearance and density it is
 * a product decision per surface, not a stored user preference.
 */
export type ConsciaMood = "current" | "balanced" | "airy";

export const appearanceOptions: ConsciaAppearance[] = ["light", "dark", "system"];
export const densityOptions: ConsciaDensity[] = ["comfortable", "compact", "operational"];
export const moodOptions: ConsciaMood[] = ["current", "balanced", "airy"];

/** Props that apply a mood to an element: `<main {...moodProps("airy")}>`. */
export function moodProps(mood: ConsciaMood): { "data-mood"?: "balanced" | "airy" } {
  return mood === "current" ? {} : { "data-mood": mood };
}
export const appearanceStorageKey = "conscia-appearance:v1";
export const densityStorageKey = "conscia-density:v1";

export function applyConsciaPreferences(
  root: HTMLElement,
  appearance: ConsciaAppearance,
  density: ConsciaDensity,
  systemDark = false,
) {
  root.dataset.appearance = appearance;
  root.dataset.density = density;
  root.classList.toggle("dark", appearance === "dark" || (appearance === "system" && systemDark));
}

/**
 * Returns a small, dependency-free bootstrap that applies persisted preferences
 * before the first paint. It is safe to inline in a document head or layout.
 */
export function getConsciaPreferenceBootstrapScript() {
  return `(function(){try{var root=document.documentElement;var appearance=localStorage.getItem("${appearanceStorageKey}")||localStorage.getItem("conscia-appearance")||"system";var density=localStorage.getItem("${densityStorageKey}")||localStorage.getItem("conscia-density")||"comfortable";if(appearance!=="light"&&appearance!=="dark"&&appearance!=="system")appearance="system";if(density!=="compact"&&density!=="comfortable"&&density!=="operational")density="comfortable";var systemDark=window.matchMedia("(prefers-color-scheme: dark)").matches;root.dataset.appearance=appearance;root.dataset.density=density;root.classList.toggle("dark",appearance==="dark"||(appearance==="system"&&systemDark));}catch(_error){}})();`;
}
