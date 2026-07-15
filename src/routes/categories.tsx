import { createFileRoute } from "@tanstack/react-router";
import { Tag, Plus, Download, Printer, Trash2, Shirt, Sparkles, ShoppingBasket, Home, UtensilsCrossed, Milk, PencilRuler } from "lucide-react";
import { useState } from "react";
import { DashboardShell, PageHeader } from "@/components/dashboard-shell";

export const Route = createFileRoute("/categories")({
  component: CategoriesPage,
  head: () => ({
    meta: [
      { title: "Categories · Insaf Trading" },
      { name: "description", content: "Create and manage product classification categories." },
    ],
  }),
});

const initial = [
  { id: 3, name: "Clothing", icon: Shirt, grad: "var(--gradient-rose)" },
  { id: 5, name: "Cosmetics", icon: Sparkles, grad: "var(--gradient-primary)" },
  { id: 1, name: "Grocery", icon: ShoppingBasket, grad: "var(--gradient-mint)" },
  { id: 6, name: "Household", icon: Home, grad: "var(--gradient-cool)" },
  { id: 2, name: "Kitchen", icon: UtensilsCrossed, grad: "var(--gradient-sunset)" },
  { id: 8, name: "Milk", icon: Milk, grad: "var(--gradient-accent)" },
  { id: 4, name: "Stationery", icon: PencilRuler, grad: "var(--gradient-gold)" },
];

function CategoriesPage() {
  const [name, setName] = useState("");
  const [items, setItems] = useState(initial);

  return (
    <DashboardShell title="Categories" crumb={<>Product Setup › <span className="text-foreground font-semibold">Categories</span></>}>
      <PageHeader title="Categories Setup" subtitle="Classify products into departments and sections for faster catalog navigation." icon={Tag} grad="var(--gradient-accent)" />

      <section className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-5">
        <div className="glass-card p-6 h-fit">
          <h3 className="text-lg font-bold">Add Category</h3>
          <p className="text-xs text-muted-foreground mt-1">Create a new product classification category.</p>
          <div className="mt-6 space-y-2">
            <label className="text-xs font-semibold flex items-center gap-1">Category Name <span className="text-destructive">*</span></label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fertilizers, Electronics, Fabrics"
              className="w-full h-12 px-4 rounded-xl border border-border bg-background/40 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition placeholder:text-muted-foreground" />
          </div>
          <button
            onClick={() => {
              if (!name.trim()) return;
              setItems((p) => [...p, { id: (p.at(-1)?.id ?? 0) + 1, name: name.trim(), icon: Tag, grad: "var(--gradient-primary)" }]);
              setName("");
            }}
            className="mt-6 w-full h-12 rounded-xl text-primary-foreground font-semibold text-sm shadow-[var(--shadow-glow)] hover:shadow-lg transition inline-flex items-center justify-center gap-2"
            style={{ background: "var(--gradient-primary)" }}>
            <Plus size={16} /> Save Category
          </button>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <h3 className="text-lg font-bold">Registered Categories</h3>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>{items.length}</span>
            <div className="flex-1" />
            <button className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-card/60 hover:border-primary/50 transition"><Download size={13} /> CSV</button>
            <button className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-card/60 hover:border-primary/50 transition"><Printer size={13} /> Print</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.id} className="group flex items-center gap-3 p-3 rounded-2xl border border-border/60 bg-card/40 hover:border-primary/40 hover:bg-card/70 transition">
                  <div className="h-11 w-11 rounded-xl grid place-items-center text-primary-foreground shrink-0" style={{ background: c.grad }}>
                    <Icon size={18} />
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
              );
            })}
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}