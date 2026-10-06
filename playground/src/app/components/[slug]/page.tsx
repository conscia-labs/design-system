import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Badge, Button, Card, CardContent, CardHeader, CodeBlock, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@conscia-labs/design-system";

import { ComponentDemo } from "@/components/component-demo";
import { componentDocs, getComponentDoc } from "@/components/component-docs";
import { ExampleSection, PlaygroundPage } from "@/components/page";

export function generateStaticParams() {
  return componentDocs.map((doc) => ({ slug: doc.slug }));
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getComponentDoc(slug);
  if (!doc) notFound();
  const index = componentDocs.indexOf(doc);
  const previous = componentDocs[index - 1];
  const next = componentDocs[index + 1];

  return (
    <PlaygroundPage
      title={doc.family}
      description={doc.description}
      breadcrumb={<Button variant="link" size="sm" className="px-0" render={<Link href="/components" />}><ArrowLeft aria-hidden="true" /> All components</Button>}
      actions={<Badge variant={doc.category === "Compatibility" ? "warning" : doc.category === "Pattern" ? "accent" : "neutral"}>{doc.category}</Badge>}
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="grid min-w-0 gap-6">
          <ExampleSection id="example" title="Example" description="A representative composition rendered with the published package API.">
            <ComponentDemo slug={doc.slug} />
          </ExampleSection>

          <ExampleSection id="options" title="Options" description="The decisions most consumers need to make when adopting this family.">
            <div className="divide-y divide-border-subtle overflow-hidden rounded-[var(--ds-radius-surface)] border bg-surface md:hidden">
              {doc.options.map((option) => (
                <div key={option.name} className="grid gap-2 p-4">
                  <code className="font-medium">{option.name}</code>
                  <div className="ds-type-ui">{option.values}</div>
                  <p className="ds-type-ui text-text-supporting">{option.guidance}</p>
                </div>
              ))}
            </div>
            <div className="hidden overflow-hidden rounded-[var(--ds-radius-surface)] border bg-surface md:block">
              <Table className="table-fixed">
                <TableHeader><TableRow><TableHead className="w-[18%]">Option</TableHead><TableHead className="w-[37%]">Values or anatomy</TableHead><TableHead className="w-[45%]">Guidance</TableHead></TableRow></TableHeader>
                <TableBody>{doc.options.map((option) => <TableRow key={option.name}><TableCell className="break-words font-medium"><code>{option.name}</code></TableCell><TableCell className="whitespace-normal">{option.values}</TableCell><TableCell className="whitespace-normal text-text-supporting">{option.guidance}</TableCell></TableRow>)}</TableBody>
              </Table>
            </div>
          </ExampleSection>

          <ExampleSection id="usage" title="Usage" description="Copy the package import and adapt the composition to product-owned content and state.">
            <CodeBlock snippets={[{ value: "tsx", label: "React", code: doc.importCode }]} />
          </ExampleSection>
        </div>

        <aside className="grid h-fit content-start gap-4 xl:sticky xl:top-[calc(var(--ds-topbar-height)+1.5rem)]">
          <nav aria-label="On this page" className="flex flex-wrap gap-1">
            {["Example", "Options", "Usage"].map((label) => <Button key={label} size="sm" variant="ghost" render={<a href={"#" + label.toLowerCase()} />}>{label}</Button>)}
          </nav>
          <Card className="gap-4">
            <CardHeader><h2 className="ds-type-card-title">When to use</h2></CardHeader>
            <CardContent><p className="ds-type-ui text-text-supporting">{doc.whenToUse}</p></CardContent>
            <CardHeader className="border-t pt-4"><h2 className="ds-type-card-title">Accessibility</h2></CardHeader>
            <CardContent><p className="ds-type-ui text-text-supporting">{doc.accessibility}</p></CardContent>
            <CardHeader className="border-t pt-4"><h2 className="ds-type-card-title">Public exports</h2></CardHeader>
            <CardContent className="flex flex-wrap gap-1.5">
              {doc.exports.map((name) => <code key={name} className="break-all rounded bg-surface-muted px-1.5 py-1 text-xs text-text-secondary">{name}</code>)}
            </CardContent>
          </Card>
        </aside>
      </div>
      <nav aria-label="Component browsing" className="flex flex-wrap items-center justify-between gap-3 border-t pt-5">
        {previous ? <Button variant="outline" render={<Link href={previous.route} />}><ArrowLeft aria-hidden="true" /> {previous.family}</Button> : <span />}
        {next ? <Button variant="outline" render={<Link href={next.route} />}>{next.family} <ArrowRight aria-hidden="true" /></Button> : null}
      </nav>
    </PlaygroundPage>
  );
}
