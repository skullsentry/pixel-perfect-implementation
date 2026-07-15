import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { DashboardShell, PageHeader } from "@/components/dashboard-shell";
import { MODULE_MAP, type ModuleDef } from "@/lib/modules";
import {
  ArrowLeft, Plus, Search, Filter, Download, MoreHorizontal, Eye, Pencil,
  Calendar, TrendingUp, TrendingDown, CheckCircle2, Clock, XCircle, X, Save,
  ArrowUpRight, ArrowDownRight, FileText, Printer, Send, Sparkles, Trash2,
  BarChart3, LineChart as LineChartIcon,
} from "lucide-react";

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

// ---------------- Layout classification ----------------

type Kind = "list" | "ledger" | "report" | "form" | "settings";

function classify(mod: ModuleDef): Kind {
  const s = mod.slug;
  if (s === "shop-settings") return "settings";
  if (mod.section === "Reports Hub") return "report";
  if (mod.section === "Finance Book") return "ledger";
  if (mod.section === "Ledgers & Profiles") return "ledger";
  if (s.includes("entry") || s === "sales-invoice") return "form";
  return "list";
}

const fmt = (n: number) => new Intl.NumberFormat("en-US").format(n);
const money = (n: number) =>
  n >= 1_000_000 ? `Rs ${(n / 1_000_000).toFixed(2)}M` : n >= 1000 ? `Rs ${(n / 1000).toFixed(1)}K` : `Rs ${n}`;

// deterministic pseudo-random per slug so numbers stay stable between renders
function seedRand(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0;
  return () => {
    h = (h * 1664525 + 1013904223) | 0;
    return (h >>> 0) / 4294967295;
  };
}

// ---------------- Page shell ----------------

function ModulePage() {
  const { mod } = Route.useLoaderData();
  const kind = classify(mod);

  return (
    <DashboardShell
      title={mod.title}
      crumb={<>Insaf Trading Company › {mod.section} › <span className="text-foreground font-semibold">{mod.title}</span></>}
    >
      {kind === "list" && <ListView mod={mod} />}
      {kind === "ledger" && <LedgerView mod={mod} />}
      {kind === "report" && <ReportView mod={mod} />}
      {kind === "form" && <FormView mod={mod} />}
      {kind === "settings" && <SettingsView mod={mod} />}
    </DashboardShell>
  );
}

function HeaderActions({ grad, primaryLabel, onPrimary }: { grad: string; primaryLabel: string; onPrimary: () => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button className="h-10 px-4 rounded-xl border border-border bg-card/60 text-sm font-medium hover:border-primary/50 transition inline-flex items-center gap-2">
        <Download size={15} /> Export
      </button>
      <button onClick={onPrimary} className="h-10 px-4 rounded-xl text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-95 transition inline-flex items-center gap-2" style={{ background: grad }}>
        <Plus size={15} /> {primaryLabel}
      </button>
    </div>
  );
}

// ---------------- KPI strip ----------------

function KpiStrip({ items }: { items: { label: string; value: string; sub: string; icon: typeof Plus; grad: string; tone?: "up" | "down" }[] }) {
  return (
    <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {items.map((k) => {
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
  );
}

// ---------------- Toolbar ----------------

function Toolbar({
  q, setQ, tabs, tab, setTab, extra,
}: {
  q: string; setQ: (v: string) => void;
  tabs: { key: string; label: string }[];
  tab: string; setTab: (v: string) => void;
  extra?: ReactNode;
}) {
  return (
    <section className="glass-card rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center gap-3">
      <div className="flex items-center gap-2 h-11 px-3 rounded-xl border border-border bg-background/50 flex-1 min-w-0">
        <Search size={16} className="text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground" />
      </div>
      <div className="flex items-center gap-1 p-1 rounded-xl border border-border bg-background/50 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-3 h-9 rounded-lg text-xs font-semibold whitespace-nowrap transition ${tab === t.key ? "text-primary-foreground shadow-[var(--shadow-md)]" : "text-muted-foreground hover:text-foreground"}`}
            style={tab === t.key ? { background: "var(--gradient-primary)" } : undefined}>
            {t.label}
          </button>
        ))}
      </div>
      {extra ?? (
        <button className="h-11 px-4 rounded-xl border border-border bg-background/50 text-sm inline-flex items-center gap-2 hover:border-primary/50 transition">
          <Filter size={15} /> Filters
        </button>
      )}
    </section>
  );
}

// ---------------- LIST VIEW ----------------

