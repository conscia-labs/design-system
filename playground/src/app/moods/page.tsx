"use client";

import { useEffect, useState } from "react";
import { Plus, UserPlus } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Eyebrow,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Input,
  MetricCard,
  MetricTrend,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsList,
  TabsTrigger,
  moodOptions,
  moodProps,
  type ConsciaMood,
} from "@conscia-labs/design-system";

import { ExampleSection, PlaygroundPage } from "@/components/page";
import { defaultSidebarOptions, setSidebarOptions, useSidebarOptions, type SidebarOptions } from "@/components/sidebar-options";

const moodLabels: Record<ConsciaMood, string> = {
  current: "Current",
  balanced: "Balanced",
  airy: "Airy",
};

const moodNotes: Record<ConsciaMood, string> = {
  current: "No attribute. Bordered white cards on a grey canvas, uppercase labels. With the shell options at Auto, the header runs across the top and the sidebar stays flush below it.",
  balanced: "data-mood=\"balanced\". Borderless cards, rounder corners, pill badges, larger titles and light metric values. The sidebar turns burgundy, floats, and runs the full height with the brand at its top; the header turns transparent until you scroll.",
  airy: "data-mood=\"airy\". Everything in Balanced, plus pill buttons, filled fields, taller rows, more space between sections, a white pill for the active sidebar item, and a header that floats as a pill once you scroll.",
};

const experiences = [
  ["Homepage hero", "Web", "Live", "1,204,880", "14 min ago"],
  ["Product detail · apparel", "Web, App", "Live", "842,310", "Yesterday"],
  ["Store finder", "App", "Source slow", "96,442", "2 days ago"],
  ["Black Friday PLP", "Web", "Draft", "—", "3 h ago"],
] as const;

const sidebarControls = [
  { key: "headerLayout", label: "Header", prop: "AppShell headerLayout", options: ["auto", "integrated", "split"] },
  { key: "layout", label: "Layout", prop: "AppShell sidebarLayout", options: ["auto", "flush", "floating"] },
  { key: "variant", label: "Colour", prop: "AppSidebar variant", options: ["auto", "light", "dark", "brand"] },
  { key: "activeStyle", label: "Active item", prop: "AppSidebar activeStyle", options: ["auto", "tint", "solid"] },
] as const satisfies ReadonlyArray<{ key: keyof SidebarOptions; label: string; prop: string; options: readonly string[] }>;

type Tone = "default" | "highlight" | "supporting" | "accent" | "muted";

function tilesFor(mood: ConsciaMood): Tone[] {
  if (mood === "airy") return ["highlight", "supporting", "accent", "muted"];
  if (mood === "balanced") return ["highlight", "default", "default", "default"];
  return ["default", "default", "default", "default"];
}

