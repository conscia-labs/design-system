import { DesignSystemPreferenceScript } from "@conscia-labs/design-system";

import { playgroundMoodScript } from "@/components/playground-mood-script";

export function ThemeScript() {
  return (
    <>
      <DesignSystemPreferenceScript />
      <script dangerouslySetInnerHTML={{ __html: playgroundMoodScript }} />
    </>
  );
}
