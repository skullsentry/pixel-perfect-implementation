import { createFileRoute } from "@tanstack/react-router";
import { Building2, Plus, Download, Printer, Trash2, Factory } from "lucide-react";
import { useState } from "react";
import { DashboardShell, PageHeader } from "@/components/dashboard-shell";

export const Route = createFileRoute("/brands")({
  component: BrandsPage,
  head: () => ({
    meta: [
      { title: "Brands & Companies · Insaf Trading" },
      { name: "description", content: "Register manufacturing companies and product brands." },
    ],
  }),
});

const initial = [{ id: 1, name: "Nestle" }];
const gradients = [
  "var(--gradient-primary)", "var(--gradient-accent)", "var(--gradient-cool)",
  "var(--gradient-mint)", "var(--gradient-sunset)", "var(--gradient-gold)", "var(--gradient-rose)",
];

function BrandsPage() {
  const [name, setName] = useState("");
  const [items, setItems] = useState(initial);
  return (
    <DashboardShell title="Brands & Companies" crumb={<>Product Setup › <span className="text-foreground font-semibold">Brands & Companies</span></>}>
      <PageHeader title="Brands & Companies Setup" subtitle="Register manufacturing companies and product brands you carry in your catalog." icon={Building2} grad="var(--gradient-cool)" />

      <section className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-5">
        <div className="glass-card p-6 h-fit">
          <h3 className="text-lg font-bold">Add Brand / Company</h3>
          <p className="text-xs text-muted-foreground mt-1">Register a new manufacturing company or product brand.</p>
          <div className="mt-6 space-y-2">
            <label className="text-xs font-semibold flex items-center gap-1">Brand Name <span className="text-destructive">*</span></label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. FMC Corp, Bayer, Syngenta"
              className="w-full h-12 px-4 rounded-xl border border-border bg-background/40 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition placeholder:text-muted-foreground" />
          </div>
          <button
            onClick={() => {
              if (!name.trim()) return;
              setItems((p) => [...p, { id: (p.at(-1)?.id ?? 0) + 1, name: name.trim() }]);
              setName("");
            }}
            className="mt-6 w-full h-12 rounded-xl text-primary-foreground font-semibold text-sm shadow-[var(--shadow-glow)] hover:shadow-lg transition inline-flex items-center justify-center gap-2"
            style={{ background: "var(--gradient-primary)" }}>
            <Plus size={16} /> Save Brand
          </button>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <h3 className="text-lg font-bold">Registered Brands</h3>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>{items.length}</span>
            <div className="flex-1" />
            <button className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-card/60 hover:border-primary/50 transition"><Download size={13} /> CSV</button>
            <button className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-card/60 hover:border-primary/50 transition"><Printer size={13} /> Print</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map((c, i) => (
              <div key={c.id} className="group flex items-center gap-3 p-3 rounded-2xl border border-border/60 bg-card/40 hover:border-primary/40 hover:bg-card/70 transition">
                <div className="h-11 w-11 rounded-xl grid place-items-center text-primary-foreground shrink-0" style={{ background: gradients[i % gradients.length] }}>
                  <Factory size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-muted-foreground">#{c.id}</p>
                  <p className="font-semibold truncate">{c.name}</p>
                </div>
                <button onClick={() => setItems((p) => p.filter((x) => x.id !== c.id))}
                  className="h-9 w-9 grid place-items-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition opacity-60 group-hover:opacity-100">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            {items.length === 0 && (
              <p className="text-sm text-muted-foreground col-span-full text-center py-8">No brands yet. Add your first above.</p>
            )}
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}