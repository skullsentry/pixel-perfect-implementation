import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DashboardShell, PageHeader } from "@/components/dashboard-shell";
import {
  ArrowLeftRight, Plus, Search, Filter, Download, ArrowRight, Warehouse,
  Package, CheckCircle2, Clock, XCircle, Truck, Calendar, Eye, MoreHorizontal,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/stock-transfer")({
  head: () => ({
    meta: [
      { title: "Stock Transfer — Insaf Trading" },
      { name: "description", content: "Move stock between warehouses and track transfer status." },
    ],
  }),
  component: StockTransferPage,
});

type Status = "completed" | "in-transit" | "pending" | "cancelled";
type Transfer = {
  id: string;
  ref: string;
  date: string;
  from: string;
  to: string;
  items: number;
  qty: number;
  value: number;
  status: Status;
  driver?: string;
};

const seed: Transfer[] = [
  { id: "1", ref: "TR-2026-0142", date: "2026-07-14", from: "WH-01 Karachi", to: "WH-02 Lahore", items: 12, qty: 480, value: 240000, status: "in-transit", driver: "Rashid" },
  { id: "2", ref: "TR-2026-0141", date: "2026-07-13", from: "WH-02 Lahore", to: "WH-05 Multan", items: 8, qty: 220, value: 118500, status: "completed", driver: "Kamran" },
  { id: "3", ref: "TR-2026-0140", date: "2026-07-13", from: "WH-01 Karachi", to: "WH-06 Peshawar", items: 22, qty: 640, value: 386000, status: "completed", driver: "Ahsan" },
  { id: "4", ref: "TR-2026-0139", date: "2026-07-12", from: "WH-03 Islamabad", to: "WH-04 Gwadar", items: 4, qty: 96, value: 42000, status: "pending" },
  { id: "5", ref: "TR-2026-0138", date: "2026-07-11", from: "WH-05 Multan", to: "WH-01 Karachi", items: 15, qty: 310, value: 152000, status: "cancelled" },
  { id: "6", ref: "TR-2026-0137", date: "2026-07-11", from: "WH-01 Karachi", to: "WH-03 Islamabad", items: 9, qty: 260, value: 98000, status: "completed" },
  { id: "7", ref: "TR-2026-0136", date: "2026-07-10", from: "WH-02 Lahore", to: "WH-06 Peshawar", items: 6, qty: 140, value: 62000, status: "in-transit", driver: "Bilal" },
];

