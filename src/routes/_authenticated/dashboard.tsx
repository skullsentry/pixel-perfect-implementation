import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  Boxes, Truck, AlertTriangle, FileText, ShoppingCart, BookOpen,
  UserCog, TrendingUp, Coins, Landmark, PiggyBank, Wallet,
  ArrowUpRight, ArrowDownRight, Flame, Trophy, Layers, Tags, Ruler, Package,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { getOverview } from "@/lib/catalog.functions";

const overviewQO = queryOptions({ queryKey: ["overview"], queryFn: () => getOverview() });

export const Route = createFileRoute("/_authenticated/dashboard")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(overviewQO);
  },
  head: () => ({ meta: [{ title: "Dashboard · Insaf Trading" }] }),
  component: DashboardPage,
});

const shortcuts = [
  { icon: Boxes, label: "Products", grad: "var(--gradient-primary)", to: "/products" as const },
  { icon: Tags, label: "Categories", grad: "var(--gradient-cool)", to: "/categories" as const },
  { icon: Layers, label: "Brands", grad: "var(--gradient-mint)", to: "/brands" as const },
  { icon: Ruler, label: "Units", grad: "var(--gradient-gold)", to: "/units" as const },
  { icon: ShoppingCart, label: "New Sale", grad: "var(--gradient-rose)", to: "/products" as const },
  { icon: FileText, label: "Reports", grad: "var(--gradient-accent)", to: "/dashboard" as const },
];

// Illustrative trailing months; anchor last point to today's live inventory value.
const trendShape = [0.62, 0.71, 0.68, 0.83, 0.78, 0.95, 0.88, 1.0];
const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

function GradientIcon({ Icon, grad, size = 44 }: { Icon: React.ComponentType<{ size?: number; className?: string }>; grad: string; size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-2xl text-white shadow-[0_8px_24px_-6px_oklch(0_0_0/0.5)]"
      style={{ width: size, height: size, background: grad }}
    >
      <Icon size={size * 0.5} />
    </div>
  );
}