export default function MoodsPage() {
  const [mood, setMood] = useState<ConsciaMood>("airy");
  const sidebar = useSidebarOptions();
  const tones = tilesFor(mood);

  // The mood goes on the root so the whole shell follows it, sidebar included.
  useEffect(() => {
    const root = document.documentElement;
    if (mood === "current") delete root.dataset.mood;
    else root.dataset.mood = mood;
    return () => {
      delete root.dataset.mood;
    };
  }, [mood]);

  // The sidebar options drive the playground shell's own props.
  useEffect(() => () => setSidebarOptions(defaultSidebarOptions), []);

  return (
    <PlaygroundPage
      title="Moods"
      description="Density sets how much fits on a screen; mood sets how open it feels. Switching mood here sets data-mood on the root, so the whole playground follows it, sidebar included. The sidebar options below set the shell's props. Leaving the page resets both."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Tabs variant="segmented" value={mood} onValueChange={(value) => setMood(value as ConsciaMood)}>
            <TabsList aria-label="Mood">
              {moodOptions.map((option) => (
                <TabsTrigger key={option} value={option}>{moodLabels[option]}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      }
    >
      <p className="ds-type-ui text-text-supporting" aria-live="polite">{moodNotes[mood]}</p>

      <ExampleSection
        title="Shell options"
        description="Each option follows the mood while it is Auto. Set one explicitly and it holds in every mood, so each application can build its own shell. Scroll the page to see the header's scrolled state."
      >
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          {sidebarControls.map((control) => (
            <div key={control.key} className="grid gap-2">
              <span className="ds-type-label">{control.label} <code className="ds-type-metadata text-text-supporting">{control.prop}</code></span>
              <Tabs
                variant="segmented"
                value={sidebar[control.key]}
                onValueChange={(value) => setSidebarOptions({ [control.key]: value } as Partial<SidebarOptions>)}
              >
                <TabsList aria-label={control.label}>
                  {control.options.map((option) => (
                    <TabsTrigger key={option} value={option}>{option[0].toUpperCase() + option.slice(1)}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          ))}
        </div>
      </ExampleSection>

      <div
        {...moodProps(mood)}
        data-testid="mood-preview"
        className="overflow-hidden rounded-[var(--ds-radius-surface)] border bg-canvas"
      >
        <div className="flex flex-col gap-[var(--ds-space-section)] p-[var(--ds-space-page)] max-sm:p-4">
          <div className="ds-supergraphic flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="grid max-w-[56ch] gap-2">
              <Eyebrow category="Production · eu-west" />
              <h2 className="ds-type-page-title">Good morning, Kent</h2>
              <p className="ds-type-body text-text-supporting">Your experiences served 3.1M requests this week. Two connections need a look before Friday&apos;s catalogue drop.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline"><UserPlus />Invite people</Button>
              <Button><Plus />New experience</Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard tone={tones[0]} label="Requests this week" value="3.1" unit="M"
              trend={<MetricTrend direction="up" sentiment="positive" value="12.4%" accessibleLabel="Up 12.4 percent, a positive change" />} />
            <MetricCard tone={tones[1]} label="Cache hit rate" value="94.2" unit="%"
              trend={<MetricTrend direction="up" sentiment="positive" value="1.8 pts" accessibleLabel="Up 1.8 points, a positive change" />} />
            <MetricCard tone={tones[2]} label="p95 response" value="86" unit="ms"
              trend={<MetricTrend direction="down" sentiment="positive" value="9 ms" accessibleLabel="Down 9 milliseconds, a positive change" />} />
            <MetricCard tone={tones[3]} label="Live experiences" value={24} description="3 drafts waiting" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="ds-type-section-title">Experiences</CardTitle>
              <CardDescription>Requests in the last 7 days</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-[var(--ds-surface-padding)]">Name</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Requests</TableHead>
                    <TableHead className="pr-[var(--ds-surface-padding)] text-right">Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {experiences.map(([name, channel, status, requests, updated]) => (
                    <TableRow key={name} interactive>
                      <TableCell className="pl-[var(--ds-surface-padding)] font-medium">{name}</TableCell>
                      <TableCell>{channel}</TableCell>
                      <TableCell>
                        <Badge variant={status === "Live" ? "success" : status === "Draft" ? "neutral" : "warning"}>{status}</Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{requests}</TableCell>
                      <TableCell className="pr-[var(--ds-surface-padding)] text-right">{updated}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="ds-type-section-title">Caching and delivery</CardTitle>
              <CardDescription>Applies to every experience unless it sets its own rule.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="mood-env-name">Environment name</FieldLabel>
                  <Input id="mood-env-name" defaultValue="Production" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="mood-region">Region</FieldLabel>
                  <Select defaultValue="eu-west">
                    <SelectTrigger id="mood-region" className="w-full"><SelectValue placeholder="Region" /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="eu-west">eu-west (Frankfurt)</SelectItem>
                        <SelectItem value="eu-north">eu-north (Stockholm)</SelectItem>
                        <SelectItem value="us-east">us-east (Virginia)</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="mood-ttl">Cache TTL (seconds)</FieldLabel>
                  <Input id="mood-ttl" defaultValue="300" inputMode="numeric" />
                  <FieldDescription>How long a response stays cached at the edge.</FieldDescription>
                </Field>
                <Field className="content-start">
                  <FieldLabel htmlFor="mood-stale">Serve stale content while revalidating</FieldLabel>
                  <Switch id="mood-stale" defaultChecked aria-label="Serve stale content while revalidating" />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
        </div>
      </div>

      <ExampleSection
        title="Choosing a mood"
        description="Balanced works as an app-wide default. Use Airy for overview and home pages, onboarding, empty states, and short settings pages. Keep the current look with operational density for the workbench, logs, and long tables."
      >
        <ul className="ds-type-ui grid list-disc gap-1 pl-5 text-text-supporting">
          <li>A mood sets spacing and type sizes, so it wins over a density preset on the same element.</li>
          <li>Toned metric tiles come from the <code>tone</code> prop, not the mood. Airy pages use one row of them at most.</li>
          <li>Without borders, focus rings and hover fills show what is interactive. Do not remove them.</li>
          <li>Peach is a highlight, never a status. Warnings and failures keep their status colors.</li>
        </ul>
      </ExampleSection>
    </PlaygroundPage>
  );
}