const statusMeta: Record<Status, { label: string; cls: string; dot: string; icon: typeof CheckCircle2 }> = {
  completed:   { label: "Completed",  cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25", dot: "bg-emerald-400", icon: CheckCircle2 },
  "in-transit":{ label: "In Transit", cls: "bg-sky-500/10 text-sky-400 border-sky-500/25", dot: "bg-sky-400", icon: Truck },
  pending:     { label: "Pending",    cls: "bg-amber-500/10 text-amber-400 border-amber-500/25", dot: "bg-amber-400", icon: Clock },
  cancelled:   { label: "Cancelled",  cls: "bg-rose-500/10 text-rose-400 border-rose-500/25", dot: "bg-rose-400", icon: XCircle },
};

const fmt = (n: number) => new Intl.NumberFormat("en-US").format(n);
const money = (n: number) => n >= 1_000_000 ? `Rs ${(n/1_000_000).toFixed(2)}M` : n >= 1000 ? `Rs ${(n/1000).toFixed(1)}K` : `Rs ${n}`;

function StockTransferPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | Status>("all");

  const filtered = useMemo(() => seed.filter((r) => {
    const okQ = q.trim() === "" || `${r.ref} ${r.from} ${r.to}`.toLowerCase().includes(q.toLowerCase());
    const okF = filter === "all" || r.status === filter;
    return okQ && okF;
  }), [q, filter]);

  const kpis = [
    { label: "In Transit", value: seed.filter(s => s.status === "in-transit").length.toString(), sub: "Active shipments", icon: Truck, grad: "var(--gradient-primary)" },
    { label: "Completed", value: seed.filter(s => s.status === "completed").length.toString(), sub: "This month", icon: CheckCircle2, grad: "var(--gradient-accent)" },
    { label: "Pending", value: seed.filter(s => s.status === "pending").length.toString(), sub: "Awaiting dispatch", icon: Clock, grad: "var(--gradient-sunset)" },
    { label: "Total Value", value: money(seed.reduce((a,b)=>a+b.value,0)), sub: "All transfers", icon: Package, grad: "var(--gradient-primary)" },
  ];

  return (
    <DashboardShell title="Stock Transfer" crumb="Warehouses · Stock Transfer">
      <PageHeader
        title="Stock Transfer"
        subtitle="Move inventory between warehouses. Track dispatch, transit, and receipt in one place."
        icon={ArrowLeftRight}
        grad="var(--gradient-primary)"
        actions={
          <div className="flex flex-wrap gap-2">
            <button className="h-10 px-4 rounded-xl border border-border bg-card/60 text-sm font-medium hover:border-primary/50 transition inline-flex items-center gap-2">
              <Download size={15} /> Export
            </button>
            <button className="h-10 px-4 rounded-xl text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-95 transition inline-flex items-center gap-2" style={{ background: "var(--gradient-primary)" }}>
              <Plus size={15} /> New Transfer
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
                  <p className="mt-2 text-2xl md:text-3xl font-bold">{k.value}</p>
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
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search reference, warehouse…" className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground" />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl border border-border bg-background/50 overflow-x-auto">
          {(["all", "in-transit", "completed", "pending", "cancelled"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 h-9 rounded-lg text-xs font-semibold whitespace-nowrap transition ${filter === f ? "text-primary-foreground shadow-[var(--shadow-md)]" : "text-muted-foreground hover:text-foreground"}`}
              style={filter === f ? { background: "var(--gradient-primary)" } : undefined}>
              {f === "all" ? "All" : statusMeta[f as Status].label}
            </button>
          ))}
        </div>
        <button className="h-11 px-4 rounded-xl border border-border bg-background/50 text-sm inline-flex items-center gap-2 hover:border-primary/50 transition">
          <Filter size={15} /> Date Range
        </button>
      </section>

      <section className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground border-b border-border">
                <th className="py-4 px-5 font-semibold">Reference</th>
                <th className="py-4 px-5 font-semibold">Route</th>
                <th className="py-4 px-5 font-semibold">Date</th>
                <th className="py-4 px-5 font-semibold text-right">Items</th>
                <th className="py-4 px-5 font-semibold text-right">Qty</th>
                <th className="py-4 px-5 font-semibold text-right">Value</th>
                <th className="py-4 px-5 font-semibold">Status</th>
                <th className="py-4 px-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const s = statusMeta[t.status];
                const S = s.icon;
                return (
                  <tr key={t.id} className="border-b border-border/60 last:border-0 hover:bg-sidebar-accent/30 transition">
                    <td className="py-4 px-5">
                      <p className="font-semibold">{t.ref}</p>
                      {t.driver && <p className="text-[11px] text-muted-foreground">Driver: {t.driver}</p>}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2 text-[12.5px]">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border border-border bg-background/40">
                          <Warehouse size={12} className="text-muted-foreground" /> {t.from}
                        </span>
                        <ArrowRight size={14} className="text-primary-glow shrink-0" />
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border border-border bg-background/40">
                          <Warehouse size={12} className="text-muted-foreground" /> {t.to}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5"><Calendar size={12} /> {t.date}</span>
                    </td>
                    <td className="py-4 px-5 text-right font-semibold">{t.items}</td>
                    <td className="py-4 px-5 text-right font-semibold">{fmt(t.qty)}</td>
                    <td className="py-4 px-5 text-right font-semibold">{money(t.value)}</td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${s.cls}`}>
                        <S size={11} /> {s.label}
                      </span>
                    </td>
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
                <tr><td colSpan={8} className="py-16 text-center text-muted-foreground"><ArrowLeftRight size={26} className="mx-auto mb-3 opacity-50" />No transfers match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardShell>
  );
}
