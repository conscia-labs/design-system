import type { ConsciaMood } from "@conscia-labs/design-system";

/*
 * The playground's mood. Airy by default; Operational ("current" in the
 * package) is the bordered look with no data-mood. It is stored per browser
 * and applied before paint by ThemeScript, so the shell never flashes.
 */
export const playgroundMoodStorageKey = "conscia-playground-mood:v1";
export const defaultPlaygroundMood: ConsciaMood = "airy";

/** Header and Moods page order: the default first, the old look last. */
export const playgroundMoodOptions = ["airy", "balanced", "current"] as const satisfies readonly ConsciaMood[];

export const playgroundMoodLabels: Record<ConsciaMood, string> = {
  airy: "Airy",
  balanced: "Balanced",
  current: "Operational",
};

export const playgroundMoodScript = `(function(){var root=document.documentElement;var mood="${defaultPlaygroundMood}";try{var stored=localStorage.getItem("${playgroundMoodStorageKey}");if(stored==="airy"||stored==="balanced"||stored==="current")mood=stored;}catch(_error){}if(mood==="current")root.removeAttribute("data-mood");else root.setAttribute("data-mood",mood);})();`;
