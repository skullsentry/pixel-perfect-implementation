import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DashboardShell, PageHeader } from "@/components/dashboard-shell";
import {
  SlidersHorizontal, Plus, Search, Filter, Download, TrendingUp, TrendingDown,
  Package, Warehouse, Calendar, Eye, MoreHorizontal, ArrowUpRight, ArrowDownRight,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/stock-adjustment")({
  head: () => ({
    meta: [
      { title: "Stock Adjustment — Insaf Trading" },
      { name: "description", content: "Adjust stock counts for damaged, lost, or found inventory." },
    ],
  }),
  component: StockAdjustmentPage,
});

type Kind = "increase" | "decrease";
type Reason = "damaged" | "lost" | "found" | "expired" | "correction";
type Adj = {
  id: string;
  ref: string;
  date: string;
  product: string;
  sku: string;
  warehouse: string;
  kind: Kind;
  qty: number;
  reason: Reason;
  value: number;
  by: string;
};

const seed: Adj[] = [
  { id: "1", ref: "ADJ-0221", date: "2026-07-14", product: "Basmati Rice 25kg", sku: "BR-25", warehouse: "WH-01 Karachi", kind: "decrease", qty: 12, reason: "damaged", value: 18000, by: "Karim" },
  { id: "2", ref: "ADJ-0220", date: "2026-07-14", product: "Sugar Refined 50kg", sku: "SR-50", warehouse: "WH-02 Lahore", kind: "increase", qty: 8, reason: "found", value: 24000, by: "Ahmad" },
  { id: "3", ref: "ADJ-0219", date: "2026-07-13", product: "Cooking Oil 5L", sku: "CO-5L", warehouse: "WH-03 Islamabad", kind: "decrease", qty: 24, reason: "expired", value: 42000, by: "Nasir" },
  { id: "4", ref: "ADJ-0218", date: "2026-07-13", product: "Wheat Flour 20kg", sku: "WF-20", warehouse: "WH-05 Multan", kind: "decrease", qty: 6, reason: "lost", value: 9600, by: "Sana" },
  { id: "5", ref: "ADJ-0217", date: "2026-07-12", product: "Green Tea 200g", sku: "GT-200", warehouse: "WH-01 Karachi", kind: "increase", qty: 32, reason: "correction", value: 12800, by: "Karim" },
  { id: "6", ref: "ADJ-0216", date: "2026-07-11", product: "Salt Iodized 1kg", sku: "SI-1", warehouse: "WH-06 Peshawar", kind: "decrease", qty: 40, reason: "damaged", value: 6400, by: "Zain" },
];

