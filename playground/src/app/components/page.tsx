import { ComponentCatalog } from "@/components/component-catalog";
import { PlaygroundPage } from "@/components/page";

export default function ComponentsPage() {
  return (
    <PlaygroundPage
      title="Components"
      description="Every public component family, with focused examples, options, accessibility guidance, and package imports."
    >
      <ComponentCatalog />
    </PlaygroundPage>
  );
}
