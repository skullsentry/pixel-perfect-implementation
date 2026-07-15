import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DashboardShell, PageHeader } from "@/components/dashboard-shell";
import {
  Warehouse, Plus, Search, MapPin, Package, TrendingUp, TrendingDown,
  MoreHorizontal, Filter, Download, Building2, Boxes,
  Pencil, Trash2, Eye, X, Check,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/warehouse-list")({
  head: () => ({
    meta: [
      { title: "Warehouse List — Insaf Trading" },
      { name: "description", content: "Manage warehouses, capacity, and stock distribution." },
    ],
  }),
  component: WarehouseListPage,
});

type Row = {
  id: string;
  code: string;
  name: string;
  city: string;
  manager: string;
  initials: string;
  capacity: number;
  used: number;
  skus: number;
  value: number;
  status: "active" | "low" | "maintenance";
  trend: number;
};

const seed: Row[] = [
  { id: "1", code: "WH-01", name: "Main Godown — Karachi", city: "Karachi, PK", manager: "Haji Karim Khan", initials: "HK", capacity: 12000, used: 9420, skus: 1284, value: 8420000, status: "active", trend: 8.2 },
  { id: "2", code: "WH-02", name: "Central Depot — Lahore", city: "Lahore, PK", manager: "Ahmad Raza", initials: "AR", capacity: 8000, used: 5210, skus: 812, value: 4210000, status: "active", trend: 3.4 },
  { id: "3", code: "WH-03", name: "North Storage — Islamabad", city: "Islamabad, PK", manager: "Nasir Ali", initials: "NA", capacity: 6000, used: 5760, skus: 604, value: 3120000, status: "low", trend: -1.6 },
  { id: "4", code: "WH-04", name: "Port Hub — Gwadar", city: "Gwadar, PK", manager: "Bilal Yousuf", initials: "BY", capacity: 4500, used: 1120, skus: 214, value: 780000, status: "maintenance", trend: -4.9 },
  { id: "5", code: "WH-05", name: "Retail Backstore — Multan", city: "Multan, PK", manager: "Sana Iqbal", initials: "SI", capacity: 3200, used: 2140, skus: 342, value: 1240000, status: "active", trend: 5.7 },
  { id: "6", code: "WH-06", name: "Cold Store — Peshawar", city: "Peshawar, PK", manager: "Zain Khan", initials: "ZK", capacity: 2800, used: 2510, skus: 156, value: 980000, status: "low", trend: 1.2 },
];

const fmt = (n: number) => new Intl.NumberFormat("en-US").format(n);
const money = (n: number) =>
  n >= 1_000_000 ? `Rs ${(n / 1_000_000).toFixed(2)}M` : n >= 1000 ? `Rs ${(n / 1000).toFixed(1)}K` : `Rs ${n}`;

