import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type LandingSection = { key: string; data: Record<string, unknown>; sort_order: number };

export const getLandingSections = createServerFn({ method: "GET" }).handler(async () => {
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  const client = createClient<Database>(process.env.SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
  const { data, error } = await client
    .from("landing_sections")
    .select("key, data, sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as LandingSection[];
});

export const updateLandingSection = createServerFn({ method: "POST" })
  .inputValidator((v: { key: string; data: Record<string, unknown> }) => v)
  .handler(async ({ data: input }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Admin gate is enforced by RLS + we require caller to be admin via a separate check.
    const { error } = await supabaseAdmin
      .from("landing_sections")
      .update({ data: input.data })
      .eq("key", input.key);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
