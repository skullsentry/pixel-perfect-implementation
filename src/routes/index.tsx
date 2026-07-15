import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Sparkles, ArrowRight, ChevronDown, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getLandingSections, type LandingSection } from "@/lib/landing.functions";

const landingQO = queryOptions({ queryKey: ["landing"], queryFn: () => getLandingSections() });

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(landingQO),
  head: () => ({
    meta: [
      { title: "Mizan — Cloud ERP for businesses that run on stock" },
      { name: "description", content: "Inventory, invoicing, purchases, ledgers, payroll and reports in one secure cloud workspace." },
      { property: "og:title", content: "Mizan — Cloud ERP" },
      { property: "og:description", content: "The calm, powerful ERP for traders and distributors." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

type Json = LandingSection["data"];
function pick<T = unknown>(sections: LandingSection[], key: string): T | null {
  const s = sections.find((x) => x.key === key);
  return (s?.data as T) ?? null;
}
function asObj(v: Json | null): Record<string, Json> {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, Json>) : {};
}
function asArr(v: Json | undefined): Array<Record<string, Json>> {
  return Array.isArray(v) ? (v as Array<Record<string, Json>>) : [];
}
function s(v: Json | undefined, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function useSession() {
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setAuthed(!!session));
    return () => sub.subscription.unsubscribe();
  }, []);
  return authed;
}

function Landing() {
  const { data: sections } = useSuspenseQuery(landingQO);
  const authed = useSession();

  const hero = asObj(pick(sections, "hero"));
  const stats = asArr(asObj(pick(sections, "stats")).items);
  const features = asArr(asObj(pick(sections, "features")).items);
  const testimonials = asArr(asObj(pick(sections, "testimonials")).items);
  const faq = asArr(asObj(pick(sections, "faq")).items);
  const cta = asObj(pick(sections, "cta"));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center h-16 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl grid place-items-center text-primary-foreground shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-primary)" }}>
              <Sparkles size={16} />
            </div>
            <span className="font-bold text-lg">Mizan</span>
          </Link>
          <nav className="ml-auto flex items-center gap-2">
            {authed ? (
              <Link to="/dashboard" className="h-9 px-4 rounded-xl text-primary-foreground text-sm font-semibold shadow-[var(--shadow-glow)] flex items-center gap-1.5"
                style={{ background: "var(--gradient-primary)" }}>
                Open dashboard <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <Link to="/auth" className="h-9 px-3 rounded-xl text-sm font-medium hover:bg-muted/40 flex items-center">Sign in</Link>
                <Link to="/auth" className="h-9 px-4 rounded-xl text-primary-foreground text-sm font-semibold shadow-[var(--shadow-glow)] flex items-center gap-1.5"
                  style={{ background: "var(--gradient-primary)" }}>
                  Get started <ArrowRight size={14} />
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full blur-3xl opacity-30" style={{ background: "var(--gradient-primary)" }} />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full blur-3xl opacity-20" style={{ background: "var(--gradient-accent)" }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          {hero.eyebrow && (
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary-glow bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
              {s(hero.eyebrow)}
            </span>
          )}
          <h1 className="mt-6 text-4xl sm:text-6xl font-bold leading-tight max-w-4xl mx-auto">{s(hero.title, "Run your business.")}</h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">{s(hero.subtitle)}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to={authed ? "/dashboard" : "/auth"} className="h-12 px-6 rounded-2xl text-primary-foreground text-sm font-semibold shadow-[var(--shadow-glow)] flex items-center gap-2"
              style={{ background: "var(--gradient-primary)" }}>
              {s(hero.cta_primary, "Get started")} <ArrowRight size={16} />
            </Link>
            {hero.cta_secondary && (
              <a href="#features" className="h-12 px-6 rounded-2xl border border-border bg-card/60 text-sm font-semibold flex items-center gap-2">
                {s(hero.cta_secondary)}
              </a>
            )}
          </div>
        </div>
      </section>

      {stats.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((it, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 text-center">
                <p className="text-2xl sm:text-3xl font-bold">{s(it.value)}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{s(it.label)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {features.length > 0 && (
        <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-center">Everything your business needs.</h2>
          <p className="text-center text-muted-foreground mt-3 max-w-2xl mx-auto">One workspace for the moving parts of a growing trading business.</p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div key={i} className="glass-card rounded-2xl p-6">
                <div className="h-10 w-10 rounded-xl grid place-items-center text-primary-foreground shadow-[var(--shadow-glow)] mb-4" style={{ background: "var(--gradient-primary)" }}>
                  <Check size={18} />
                </div>
                <h3 className="font-bold text-lg">{s(f.title)}</h3>
                <p className="text-sm text-muted-foreground mt-2">{s(f.desc)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-center">Trusted by growing teams.</h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <blockquote key={i} className="glass-card rounded-2xl p-6">
                <p className="text-base leading-relaxed">"{s(t.quote)}"</p>
                <footer className="mt-4 text-sm">
                  <div className="font-semibold">{s(t.name)}</div>
                  <div className="text-muted-foreground text-xs">{s(t.company)}</div>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {faq.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-center">Frequently asked.</h2>
          <div className="mt-8 space-y-2">
            {faq.map((it, i) => (
              <details key={i} className="glass-card rounded-2xl p-5 group">
                <summary className="flex items-center justify-between cursor-pointer font-semibold">
                  {s(it.q)}
                  <ChevronDown size={16} className="transition group-open:rotate-180" />
                </summary>
                <p className="text-sm text-muted-foreground mt-3">{s(it.a)}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl glass-card p-10 text-center">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl opacity-30" style={{ background: "var(--gradient-primary)" }} />
          <h2 className="relative text-3xl sm:text-4xl font-bold">{s(cta.title, "Ready to get started?")}</h2>
          <p className="relative mt-3 text-muted-foreground">{s(cta.subtitle)}</p>
          <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to={authed ? "/dashboard" : "/auth"} className="h-12 px-6 rounded-2xl text-primary-foreground text-sm font-semibold shadow-[var(--shadow-glow)] flex items-center gap-2"
              style={{ background: "var(--gradient-primary)" }}>
              {s(cta.cta_primary, "Get started")} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Mizan · Cloud ERP for stock-based businesses
      </footer>
    </div>
  );
}
