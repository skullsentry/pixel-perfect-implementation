import { createFileRoute } from "@tanstack/react-router";
import { Ruler, Plus, Download, Printer, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { DashboardShell, PageHeader } from "@/components/dashboard-shell";

export const Route = createFileRoute("/units")({
  component: UnitsPage,
  head: () => ({
    meta: [
      { title: "Units of Measure · Insaf Trading" },
      { name: "description", content: "Configure units of measurement for products and inventory." },
    ],
  }),
});

type Cat = "Weight / Volume" | "Weight" | "Volume" | "Length" | "Count" | "N/A";
const units: { id: string; name: string; ref: string; cat: Cat }[] = [
  { id: "UOM-001", name: "Bag (Kg)", ref: "Fertilizers, bulk powders, stock feeds", cat: "Weight / Volume" },
  { id: "UOM-005", name: "Kg", ref: "Weight measurements", cat: "Weight" },
  { id: "UOM-002", name: "Liter (L)", ref: "Liquid pesticides, chemical sprays, fuels", cat: "Volume" },
  { id: "UOM-006", name: "Meter (M)", ref: "Tailoring cloth, suit parameters", cat: "Length" },
  { id: "UOM-004", name: "Pack", ref: "Box listings, bundled units, items", cat: "Count" },
  { id: "UOM-007", name: "Small", ref: "—", cat: "N/A" },
  { id: "UOM-003", name: "Tablet", ref: "Medical drugs, tablets, packages", cat: "Count" },
];
const catStyle: Record<Cat, string> = {
  "Weight / Volume": "text-primary-glow bg-primary/12 border-primary/25",
  Weight: "text-primary-glow bg-primary/12 border-primary/25",
  Volume: "text-info bg-info/12 border-info/25",
  Length: "text-accent bg-accent/12 border-accent/25",
  Count: "text-success bg-success/12 border-success/25",
  "N/A": "text-muted-foreground bg-muted/40 border-border",
};

function UnitsPage() {
  const [name, setName] = useState("");
  const [ref, setRef] = useState("");
  const [cat, setCat] = useState("");
  return (
    <DashboardShell title="Units of Measure" crumb={<>Product Setup › <span className="text-foreground font-semibold">Units of Measure</span></>}>
      <PageHeader title="Units of Measure" subtitle="Standardize how you count, weigh and volume-track every item in your catalog." icon={Ruler} grad="var(--gradient-mint)" />

      <section className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-5">
        <div className="glass-card p-6 h-fit">
          <h3 className="text-lg font-bold">Add Unit of Measure</h3>
          <p className="text-xs text-muted-foreground mt-1">Create a new unit of measurement.</p>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold flex items-center gap-1">Unit Name / Abbreviation <span className="text-destructive">*</span></label>
              <input value={name} onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Liter (L), Box, Packet"
                className="w-full h-11 px-4 rounded-xl border border-border bg-background/40 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold">Standard Usage Reference</label>
              <input value={ref} onChange={(e) => setRef(e.target.value)}
                placeholder="e.g. Liquid chemicals, bulk packaging"
                className="w-full h-11 px-4 rounded-xl border border-border bg-background/40 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold">System Category</label>
              <input value={cat} onChange={(e) => setCat(e.target.value)}
                placeholder="e.g. Volume, Count, Weight"
                className="w-full h-11 px-4 rounded-xl border border-border bg-background/40 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition" />
            </div>
          </div>

          <button className="mt-6 w-full h-12 rounded-xl text-primary-foreground font-semibold text-sm shadow-[var(--shadow-glow)] hover:shadow-lg transition inline-flex items-center justify-center gap-2"
            style={{ background: "var(--gradient-primary)" }}>
            <Plus size={16} /> Save Unit
          </button>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <h3 className="text-lg font-bold">Units Configuration Registry</h3>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>{units.length}</span>
            <div className="flex-1" />
            <button className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-card/60 hover:border-primary/50 transition"><Download size={13} /> CSV</button>
            <button className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-card/60 hover:border-primary/50 transition"><Printer size={13} /> Print</button>
          </div>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-left text-[10px] tracking-wider text-muted-foreground uppercase">
                  <th className="font-semibold px-3 py-3">Unit ID</th>
                  <th className="font-semibold px-3 py-3">Unit Name</th>
                  <th className="font-semibold px-3 py-3">Standard Usage Reference</th>
                  <th className="font-semibold px-3 py-3">System Category</th>
                  <th className="font-semibold px-3 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {units.map((u) => (
                  <tr key={u.id} className="border-t border-border/60 hover:bg-card/40 transition group">
                    <td className="px-3 py-4"><span className="font-mono text-[11px] font-semibold text-primary-glow">{u.id}</span></td>
                    <td className="px-3 py-4 font-semibold">{u.name}</td>
                    <td className="px-3 py-4 text-muted-foreground">{u.ref}</td>
                    <td className="px-3 py-4">
                      <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full border ${catStyle[u.cat]}`}>{u.cat}</span>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition">
                        <button className="h-8 w-8 grid place-items-center rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition"><Pencil size={14} /></button>
                        <button className="h-8 w-8 grid place-items-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}