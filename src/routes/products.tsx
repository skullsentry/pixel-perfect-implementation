import { createFileRoute } from "@tanstack/react-router";
import { Boxes, Package, DollarSign, TrendingUp, MinusCircle, Plus, Download, Printer, Pencil, Trash2, Eye, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { DashboardShell, PageHeader } from "@/components/dashboard-shell";

export const Route = createFileRoute("/products")({
  component: ProductsPage,
  head: () => ({
    meta: [
      { title: "Products · Insaf Trading" },
      { name: "description", content: "Manage your product catalog, stock levels and pricing." },
    ],
  }),
});

type Status = "Healthy" | "Low Stock" | "Dealer" | "Out";
type Product = {
  sku: string; name: string; sub?: string; category: string; cost: string; retail: string;
  shelf: number; warehouse: number; min: number; status: Status;
};

const products: Product[] = [
  { sku: "SKU-COSM-001-19", name: "Clear Shampo", category: "Cosmetics", cost: "Rs 55.00", retail: "Rs 109.99", shelf: 4, warehouse: 0, min: 5, status: "Low Stock" },
  { sku: "SKU-XXXX-001-19", name: "Lectogen 2", category: "دودھ", cost: "Rs 800.00", retail: "Rs 1,000.00", shelf: 2, warehouse: 41, min: 5, status: "Low Stock" },
  { sku: "SKU-GROC-001-19", name: "Longi 585 Watt", category: "Grocery", cost: "Rs 15,000.00", retail: "Rs 15,500.00", shelf: 0, warehouse: 0, min: 5, status: "Dealer" },
  { sku: "GEN-SGR-ORG", name: "Organic Cane Sugar (1kg)", sub: "Unrefined natural brown crystal swe…", category: "Grocery", cost: "Rs 110.00", retail: "Rs 150.00", shelf: 175, warehouse: 120, min: 5, status: "Healthy" },
  { sku: "GEN-RCE-BMT", name: "Premium Basmati Rice (5kg)", sub: "Extra long grain aged fragrant rice p…", category: "Grocery", cost: "Rs 1,150.00", retail: "Rs 1,400.00", shelf: 83, warehouse: 80, min: 5, status: "Healthy" },
  { sku: "GEN-FLR-20K", name: "Whole Wheat Flour (20kg Bag)", sub: "Organic fine whole wheat flour pack", category: "Grocery", cost: "Rs 1,600.00", retail: "Rs 1,850.00", shelf: 54, warehouse: 60, min: 5, status: "Healthy" },
];

const sections = ["All Sections", "Clothing", "Cosmetics", "Grocery", "Household", "Kitchen", "Milk", "Stationery", "Test Temp 1782067137", "دودھ"];

const kpis = [
  { label: "Items Configured", value: "6", sub: "Catalog listings", icon: Package, grad: "var(--gradient-primary)" },
  { label: "Stock Asset Value", value: "Rs 202,920.00", sub: "Inventory cost basis", icon: DollarSign, grad: "var(--gradient-cool)" },
  { label: "Expected Sales Value", value: "Rs 244,789.96", sub: "Turnover capacity", icon: TrendingUp, grad: "var(--gradient-mint)" },
  { label: "Expected Markup Margin", value: "17.1%", sub: "Potential profit percentage", icon: MinusCircle, grad: "var(--gradient-gold)" },
];

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    Healthy: "text-success bg-success/12 border border-success/25",
    "Low Stock": "text-warning bg-warning/12 border border-warning/30",
    Dealer: "text-primary-glow bg-primary/12 border border-primary/25",
    Out: "text-destructive bg-destructive/12 border border-destructive/25",
  };
  return <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${map[status]}`}>{status}</span>;
}

function ProductsPage() {
  const [section, setSection] = useState("All Sections");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => products.filter((p) =>
    (section === "All Sections" || p.category === section) &&
    (!query || p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase()))
  ), [section, query]);
  return (
    <DashboardShell title="Products" crumb={<>Product Setup › <span className="text-foreground font-semibold">All Products</span></>}>
      <PageHeader
        title="Product Catalog"
        subtitle="Track your inventory, stock health, pricing and margins in real time."
        icon={Boxes}
        actions={
          <button className="inline-flex items-center gap-2 h-11 px-5 rounded-2xl text-primary-foreground text-sm font-semibold shadow-[var(--shadow-glow)] hover:shadow-lg transition"
            style={{ background: "var(--gradient-primary)" }}>
            <Plus size={16} /> Register Stock Item
          </button>
        }
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="glass-card hover-lift p-5 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-25 blur-2xl" style={{ background: k.grad }} />
              <div className="flex items-start justify-between relative">
                <div className="h-11 w-11 rounded-2xl grid place-items-center text-primary-foreground shadow-[0_8px_24px_-6px_oklch(0_0_0/0.5)]" style={{ background: k.grad }}>
                  <Icon size={20} />
                </div>
              </div>
              <p className="text-[11px] tracking-wider uppercase text-muted-foreground mt-4">{k.label}</p>
              <p className="text-2xl font-bold mt-1">{k.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>
            </div>
          );
        })}
      </section>

      <section className="glass-card p-5">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {sections.map((s) => {
            const active = section === s;
            return (
              <button key={s} onClick={() => setSection(s)}
                className={`text-xs font-semibold px-3 py-2 rounded-xl transition ${active ? "text-primary-foreground shadow-[var(--shadow-glow)]" : "text-muted-foreground border border-border bg-card/40 hover:text-foreground hover:border-primary/40"}`}
                style={active ? { background: "var(--gradient-primary)" } : undefined}>
                {s}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-2 h-10 px-3 rounded-xl border border-border bg-card/60 min-w-[220px] flex-1 sm:flex-none sm:w-[300px]">
            <Search size={15} className="text-muted-foreground" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground" placeholder="Search product or SKU…" />
          </div>
          <div className="flex-1" />
          <button className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-card/60 hover:border-primary/50 transition"><Download size={13} /> CSV</button>
          <button className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-card/60 hover:border-primary/50 transition"><Printer size={13} /> Print</button>
        </div>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="text-left text-[10px] tracking-wider text-muted-foreground uppercase">
                <th className="font-semibold px-3 py-3">SKU Code</th>
                <th className="font-semibold px-3 py-3">Product Name</th>
                <th className="font-semibold px-3 py-3">Category</th>
                <th className="font-semibold px-3 py-3">Cost Price</th>
                <th className="font-semibold px-3 py-3">Retail Price</th>
                <th className="font-semibold px-3 py-3 text-center">Shelf</th>
                <th className="font-semibold px-3 py-3 text-center">Warehouse</th>
                <th className="font-semibold px-3 py-3 text-center">Min Alert</th>
                <th className="font-semibold px-3 py-3">Status</th>
                <th className="font-semibold px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const stockDanger = p.shelf < p.min;
                return (
                  <tr key={p.sku} className="border-t border-border/60 hover:bg-card/40 transition group">
                    <td className="px-3 py-4"><span className="font-mono text-[11px] font-semibold text-primary-glow">{p.sku}</span></td>
                    <td className="px-3 py-4">
                      <p className="font-semibold">{p.name}</p>
                      {p.sub && <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[240px] truncate">{p.sub}</p>}
                    </td>
                    <td className="px-3 py-4"><span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-primary/12 text-primary-glow border border-primary/20">{p.category}</span></td>
                    <td className="px-3 py-4 text-muted-foreground">{p.cost}</td>
                    <td className="px-3 py-4 font-semibold">{p.retail}</td>
                    <td className={`px-3 py-4 text-center font-bold ${stockDanger ? "text-destructive" : ""}`}>{p.shelf}</td>
                    <td className={`px-3 py-4 text-center ${p.warehouse === 0 ? "text-destructive font-semibold" : "text-foreground"}`}>{p.warehouse}</td>
                    <td className="px-3 py-4 text-center text-muted-foreground">{p.min}</td>
                    <td className="px-3 py-4"><StatusBadge status={p.status} /></td>
                    <td className="px-3 py-4">
                      <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition">
                        <button className="h-8 w-8 grid place-items-center rounded-lg text-muted-foreground hover:text-primary-glow hover:bg-primary/10 transition"><Eye size={14} /></button>
                        <button className="h-8 w-8 grid place-items-center rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition"><Pencil size={14} /></button>
                        <button className="h-8 w-8 grid place-items-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardShell>
  );
}