const STATUS_META: Record<string, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
  paid:      { label: "Paid",       cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25", icon: CheckCircle2 },
  pending:   { label: "Pending",    cls: "bg-amber-500/10 text-amber-400 border-amber-500/25",       icon: Clock },
  overdue:   { label: "Overdue",    cls: "bg-rose-500/10 text-rose-400 border-rose-500/25",          icon: XCircle },
  draft:     { label: "Draft",      cls: "bg-sky-500/10 text-sky-400 border-sky-500/25",             icon: FileText },
  completed: { label: "Completed",  cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25", icon: CheckCircle2 },
};

type ListRow = {
  id: string; ref: string; party: string; initials: string; date: string;
  note: string; amount: number; status: string;
};

function ListView({ mod }: { mod: ModuleDef }) {
  const [rows, setRows] = useState<ListRow[]>(() => buildListRows(mod));
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("all");
  const [editing, setEditing] = useState<ListRow | null>(null);
  const [viewing, setViewing] = useState<ListRow | null>(null);
  const [openNew, setOpenNew] = useState(false);

  const tabs = [
    { key: "all", label: "All" },
    { key: "paid", label: "Paid" },
    { key: "pending", label: "Pending" },
    { key: "overdue", label: "Overdue" },
  ];

  const filtered = rows.filter((r) => {
    const okQ = q.trim() === "" || `${r.ref} ${r.party} ${r.note}`.toLowerCase().includes(q.toLowerCase());
    const okT = tab === "all" || r.status === tab;
    return okQ && okT;
  });

  const total = rows.reduce((a, b) => a + b.amount, 0);
  const paid = rows.filter(r => r.status === "paid").reduce((a, b) => a + b.amount, 0);
  const pending = rows.filter(r => r.status === "pending").reduce((a, b) => a + b.amount, 0);
  const overdue = rows.filter(r => r.status === "overdue").reduce((a, b) => a + b.amount, 0);

  const upsert = (row: ListRow) => {
    setRows((prev) => prev.some(r => r.id === row.id) ? prev.map(r => r.id === row.id ? row : r) : [row, ...prev]);
  };
  const remove = (id: string) => setRows((prev) => prev.filter(r => r.id !== id));

  return (
    <>
      <PageHeader title={mod.title} subtitle={mod.description} icon={mod.icon} grad={mod.grad}
        actions={<HeaderActions grad={mod.grad} primaryLabel="New Record" onPrimary={() => setOpenNew(true)} />} />

      <KpiStrip items={[
        { label: "Total Records", value: fmt(rows.length), sub: "This month", icon: FileText, grad: mod.grad },
        { label: "Total Value", value: money(total), sub: "All entries", icon: TrendingUp, grad: "var(--gradient-accent)" },
        { label: "Settled", value: money(paid), sub: `${rows.filter(r => r.status === "paid").length} entries`, icon: CheckCircle2, grad: "var(--gradient-mint)", tone: "up" },
        { label: "Outstanding", value: money(pending + overdue), sub: "Pending + Overdue", icon: Clock, grad: "var(--gradient-sunset)", tone: "down" },
      ]} />

      <Toolbar q={q} setQ={setQ} tabs={tabs} tab={tab} setTab={setTab} />

      <section className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[820px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground border-b border-border">
                <th className="py-4 px-5 font-semibold">Reference</th>
                <th className="py-4 px-5 font-semibold">Party</th>
                <th className="py-4 px-5 font-semibold">Date</th>
                <th className="py-4 px-5 font-semibold">Note</th>
                <th className="py-4 px-5 font-semibold text-right">Amount</th>
                <th className="py-4 px-5 font-semibold">Status</th>
                <th className="py-4 px-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const s = STATUS_META[r.status] ?? STATUS_META.pending;
                const S = s.icon;
                return (
                  <tr key={r.id} className="border-b border-border/60 last:border-0 hover:bg-sidebar-accent/30 transition">
                    <td className="py-4 px-5 font-semibold">{r.ref}</td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg grid place-items-center text-[11px] font-bold text-primary-foreground" style={{ background: "var(--gradient-accent)" }}>{r.initials}</div>
                        <span>{r.party}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5"><Calendar size={12} /> {r.date}</span>
                    </td>
                    <td className="py-4 px-5 text-muted-foreground text-[12.5px] max-w-[260px] truncate">{r.note}</td>
                    <td className="py-4 px-5 text-right font-semibold">{money(r.amount)}</td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${s.cls}`}>
                        <S size={11} /> {s.label}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-end gap-1">
                        <IconBtn label="View" onClick={() => setViewing(r)}><Eye size={14} /></IconBtn>
                        <IconBtn label="Edit" onClick={() => setEditing(r)}><Pencil size={14} /></IconBtn>
                        <IconBtn label="Delete" onClick={() => { if (confirm(`Delete ${r.ref}?`)) remove(r.id); }}><Trash2 size={14} /></IconBtn>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-16 text-center text-muted-foreground"><FileText size={26} className="mx-auto mb-3 opacity-50" />No records match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-border text-[12px] text-muted-foreground">
          <span>Showing <span className="text-foreground font-semibold">{filtered.length}</span> of {rows.length} records</span>
          <div className="flex items-center gap-1">
            <button className="h-8 px-3 rounded-lg border border-border hover:border-primary/50 transition">Prev</button>
            <button className="h-8 w-8 rounded-lg text-primary-foreground font-semibold" style={{ background: mod.grad }}>1</button>
            <button className="h-8 w-8 rounded-lg border border-border hover:border-primary/50 transition">2</button>
            <button className="h-8 px-3 rounded-lg border border-border hover:border-primary/50 transition">Next</button>
          </div>
        </div>
      </section>

      {openNew && (
        <RecordFormModal
          title={`New — ${mod.title}`} grad={mod.grad}
          initial={{ id: crypto.randomUUID(), ref: `${mod.slug.slice(0,2).toUpperCase()}-2026-${String(Math.floor(1000 + Math.random()*8999))}`, party: "", initials: "", date: new Date().toISOString().slice(0,10), note: "", amount: 0, status: "pending" }}
          onClose={() => setOpenNew(false)}
          onSave={(r) => { upsert({ ...r, initials: r.party.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase() || "??" }); setOpenNew(false); }}
        />
      )}
      {editing && (
        <RecordFormModal
          title={`Edit — ${editing.ref}`} grad={mod.grad} initial={editing}
          onClose={() => setEditing(null)}
          onSave={(r) => { upsert({ ...r, initials: r.party.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase() || "??" }); setEditing(null); }}
        />
      )}
      {viewing && (
        <RecordViewModal record={viewing} grad={mod.grad} onClose={() => setViewing(null)}
          onEdit={() => { setEditing(viewing); setViewing(null); }} />
      )}
    </>
  );
}

function buildListRows(mod: ModuleDef): ListRow[] {
  const rand = seedRand(mod.slug);
  const parties = ["Al Karim Traders", "Bismillah Suppliers", "Faisal Foods", "Ghazi Distributors", "Hamza Enterprises", "Iqbal Cash & Carry", "Junaid Wholesale", "Karim Sons", "Lahori Foods", "Mustafa Traders"];
  const statuses = ["paid", "pending", "overdue", "paid", "pending", "completed", "paid", "pending", "overdue", "paid"];
  const prefix = mod.slug.slice(0, 2).toUpperCase();
  const notes = mod.features;
  return Array.from({ length: 10 }).map((_, i) => {
    const party = parties[Math.floor(rand() * parties.length)];
    const initials = party.split(" ").map((w) => w[0]).slice(0, 2).join("");
    return {
      id: `${mod.slug}-${i}`,
      ref: `${prefix}-2026-${String(2100 + Math.floor(rand() * 800)).padStart(4, "0")}`,
      party, initials,
      date: `2026-07-${String(1 + Math.floor(rand() * 14)).padStart(2, "0")}`,
      note: notes[i % notes.length],
      amount: Math.round(1000 + rand() * 499000),
      status: statuses[i % statuses.length],
    };
  });
}

// ---------------- Record Modals (shared by List & Ledger) ----------------

function ModalShell({ title, onClose, grad, children, footer }: { title: string; onClose: () => void; grad: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-background/70 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg glass-card rounded-3xl p-6 md:p-7 relative">
        <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl opacity-40" style={{ background: grad }} />
        <div className="relative">
          <div className="flex items-start justify-between gap-3 mb-5">
            <h3 className="text-lg font-bold">{title}</h3>
            <button type="button" onClick={onClose} aria-label="Close" className="h-8 w-8 grid place-items-center rounded-lg border border-border bg-background/40 text-muted-foreground hover:text-foreground">
              <X size={15} />
            </button>
          </div>
          {children}
          {footer && <div className="mt-6 flex items-center justify-end gap-2">{footer}</div>}
        </div>
        <style>{`.input{width:100%;height:40px;padding:0 12px;border-radius:12px;border:1px solid hsl(var(--border));background:oklch(1 0 0 / 0.02);font-size:13px;outline:none;color:inherit;transition:border-color .15s}.input:focus{border-color:oklch(0.7 0.19 285 / 0.7)}`}</style>
      </div>
    </div>
  );
}

function RecordFormModal({ title, initial, grad, onClose, onSave }: {
  title: string; initial: ListRow; grad: string; onClose: () => void; onSave: (r: ListRow) => void;
}) {
  const [form, setForm] = useState<ListRow>(initial);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.party.trim()) return;
    onSave(form);
  };
  return (
    <ModalShell title={title} grad={grad} onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="h-10 px-4 rounded-xl border border-border text-sm font-medium hover:bg-card/60 transition">Cancel</button>
          <button type="submit" form="record-form" className="h-10 px-4 rounded-xl text-sm font-semibold text-primary-foreground inline-flex items-center gap-2 shadow-[var(--shadow-glow)] hover:opacity-95 transition" style={{ background: grad }}>
            <Save size={15} /> Save Record
          </button>
        </>
      }>
      <form id="record-form" onSubmit={submit} className="grid grid-cols-2 gap-3">
        <Field label="Reference"><input value={form.ref} onChange={(e) => setForm({ ...form, ref: e.target.value })} className="input" /></Field>
        <Field label="Date"><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input" /></Field>
        <Field label="Party / Customer" full><input value={form.party} onChange={(e) => setForm({ ...form, party: e.target.value })} placeholder="Al Karim Traders" className="input" required /></Field>
        <Field label="Note" full><input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Short description" className="input" /></Field>
        <Field label="Amount (Rs)"><input type="number" min={0} value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} className="input" /></Field>
        <Field label="Status">
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input">
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="completed">Completed</option>
            <option value="draft">Draft</option>
          </select>
        </Field>
      </form>
    </ModalShell>
  );
}

function RecordViewModal({ record, grad, onClose, onEdit }: { record: ListRow; grad: string; onClose: () => void; onEdit: () => void }) {
  const s = STATUS_META[record.status] ?? STATUS_META.pending;
  const S = s.icon;
  return (
    <ModalShell title={record.ref} grad={grad} onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="h-10 px-4 rounded-xl border border-border text-sm font-medium hover:bg-card/60 transition">Close</button>
          <button onClick={onEdit} className="h-10 px-4 rounded-xl text-sm font-semibold text-primary-foreground inline-flex items-center gap-2 shadow-[var(--shadow-glow)] hover:opacity-95 transition" style={{ background: grad }}>
            <Pencil size={15} /> Edit Record
          </button>
        </>
      }>
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-3 pb-3 border-b border-border/60">
          <div className="h-12 w-12 rounded-2xl grid place-items-center text-primary-foreground shadow-[var(--shadow-md)]" style={{ background: "var(--gradient-accent)" }}>
            {record.initials || "??"}
          </div>
          <div className="flex-1">
            <p className="font-semibold">{record.party}</p>
            <p className="text-[11px] text-muted-foreground inline-flex items-center gap-1.5"><Calendar size={11} /> {record.date}</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${s.cls}`}>
            <S size={11} /> {s.label}
          </span>
        </div>
        <Row label="Amount" value={money(record.amount)} />
        <Row label="Reference" value={record.ref} />
        <Row label="Note" value={record.note || "—"} />
      </div>
    </ModalShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

// ---------------- LEDGER VIEW ----------------

type LedgerRow = { id: string; date: string; ref: string; desc: string; debit: number; credit: number; balance: number };

function LedgerView({ mod }: { mod: ModuleDef }) {
  const [entries, setEntries] = useState<LedgerRow[]>(() => buildLedger(mod));
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("all");
  const [openNew, setOpenNew] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = entries.filter((e) => {
    const okQ = q.trim() === "" || `${e.desc} ${e.ref}`.toLowerCase().includes(q.toLowerCase());
    const okT = tab === "all" || (tab === "debit" ? e.debit > 0 : e.credit > 0);
    return okQ && okT;
  });

  const totalDebit = entries.reduce((a, b) => a + b.debit, 0);
  const totalCredit = entries.reduce((a, b) => a + b.credit, 0);
  const balance = totalDebit - totalCredit;

  const addEntry = (row: { date: string; ref: string; desc: string; debit: number; credit: number }) => {
    setEntries((prev) => {
      const prevBal = prev.length ? prev[prev.length - 1].balance : 0;
      const newBal = prevBal + row.debit - row.credit;
      return [...prev, { id: `${mod.slug}-le-${Date.now()}`, ...row, balance: newBal }];
    });
    setOpenNew(false);
    setToast("Journal entry posted");
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <>
      <PageHeader title={mod.title} subtitle={mod.description} icon={mod.icon} grad={mod.grad}
        actions={<HeaderActions grad={mod.grad} primaryLabel="New Entry" onPrimary={() => setOpenNew(true)} />} />
      <KpiStrip items={[
        { label: "Total Debit", value: money(totalDebit), sub: "This period", icon: ArrowUpRight, grad: "var(--gradient-mint)", tone: "up" },
        { label: "Total Credit", value: money(totalCredit), sub: "This period", icon: ArrowDownRight, grad: "var(--gradient-sunset)", tone: "down" },
        { label: "Closing Balance", value: money(Math.abs(balance)), sub: balance >= 0 ? "Debit balance" : "Credit balance", icon: TrendingUp, grad: mod.grad },
        { label: "Entries", value: fmt(entries.length), sub: "Journal lines", icon: FileText, grad: "var(--gradient-accent)" },
      ]} />

      <Toolbar q={q} setQ={setQ}
        tabs={[{ key: "all", label: "All" }, { key: "debit", label: "Debits" }, { key: "credit", label: "Credits" }]}
        tab={tab} setTab={setTab} />

      <section className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[820px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground border-b border-border">
                <th className="py-4 px-5 font-semibold">Date</th>
                <th className="py-4 px-5 font-semibold">Reference</th>
                <th className="py-4 px-5 font-semibold">Description</th>
                <th className="py-4 px-5 font-semibold text-right">Debit</th>
                <th className="py-4 px-5 font-semibold text-right">Credit</th>
                <th className="py-4 px-5 font-semibold text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b border-border/60 last:border-0 hover:bg-sidebar-accent/30 transition">
                  <td className="py-4 px-5 text-muted-foreground">{e.date}</td>
                  <td className="py-4 px-5 font-semibold">{e.ref}</td>
                  <td className="py-4 px-5">{e.desc}</td>
                  <td className="py-4 px-5 text-right font-semibold text-emerald-400">{e.debit > 0 ? money(e.debit) : "—"}</td>
                  <td className="py-4 px-5 text-right font-semibold text-rose-400">{e.credit > 0 ? money(e.credit) : "—"}</td>
                  <td className="py-4 px-5 text-right font-semibold">{money(e.balance)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border bg-background/40">
                <td colSpan={3} className="py-3 px-5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">Totals</td>
                <td className="py-3 px-5 text-right font-bold text-emerald-400">{money(totalDebit)}</td>
                <td className="py-3 px-5 text-right font-bold text-rose-400">{money(totalCredit)}</td>
                <td className="py-3 px-5 text-right font-bold">{money(Math.abs(balance))}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {openNew && <LedgerEntryModal mod={mod} grad={mod.grad} onClose={() => setOpenNew(false)} onSave={addEntry} />}
      {toast && <Toast message={toast} grad={mod.grad} />}
    </>
  );
}

function LedgerEntryModal({ mod, grad, onClose, onSave }: { mod: ModuleDef; grad: string; onClose: () => void; onSave: (r: { date: string; ref: string; desc: string; debit: number; credit: number }) => void }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    ref: `${mod.slug.slice(0, 2).toUpperCase()}-${String(Math.floor(4000 + Math.random() * 900))}`,
    desc: "",
    kind: "debit" as "debit" | "credit",
    amount: 0,
  });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.desc.trim() || form.amount <= 0) return;
    onSave({
      date: form.date, ref: form.ref, desc: form.desc,
      debit: form.kind === "debit" ? form.amount : 0,
      credit: form.kind === "credit" ? form.amount : 0,
    });
  };
  return (
    <ModalShell title="New Journal Entry" grad={grad} onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="h-10 px-4 rounded-xl border border-border text-sm font-medium hover:bg-card/60 transition">Cancel</button>
          <button type="submit" form="ledger-form" className="h-10 px-4 rounded-xl text-sm font-semibold text-primary-foreground inline-flex items-center gap-2 shadow-[var(--shadow-glow)] hover:opacity-95 transition" style={{ background: grad }}>
            <Save size={15} /> Post Entry
          </button>
        </>
      }>
      <form id="ledger-form" onSubmit={submit} className="grid grid-cols-2 gap-3">
        <Field label="Date"><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input" /></Field>
        <Field label="Reference"><input value={form.ref} onChange={(e) => setForm({ ...form, ref: e.target.value })} className="input" /></Field>
        <Field label="Description" full><input value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="Bank deposit, payment received…" className="input" required /></Field>
        <Field label="Type">
          <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as "debit" | "credit" })} className="input">
            <option value="debit">Debit</option>
            <option value="credit">Credit</option>
          </select>
        </Field>
        <Field label="Amount (Rs)"><input type="number" min={0} value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} className="input" required /></Field>
      </form>
    </ModalShell>
  );
}