const statusMeta: Record<Row["status"], { label: string; cls: string; dot: string }> = {
  active:      { label: "Operational", cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25", dot: "bg-emerald-400" },
  low:         { label: "Near Capacity", cls: "bg-amber-500/10 text-amber-400 border-amber-500/25", dot: "bg-amber-400" },
  maintenance: { label: "Maintenance", cls: "bg-rose-500/10 text-rose-400 border-rose-500/25", dot: "bg-rose-400" },
};

function WarehouseListPage() {
  const [rows, setRows] = useState<Row[]>(seed);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | Row["status"]>("all");
  const [openNew, setOpenNew] = useState(false);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const okQ = q.trim() === "" || `${r.name} ${r.code} ${r.city} ${r.manager}`.toLowerCase().includes(q.toLowerCase());
      const okF = filter === "all" || r.status === filter;
      return okQ && okF;
    });
  }, [q, filter, rows]);

  const totalCap = rows.reduce((a, b) => a + b.capacity, 0);
  const totalUsed = rows.reduce((a, b) => a + b.used, 0);
  const totalValue = rows.reduce((a, b) => a + b.value, 0);
  const totalSkus = rows.reduce((a, b) => a + b.skus, 0);

  const kpis = [
    { label: "Warehouses", value: rows.length.toString(), icon: Building2, grad: "var(--gradient-primary)", sub: `${rows.filter(r => r.status === "active").length} operational` },
    { label: "Utilization", value: `${Math.round((totalUsed / totalCap) * 100)}%`, icon: TrendingUp, grad: "var(--gradient-accent)", sub: `${fmt(totalUsed)} / ${fmt(totalCap)} units` },
    { label: "Total SKUs", value: fmt(totalSkus), icon: Boxes, grad: "var(--gradient-sunset)", sub: "Across all locations" },
    { label: "Stock Value", value: money(totalValue), icon: Package, grad: "var(--gradient-primary)", sub: "Retail valuation" },
  ];

  const handleCreate = (r: Omit<Row, "id" | "initials" | "trend" | "used" | "skus" | "value">) => {
    const initials = r.manager.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "WH";
    const next: Row = { ...r, id: crypto.randomUUID(), initials, used: 0, skus: 0, value: 0, trend: 0 };
    setRows((prev) => [next, ...prev]);
    setOpenNew(false);
  };

  return (
    <DashboardShell title="Warehouse List" crumb="Warehouses · Warehouse List">
      <PageHeader
        title="Warehouse Network"
        subtitle="Track capacity, stock health, and operational status across every location."
        icon={Warehouse}
        grad="var(--gradient-primary)"
        actions={
          <div className="flex flex-wrap gap-2">
            <button className="h-10 px-4 rounded-xl border border-border bg-card/60 text-sm font-medium hover:border-primary/50 transition inline-flex items-center gap-2">
              <Download size={15} /> Export
            </button>
            <button
              onClick={() => setOpenNew(true)}
              className="h-10 px-4 rounded-xl text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-95 transition inline-flex items-center gap-2"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Plus size={15} /> New Warehouse
            </button>
          </div>
        }
      />

      {/* KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
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
                <div className="h-11 w-11 rounded-xl grid place-items-center text-primary-foreground shadow-[var(--shadow-glow)]" style={{ background: k.grad }}>
                  <Icon size={18} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Toolbar */}
      <section className="glass-card rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex items-center gap-2 h-11 px-3 rounded-xl border border-border bg-background/50 flex-1 min-w-0">
          <Search size={16} className="text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, code, city, manager…"
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl border border-border bg-background/50">
          {(["all", "active", "low", "maintenance"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 h-9 rounded-lg text-xs font-semibold capitalize transition ${
                filter === f ? "text-primary-foreground shadow-[var(--shadow-md)]" : "text-muted-foreground hover:text-foreground"
              }`}
              style={filter === f ? { background: "var(--gradient-primary)" } : undefined}
            >
              {f === "all" ? "All" : f === "low" ? "Near Capacity" : f === "maintenance" ? "Maintenance" : "Operational"}
            </button>
          ))}
        </div>
        <button className="h-11 px-4 rounded-xl border border-border bg-background/50 text-sm inline-flex items-center gap-2 hover:border-primary/50 transition">
          <Filter size={15} /> Advanced
        </button>
      </section>

      {/* Cards grid — mobile view */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:hidden gap-4">
        {filtered.map((r) => (<WarehouseCard key={r.id} r={r} />))}
      </section>

      {/* Table — desktop view */}
      <section className="hidden xl:block glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground border-b border-border">
                <th className="py-4 px-5 font-semibold">Warehouse</th>
                <th className="py-4 px-5 font-semibold">Location</th>
                <th className="py-4 px-5 font-semibold">Manager</th>
                <th className="py-4 px-5 font-semibold">Utilization</th>
                <th className="py-4 px-5 font-semibold text-right">SKUs</th>
                <th className="py-4 px-5 font-semibold text-right">Value</th>
                <th className="py-4 px-5 font-semibold">Status</th>
                <th className="py-4 px-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const pct = r.capacity ? Math.round((r.used / r.capacity) * 100) : 0;
                const s = statusMeta[r.status];
                const barGrad = pct >= 90 ? "linear-gradient(90deg,#f43f5e,#f59e0b)" : pct >= 70 ? "linear-gradient(90deg,#f59e0b,#facc15)" : "var(--gradient-primary)";
                return (
                  <tr key={r.id} className="border-b border-border/60 last:border-0 hover:bg-sidebar-accent/30 transition">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl grid place-items-center text-primary-foreground shadow-[var(--shadow-md)]" style={{ background: "var(--gradient-primary)" }}>
                          <Warehouse size={16} />
                        </div>
                        <div>
                          <p className="font-semibold leading-tight">{r.name}</p>
                          <p className="text-[11px] text-muted-foreground">{r.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5"><MapPin size={13} /> {r.city}</span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg grid place-items-center text-[11px] font-bold text-primary-foreground" style={{ background: "var(--gradient-accent)" }}>{r.initials}</div>
                        <span>{r.manager}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 min-w-[180px]">
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="font-semibold">{pct}%</span>
                        <span className="text-muted-foreground">{fmt(r.used)} / {fmt(r.capacity)}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: barGrad }} />
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right font-semibold">{fmt(r.skus)}</td>
                    <td className="py-4 px-5 text-right">
                      <p className="font-semibold">{money(r.value)}</p>
                      <p className={`text-[11px] inline-flex items-center gap-1 ${r.trend >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {r.trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {Math.abs(r.trend)}%
                      </p>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${s.cls}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-end gap-1">
                        <IconBtn label="View"><Eye size={14} /></IconBtn>
                        <IconBtn label="Edit"><Pencil size={14} /></IconBtn>
                        <IconBtn label="More"><MoreHorizontal size={14} /></IconBtn>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-muted-foreground">
                    <Warehouse size={26} className="mx-auto mb-3 opacity-50" />
                    No warehouses match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-border text-[12px] text-muted-foreground">
          <span>Showing <span className="text-foreground font-semibold">{filtered.length}</span> of {rows.length} warehouses</span>
          <div className="flex items-center gap-1">
            <button className="h-8 px-3 rounded-lg border border-border hover:border-primary/50 transition">Prev</button>
            <button className="h-8 w-8 rounded-lg text-primary-foreground font-semibold" style={{ background: "var(--gradient-primary)" }}>1</button>
            <button className="h-8 w-8 rounded-lg border border-border hover:border-primary/50 transition">2</button>
            <button className="h-8 px-3 rounded-lg border border-border hover:border-primary/50 transition">Next</button>
          </div>
        </div>
      </section>

      {openNew && <NewWarehouseModal onClose={() => setOpenNew(false)} onCreate={handleCreate} nextCode={`WH-${String(rows.length + 1).padStart(2, "0")}`} />}
    </DashboardShell>
  );
}

function IconBtn({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button aria-label={label} className="h-8 w-8 grid place-items-center rounded-lg border border-border bg-background/40 text-muted-foreground hover:text-foreground hover:border-primary/50 transition">
      {children}
    </button>
  );
}

function WarehouseCard({ r }: { r: Row }) {
  const pct = r.capacity ? Math.round((r.used / r.capacity) * 100) : 0;
  const s = statusMeta[r.status];
  const barGrad = pct >= 90 ? "linear-gradient(90deg,#f43f5e,#f59e0b)" : pct >= 70 ? "linear-gradient(90deg,#f59e0b,#facc15)" : "var(--gradient-primary)";
  return (
    <div className="glass-card hover-lift rounded-2xl p-5">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-2xl grid place-items-center text-primary-foreground shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-primary)" }}>
          <Warehouse size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{r.name}</p>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5"><MapPin size={11} /> {r.city} · {r.code}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-semibold ${s.cls}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
          {s.label}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <span className="text-muted-foreground font-semibold uppercase tracking-wider">Utilization</span>
          <span className="font-semibold">{pct}% · {fmt(r.used)}/{fmt(r.capacity)}</span>
        </div>
        <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: barGrad }} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <Stat label="SKUs" value={fmt(r.skus)} icon={Boxes} />
        <Stat label="Value" value={money(r.value)} icon={Package} />
        <Stat label="Trend" value={`${r.trend >= 0 ? "+" : ""}${r.trend}%`} icon={r.trend >= 0 ? TrendingUp : TrendingDown} tone={r.trend >= 0 ? "up" : "down"} />
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/60">
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <div className="h-7 w-7 rounded-lg grid place-items-center text-[10px] font-bold text-primary-foreground" style={{ background: "var(--gradient-accent)" }}>{r.initials}</div>
          <span className="truncate">{r.manager}</span>
        </div>
        <div className="flex items-center gap-1">
          <IconBtn label="View"><Eye size={13} /></IconBtn>
          <IconBtn label="Edit"><Pencil size={13} /></IconBtn>
          <IconBtn label="Delete"><Trash2 size={13} /></IconBtn>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon, tone }: { label: string; value: string; icon: typeof TrendingUp; tone?: "up" | "down" }) {
  const color = tone === "up" ? "text-emerald-400" : tone === "down" ? "text-rose-400" : "text-foreground";
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 py-2.5">
      <div className={`flex items-center justify-center gap-1 ${color}`}>
        <Icon size={12} />
        <span className="text-[13px] font-bold">{value}</span>
      </div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}

function NewWarehouseModal({
  onClose, onCreate, nextCode,
}: {
  onClose: () => void;
  onCreate: (r: { code: string; name: string; city: string; manager: string; capacity: number; status: Row["status"] }) => void;
  nextCode: string;
}) {
  const [form, setForm] = useState({
    code: nextCode,
    name: "",
    city: "",
    manager: "",
    capacity: 5000,
    status: "active" as Row["status"],
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.city.trim() || !form.manager.trim()) return;
    onCreate(form);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-background/70 backdrop-blur-sm" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="w-full max-w-lg glass-card rounded-3xl p-6 md:p-7 relative"
      >
        <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl opacity-40" style={{ background: "var(--gradient-primary)" }} />
        <div className="relative">
          <div className="flex items-start justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl grid place-items-center text-primary-foreground shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-primary)" }}>
                <Warehouse size={18} />
              </div>
              <div>
                <h3 className="text-lg font-bold">New Warehouse</h3>
                <p className="text-[12px] text-muted-foreground">Register a new storage location.</p>
              </div>
            </div>
            <button type="button" onClick={onClose} aria-label="Close" className="h-8 w-8 grid place-items-center rounded-lg border border-border bg-background/40 text-muted-foreground hover:text-foreground">
              <X size={15} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Code">
              <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="input" />
            </Field>
            <Field label="Capacity (units)">
              <input type="number" min={0} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} className="input" />
            </Field>
            <Field label="Name" full>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Main Godown — Karachi" className="input" required />
            </Field>
            <Field label="City / Location" full>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Karachi, PK" className="input" required />
            </Field>
            <Field label="Manager" full>
              <input value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} placeholder="Full name" className="input" required />
            </Field>
            <Field label="Status" full>
              <div className="flex gap-2">
                {(["active", "low", "maintenance"] as const).map((s) => (
                  <button
                    key={s} type="button" onClick={() => setForm({ ...form, status: s })}
                    className={`flex-1 h-10 rounded-xl border text-xs font-semibold transition ${form.status === s ? "border-primary/60 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
                    style={form.status === s ? { background: "linear-gradient(135deg, oklch(0.7 0.19 285 / 0.22), oklch(0.72 0.18 320 / 0.10))" } : undefined}
                  >
                    {statusMeta[s].label}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <div className="mt-6 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="h-10 px-4 rounded-xl border border-border text-sm font-medium hover:bg-card/60 transition">
              Cancel
            </button>
            <button type="submit" className="h-10 px-4 rounded-xl text-sm font-semibold text-primary-foreground inline-flex items-center gap-2 shadow-[var(--shadow-glow)] hover:opacity-95 transition" style={{ background: "var(--gradient-primary)" }}>
              <Check size={15} /> Create Warehouse
            </button>
          </div>
        </div>
        <style>{`.input{width:100%;height:40px;padding:0 12px;border-radius:12px;border:1px solid hsl(var(--border));background:oklch(1 0 0 / 0.02);font-size:13px;outline:none;transition:border-color .15s}.input:focus{border-color:oklch(0.7 0.19 285 / 0.7)}`}</style>
      </form>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? "col-span-2" : ""}`}>
      <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
