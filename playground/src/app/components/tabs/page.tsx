import { PlaygroundPage } from "@/components/page";
import { TabsShowcase } from "@/components/tabs-showcase";

export default function TabsPage() {
  return (
    <PlaygroundPage title="Tabs" description="Compare quiet underline, divider, pills, compact tabs, and segmented controls. Select a tab to try each option.">
      <div className="max-w-3xl"><TabsShowcase /></div>
    </PlaygroundPage>
  );
}
