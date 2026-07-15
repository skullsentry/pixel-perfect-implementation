## Goal
Turn the currently-hardcoded site into a real dynamic app powered by Lovable Cloud (database + auth), so:
- The landing page (Hero, Features, Stats, Testimonials, FAQ, CTA) is editable from the database.
- Users can sign up / sign in and each has their own workspace.
- Dashboard pages (Products, Categories, Brands & Companies, Units of Measure) do real CRUD against the database, scoped per user.

## Step 1 — Enable Lovable Cloud
Turn on Cloud so we get database + auth + server functions.

## Step 2 — Database schema (migration)
Tables (all with RLS + grants):
- `profiles` — one row per auth user (display name, avatar).
- `landing_sections` — CMS for the landing page. Columns: `id`, `key` (hero/features/stats/testimonials/faq/cta), `data` (jsonb), `updated_at`. Public SELECT (anon) so the landing page can SSR.
- `categories` — user-owned: `id, user_id, name, slug, description, created_at`.
- `brands` — user-owned: `id, user_id, name, company, country, created_at`.
- `units` — user-owned: `id, user_id, name, short_code, base_unit, created_at`.
- `products` — user-owned: `id, user_id, name, sku, category_id, brand_id, unit_id, price, stock, status, created_at`.
- `user_roles` + `app_role` enum + `has_role()` security-definer function (admin can edit landing_sections).

RLS: each row scoped to `auth.uid() = user_id`. `landing_sections` readable by `anon`, writable by admins only. Seed default landing content in the migration.

## Step 3 — Auth
- Email/password + Google sign-in (Lovable Cloud managed).
- Public `/auth` route (sign in + sign up).
- Move dashboard routes under `src/routes/_authenticated/` so they require login.
- Header shows Sign in / avatar+sign out based on session.

## Step 4 — Dynamic landing page
- `src/routes/index.tsx` becomes a public route with a loader that reads `landing_sections` via a public server function.
- Hero/Features/Stats/Testimonials/FAQ/CTA render from the returned JSON instead of hardcoded arrays.

## Step 5 — Dashboard CRUD
For each of Products / Categories / Brands / Units:
- Server functions (`list`, `create`, `update`, `delete`) using `requireSupabaseAuth`.
- Route under `_authenticated/` using TanStack Query (`useSuspenseQuery` + `useMutation`).
- Table view + Add/Edit dialog + Delete confirm. Replaces the current static tables.
- Business Control (dashboard home) shows real counts and recent items.

## Step 6 — Admin editor for landing content (light)
A simple `/admin/landing` page (admin-only) with a JSON editor per section so the landing copy is truly editable without code.

## Technical notes
- Stack: TanStack Start server functions, `requireSupabaseAuth`, TanStack Query for reads/mutations.
- Public landing reads use a server publishable client + `TO anon` SELECT policy on `landing_sections`.
- All new tables include explicit `GRANT` statements and RLS policies.
- Existing UI (glass cards, sidebar, gradients) is preserved; only data source changes.

## Out of scope (for this pass)
- File/image uploads (product images) — can add storage later.
- Multi-tenant orgs / team sharing.
- Real invoicing/purchase/HR modules — still placeholder in the sidebar until you ask.

Approve and I'll enable Cloud and start building.