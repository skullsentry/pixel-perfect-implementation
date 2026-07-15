import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Boxes, Plus, Trash2, Pencil, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DashboardShell, PageHeader } from "@/components/dashboard-shell";
import {
  listProducts, listCategories, listBrands, listUnits,
  createProduct, updateProduct, deleteProduct, type ProductInput,
} from "@/lib/catalog.functions";

const productsQO = queryOptions({ queryKey: ["products"], queryFn: () => listProducts() });
const catsQO = queryOptions({ queryKey: ["categories"], queryFn: () => listCategories() });
const brandsQO = queryOptions({ queryKey: ["brands"], queryFn: () => listBrands() });
const unitsQO = queryOptions({ queryKey: ["units"], queryFn: () => listUnits() });

export const Route = createFileRoute("/_authenticated/products")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(productsQO),
      context.queryClient.ensureQueryData(catsQO),
      context.queryClient.ensureQueryData(brandsQO),
      context.queryClient.ensureQueryData(unitsQO),
    ]);
  },
  head: () => ({ meta: [{ title: "Products · Mizan" }] }),
  component: ProductsPage,
});

type Row = Awaited<ReturnType<typeof listProducts>>[number];

const emptyForm: ProductInput = {
  name: "", sku: "", category_id: null, brand_id: null, unit_id: null,
  cost_price: 0, retail_price: 0, stock_shelf: 0, stock_warehouse: 0, min_stock: 5, status: "Healthy",
};

