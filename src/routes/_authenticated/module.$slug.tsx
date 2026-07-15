import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard-shell";
import { MODULE_MAP } from "@/lib/modules";
import { ArrowLeft, Check, Sparkles, Wrench } from "lucide-react";

export const Route = createFileRoute("/_authenticated/module/$slug")({
  loader: ({ params }) => {
    const mod = MODULE_MAP[params.slug];
    if (!mod) throw notFound();
    return { mod };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.mod.title} · Insaf Trading` : "Module · Insaf Trading" }],
  }),
  notFoundComponent: NotFoundModule,
  errorComponent: ErrorModule,
  component: ModulePage,
});

function ModulePage() {
  const { mod } = Route.useLoaderData();
  const Icon = mod.icon;

  return (
    <DashboardShell
      title={mod.title}
      crumb={<>Insaf Trading Company › {mod.section} › <span className="text-foreground font-semibold">{mod.title}</span></>}
    >
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl glass-card p-6 md:p-8">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-40" style={{ background: mod.grad }} />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-25" style={{ background: "var(--gradient-accent)" }} />
        <div className="relative flex flex-col md:flex-row md:items-end gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold px-3 py-1 rounded-full border border-border bg-card/60 mb-4">
              <Sparkles size={12} /> {mod.section.toUpperCase()}
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center justify-center rounded-2xl text-white shadow-[0_8px_24px_-6px_oklch(0_0_0/0.5)] h-14 w-14" style={{ background: mod.grad }}>
                <Icon size={28} />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">{mod.title}</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl">{mod.description}</p>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border border-warning/40 bg-warning/10 text-warning">
            <Wrench size={14} /> Module in preview
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section>
        <h3 className="text-sm font-bold tracking-wider text-muted-foreground uppercase mb-4">What this module will do</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mod.features.map((f: string, i: number) => (
            <div key={f} className="glass-card hover-lift p-5 flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl grid place-items-center shrink-0" style={{ background: mod.grad }}>
                <Check size={16} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] tracking-widest uppercase text-muted-foreground">Feature 0{i + 1}</p>
                <p className="text-sm font-semibold mt-0.5">{f}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Placeholder empty state */}
      <section className="glass-card p-8 text-center">
        <div className="mx-auto h-14 w-14 rounded-2xl grid place-items-center mb-4" style={{ background: mod.grad }}>
          <Icon size={28} className="text-white" />
        </div>
        <h4 className="text-lg font-bold">No {mod.title.toLowerCase()} records yet</h4>
        <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
          This module is scaffolded and ready. Data models and forms will plug in here as the workflow is enabled.
        </p>
        <div className="flex items-center justify-center gap-3 mt-5">
          <Link to="/dashboard" className="text-xs font-semibold px-4 py-2 rounded-xl border border-border hover:bg-card/60 transition inline-flex items-center gap-2">
            <ArrowLeft size={14} /> Back to dashboard
          </Link>
          <button disabled className="text-xs font-semibold px-4 py-2 rounded-xl text-white opacity-60 cursor-not-allowed" style={{ background: mod.grad }}>
            Coming soon
          </button>
        </div>
      </section>
    </DashboardShell>
  );
}

function NotFoundModule() {
  const { slug } = Route.useParams();
  return (
    <DashboardShell title="Module not found" crumb={<>Modules › {slug}</>}>
      <section className="glass-card p-10 text-center">
        <h3 className="text-xl font-bold">Module not found</h3>
        <p className="text-sm text-muted-foreground mt-2">The module "{slug}" isn't registered.</p>
        <Link to="/dashboard" className="inline-flex items-center gap-2 mt-4 text-xs font-semibold px-4 py-2 rounded-xl border border-border hover:bg-card/60">
          <ArrowLeft size={14} /> Back to dashboard
        </Link>
      </section>
    </DashboardShell>
  );
}

function ErrorModule({ reset }: { reset: () => void }) {
  const router = useRouter();
  return (
    <DashboardShell title="Something went wrong" crumb={<>Modules</>}>
      <section className="glass-card p-10 text-center">
        <h3 className="text-xl font-bold">Something went wrong</h3>
        <button
          className="mt-4 text-xs font-semibold px-4 py-2 rounded-xl border border-border hover:bg-card/60"
          onClick={() => { router.invalidate(); reset(); }}
        >Retry</button>
      </section>
    </DashboardShell>
  );
}
