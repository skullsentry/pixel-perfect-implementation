import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { LayoutDashboard, Package, Tag, Award, Ruler, TrendingUp, ArrowUpRight } from "lucide-react";
import { DashboardShell, PageHeader } from "@/components/dashboard-shell";
import { getOverview, listProducts } from "@/lib/catalog.functions";
import { Link } from "@tanstack/react-router";

const overviewQO = queryOptions({ queryKey: ["overview"], queryFn: () => getOverview() });
const recentProductsQO = queryOptions({ queryKey: ["products"], queryFn: () => listProducts() });

export const Route = createFileRoute("/_authenticated/dashboard")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(overviewQO),
      context.queryClient.ensureQueryData(recentProductsQO),
    ]);
  },
  head: () => ({ meta: [{ title: "Business Control · Mizan" }] }),
  component: DashboardPage,
});

function StatCard({ icon: Icon, label, value, grad, to }: { icon: typeof Package; label: string; value: number; grad: string; to: string }) {
  return (
    <Link to={to} className="glass-card rounded-2xl p-5 group hover:border-primary/50 transition">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl grid place-items-center text-primary-foreground shadow-[var(--shadow-glow)]" style={{ background: grad }}>
          <Icon size={22} />
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold mt-0.5">{value}</p>
        </div>
        <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-primary-glow transition" />
      </div>
    </Link>
  );
}

function DashboardPage() {
  const { data: ov } = useSuspenseQuery(overviewQO);
  const { data: products } = useSuspenseQuery(recentProductsQO);

  return (
    <DashboardShell title="Business Control" crumb="Dashboard · Overview">
      <PageHeader
        title="Welcome back"
        subtitle="Here's what's happening across your workspace today."
        icon={LayoutDashboard}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Products" value={ov.products} grad="var(--gradient-primary)" to="/products" />
        <StatCard icon={Tag} label="Categories" value={ov.categories} grad="var(--gradient-mint)" to="/categories" />
        <StatCard icon={Award} label="Brands" value={ov.brands} grad="var(--gradient-sunset)" to="/brands" />
        <StatCard icon={Ruler} label="Units" value={ov.units} grad="var(--gradient-accent)" to="/units" />
      </div>

      <section className="glass-card rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2"><TrendingUp size={18} className="text-primary-glow" /> Recent Products</h3>
          <Link to="/products" className="text-xs font-semibold text-primary-glow">View all →</Link>
        </div>
        {products.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No products yet.</p>
            <Link to="/products" className="inline-block mt-3 px-4 py-2 rounded-xl text-primary-foreground text-sm font-semibold" style={{ background: "var(--gradient-primary)" }}>
              Add your first product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="py-2">Name</th><th>SKU</th><th>Cost</th><th>Retail</th><th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 6).map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="py-3 font-medium">{p.name}</td>
                    <td className="text-muted-foreground">{p.sku ?? "—"}</td>
                    <td>Rs {Number(p.cost_price).toLocaleString()}</td>
                    <td>Rs {Number(p.retail_price).toLocaleString()}</td>
                    <td>{p.stock_shelf + p.stock_warehouse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
