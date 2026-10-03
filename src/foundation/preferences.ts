export type ConsciaAppearance = "light" | "dark" | "system";
export type ConsciaDensity = "compact" | "comfortable" | "operational";

export const appearanceOptions: ConsciaAppearance[] = ["light", "dark", "system"];
export const densityOptions: ConsciaDensity[] = ["comfortable", "compact", "operational"];
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
