import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  ActivityItem,
  ActivityList,
  AttentionItem,
  AttentionList,
  Badge,
  Button,
  DataPanel,
  DataPanelContent,
  DataPanelFooter,
  DataPanelHeader,
  MetricBand,
  MetricBandItem,
  StateView,
} from "@conscia-labs/design-system";

import { ExampleSection, PlaygroundPage } from "@/components/page";

const requests = [
  {
    id: "req_illustrative_01",
    model: "Claude 3.7 Sonnet · eu.anthropic.claude-3-7-sonnet-20250219-v1:0",
    time: "4 minutes ago",
    dateTime: "2026-10-06T09:12:00Z",
    detail: "1,284 tokens",
    outcome: "Provider failure · retry unavailable",
  },
  {
    id: "req_illustrative_02",
    model: "gpt-4.1",
    time: "18 minutes ago",
    dateTime: "2026-10-06T08:58:00Z",
    detail: "2,016 tokens",
    outcome: "Access denied",
  },
  {
    id: "req_illustrative_03",
    model: "Gemini 2.5 Pro · gemini-2.5-pro-preview-05-06",
    time: "36 minutes ago",
    dateTime: "2026-10-06T08:40:00Z",
    detail: undefined,
    outcome: "Completed",
  },
];

export default function DeveloperOverviewPage() {
  return (
    <PlaygroundPage
      title="Developer overview example"
      description="An illustrative composition using the quiet sidebar, compact metrics, existing attention patterns, and linked request activity. All values and destinations are examples owned by the consuming application."
    >
      <div className="grid max-w-6xl gap-6">
        <header className="flex flex-col gap-3 border-b border-border-subtle pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="ds-type-section-title">Workspace overview</h2>
            <p className="ds-type-ui mt-1 text-text-supporting">Usage, configuration attention, and recent API activity.</p>
          </div>
          <Button size="sm" className="self-start sm:self-auto">Manage API keys</Button>
        </header>

        <AttentionList aria-label="Illustrative attention items">
          <AttentionItem
            tone="warning"
            severityLabel="Example attention"
            title="An API key is approaching its expiration date"
            description="Illustrative: one key expires in 14 days."
            action={<Button variant="outline" size="sm">Review key</Button>}
          />
        </AttentionList>

        <ExampleSection
          title="Usage at a glance"
          description="Compact metrics remain in full-width rows below desktop and form the configured horizontal strip at desktop widths."
        >
          <MetricBand columns={3} presentation="compact" className="border-t border-border-subtle">
            <MetricBandItem
              label="Available AI models"
              value={
                <Link
                  href="/reference-patterns"
                  className="rounded-sm text-text-link underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  6
                </Link>
              }
              detail="Explore models"
            />
            <MetricBandItem
              label="Monthly spend"
              value="Less than $0.01"
              detail="Of an illustrative $100.00 allowance"
            />
            <MetricBandItem
              label="Requests this month"
              value="14"
              detail="Example workspace total"
            />
          </MetricBand>
        </ExampleSection>

        <DataPanel>
          <DataPanelHeader
            title="Recent requests"
            description="Open a request directly in the consuming application’s diagnostics route."
            status={<Badge variant="neutral">Illustrative</Badge>}
          />
          <DataPanelContent className="px-4">
            <ActivityList aria-label="Illustrative recent requests">
              {requests.map((request) => (
                <ActivityItem
                  key={request.id}
                  layout="compact"
                  title={
                    <Link
                      href={`/requests/${request.id}`}
                      aria-label={`Open diagnostics for ${request.model}`}
                      className="group inline-flex min-w-0 max-w-full items-start gap-1 rounded-sm text-text-primary outline-none hover:text-text-link focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                    >
                      <span className="min-w-0 break-words">{request.model}</span>
                      <ArrowUpRight aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-text-supporting group-hover:text-text-link" />
                    </Link>
                  }
                  description={request.detail}
                  metadata={<time dateTime={request.dateTime}>{request.time}</time>}
                  status={
                    <Badge variant="neutral" className="max-w-32 whitespace-normal break-words leading-4">
                      {request.outcome}
                    </Badge>
                  }
                />
              ))}
            </ActivityList>
          </DataPanelContent>
          <DataPanelFooter>
            Outcome tone and request destinations are application decisions. The links above are illustrative paths.
          </DataPanelFooter>
        </DataPanel>

        <ExampleSection
          title="Loading and unavailable metrics"
          description="Loading retains its value slot; missing values render as an accessible em dash instead of zero."
        >
          <MetricBand columns={2} presentation="compact" className="border-t border-border-subtle">
            <MetricBandItem
              label="Estimated daily provider allowance remaining"
              detail="Loading from the application data source"
              loading
            />
            <MetricBandItem
              label="Latest spend observation"
              value={null}
              detail="No value has been supplied"
            />
          </MetricBand>
        </ExampleSection>

        <ExampleSection title="Empty request history">
          <StateView
            className="min-h-40 border-y border-border-subtle"
            title="No recent requests"
            description="Requests will appear here when the application has activity to show."
          />
        </ExampleSection>

        <aside className="flex flex-col gap-2 border-t border-border-subtle pt-4 sm:flex-row sm:items-center">
          <Badge variant="information" className="self-start">Announcement</Badge>
          <p className="ds-type-ui min-w-0 flex-1 text-text-supporting">
            Illustrative: request diagnostics now include provider timing details.
          </p>
          <Link href="/patterns" className="ds-type-ui inline-flex items-center gap-1 text-text-link hover:underline">
            What’s new <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </Link>
        </aside>
      </div>
    </PlaygroundPage>
  );
}
