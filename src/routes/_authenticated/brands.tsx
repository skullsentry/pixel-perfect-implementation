import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Award, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardShell, PageHeader } from "@/components/dashboard-shell";
import { listBrands, createBrand, deleteBrand } from "@/lib/catalog.functions";

const qo = queryOptions({ queryKey: ["brands"], queryFn: () => listBrands() });

export const Route = createFileRoute("/_authenticated/brands")({
  loader: ({ context }) => context.queryClient.ensureQueryData(qo),
  head: () => ({ meta: [{ title: "Brands · Mizan" }] }),
  component: BrandsPage,
});

function BrandsPage() {
  const { data: items } = useSuspenseQuery(qo);
  const qc = useQueryClient();
  const create = useServerFn(createBrand);
  const del = useServerFn(deleteBrand);
  const [form, setForm] = useState({ name: "", company: "", country: "" });

  const mCreate = useMutation({
    mutationFn: () => create({ data: form }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["brands"] }); qc.invalidateQueries({ queryKey: ["overview"] }); setForm({ name: "", company: "", country: "" }); toast.success("Brand added"); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });
  const mDel = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["brands"] }); qc.invalidateQueries({ queryKey: ["overview"] }); toast.success("Deleted"); },
  });

  return (
    <DashboardShell title="Brands & Companies" crumb="Product Setup · Brands">
      <PageHeader title="Brands & Companies" subtitle="Manage brands, manufacturers and their country of origin." icon={Award} grad="var(--gradient-sunset)" />

      <section className="glass-card rounded-3xl p-5 grid grid-cols-1 sm:grid-cols-4 gap-3">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Brand name"
          className="h-11 px-3 rounded-xl border border-border bg-card/60 text-sm outline-none focus:border-primary/60" />
        <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company"
          className="h-11 px-3 rounded-xl border border-border bg-card/60 text-sm outline-none focus:border-primary/60" />
        <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Country"
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
              <th className="px-4 py-3">Name</th><th className="px-4">Company</th><th className="px-4">Country</th><th className="px-4"></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">No brands yet.</td></tr>}
            {items.map((b) => (
              <tr key={b.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{b.name}</td>
                <td className="px-4 text-muted-foreground">{b.company ?? "—"}</td>
                <td className="px-4 text-muted-foreground">{b.country ?? "—"}</td>
                <td className="px-4 text-right">
                  <button onClick={() => mDel.mutate(b.id)} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-destructive/10 hover:text-destructive inline-flex"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </DashboardShell>
  );
}