function Toast({ message, grad }: { message: string; grad: string }) {
  return (
    <div className="fixed bottom-6 right-6 z-[60] glass-card rounded-2xl px-4 py-3 flex items-center gap-3 shadow-[var(--shadow-glow)]">
      <div className="h-8 w-8 rounded-lg grid place-items-center text-primary-foreground" style={{ background: grad }}>
        <CheckCircle2 size={15} />
      </div>
      <span className="text-sm font-semibold">{message}</span>
    </div>
  );
}

function buildLedger(mod: ModuleDef): LedgerRow[] {
  const rand = seedRand(mod.slug + "-l");
  const descs = mod.features.concat(["Opening balance", "Bank deposit", "Cash withdrawal", "Adjustment entry"]);
  const prefix = mod.slug.slice(0, 2).toUpperCase();
  let bal = Math.round(50000 + rand() * 300000);
  return Array.from({ length: 12 }).map((_, i) => {
    const isDebit = rand() > 0.45;
    const amt = Math.round(2000 + rand() * 80000);
    if (isDebit) bal += amt; else bal -= amt;
    return {
      id: `${mod.slug}-le-${i}`,
      date: `2026-07-${String(1 + Math.floor(rand() * 14)).padStart(2, "0")}`,
      ref: `${prefix}-${String(4100 + i).padStart(4, "0")}`,
      desc: descs[i % descs.length],
      debit: isDebit ? amt : 0,
      credit: isDebit ? 0 : amt,
      balance: bal,
    };
  });
}

