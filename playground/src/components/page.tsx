export function PlaygroundPage({
  title,
  description,
  children,
  actions
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen min-w-0 flex-col">
      <div className="border-b px-6 py-5">
        <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h1 className="ds-type-page-title">{title}</h1>
            <p className="ds-type-ui mt-1 max-w-3xl text-muted-foreground">{description}</p>
          </div>
          {actions}
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-6 p-6">{children}</div>
    </div>
  );
}

export function ExampleSection({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-w-0 flex-col gap-3">
      <div>
        <h2 className="ds-type-section-title">{title}</h2>
        {description ? <p className="ds-type-ui mt-1 text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
