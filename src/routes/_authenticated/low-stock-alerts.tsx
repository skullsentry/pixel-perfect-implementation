import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DashboardShell, PageHeader } from "@/components/dashboard-shell";
import {
  AlertTriangle, Search, Filter, Download, Package, Warehouse, TrendingDown,
  ShoppingCart, Bell, Sparkles, XCircle,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/low-stock-alerts")({
  head: () => ({
    meta: [
      { title: "Low Stock Alerts — Insaf Trading" },
      { name: "description", content: "Products below reorder threshold. Prioritized restocking view." },
    ],
  }),
  component: LowStockAlertsPage,
});

type Sev = "critical" | "warning" | "reorder";
type Alert = {
  id: string;
  product: string;
  sku: string;
  category: string;
  warehouse: string;
  stock: number;
  min: number;
  reorder: number;
  unit: string;
  daysLeft: number;
  severity: Sev;
};

const seed: Alert[] = [
  { id: "1", product: "Basmati Rice 25kg",  sku: "BR-25", category: "Grains",     warehouse: "WH-01 Karachi",    stock: 0,   min: 20, reorder: 100, unit: "bag",  daysLeft: 0, severity: "critical" },
  { id: "2", product: "Cooking Oil 5L",     sku: "CO-5L", category: "Cooking",    warehouse: "WH-02 Lahore",     stock: 4,   min: 24, reorder: 120, unit: "carton", daysLeft: 2, severity: "critical" },
  { id: "3", product: "Sugar Refined 50kg", sku: "SR-50", category: "Sweetener",  warehouse: "WH-03 Islamabad",  stock: 8,   min: 20, reorder: 80,  unit: "bag",  daysLeft: 3, severity: "warning" },
  { id: "4", product: "Wheat Flour 20kg",   sku: "WF-20", category: "Grains",     warehouse: "WH-05 Multan",     stock: 12,  min: 20, reorder: 100, unit: "bag",  daysLeft: 5, severity: "warning" },
  { id: "5", product: "Green Tea 200g",     sku: "GT-200",category: "Beverages",  warehouse: "WH-01 Karachi",    stock: 18,  min: 30, reorder: 150, unit: "box",  daysLeft: 6, severity: "reorder" },
  { id: "6", product: "Salt Iodized 1kg",   sku: "SI-1",  category: "Seasoning",  warehouse: "WH-06 Peshawar",   stock: 22,  min: 40, reorder: 200, unit: "pack", daysLeft: 7, severity: "reorder" },
  { id: "7", product: "Ghee Pure 5kg",      sku: "GH-5",  category: "Cooking",    warehouse: "WH-02 Lahore",     stock: 2,   min: 15, reorder: 60,  unit: "tin",  daysLeft: 1, severity: "critical" },
  { id: "8", product: "Red Chili Powder 500g", sku: "RC-500", category: "Spices", warehouse: "WH-05 Multan",     stock: 26,  min: 30, reorder: 120, unit: "pack", daysLeft: 8, severity: "reorder" },
];

const sevMeta: Record<Sev, { label: string; cls: string; bar: string; ring: string }> = {
  critical: { label: "Out of Stock",  cls: "bg-rose-500/10 text-rose-400 border-rose-500/25", bar: "linear-gradient(90deg,#f43f5e,#f97316)", ring: "ring-rose-500/30" },
  warning:  { label: "Critical Low",  cls: "bg-amber-500/10 text-amber-400 border-amber-500/25", bar: "linear-gradient(90deg,#f59e0b,#facc15)", ring: "ring-amber-500/30" },
  reorder:  { label: "Reorder Soon",  cls: "bg-sky-500/10 text-sky-400 border-sky-500/25", bar: "linear-gradient(90deg,#0ea5e9,#38bdf8)", ring: "ring-sky-500/30" },
};

const fmt = (n: number) => new Intl.NumberFormat("en-US").format(n);

