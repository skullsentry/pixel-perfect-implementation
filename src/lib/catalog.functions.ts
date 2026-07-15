import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ---------- Categories ----------
export const listCategories = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("categories")
      .select("id, name, slug, description, icon, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: { name: string; slug?: string; description?: string; icon?: string }) => v)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("categories").insert({ ...data, user_id: context.userId });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: { id: string; name?: string; slug?: string; description?: string; icon?: string }) => v)
  .handler(async ({ data, context }) => {
    const { id, ...patch } = data;
    const { error } = await context.supabase.from("categories").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: { id: string }) => v)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("categories").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Brands ----------
export const listBrands = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("brands")
      .select("id, name, company, country, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createBrand = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: { name: string; company?: string; country?: string }) => v)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("brands").insert({ ...data, user_id: context.userId });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateBrand = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: { id: string; name?: string; company?: string; country?: string }) => v)
  .handler(async ({ data, context }) => {
    const { id, ...patch } = data;
    const { error } = await context.supabase.from("brands").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteBrand = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: { id: string }) => v)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("brands").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Units ----------
export const listUnits = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("units")
      .select("id, name, short_code, base_unit, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createUnit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: { name: string; short_code?: string; base_unit?: string }) => v)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("units").insert({ ...data, user_id: context.userId });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateUnit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: { id: string; name?: string; short_code?: string; base_unit?: string }) => v)
  .handler(async ({ data, context }) => {
    const { id, ...patch } = data;
    const { error } = await context.supabase.from("units").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteUnit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: { id: string }) => v)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("units").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Products ----------
export const listProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("products")
      .select("id, name, sku, description, category_id, brand_id, unit_id, cost_price, retail_price, stock_shelf, stock_warehouse, min_stock, status, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export type ProductInput = {
  name: string;
  sku?: string;
  description?: string;
  category_id?: string | null;
  brand_id?: string | null;
  unit_id?: string | null;
  cost_price?: number;
  retail_price?: number;
  stock_shelf?: number;
  stock_warehouse?: number;
  min_stock?: number;
  status?: string;
};

export const createProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: ProductInput) => v)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("products").insert({ ...data, user_id: context.userId });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: ProductInput & { id: string }) => v)
  .handler(async ({ data, context }) => {
    const { id, ...patch } = data;
    const { error } = await context.supabase.from("products").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: { id: string }) => v)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Overview ----------
export const getOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [prods, cats, brnds, unts] = await Promise.all([
      context.supabase.from("products").select("id, name, sku, cost_price, retail_price, stock_shelf, stock_warehouse, min_stock, category_id, brand_id, unit_id, status"),
      context.supabase.from("categories").select("id, name"),
      context.supabase.from("brands").select("id, name"),
      context.supabase.from("units").select("id, name"),
    ]);
    const products = prods.data ?? [];
    const categories = cats.data ?? [];
    const brands = brnds.data ?? [];
    const units = unts.data ?? [];

    const catMap = new Map(categories.map((c) => [c.id, c.name]));
    const brandMap = new Map(brands.map((b) => [b.id, b.name]));
    const unitMap = new Map(units.map((u) => [u.id, u.name]));

    let costValue = 0;
    let retailValue = 0;
    let totalUnits = 0;
    const lowStock: Array<{ id: string; name: string; sku: string | null; qty: number; unit: string; severity: "danger" | "warn" }> = [];
    const catAgg = new Map<string, { name: string; units: number; value: number }>();

    for (const p of products) {
      const qty = (p.stock_shelf ?? 0) + (p.stock_warehouse ?? 0);
      totalUnits += qty;
      costValue += qty * Number(p.cost_price ?? 0);
      retailValue += qty * Number(p.retail_price ?? 0);
      if (qty <= (p.min_stock ?? 0)) {
        lowStock.push({
          id: p.id,
          name: p.name,
          sku: p.sku,
          qty,
          unit: p.unit_id ? unitMap.get(p.unit_id) ?? "" : "",
          severity: qty === 0 ? "danger" : "warn",
        });
      }
      const catName = p.category_id ? catMap.get(p.category_id) ?? "Uncategorized" : "Uncategorized";
      const agg = catAgg.get(catName) ?? { name: catName, units: 0, value: 0 };
      agg.units += qty;
      agg.value += qty * Number(p.retail_price ?? 0);
      catAgg.set(catName, agg);
    }

    const topStock = [...products]
      .map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        brand: p.brand_id ? brandMap.get(p.brand_id) ?? "—" : "—",
        category: p.category_id ? catMap.get(p.category_id) ?? "—" : "—",
        qty: (p.stock_shelf ?? 0) + (p.stock_warehouse ?? 0),
        retail: Number(p.retail_price ?? 0),
        value: ((p.stock_shelf ?? 0) + (p.stock_warehouse ?? 0)) * Number(p.retail_price ?? 0),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return {
      counts: {
        products: products.length,
        categories: categories.length,
        brands: brands.length,
        units: units.length,
      },
      costValue,
      retailValue,
      potentialProfit: retailValue - costValue,
      totalUnits,
      lowStock,
      topStock,
      categoryBreakdown: [...catAgg.values()].sort((a, b) => b.value - a.value),
      // legacy fields for older callers
      products: products.length,
      categories: categories.length,
      brands: brands.length,
      units: units.length,
    };
  });
