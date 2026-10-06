export function PlaygroundPage({
  title,
  description,
  children,
  actions,
  breadcrumb,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[calc(100svh-var(--ds-topbar-height))] w-full max-w-[96rem] min-w-0 flex-col">
      <div className="border-b px-4 py-6 sm:px-6 xl:px-8">
        {breadcrumb ? <div className="mb-4">{breadcrumb}</div> : null}
        <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h1 className="ds-type-page-title">{title}</h1>
            <p className="ds-type-ui mt-2 max-w-[72ch] text-text-supporting">{description}</p>
          </div>
          {actions}
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-8 px-4 py-6 sm:px-6 xl:px-8">{children}</div>
    </div>
  );
}

export function ExampleSection({
  title,
  description,
  children,
  id,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="flex min-w-0 scroll-mt-24 flex-col gap-3">
      <div>
        <h2 className="ds-type-section-title">{title}</h2>
        {description ? <p className="ds-type-ui mt-1 text-text-supporting">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
