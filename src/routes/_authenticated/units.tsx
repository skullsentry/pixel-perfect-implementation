import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Ruler, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardShell, PageHeader } from "@/components/dashboard-shell";
import { listUnits, createUnit, deleteUnit } from "@/lib/catalog.functions";

const qo = queryOptions({ queryKey: ["units"], queryFn: () => listUnits() });

export const Route = createFileRoute("/_authenticated/units")({
  loader: ({ context }) => context.queryClient.ensureQueryData(qo),
  head: () => ({ meta: [{ title: "Units · Mizan" }] }),
  component: UnitsPage,
});

function UnitsPage() {
  const { data: items } = useSuspenseQuery(qo);
  const qc = useQueryClient();
  const create = useServerFn(createUnit);
  const del = useServerFn(deleteUnit);
  const [form, setForm] = useState({ name: "", short_code: "", base_unit: "" });

  const mCreate = useMutation({
    mutationFn: () => create({ data: form }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["units"] }); qc.invalidateQueries({ queryKey: ["overview"] }); setForm({ name: "", short_code: "", base_unit: "" }); toast.success("Unit added"); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });
  const mDel = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["units"] }); qc.invalidateQueries({ queryKey: ["overview"] }); toast.success("Deleted"); },
  });

  return (
    <DashboardShell title="Units of Measure" crumb="Product Setup · Units">
      <PageHeader title="Units of Measure" subtitle="Define units like kg, pcs, box that products are sold and stocked in." icon={Ruler} grad="var(--gradient-accent)" />

      <section className="glass-card rounded-3xl p-5 grid grid-cols-1 sm:grid-cols-4 gap-3">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Unit name (e.g. Kilogram)"
          className="h-11 px-3 rounded-xl border border-border bg-card/60 text-sm outline-none focus:border-primary/60" />
        <input value={form.short_code} onChange={(e) => setForm({ ...form, short_code: e.target.value })} placeholder="Code (e.g. kg)"
          className="h-11 px-3 rounded-xl border border-border bg-card/60 text-sm outline-none focus:border-primary/60" />
        <input value={form.base_unit} onChange={(e) => setForm({ ...form, base_unit: e.target.value })} placeholder="Base unit (optional)"
          className="h-11 px-3 rounded-xl border border-border bg-card/60 text-sm outline-none focus:border-primary/60" />
        <button disabled={!form.name.trim() || mCreate.isPending} onClick={() => mCreate.mutate()}
          className="h-11 px-4 rounded-xl text-primary-foreground text-sm font-semibold shadow-[var(--shadow-glow)] disabled:opacity-60 flex items-center gap-2 justify-center"
          style={{ background: "var(--gradient-primary)" }}>
          <Plus size={16} /> Add
        </button>
      </section>

      <section className="glass-card rounded-3xl p-2 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider">
              <th className="px-4 py-3">Name</th><th className="px-4">Code</th><th className="px-4">Base</th><th className="px-4"></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">No units yet.</td></tr>}
            {items.map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 text-muted-foreground">{u.short_code ?? "—"}</td>
                <td className="px-4 text-muted-foreground">{u.base_unit ?? "—"}</td>
                <td className="px-4 text-right">
                  <button onClick={() => mDel.mutate(u.id)} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-destructive/10 hover:text-destructive inline-flex"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </DashboardShell>
  );
}
