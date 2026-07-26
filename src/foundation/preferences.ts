export type ConsciaAppearance = "light" | "dark" | "system";
export type ConsciaDensity = "compact" | "comfortable";

export const appearanceOptions: ConsciaAppearance[] = ["light", "dark", "system"];
export const densityOptions: ConsciaDensity[] = ["comfortable", "compact"];

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
