import { CalendarDays, GitBranch, Users } from "lucide-react";
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
  MetricCard,
  MetricTrend,
} from "@conscia-labs/design-system";

import { PlaygroundPage } from "@/components/page";

const deployments = [
  ["checkout-api", "a3f9b21", "4m 12s", "Healthy"],
  ["search", "7c1d004", "6m 03s", "Healthy"],
  ["workers", "e81f5aa", "3m 41s", "Failed"],
  ["events", "19b7c3d", "5m 20s", "Healthy"],
] as const;

export default function DeliveryMetricsPage() {
  return (
    <PlaygroundPage
      title="Delivery metrics"
      description="A chart-library-agnostic operational dashboard composed from shared metric, panel, attention, and activity patterns."
      actions={
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm"><CalendarDays />May 19 – Aug 17</Button>
          <Button variant="outline" size="sm"><Users />All teams</Button>
        </div>
      }
    >
      <div className="grid gap-3 xl:grid-cols-4">
        <MetricCard
          className="xl:col-span-3 xl:row-span-3"
          emphasis="primary"
          label="Deployment frequency"
          description="Deploys reaching production, per week"
          value="4.4"
          unit="/ week"
          status={<Badge variant="information">Healthy</Badge>}
          trend={<MetricTrend direction="up" sentiment="positive" value="43%" accessibleLabel="Up 43 percent, a positive change" />}
          visualization={<TrendChart tone="primary" />}
          visualizationSummary="Deployment frequency trends upward across the period with one short regression near the beginning of July."
        />
        <MetricCard
          label="Lead time for changes"
          description="First commit to production"
          value="18.6"
          unit="hrs"
          status={<Badge variant="success">High</Badge>}
          trend={<MetricTrend direction="down" sentiment="positive" value="22%" accessibleLabel="Down 22 percent, a positive change" />}
          visualization={<TrendChart tone="success" compact />}
          visualizationSummary="Lead time is lower at the end of the period than at the beginning."
        />
        <MetricCard
          label="Change failure rate"
          description="Deploys that required a fix"
          value="8.3"
          unit="%"
          status={<Badge variant="success">High</Badge>}
          trend={<MetricTrend direction="down" sentiment="positive" value="24%" accessibleLabel="Down 24 percent, a positive change" />}
          visualization={<TrendChart tone="success" compact />}
          visualizationSummary="Change failure rate declines steadily after a short increase."
        />
        <MetricCard
          label="Mean time to recovery"
          description="Failure to restored service"
          value="39"
          unit="min"
          status={<Badge variant="information">Elite</Badge>}
          trend={<MetricTrend direction="down" sentiment="positive" value="33%" accessibleLabel="Down 33 percent, a positive change" />}
          visualization={<TrendChart tone="primary" compact />}
          visualizationSummary="Recovery time trends downward through the measured period."
        />
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(24rem,1fr)]">
        <DataPanel>
          <DataPanelHeader title="What needs attention" actions={<Button variant="ghost" size="sm">View all</Button>} />
          <DataPanelContent padded>
            <AttentionList>
              <AttentionItem tone="danger" title="Job success rate below SLO" description="99.2% against a 99.5% target · workers" metadata="Open for 3 days" />
              <AttentionItem tone="warning" title="Mean time to recovery up 54%" description="Mean 91 min against 59 min · All teams" metadata="Jun 15 – Jun 27" />
              <AttentionItem tone="warning" title="Deployment frequency down 44%" description="Mean 2.2 per week against 3.9 per week" metadata="Jun 15 – Jun 27" />
            </AttentionList>
          </DataPanelContent>
          <DataPanelFooter>Persistent findings are list content, not live alerts.</DataPanelFooter>
        </DataPanel>

        <DataPanel>
          <DataPanelHeader title="Latest deployments" actions={<Button variant="ghost" size="sm"><GitBranch />Pipeline</Button>} />
          <DataPanelContent className="px-[var(--ds-surface-padding)]">
            <ActivityList>
              {deployments.map(([service, commit, duration, state], index) => (
                <ActivityItem
                  key={commit}
                  layout="compact"
                  leading={<><span className={`mt-1 block size-2 rounded-full ${state === "Failed" ? "bg-danger" : "bg-success"}`} aria-hidden="true" /><span className="sr-only">{state}</span></>}
                  title={service}
                  description={index === 0 ? "r.chen · 12m ago" : `${index + 1}h ago`}
                  trailing={
                    <div className="grid grid-cols-[5rem_4rem] gap-3 text-right ds-type-metadata">
                      <span className="font-mono text-text-link">{commit}</span>
                      <span className="text-text-supporting">{duration}</span>
                    </div>
                  }
                />
              ))}
            </ActivityList>
          </DataPanelContent>
        </DataPanel>
      </div>
    </PlaygroundPage>
  );
}

function TrendChart({ tone, compact = false }: { tone: "primary" | "success"; compact?: boolean }) {
  const stroke = tone === "success" ? "var(--chart-series-3)" : "var(--chart-series-1)";
  const path = compact
    ? "M0 34 L12 28 L23 31 L34 18 L46 21 L58 13 L70 24 L82 19 L94 30 L106 25 L118 36 L130 29 L142 38 L154 34 L166 43 L178 39 L190 45 L202 42 L214 48 L226 44 L240 50"
    : "M0 92 L16 72 L30 102 L47 61 L63 110 L80 69 L97 84 L114 43 L132 132 L149 111 L166 85 L183 122 L201 59 L218 72 L235 49 L252 83 L270 55 L287 64 L304 34 L321 89 L338 52 L355 29 L372 47 L389 22 L406 60 L423 35 L440 42 L457 18 L474 38 L491 27 L508 14 L525 40 L542 24 L560 51";
  return (
    <svg aria-hidden="true" viewBox={compact ? "0 0 240 56" : "0 0 560 150"} preserveAspectRatio="none" className={compact ? "h-20 w-full" : "h-full min-h-44 w-full"}>
      <path d={`${path} L${compact ? "240 56" : "560 150"} L0 ${compact ? "56" : "150"} Z`} fill={stroke} fillOpacity="0.1" />
      <path d={path} fill="none" stroke={stroke} strokeWidth={compact ? 2 : 2.5} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