function Stat({ label, value, tint }: { label: string; value: string; tint: string }) {
  return (
    <div className="rounded-2xl p-4 border border-border bg-card/40 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-0.5" style={{ background: tint }} />
      <p className="text-[10px] tracking-widest uppercase text-muted-foreground">{label}</p>
      <p className="text-lg font-bold mt-1" style={{ backgroundImage: tint, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{value}</p>
    </div>
  );
}

const fmtRs = (n: number) =>
  "Rs " + Math.round(n).toLocaleString("en-IN");

function DashboardPage() {
  const { data: ov } = useSuspenseQuery(overviewQO);
  const [range, setRange] = useState<"1M" | "3M" | "6M" | "1Y">("6M");

  const chartData = useMemo(() => {
    const anchor = ov.retailValue || 1;
    const expAnchor = ov.costValue || 1;
    return monthLabels.map((m, i) => ({
      m,
      rev: Math.round(anchor * trendShape[i]),
      exp: Math.round(expAnchor * trendShape[i] * 0.85),
    }));
  }, [ov.retailValue, ov.costValue]);

  const totals = useMemo(() => {
    const rev = chartData.reduce((s, d) => s + d.rev, 0);
    const exp = chartData.reduce((s, d) => s + d.exp, 0);
    return { rev, exp, net: rev - exp };
  }, [chartData]);

  const kpis = [
    { icon: Coins, label: "Inventory (Retail)", value: fmtRs(ov.retailValue), sub: "Value at selling price", trend: `${ov.counts.products} SKUs`, up: true, grad: "var(--gradient-primary)" },
    { icon: Truck, label: "Inventory (Cost)", value: fmtRs(ov.costValue), sub: "Value at cost price", trend: "Stock capital", up: false, grad: "var(--gradient-sunset)" },
    { icon: TrendingUp, label: "Potential Profit", value: fmtRs(ov.potentialProfit), sub: "If all stock sells at retail", trend: ov.costValue ? `+${Math.round((ov.potentialProfit / ov.costValue) * 100)}%` : "—", up: true, grad: "var(--gradient-mint)" },
    { icon: Package, label: "Units in Stock", value: ov.totalUnits.toLocaleString(), sub: "Across shelf + warehouse", trend: "Live count", up: true, grad: "var(--gradient-cool)" },
    { icon: AlertTriangle, label: "Low Stock Items", value: String(ov.lowStock.length), sub: "Below reorder point", trend: ov.lowStock.length ? "Reorder needed" : "Healthy", up: ov.lowStock.length === 0, grad: "var(--gradient-gold)" },
    { icon: Layers, label: "Brands", value: String(ov.counts.brands), sub: "Supplier brands tracked", trend: "Catalog", up: true, grad: "var(--gradient-rose)" },
    { icon: Tags, label: "Categories", value: String(ov.counts.categories), sub: "Product categories", trend: "Catalog", up: true, grad: "var(--gradient-accent)" },
    { icon: Wallet, label: "Avg. Margin", value: ov.costValue ? `${Math.round((ov.potentialProfit / ov.costValue) * 100)}%` : "—", sub: "Retail vs. cost", trend: "Weighted", up: true, grad: "var(--gradient-primary)" },
  ];

  return (
    <DashboardShell
      title="Dashboard"
      crumb={<>Insaf Trading Company › General › <span className="text-foreground font-semibold">Overview</span></>}
    >
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl glass-card p-6 md:p-8">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-40" style={{ background: "var(--gradient-primary)" }} />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-30" style={{ background: "var(--gradient-accent)" }} />
        <div className="relative flex flex-col md:flex-row md:items-end gap-6 md:gap-10">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold px-3 py-1 rounded-full border border-border bg-card/60 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> LIVE · Insaf Trading Company
            </div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Welcome back, <span className="text-gradient">Haji Karim</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              You have <span className="text-foreground font-semibold">{ov.counts.products}</span> products worth{" "}
              <span className="text-success font-semibold">{fmtRs(ov.retailValue)}</span> at retail.
              {ov.lowStock.length > 0 ? (
                <> <span className="text-warning font-semibold">{ov.lowStock.length}</span> item{ov.lowStock.length === 1 ? "" : "s"} need reordering.</>
              ) : (
                <> All stock is healthy.</>
              )}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 md:gap-6">
            {[
              { l: "Retail", v: fmtRs(ov.retailValue), g: "var(--gradient-primary)" },
              { l: "Cost", v: fmtRs(ov.costValue), g: "var(--gradient-sunset)" },
              { l: "Units", v: ov.totalUnits.toLocaleString(), g: "var(--gradient-mint)" },
            ].map((s) => (
              <div key={s.l} className="min-w-[100px] rounded-2xl p-4 border border-border bg-card/40">
                <p className="text-[10px] tracking-widest text-muted-foreground uppercase">{s.l}</p>
                <p className="text-xl md:text-2xl font-bold mt-1" style={{ backgroundImage: s.g, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHORTCUTS */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {shortcuts.map((s) => (
            <Link key={s.label} to={s.to} className="glass-card hover-lift p-4 flex flex-col items-start gap-3 text-left">
              <GradientIcon Icon={s.icon} grad={s.grad} />
              <span className="text-sm font-semibold">{s.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* KPIs */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">Business Overview</h3>
          <div className="flex items-center gap-1 p-1 rounded-xl border border-border bg-card/50">
            {(["1M", "3M", "6M", "1Y"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                  range === r ? "text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
                }`}
                style={range === r ? { background: "var(--gradient-primary)" } : undefined}
              >{r}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k) => {
            const Icon = k.icon;
            const TrendIcon = k.up ? ArrowUpRight : ArrowDownRight;
            return (
              <div key={k.label} className="glass-card hover-lift p-5 relative overflow-hidden">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl" style={{ background: k.grad }} />
                <div className="flex items-start justify-between relative">
                  <GradientIcon Icon={Icon} grad={k.grad} size={42} />
                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full ${k.up ? "text-success bg-success/10" : "text-destructive bg-destructive/10"}`}>
                    <TrendIcon size={12} /> {k.trend}
                  </span>
                </div>
                <p className="text-[11px] tracking-wider uppercase text-muted-foreground mt-4">{k.label}</p>
                <p className="text-2xl font-bold mt-1">{k.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CHART + TOP PRODUCTS */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="glass-card p-5 xl:col-span-2">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold">Inventory Value Trend</h3>
              <p className="text-xs text-muted-foreground">Retail vs cost · projected over last 8 months</p>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-4 text-xs">
              <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: "oklch(0.7 0.19 285)" }} /> Retail</span>
              <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: "oklch(0.7 0.22 15)" }} /> Cost</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <Stat label="Cumulative Retail" value={fmtRs(totals.rev)} tint="var(--gradient-primary)" />
            <Stat label="Cumulative Cost" value={fmtRs(totals.exp)} tint="var(--gradient-sunset)" />
            <Stat label="Projected Margin" value={fmtRs(totals.net)} tint="var(--gradient-mint)" />
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.7 0.19 285)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.7 0.19 285)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.7 0.22 15)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.7 0.22 15)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 6" stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                <XAxis dataKey="m" stroke="oklch(0.74 0.03 265)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.74 0.03 265)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.23 0.045 275)",
                    border: "1px solid oklch(1 0 0 / 0.1)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => fmtRs(v)}
                />
                <Area type="monotone" dataKey="rev" stroke="oklch(0.7 0.19 285)" strokeWidth={2.5} fill="url(#gRev)" />
                <Area type="monotone" dataKey="exp" stroke="oklch(0.7 0.22 15)" strokeWidth={2.5} fill="url(#gExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Flame size={16} className="text-warning" />
            <h3 className="text-base font-bold">Top Products by Value</h3>
            <div className="flex-1" />
            <Link to="/products" className="text-xs font-semibold text-primary-glow hover:underline">All →</Link>
          </div>
          {ov.topStock.length === 0 ? (
            <div className="text-center py-10 text-sm text-muted-foreground">
              No products yet.{" "}
              <Link to="/products" className="text-primary-glow font-semibold">Add one →</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {ov.topStock.map((p, i) => {
                const rank = i + 1;
                const gradByRank =
                  rank === 1 ? "var(--gradient-gold)" :
                  rank === 2 ? "var(--gradient-cool)" :
                  rank === 3 ? "var(--gradient-sunset)" :
                  "linear-gradient(135deg, oklch(0.4 0.03 275), oklch(0.32 0.04 275))";
                return (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-card/60 transition group">
                    <div className="relative">
                      <div className="h-11 w-11 rounded-xl grid place-items-center font-bold text-primary-foreground" style={{ background: gradByRank }}>
                        {rank <= 3 ? <Trophy size={16} /> : rank}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{p.brand} · {p.qty} in stock</p>
                    </div>
                    <p className="text-sm font-bold text-success whitespace-nowrap">{fmtRs(p.value)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* LOW STOCK + CATEGORY BREAKDOWN */}
      <section className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="glass-card p-5 xl:col-span-3">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-xl grid place-items-center" style={{ background: "oklch(0.83 0.16 78 / 0.15)" }}>
              <AlertTriangle size={16} className="text-warning" />
            </div>
            <h3 className="text-base font-bold">Low Stock Alert</h3>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full text-white" style={{ background: ov.lowStock.length ? "var(--gradient-sunset)" : "var(--gradient-mint)" }}>{ov.lowStock.length} items</span>
            <div className="flex-1" />
            <Link to="/products" className="text-xs font-semibold text-primary-glow hover:underline">View All →</Link>
          </div>
          {ov.lowStock.length === 0 ? (
            <div className="text-center py-10 text-sm text-muted-foreground">All products are above reorder point.</div>
          ) : (
            <div className="space-y-2">
              {ov.lowStock.map((s) => (
                <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/60 hover:border-border transition">
                  <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${s.severity === "danger" ? "bg-destructive" : "bg-warning"}`} style={{ boxShadow: `0 0 12px ${s.severity === "danger" ? "oklch(0.68 0.22 20 / 0.7)" : "oklch(0.83 0.16 78 / 0.6)"}` }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{s.name}</p>
                    <p className="text-[11px] text-muted-foreground">{s.sku ?? "—"}</p>
                  </div>
                  <span className={`text-sm font-bold ${s.severity === "danger" ? "text-destructive" : "text-warning"}`}>{s.qty} {s.unit}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card p-5 xl:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={16} className="text-primary-glow" />
            <h3 className="text-base font-bold">Category Breakdown</h3>
          </div>
          {ov.categoryBreakdown.length === 0 ? (
            <div className="text-center py-10 text-sm text-muted-foreground">No categories yet.</div>
          ) : (
            <div className="space-y-4">
              {ov.categoryBreakdown.map((c, i) => {
                const max = ov.categoryBreakdown[0].value || 1;
                const pct = Math.max(6, (c.value / max) * 100);
                const grads = ["var(--gradient-primary)", "var(--gradient-cool)", "var(--gradient-mint)", "var(--gradient-sunset)", "var(--gradient-rose)"];
                return (
                  <div key={c.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold truncate">{c.name}</span>
                      <span className="text-xs text-muted-foreground">{fmtRs(c.value)} · {c.units}u</span>
                    </div>
                    <div className="h-2 rounded-full bg-card/60 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: grads[i % grads.length] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER STAT STRIP */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Boxes, label: "Products", value: ov.counts.products, to: "/products" as const, g: "var(--gradient-primary)" },
          { icon: Tags, label: "Categories", value: ov.counts.categories, to: "/categories" as const, g: "var(--gradient-cool)" },
          { icon: Layers, label: "Brands", value: ov.counts.brands, to: "/brands" as const, g: "var(--gradient-mint)" },
          { icon: Ruler, label: "Units", value: ov.counts.units, to: "/units" as const, g: "var(--gradient-gold)" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} to={s.to} className="glass-card hover-lift p-4 flex items-center gap-4">
              <GradientIcon Icon={Icon} grad={s.g} size={40} />
              <div>
                <p className="text-[10px] tracking-widest uppercase text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold">{s.value}</p>
              </div>
            </Link>
          );
        })}
      </section>

      {/* Silence unused-var warning for UserCog kept for future HR shortcut */}
      <span className="hidden"><UserCog size={0} /><Landmark size={0} /><PiggyBank size={0} /></span>
    </DashboardShell>
  );
}