function ProductsPage() {
  const { data: products } = useSuspenseQuery(productsQO);
  const { data: cats } = useSuspenseQuery(catsQO);
  const { data: brands } = useSuspenseQuery(brandsQO);
  const { data: units } = useSuspenseQuery(unitsQO);
  const qc = useQueryClient();
  const create = useServerFn(createProduct);
  const update = useServerFn(updateProduct);
  const del = useServerFn(deleteProduct);

  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductInput>(emptyForm);

  const catMap = useMemo(() => new Map(cats.map((c) => [c.id, c.name])), [cats]);
  const brandMap = useMemo(() => new Map(brands.map((b) => [b.id, b.name])), [brands]);

  const filtered = useMemo(
    () => products.filter((p) => !q || p.name.toLowerCase().includes(q.toLowerCase()) || (p.sku ?? "").toLowerCase().includes(q.toLowerCase())),
    [products, q]
  );

  const mSave = useMutation({
    mutationFn: async () => {
      if (editId) await update({ data: { ...form, id: editId } });
      else await create({ data: form });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["overview"] });
      setOpen(false); setForm(emptyForm); setEditId(null);
      toast.success(editId ? "Product updated" : "Product added");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });
  const mDel = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["products"] }); qc.invalidateQueries({ queryKey: ["overview"] }); toast.success("Deleted"); },
  });

  const startEdit = (p: Row) => {
    setEditId(p.id);
    setForm({
      name: p.name, sku: p.sku ?? "", description: p.description ?? "",
      category_id: p.category_id, brand_id: p.brand_id, unit_id: p.unit_id,
      cost_price: Number(p.cost_price), retail_price: Number(p.retail_price),
      stock_shelf: p.stock_shelf, stock_warehouse: p.stock_warehouse, min_stock: p.min_stock, status: p.status,
    });
    setOpen(true);
  };

  return (
    <DashboardShell title="Products" crumb="Product Setup · Products">
      <PageHeader
        title="Product Catalog"
        subtitle="Add, edit and track every SKU across your business."
        icon={Boxes}
        actions={
          <button onClick={() => { setForm(emptyForm); setEditId(null); setOpen(true); }}
            className="h-11 px-4 rounded-xl text-primary-foreground text-sm font-semibold shadow-[var(--shadow-glow)] flex items-center gap-2"
            style={{ background: "var(--gradient-primary)" }}>
            <Plus size={16} /> New Product
          </button>
        }
      />

      <section className="glass-card rounded-3xl p-4">
        <div className="flex items-center gap-2 h-10 px-3 rounded-xl border border-border bg-card/60 max-w-sm mb-3">
          <Search size={15} className="text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…"
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider">
                <th className="px-3 py-3">Name</th><th className="px-3">SKU</th><th className="px-3">Category</th>
                <th className="px-3">Brand</th><th className="px-3">Cost</th><th className="px-3">Retail</th>
                <th className="px-3">Stock</th><th className="px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={8} className="text-center py-10 text-muted-foreground">No products found.</td></tr>}
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-3 py-3 font-medium">{p.name}</td>
                  <td className="px-3 text-muted-foreground text-xs">{p.sku ?? "—"}</td>
                  <td className="px-3 text-muted-foreground">{p.category_id ? catMap.get(p.category_id) ?? "—" : "—"}</td>
                  <td className="px-3 text-muted-foreground">{p.brand_id ? brandMap.get(p.brand_id) ?? "—" : "—"}</td>
                  <td className="px-3">Rs {Number(p.cost_price).toLocaleString()}</td>
                  <td className="px-3">Rs {Number(p.retail_price).toLocaleString()}</td>
                  <td className="px-3">{p.stock_shelf + p.stock_warehouse}</td>
                  <td className="px-3 text-right whitespace-nowrap">
                    <button onClick={() => startEdit(p)} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-muted/40 inline-flex"><Pencil size={14} /></button>
                    <button onClick={() => mDel.mutate(p.id)} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-destructive/10 hover:text-destructive inline-flex"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm p-4" onClick={() => setOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg glass-card rounded-3xl p-6 space-y-3 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold">{editId ? "Edit Product" : "New Product"}</h3>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name *"
              className="w-full h-11 px-3 rounded-xl border border-border bg-card/60 text-sm outline-none" />
            <input value={form.sku ?? ""} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="SKU"
              className="w-full h-11 px-3 rounded-xl border border-border bg-card/60 text-sm outline-none" />
            <div className="grid grid-cols-3 gap-3">
              <select value={form.category_id ?? ""} onChange={(e) => setForm({ ...form, category_id: e.target.value || null })}
                className="h-11 px-3 rounded-xl border border-border bg-card/60 text-sm outline-none">
                <option value="">Category…</option>
                {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select value={form.brand_id ?? ""} onChange={(e) => setForm({ ...form, brand_id: e.target.value || null })}
                className="h-11 px-3 rounded-xl border border-border bg-card/60 text-sm outline-none">
                <option value="">Brand…</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <select value={form.unit_id ?? ""} onChange={(e) => setForm({ ...form, unit_id: e.target.value || null })}
                className="h-11 px-3 rounded-xl border border-border bg-card/60 text-sm outline-none">
                <option value="">Unit…</option>
                {units.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-muted-foreground">Cost price
                <input type="number" value={form.cost_price} onChange={(e) => setForm({ ...form, cost_price: Number(e.target.value) })}
                  className="mt-1 w-full h-11 px-3 rounded-xl border border-border bg-card/60 text-sm outline-none" />
              </label>
              <label className="text-xs text-muted-foreground">Retail price
                <input type="number" value={form.retail_price} onChange={(e) => setForm({ ...form, retail_price: Number(e.target.value) })}
                  className="mt-1 w-full h-11 px-3 rounded-xl border border-border bg-card/60 text-sm outline-none" />
              </label>
              <label className="text-xs text-muted-foreground">Shelf stock
                <input type="number" value={form.stock_shelf} onChange={(e) => setForm({ ...form, stock_shelf: Number(e.target.value) })}
                  className="mt-1 w-full h-11 px-3 rounded-xl border border-border bg-card/60 text-sm outline-none" />
              </label>
              <label className="text-xs text-muted-foreground">Warehouse stock
                <input type="number" value={form.stock_warehouse} onChange={(e) => setForm({ ...form, stock_warehouse: Number(e.target.value) })}
                  className="mt-1 w-full h-11 px-3 rounded-xl border border-border bg-card/60 text-sm outline-none" />
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setOpen(false)} className="h-10 px-4 rounded-xl border border-border text-sm">Cancel</button>
              <button disabled={!form.name.trim() || mSave.isPending} onClick={() => mSave.mutate()}
                className="h-10 px-5 rounded-xl text-primary-foreground text-sm font-semibold shadow-[var(--shadow-glow)] disabled:opacity-60"
                style={{ background: "var(--gradient-primary)" }}>
                {mSave.isPending ? "Saving…" : editId ? "Save" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