// ---------------- REPORT VIEW ----------------

function ReportView({ mod }: { mod: ModuleDef }) {
  const rows = useMemo(() => buildReport(mod), [mod]);
  const [tab, setTab] = useState("monthly");
  const trend = useMemo(() => buildTrend(mod), [mod]);
  const [openGen, setOpenGen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const totalRevenue = rows.reduce((a, b) => a + b.revenue, 0);
  const totalUnits = rows.reduce((a, b) => a + b.units, 0);
  const totalMargin = rows.reduce((a, b) => a + b.margin, 0);
  const marginPct = totalRevenue ? Math.round((totalMargin / totalRevenue) * 100) : 0;

  return (
    <>
      <PageHeader title={mod.title} subtitle={mod.description} icon={mod.icon} grad={mod.grad}
        actions={<HeaderActions grad={mod.grad} primaryLabel="Generate Report" onPrimary={() => setOpenGen(true)} />} />
      <KpiStrip items={[
        { label: "Revenue", value: money(totalRevenue), sub: "This period", icon: TrendingUp, grad: mod.grad, tone: "up" },
        { label: "Units Moved", value: fmt(totalUnits), sub: `${rows.length} items`, icon: BarChart3, grad: "var(--gradient-accent)" },
        { label: "Gross Margin", value: money(totalMargin), sub: `${marginPct}% of revenue`, icon: LineChartIcon, grad: "var(--gradient-mint)", tone: "up" },
        { label: "Top Performer", value: rows[0]?.name.split(" ").slice(0, 2).join(" ") ?? "—", sub: money(rows[0]?.revenue ?? 0), icon: Sparkles, grad: "var(--gradient-sunset)" },
      ]} />

      <section className="glass-card rounded-2xl p-5 md:p-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div>
            <h3 className="text-lg font-bold">Performance Trend</h3>
            <p className="text-[12px] text-muted-foreground">Rolling {tab === "monthly" ? "monthly" : "weekly"} view</p>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl border border-border bg-background/50">
            {[{ k: "weekly", l: "Weekly" }, { k: "monthly", l: "Monthly" }, { k: "yearly", l: "Yearly" }].map((t) => (
              <button key={t.k} onClick={() => setTab(t.k)}
                className={`px-3 h-9 rounded-lg text-xs font-semibold transition ${tab === t.k ? "text-primary-foreground shadow-[var(--shadow-md)]" : "text-muted-foreground hover:text-foreground"}`}
                style={tab === t.k ? { background: mod.grad } : undefined}>
                {t.l}
              </button>
            ))}
          </div>
        </div>
        <BarChart data={trend} grad={mod.grad} />
      </section>

      <section className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-bold">Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground border-b border-border">
                <th className="py-4 px-5 font-semibold">#</th>
                <th className="py-4 px-5 font-semibold">Name</th>
                <th className="py-4 px-5 font-semibold text-right">Units</th>
                <th className="py-4 px-5 font-semibold text-right">Revenue</th>
                <th className="py-4 px-5 font-semibold text-right">Margin</th>
                <th className="py-4 px-5 font-semibold">Trend</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} className="border-b border-border/60 last:border-0 hover:bg-sidebar-accent/30 transition">
                  <td className="py-4 px-5 text-muted-foreground">{String(i + 1).padStart(2, "0")}</td>
                  <td className="py-4 px-5 font-semibold">{r.name}</td>
                  <td className="py-4 px-5 text-right">{fmt(r.units)}</td>
                  <td className="py-4 px-5 text-right font-semibold">{money(r.revenue)}</td>
                  <td className="py-4 px-5 text-right font-semibold text-emerald-400">{money(r.margin)}</td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full bg-muted/40 overflow-hidden max-w-[160px]">
                        <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: mod.grad }} />
                      </div>
                      <span className={`text-[11px] font-semibold inline-flex items-center gap-1 ${r.delta >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {r.delta >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {Math.abs(r.delta)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {openGen && (
        <ReportGenerateModal grad={mod.grad} onClose={() => setOpenGen(false)}
          onGenerate={(opt) => {
            setOpenGen(false);
            setToast(`Report generated · ${opt.format.toUpperCase()} · ${opt.range}`);
            setTimeout(() => setToast(null), 2400);
            if (opt.format === "print") setTimeout(() => window.print(), 300);
          }} />
      )}
      {toast && <Toast message={toast} grad={mod.grad} />}
    </>
  );
}

function ReportGenerateModal({ grad, onClose, onGenerate }: { grad: string; onClose: () => void; onGenerate: (opt: { range: string; format: string }) => void }) {
  const [range, setRange] = useState("This month");
  const [format, setFormat] = useState("pdf");
  return (
    <ModalShell title="Generate Report" grad={grad} onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="h-10 px-4 rounded-xl border border-border text-sm font-medium hover:bg-card/60 transition">Cancel</button>
          <button onClick={() => onGenerate({ range, format })} className="h-10 px-4 rounded-xl text-sm font-semibold text-primary-foreground inline-flex items-center gap-2 shadow-[var(--shadow-glow)] hover:opacity-95 transition" style={{ background: grad }}>
            <Sparkles size={15} /> Generate
          </button>
        </>
      }>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Date Range" full>
          <select value={range} onChange={(e) => setRange(e.target.value)} className="input">
            <option>Today</option><option>This week</option><option>This month</option><option>Last month</option><option>This quarter</option><option>This year</option>
          </select>
        </Field>
        <Field label="Format" full>
          <div className="grid grid-cols-3 gap-2">
            {[{ k: "pdf", l: "PDF" }, { k: "excel", l: "Excel" }, { k: "print", l: "Print" }].map((f) => (
              <button key={f.k} type="button" onClick={() => setFormat(f.k)}
                className={`h-10 rounded-xl border text-xs font-semibold transition ${format === f.k ? "text-primary-foreground border-transparent shadow-[var(--shadow-md)]" : "border-border text-muted-foreground hover:text-foreground"}`}
                style={format === f.k ? { background: grad } : undefined}>
                {f.l}
              </button>
            ))}
          </div>
        </Field>
      </div>
    </ModalShell>
  );
}


function BarChart({ data, grad }: { data: { label: string; value: number }[]; grad: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end justify-between gap-2 h-[220px]">
      {data.map((d, i) => {
        const h = Math.max(6, Math.round((d.value / max) * 200));
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
            <div className="relative w-full flex justify-center">
              <div className="w-full max-w-[36px] rounded-t-lg transition-all duration-300 group-hover:opacity-90" style={{ height: h, background: grad }} />
              <span className="absolute -top-6 text-[10px] font-bold text-foreground opacity-0 group-hover:opacity-100 transition">{money(d.value)}</span>
            </div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function buildReport(mod: ModuleDef) {
  const rand = seedRand(mod.slug + "-r");
  const names: Record<string, string[]> = {
    "product-report": ["Basmati Rice 25kg", "Sugar Refined 50kg", "Cooking Oil 5L", "Wheat Flour 20kg", "Green Tea 200g", "Salt Iodized 1kg", "Ghee Pure 5kg", "Red Chili 500g"],
    "stock-report":   ["Karachi Godown", "Lahore Depot", "Islamabad Storage", "Gwadar Port Hub", "Multan Backstore", "Peshawar Cold Store"],
    "purchase-report":["Al Karim Traders", "Bismillah Suppliers", "Faisal Foods", "Ghazi Distributors", "Hamza Enterprises", "Iqbal Cash & Carry"],
    "sales-report":   ["Retail — Karachi", "Retail — Lahore", "Wholesale — Islamabad", "Export — Gwadar", "Multan Branch", "Peshawar Branch"],
  };
  const pool = names[mod.slug] ?? mod.features;
  return pool.map((n, i) => {
    const units = Math.round(50 + rand() * 950);
    const revenue = units * Math.round(500 + rand() * 4500);
    const margin = Math.round(revenue * (0.12 + rand() * 0.25));
    const delta = Math.round((rand() - 0.35) * 40);
    return { id: `${mod.slug}-r-${i}`, name: n, units, revenue, margin, delta, pct: 30 + Math.round(rand() * 70) };
  }).sort((a, b) => b.revenue - a.revenue);
}

function buildTrend(mod: ModuleDef) {
  const rand = seedRand(mod.slug + "-t");
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  return labels.map((l) => ({ label: l, value: Math.round(200000 + rand() * 1800000) }));
}

// ---------------- FORM VIEW ----------------

function FormView({ mod }: { mod: ModuleDef }) {
  const [items, setItems] = useState([
    { id: 1, name: "", qty: 1, price: 0 },
    { id: 2, name: "", qty: 1, price: 0 },
  ]);
  const [meta, setMeta] = useState({
    ref: "AUTO-2026-0142",
    date: "2026-07-15",
    party: "",
    warehouse: "WH-01 Karachi",
    payment: "Cash",
    notes: "",
  });
  const [toast, setToast] = useState<string | null>(null);
  const subtotal = items.reduce((a, b) => a + b.qty * b.price, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2200); };
  const save = (kind: "saved" | "draft" | "print") => {
    if (!meta.party.trim()) { flash("Select a party first"); return; }
    if (items.every(i => !i.name.trim())) { flash("Add at least one line item"); return; }
    if (kind === "saved") flash(`Entry saved · ${meta.ref} · ${money(total)}`);
    if (kind === "draft") flash(`Draft saved · ${meta.ref}`);
    if (kind === "print") { flash("Preparing print…"); setTimeout(() => window.print(), 300); }
  };

  return (
    <>
      <PageHeader title={mod.title} subtitle={mod.description} icon={mod.icon} grad={mod.grad}
        actions={<HeaderActions grad={mod.grad} primaryLabel="Save Entry" onPrimary={() => save("saved")} />} />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Main form */}
      <div className="lg:col-span-2 space-y-4">
        <section className="glass-card rounded-2xl p-5 md:p-6">
          <h3 className="text-sm font-bold mb-4">Entry Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Reference No"><input value={meta.ref} onChange={(e) => setMeta({ ...meta, ref: e.target.value })} className="input" /></Field>
            <Field label="Date"><input type="date" value={meta.date} onChange={(e) => setMeta({ ...meta, date: e.target.value })} className="input" /></Field>
            <Field label="Party / Customer" full>
              <select value={meta.party} onChange={(e) => setMeta({ ...meta, party: e.target.value })} className="input">
                <option value="">Select party…</option>
                <option>Al Karim Traders</option><option>Bismillah Suppliers</option><option>Faisal Foods</option>
              </select>
            </Field>
            <Field label="Warehouse">
              <select value={meta.warehouse} onChange={(e) => setMeta({ ...meta, warehouse: e.target.value })} className="input"><option>WH-01 Karachi</option><option>WH-02 Lahore</option></select>
            </Field>
            <Field label="Payment Mode">
              <select value={meta.payment} onChange={(e) => setMeta({ ...meta, payment: e.target.value })} className="input"><option>Cash</option><option>Bank Transfer</option><option>Credit</option><option>Split</option></select>
            </Field>
          </div>
        </section>

        <section className="glass-card rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-bold">Line Items</h3>
            <button onClick={() => setItems([...items, { id: Date.now(), name: "", qty: 1, price: 0 }])} className="h-8 px-3 rounded-lg text-xs font-semibold border border-border hover:border-primary/50 transition inline-flex items-center gap-1.5">
              <Plus size={12} /> Add Item
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground border-b border-border">
                  <th className="py-3 px-4 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold text-right w-24">Qty</th>
                  <th className="py-3 px-4 font-semibold text-right w-32">Price</th>
                  <th className="py-3 px-4 font-semibold text-right w-32">Total</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id} className="border-b border-border/60 last:border-0">
                    <td className="py-3 px-4"><input value={it.name} onChange={(e) => setItems(items.map(x => x.id === it.id ? { ...x, name: e.target.value } : x))} placeholder="Product name or SKU…" className="input" /></td>
                    <td className="py-3 px-4"><input type="number" min={0} value={it.qty} onChange={(e) => setItems(items.map(x => x.id === it.id ? { ...x, qty: Number(e.target.value) } : x))} className="input text-right" /></td>
                    <td className="py-3 px-4"><input type="number" min={0} value={it.price} onChange={(e) => setItems(items.map(x => x.id === it.id ? { ...x, price: Number(e.target.value) } : x))} className="input text-right" /></td>
                    <td className="py-3 px-4 text-right font-semibold">{money(it.qty * it.price)}</td>
                    <td className="py-3 px-2">
                      <button onClick={() => setItems(items.filter(x => x.id !== it.id))} className="h-8 w-8 grid place-items-center rounded-lg text-muted-foreground hover:text-rose-400 transition">
                        <XCircle size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="glass-card rounded-2xl p-5 md:p-6">
          <h3 className="text-sm font-bold mb-3">Notes</h3>
          <textarea rows={3} value={meta.notes} onChange={(e) => setMeta({ ...meta, notes: e.target.value })} placeholder="Optional notes, terms, or internal reference…" className="input min-h-[80px] py-2 resize-none" />
        </section>
      </div>

      {/* Summary sidebar */}
      <aside className="space-y-4">
        <section className="glass-card rounded-2xl p-5 md:p-6 sticky top-24">
          <h3 className="text-sm font-bold mb-4">Summary</h3>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">{money(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax (5%)</span><span className="font-semibold">{money(tax)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="font-semibold">Rs 0</span></div>
            <div className="border-t border-border/60 my-3" />
            <div className="flex justify-between items-baseline">
              <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">Grand Total</span>
              <span className="text-2xl font-bold">{money(total)}</span>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            <button onClick={() => { save("saved"); setTimeout(() => window.print(), 400); }} className="w-full h-11 rounded-xl text-sm font-semibold text-primary-foreground inline-flex items-center justify-center gap-2 shadow-[var(--shadow-glow)] hover:opacity-95 transition" style={{ background: mod.grad }}>
              <CheckCircle2 size={15} /> Save & Print
            </button>
            <button onClick={() => save("print")} className="w-full h-11 rounded-xl text-sm font-semibold border border-border hover:border-primary/50 transition inline-flex items-center justify-center gap-2">
              <Printer size={15} /> Print Preview
            </button>
            <button onClick={() => save("draft")} className="w-full h-11 rounded-xl text-sm font-semibold border border-border hover:border-primary/50 transition inline-flex items-center justify-center gap-2">
              <Send size={15} /> Save as Draft
            </button>
          </div>
        </section>
      </aside>
    </div>
    {toast && <Toast message={toast} grad={mod.grad} />}
    </>
  );
}

// ---------------- SETTINGS VIEW ----------------

function SettingsView({ mod }: { mod: ModuleDef }) {
  const [tab, setTab] = useState("business");
  const [toast, setToast] = useState<string | null>(null);
  const saveChanges = () => { setToast("Settings saved"); setTimeout(() => setToast(null), 2200); };
  const tabs = [
    { key: "business", label: "Business" },
    { key: "invoice", label: "Invoice" },
    { key: "tax", label: "Tax & Currency" },
    { key: "users", label: "Users" },
  ];
  return (
    <>
      <PageHeader title={mod.title} subtitle={mod.description} icon={mod.icon} grad={mod.grad}
        actions={<HeaderActions grad={mod.grad} primaryLabel="Save Changes" onPrimary={saveChanges} />} />
    <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4">
      <aside className="glass-card rounded-2xl p-3 h-fit">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition ${tab === t.key ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60"}`}
            style={tab === t.key ? { background: "linear-gradient(135deg, oklch(0.7 0.19 285 / 0.22), oklch(0.72 0.18 320 / 0.10))", borderLeft: "2px solid oklch(0.7 0.19 285)" } : undefined}>
            {t.label}
          </button>
        ))}
      </aside>

      <section className="glass-card rounded-2xl p-5 md:p-6 space-y-5">
        {tab === "business" && (
          <>
            <h3 className="text-lg font-bold">Business Profile</h3>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Business Name" full><input defaultValue="Insaf Trading Company" className="input" /></Field>
              <Field label="Owner"><input defaultValue="Haji Karim Khan" className="input" /></Field>
              <Field label="NTN / Tax ID"><input defaultValue="1234567-8" className="input" /></Field>
              <Field label="Phone"><input defaultValue="+92 300 1234567" className="input" /></Field>
              <Field label="Email"><input defaultValue="admin@insaftrading.pk" className="input" /></Field>
              <Field label="Address" full><input defaultValue="Shop 24, Bolton Market, Karachi" className="input" /></Field>
            </div>
          </>
        )}
        {tab === "invoice" && (
          <>
            <h3 className="text-lg font-bold">Invoice & Receipt</h3>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Invoice Prefix"><input defaultValue="INV-2026-" className="input" /></Field>
              <Field label="Next Number"><input defaultValue="0142" className="input" /></Field>
              <Field label="Paper Size"><select className="input"><option>58mm Thermal</option><option>80mm Thermal</option><option>A4</option></select></Field>
              <Field label="Footer Note" full><input defaultValue="Thank you for your business!" className="input" /></Field>
            </div>
          </>
        )}
        {tab === "tax" && (
          <>
            <h3 className="text-lg font-bold">Tax & Currency</h3>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Currency"><select className="input"><option>PKR — Rs</option><option>USD — $</option><option>AED — د.إ</option></select></Field>
              <Field label="Default Tax Rate"><input defaultValue="5" className="input" /></Field>
              <Field label="Rounding"><select className="input"><option>Nearest 1</option><option>Nearest 5</option><option>Nearest 10</option></select></Field>
            </div>
          </>
        )}
        {tab === "users" && (
          <>
            <h3 className="text-lg font-bold">Users & Permissions</h3>
            <div className="rounded-2xl border border-border overflow-hidden">
              {[{ n: "Haji Karim Khan", r: "Admin", e: "admin@insaftrading.pk" }, { n: "Ahmad Raza", r: "Manager", e: "ahmad@insaftrading.pk" }, { n: "Sana Iqbal", r: "Cashier", e: "sana@insaftrading.pk" }].map((u, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-border/60 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl grid place-items-center text-[11px] font-bold text-primary-foreground" style={{ background: "var(--gradient-accent)" }}>{u.n.split(" ").map(w => w[0]).slice(0, 2).join("")}</div>
                    <div>
                      <p className="text-sm font-semibold">{u.n}</p>
                      <p className="text-[11px] text-muted-foreground">{u.e}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-border bg-background/40">{u.r}</span>
                </div>
              ))}
            </div>
          </>
        )}
        <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
          <button className="h-10 px-4 rounded-xl border border-border text-sm font-medium hover:bg-card/60 transition">Cancel</button>
          <button className="h-10 px-4 rounded-xl text-sm font-semibold text-primary-foreground inline-flex items-center gap-2 shadow-[var(--shadow-glow)] hover:opacity-95 transition" style={{ background: mod.grad }}>
            <CheckCircle2 size={15} /> Save Changes
          </button>
        </div>
      </section>
      <style>{`.input{width:100%;height:40px;padding:0 12px;border-radius:12px;border:1px solid hsl(var(--border));background:oklch(1 0 0 / 0.02);font-size:13px;outline:none;color:inherit;transition:border-color .15s}.input:focus{border-color:oklch(0.7 0.19 285 / 0.7)}`}</style>
    </div>
    </>
  );
}

// ---------------- Shared bits ----------------

function IconBtn({ children, label, onClick }: { children: ReactNode; label: string; onClick?: () => void }) {
  return (
    <button aria-label={label} onClick={onClick} className="h-8 w-8 grid place-items-center rounded-lg border border-border bg-background/40 text-muted-foreground hover:text-foreground hover:border-primary/50 transition">
      {children}
    </button>
  );
}

function Field({ label, children, full }: { label: string; children: ReactNode; full?: boolean }) {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? "col-span-2" : ""}`}>
      <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-muted-foreground">{label}</span>
      {children}
      <style>{`.input{width:100%;height:40px;padding:0 12px;border-radius:12px;border:1px solid hsl(var(--border));background:oklch(1 0 0 / 0.02);font-size:13px;outline:none;color:inherit;transition:border-color .15s}.input:focus{border-color:oklch(0.7 0.19 285 / 0.7)}`}</style>
    </label>
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