function LowStockAlertsPage() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | Sev>("all");

  const filtered = useMemo(() => seed.filter((r) => {
    const okQ = q.trim() === "" || `${r.product} ${r.sku} ${r.warehouse} ${r.category}`.toLowerCase().includes(q.toLowerCase());
    const okF = tab === "all" || r.severity === tab;
    return okQ && okF;
  }), [q, tab]);

  const critical = seed.filter(s => s.severity === "critical").length;
  const warning = seed.filter(s => s.severity === "warning").length;
  const reorder = seed.filter(s => s.severity === "reorder").length;

  const kpis = [
    { label: "Critical", value: critical.toString(), sub: "Immediate action", icon: XCircle, grad: "linear-gradient(135deg,#f43f5e,#f97316)" },
    { label: "Warning", value: warning.toString(), sub: "Restock this week", icon: AlertTriangle, grad: "linear-gradient(135deg,#f59e0b,#facc15)" },
    { label: "Reorder", value: reorder.toString(), sub: "Plan next PO", icon: Bell, grad: "linear-gradient(135deg,#0ea5e9,#38bdf8)" },
    { label: "Suggested PO", value: fmt(seed.reduce((a,b)=>a+Math.max(0,b.reorder-b.stock),0)), sub: "Total units", icon: ShoppingCart, grad: "var(--gradient-primary)" },
  ];

  return (
    <DashboardShell title="Low Stock Alerts" crumb="Warehouses · Low Stock Alerts">
      <PageHeader
        title="Low Stock Alerts"
        subtitle="Products at or below reorder thresholds. Prioritized by severity and days of cover left."
        icon={AlertTriangle}
        grad="linear-gradient(135deg,#f43f5e,#f97316)"
        actions={
          <div className="flex flex-wrap gap-2">
            <button className="h-10 px-4 rounded-xl border border-border bg-card/60 text-sm font-medium hover:border-primary/50 transition inline-flex items-center gap-2">
              <Download size={15} /> Export
            </button>
            <button className="h-10 px-4 rounded-xl text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-95 transition inline-flex items-center gap-2" style={{ background: "var(--gradient-primary)" }}>
              <ShoppingCart size={15} /> Create Purchase Order
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
                  <p className="mt-2 text-3xl font-bold">{k.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{k.sub}</p>
                </div>
                <div className="h-11 w-11 rounded-xl grid place-items-center text-white shadow-[var(--shadow-glow)]" style={{ background: k.grad }}>
                  <Icon size={18} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Critical banner */}
      {critical > 0 && (
        <section className="relative overflow-hidden rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5">
          <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl opacity-30" style={{ background: "linear-gradient(135deg,#f43f5e,#f97316)" }} />
          <div className="relative flex items-start gap-4">
            <div className="h-11 w-11 rounded-xl grid place-items-center text-white shrink-0" style={{ background: "linear-gradient(135deg,#f43f5e,#f97316)" }}>
              <Sparkles size={18} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-rose-400">{critical} product{critical === 1 ? "" : "s"} need immediate attention</p>
              <p className="text-sm text-muted-foreground mt-0.5">These items are out of stock or will run out within 48 hours. Prioritize a purchase order today.</p>
            </div>
          </div>
        </section>
      )}

      <section className="glass-card rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex items-center gap-2 h-11 px-3 rounded-xl border border-border bg-background/50 flex-1 min-w-0">
          <Search size={16} className="text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search product, SKU, warehouse…" className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground" />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl border border-border bg-background/50 overflow-x-auto">
          {(["all", "critical", "warning", "reorder"] as const).map((f) => (
            <button key={f} onClick={() => setTab(f)}
              className={`px-3 h-9 rounded-lg text-xs font-semibold whitespace-nowrap transition ${tab === f ? "text-primary-foreground shadow-[var(--shadow-md)]" : "text-muted-foreground hover:text-foreground"}`}
              style={tab === f ? { background: "var(--gradient-primary)" } : undefined}>
              {f === "all" ? "All" : sevMeta[f as Sev].label}
            </button>
          ))}
        </div>
        <button className="h-11 px-4 rounded-xl border border-border bg-background/50 text-sm inline-flex items-center gap-2 hover:border-primary/50 transition">
          <Filter size={15} /> Warehouse
        </button>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((a) => {
          const s = sevMeta[a.severity];
          const pct = Math.min(100, Math.round((a.stock / a.reorder) * 100));
          const needed = Math.max(0, a.reorder - a.stock);
          return (
            <div key={a.id} className={`glass-card hover-lift rounded-2xl p-5 ring-1 ${s.ring}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="h-11 w-11 rounded-xl grid place-items-center text-primary-foreground shadow-[var(--shadow-md)] shrink-0" style={{ background: "var(--gradient-primary)" }}>
                    <Package size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{a.product}</p>
                    <p className="text-[11px] text-muted-foreground">{a.sku} · {a.category}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-semibold whitespace-nowrap ${s.cls}`}>
                  {s.label}
                </span>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="text-muted-foreground font-semibold uppercase tracking-wider">Stock Level</span>
                  <span className="font-semibold">{fmt(a.stock)} / {fmt(a.reorder)} {a.unit}</span>
                </div>
                <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: s.bar }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1.5">
                  <span>Min: {a.min}</span>
                  <span>Reorder: {a.reorder}</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-border/60 bg-background/40 py-2.5">
                  <p className="text-[13px] font-bold inline-flex items-center gap-1 text-rose-400"><TrendingDown size={12} /> {a.daysLeft}d</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Cover Left</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/40 py-2.5">
                  <p className="text-[13px] font-bold">+{fmt(needed)}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">To Reorder</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/40 py-2.5 flex flex-col items-center justify-center">
                  <p className="text-[11px] font-bold inline-flex items-center gap-1"><Warehouse size={11} /></p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5 truncate max-w-full px-1">{a.warehouse.split(" ")[0]}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button className="flex-1 h-9 rounded-xl text-xs font-semibold text-primary-foreground inline-flex items-center justify-center gap-1.5 shadow-[var(--shadow-md)] hover:opacity-95 transition" style={{ background: "var(--gradient-primary)" }}>
                  <ShoppingCart size={13} /> Reorder
                </button>
                <button className="h-9 px-3 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/50 transition">
                  Snooze
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-muted-foreground glass-card rounded-2xl">
            <AlertTriangle size={26} className="mx-auto mb-3 opacity-50" />
            No low stock alerts match your filters.
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
