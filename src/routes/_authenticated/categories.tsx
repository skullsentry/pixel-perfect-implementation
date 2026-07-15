import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Tag, Plus, Trash2, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardShell, PageHeader } from "@/components/dashboard-shell";
import { listCategories, createCategory, updateCategory, deleteCategory } from "@/lib/catalog.functions";

const qo = queryOptions({ queryKey: ["categories"], queryFn: () => listCategories() });

export const Route = createFileRoute("/_authenticated/categories")({
  loader: ({ context }) => context.queryClient.ensureQueryData(qo),
  head: () => ({ meta: [{ title: "Categories · Mizan" }] }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { data: items } = useSuspenseQuery(qo);
  const qc = useQueryClient();
  const create = useServerFn(createCategory);
  const update = useServerFn(updateCategory);
  const del = useServerFn(deleteCategory);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<{ id: string; name: string } | null>(null);

  const mCreate = useMutation({
    mutationFn: (n: string) => create({ data: { name: n } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["categories"] }); qc.invalidateQueries({ queryKey: ["overview"] }); setName(""); toast.success("Category added"); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });
  const mUpdate = useMutation({
    mutationFn: (v: { id: string; name: string }) => update({ data: v }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["categories"] }); setEditing(null); toast.success("Updated"); },
  });
  const mDelete = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["categories"] }); qc.invalidateQueries({ queryKey: ["overview"] }); toast.success("Deleted"); },
  });

  return (
    <DashboardShell title="Categories" crumb="Product Setup · Categories">
      <PageHeader title="Product Categories" subtitle="Organize your catalog with classification categories." icon={Tag} grad="var(--gradient-mint)" />

      <section className="glass-card rounded-3xl p-5 flex flex-col sm:flex-row gap-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name"
          className="flex-1 h-11 px-3 rounded-xl border border-border bg-card/60 text-sm outline-none focus:border-primary/60" />
        <button
          disabled={!name.trim() || mCreate.isPending}
          onClick={() => mCreate.mutate(name.trim())}
          className="h-11 px-5 rounded-xl text-primary-foreground text-sm font-semibold shadow-[var(--shadow-glow)] disabled:opacity-60 flex items-center gap-2 justify-center"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Plus size={16} /> Add Category
        </button>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 && <p className="text-muted-foreground col-span-full text-center py-8">No categories yet.</p>}
        {items.map((c) => (
          <div key={c.id} className="glass-card rounded-2xl p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl grid place-items-center text-primary-foreground shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-primary)" }}>
              <Tag size={20} />
            </div>
            <div className="flex-1 min-w-0">
              {editing?.id === c.id ? (
                <input autoFocus value={editing.name} onChange={(e) => setEditing({ id: c.id, name: e.target.value })}
                  onKeyDown={(e) => { if (e.key === "Enter") mUpdate.mutate(editing); }}
                  className="w-full h-9 px-2 rounded-lg border border-border bg-card/60 text-sm outline-none" />
              ) : (
                <p className="font-semibold truncate">{c.name}</p>
              )}
              <p className="text-xs text-muted-foreground">{c.slug ?? "—"}</p>
            </div>
            <div className="flex gap-1">
              {editing?.id === c.id ? (
                <button onClick={() => mUpdate.mutate(editing)} className="h-9 px-2 rounded-lg text-xs font-semibold text-primary-glow">Save</button>
              ) : (
                <button onClick={() => setEditing({ id: c.id, name: c.name })} className="h-9 w-9 grid place-items-center rounded-lg hover:bg-muted/40"><Pencil size={14} /></button>
              )}
              <button onClick={() => mDelete.mutate(c.id)} className="h-9 w-9 grid place-items-center rounded-lg hover:bg-destructive/10 hover:text-destructive"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </section>
    </DashboardShell>
  );
}
