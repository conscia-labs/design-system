"use client";

import { NavigationTab, NavigationTabs, NavigationTabsList, Tabs, TabsContent, TabsList, TabsTrigger } from "@conscia-labs/design-system";
import { ExampleSection } from "@/components/page";

export function TabsShowcase() {
  return (
          <ExampleSection title="Tabs">
            <NavigationTabs aria-label="Resource sections">
              <NavigationTabsList>
                <NavigationTab href="#tabs" active>
                  Overview
                </NavigationTab>
                <NavigationTab href="#tabs-configuration">Configuration</NavigationTab>
                <NavigationTab href="#tabs-credentials">Credentials</NavigationTab>
                <NavigationTab href="#tabs-organizations">Organizations</NavigationTab>
                <NavigationTab href="#tabs-models">Models</NavigationTab>
                <NavigationTab href="#tabs-health">Health</NavigationTab>
                <NavigationTab href="#tabs-activity">Activity</NavigationTab>
              </NavigationTabsList>
            </NavigationTabs>
            <p className="pt-3 text-sm text-text-supporting">
              Routed resource navigation exposes the current page and keeps the full tab target interactive.
            </p>
            <div className="space-y-6 py-4">
              {([
                { variant: "underline", title: "Quiet underline", description: "The default. Selection stays clear without a full-width divider." },
                { variant: "divider", title: "Divider", description: "Use the rail when tabs need to separate navigation from the section below." },
                { variant: "pills", title: "Pills", description: "A softer option for small groups of peer views without a surrounding track." },
              ] as const).map(({ variant, title, description }) => (
                <div key={variant} className="space-y-2">
                  <h3 className="text-sm font-semibold">{title}</h3>
                  <p className="text-sm text-text-supporting">{description}</p>
                  <Tabs variant={variant} defaultValue="overview">
                    <TabsList aria-label={`${title} example`}>
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="usage">Usage</TabsTrigger>
                      <TabsTrigger value="activity">Activity</TabsTrigger>
                      <TabsTrigger value="settings" disabled>Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="pt-3 text-sm text-text-supporting">Review resource configuration and recent changes.</TabsContent>
                    <TabsContent value="usage" className="pt-3 text-sm text-text-supporting">Compare requests and consumption across resources.</TabsContent>
                    <TabsContent value="activity" className="pt-3 text-sm text-text-supporting">Inspect recent changes and resource events.</TabsContent>
                  </Tabs>
                </div>
              ))}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Compact underline</h3>
                <p className="text-sm text-text-supporting">Use the existing compact size for tabs inside dense sections.</p>
                <Tabs size="compact" defaultValue="details">
                  <TabsList aria-label="Compact underline example">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="pt-3 text-sm text-text-supporting">Resource details.</TabsContent>
                  <TabsContent value="history" className="pt-3 text-sm text-text-supporting">Resource change history.</TabsContent>
                </Tabs>
              </div>
            </div>
            <Tabs variant="segmented" defaultValue="table" className="rounded-[var(--ds-radius-surface)] border bg-surface p-4">
              <TabsList aria-label="Display mode example">
                <TabsTrigger value="table">Table</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="compact">Compact</TabsTrigger>
              </TabsList>
              <TabsContent value="table" className="pt-3 text-sm text-text-supporting">Segmented tabs are reserved for compact mode switching.</TabsContent>
              <TabsContent value="list" className="pt-3 text-sm text-text-supporting">List mode placeholder.</TabsContent>
              <TabsContent value="compact" className="pt-3 text-sm text-text-supporting">Compact mode placeholder.</TabsContent>
            </Tabs>
          </ExampleSection>
  );
}