const reasonMeta: Record<Reason, { label: string; cls: string }> = {
  damaged:    { label: "Damaged",    cls: "bg-rose-500/10 text-rose-400 border-rose-500/25" },
  lost:       { label: "Lost",       cls: "bg-orange-500/10 text-orange-400 border-orange-500/25" },
  expired:    { label: "Expired",    cls: "bg-amber-500/10 text-amber-400 border-amber-500/25" },
  found:      { label: "Found",      cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" },
  correction: { label: "Correction", cls: "bg-sky-500/10 text-sky-400 border-sky-500/25" },
};

const fmt = (n: number) => new Intl.NumberFormat("en-US").format(n);
const money = (n: number) => n >= 1_000_000 ? `Rs ${(n/1_000_000).toFixed(2)}M` : n >= 1000 ? `Rs ${(n/1000).toFixed(1)}K` : `Rs ${n}`;

function StockAdjustmentPage() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | Kind>("all");

  const filtered = useMemo(() => seed.filter((r) => {
    const okQ = q.trim() === "" || `${r.ref} ${r.product} ${r.sku} ${r.warehouse}`.toLowerCase().includes(q.toLowerCase());
    const okF = tab === "all" || r.kind === tab;
    return okQ && okF;
  }), [q, tab]);

  const inc = seed.filter(s => s.kind === "increase");
  const dec = seed.filter(s => s.kind === "decrease");
  const kpis = [
    { label: "Total Adjustments", value: seed.length.toString(), sub: "This month", icon: SlidersHorizontal, grad: "var(--gradient-primary)" },
    { label: "Increases", value: `+${fmt(inc.reduce((a,b)=>a+b.qty,0))}`, sub: `${inc.length} entries`, icon: ArrowUpRight, grad: "var(--gradient-accent)", tone: "up" as const },
    { label: "Decreases", value: `-${fmt(dec.reduce((a,b)=>a+b.qty,0))}`, sub: `${dec.length} entries`, icon: ArrowDownRight, grad: "var(--gradient-sunset)", tone: "down" as const },
    { label: "Value Impact", value: money(dec.reduce((a,b)=>a+b.value,0) - inc.reduce((a,b)=>a+b.value,0)), sub: "Net write-off", icon: Package, grad: "var(--gradient-primary)" },
  ];

  return (
    <DashboardShell title="Stock Adjustment" crumb="Warehouses · Stock Adjustment">
      <PageHeader
        title="Stock Adjustment"
        subtitle="Reconcile inventory. Log damage, loss, discovery, and manual corrections with audit trail."
        icon={SlidersHorizontal}
        grad="var(--gradient-sunset)"
        actions={
          <div className="flex flex-wrap gap-2">
            <button className="h-10 px-4 rounded-xl border border-border bg-card/60 text-sm font-medium hover:border-primary/50 transition inline-flex items-center gap-2">
              <Download size={15} /> Export
            </button>
            <button className="h-10 px-4 rounded-xl text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-95 transition inline-flex items-center gap-2" style={{ background: "var(--gradient-primary)" }}>
              <Plus size={15} /> New Adjustment
            </button>
          </div>
        }
      />

      <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="glass-card hover-lift rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full blur-3xl opacity-30" style={{ background: k.grad }} />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">{k.label}</p>
                  <p className={`mt-2 text-2xl md:text-3xl font-bold ${k.tone === "up" ? "text-emerald-400" : k.tone === "down" ? "text-rose-400" : ""}`}>{k.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{k.sub}</p>
                </div>
                <div className="h-11 w-11 rounded-xl grid place-items-center text-primary-foreground shadow-[var(--shadow-glow)]" style={{ background: k.grad }}>
                  <Icon size={18} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="glass-card rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex items-center gap-2 h-11 px-3 rounded-xl border border-border bg-background/50 flex-1 min-w-0">
          <Search size={16} className="text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search product, SKU, reference…" className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground" />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl border border-border bg-background/50">
          {(["all", "increase", "decrease"] as const).map((f) => (
            <button key={f} onClick={() => setTab(f)}
              className={`px-3 h-9 rounded-lg text-xs font-semibold capitalize transition ${tab === f ? "text-primary-foreground shadow-[var(--shadow-md)]" : "text-muted-foreground hover:text-foreground"}`}
              style={tab === f ? { background: "var(--gradient-primary)" } : undefined}>
              {f}
            </button>
          ))}
        </div>
        <button className="h-11 px-4 rounded-xl border border-border bg-background/50 text-sm inline-flex items-center gap-2 hover:border-primary/50 transition">
          <Filter size={15} /> Reason
        </button>
      </section>

      <section className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground border-b border-border">
                <th className="py-4 px-5 font-semibold">Reference</th>
                <th className="py-4 px-5 font-semibold">Product</th>
                <th className="py-4 px-5 font-semibold">Warehouse</th>
                <th className="py-4 px-5 font-semibold">Date</th>
                <th className="py-4 px-5 font-semibold">Reason</th>
                <th className="py-4 px-5 font-semibold text-right">Change</th>
                <th className="py-4 px-5 font-semibold text-right">Value</th>
                <th className="py-4 px-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const isUp = a.kind === "increase";
                const r = reasonMeta[a.reason];
                return (
                  <tr key={a.id} className="border-b border-border/60 last:border-0 hover:bg-sidebar-accent/30 transition">
                    <td className="py-4 px-5">
                      <p className="font-semibold">{a.ref}</p>
                      <p className="text-[11px] text-muted-foreground">by {a.by}</p>
                    </td>
                    <td className="py-4 px-5">
                      <p className="font-semibold">{a.product}</p>
                      <p className="text-[11px] text-muted-foreground">{a.sku}</p>
                    </td>
                    <td className="py-4 px-5 text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5"><Warehouse size={12} /> {a.warehouse}</span>
                    </td>
                    <td className="py-4 px-5 text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5"><Calendar size={12} /> {a.date}</span>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${r.cls}`}>
                        {r.label}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <span className={`inline-flex items-center gap-1 font-bold ${isUp ? "text-emerald-400" : "text-rose-400"}`}>
                        {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                        {isUp ? "+" : "-"}{fmt(a.qty)}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right font-semibold">{money(a.value)}</td>
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-end gap-1">
                        <button aria-label="View" className="h-8 w-8 grid place-items-center rounded-lg border border-border bg-background/40 text-muted-foreground hover:text-foreground hover:border-primary/50 transition"><Eye size={14} /></button>
                        <button aria-label="More" className="h-8 w-8 grid place-items-center rounded-lg border border-border bg-background/40 text-muted-foreground hover:text-foreground hover:border-primary/50 transition"><MoreHorizontal size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="py-16 text-center text-muted-foreground"><SlidersHorizontal size={26} className="mx-auto mb-3 opacity-50" />No adjustments match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardShell>
  );
}
