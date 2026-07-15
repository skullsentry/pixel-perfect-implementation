import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Bell,
  Search,
  Store,
  Globe,
  LogOut,
  LayoutDashboard,
  Boxes,
  Warehouse,
  Truck,
  ReceiptText,
  BookUser,
  BookOpenText,
  Users,
  BarChart3,
  AlertTriangle,
  Settings,
  FileText,
  ShoppingCart,
  BookOpen,
  UserCog,
  TrendingUp,
  Coins,
  HandCoins,
  Landmark,
  PiggyBank,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  Trophy,
  ChevronRight,
  Sparkles,
  Download,
  Printer,
  CircleCheck,
  CircleMinus,
  Zap,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

/* ------------------------------- Data ---------------------------------- */

type NavItem = {
  icon: typeof LayoutDashboard;
  name: string;
  active?: boolean;
  badge?: number;
  children?: { name: string; badge?: number }[];
};
const nav: { label: string; items: NavItem[] }[] = [
  {
    label: "Main",
    items: [
      {
        icon: LayoutDashboard,
        name: "Business Control",
        active: true,
        children: [
          { name: "Overview" },
          { name: "Live Activity" },
          { name: "Daybook" },
        ],
      },
      {
        icon: Boxes,
        name: "Product Setup",
        children: [
          { name: "All Products" },
          { name: "Categories" },
          { name: "Units & Variants" },
          { name: "Pricing Rules" },
        ],
      },
      {
        icon: Warehouse,
        name: "Warehouses",
        children: [
          { name: "Locations" },
          { name: "Stock Transfer" },
          { name: "Stock Adjustment" },
        ],
      },
      {
        icon: Truck,
        name: "Purchases",
        children: [
          { name: "New Purchase" },
          { name: "Purchase History" },
          { name: "Purchase Returns" },
        ],
      },
    ],
  },
  {
    label: "Finance",
    items: [
      {
        icon: ReceiptText,
        name: "Sales & Billing",
        children: [
          { name: "New Invoice" },
          { name: "Invoice History" },
          { name: "Sales Returns" },
          { name: "Quotations" },
        ],
      },
      {
        icon: BookUser,
        name: "Ledgers & Profiles",
        children: [
          { name: "Customers" },
          { name: "Suppliers" },
          { name: "Account Groups" },
        ],
      },
      {
        icon: BookOpenText,
        name: "Finance Book",
        children: [
          { name: "Cash Book" },
          { name: "Bank Book" },
          { name: "Expenses" },
          { name: "Journal Entries" },
        ],
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        icon: Users,
        name: "Personnel & HR",
        children: [
          { name: "Employees" },
          { name: "Attendance" },
          { name: "Payroll" },
        ],
      },
      {
        icon: BarChart3,
        name: "Reports Hub",
        children: [
          { name: "Sales Reports" },
          { name: "Purchase Reports" },
          { name: "Inventory Reports" },
          { name: "Profit & Loss" },
        ],
      },
      {
        icon: AlertTriangle,
        name: "Low Stock",
        badge: 6,
        children: [
          { name: "Reorder List", badge: 6 },
          { name: "Out of Stock" },
          { name: "Reorder Rules" },
        ],
      },
      {
        icon: Settings,
        name: "Shop Settings",
        children: [
          { name: "Profile" },
          { name: "Users & Roles" },
          { name: "Preferences" },
          { name: "Backups" },
        ],
      },
    ],
  },
];

const shortcuts = [
  { icon: FileText, label: "Sales Invoice", grad: "var(--gradient-primary)" },
  { icon: Boxes, label: "Products Catalog", grad: "var(--gradient-cool)" },
  { icon: ShoppingCart, label: "Log Purchase", grad: "var(--gradient-mint)" },
  { icon: BookOpen, label: "Cash Book", grad: "var(--gradient-gold)" },
  { icon: UserCog, label: "HR & Staff", grad: "var(--gradient-rose)" },
  { icon: TrendingUp, label: "Sales Report", grad: "var(--gradient-accent)" },
];

const kpis = [
  { icon: Coins, label: "Total Sales Revenue", value: "Rs 40,850", sub: "All cash & credit sales", trend: "+12.4%", up: true, grad: "var(--gradient-primary)" },
  { icon: Truck, label: "Total Purchases", value: "Rs 1,72,500", sub: "All supplier purchases", trend: "+3.1%", up: false, grad: "var(--gradient-sunset)" },
  { icon: HandCoins, label: "Customer Dues", value: "Rs 2,100", sub: "Outstanding credit", trend: "Needs attention", up: false, grad: "var(--gradient-warm)" },
  { icon: Wallet, label: "Cash in Hand", value: "Rs 13,050", sub: "Shop net cash balance", trend: "Healthy", up: true, grad: "var(--gradient-mint)" },
  { icon: Zap, label: "Today's Collection", value: "Rs 0", sub: "Sales & recoveries today", trend: "No collection yet", up: false, grad: "var(--gradient-cool)" },
  { icon: Landmark, label: "Supplier Dues", value: "Rs 1,72,500", sub: "Dues to suppliers", trend: "High payables", up: false, grad: "var(--gradient-rose)" },
  { icon: AlertTriangle, label: "Low Stock Items", value: "6", sub: "Below reorder limit", trend: "Reorder required", up: false, grad: "var(--gradient-gold)" },
  { icon: PiggyBank, label: "Bank Balance", value: "Rs 2,450", sub: "All bank accounts", trend: "Stable", up: true, grad: "var(--gradient-accent)" },
];

const lowStock = [
  { name: "Lectogen 2", sku: "SKU-MLK-002-1B", qty: "-1", unit: "Small", severity: "danger" },
  { name: "Lux Soap", sku: "SKU-COS-001-1B", qty: "-4", unit: "Pack", severity: "danger" },
  { name: "Organic Cane Sugar (1kg)", sku: "SKU-GEN-SGR-OKG", qty: "0", unit: "Pack", severity: "warn" },
  { name: "Premium Basmati Rice (5kg)", sku: "SKU-GEN-RCE-5KT", qty: "0", unit: "Pack", severity: "warn" },
  { name: "Taj Shampoo", sku: "SKU-KTC-001-1B", qty: "0", unit: "Ltr", severity: "warn" },
  { name: "Whole Wheat Flour (20kg)", sku: "SKU-GEN-FLR-20K", qty: "0", unit: "Bag", severity: "warn" },
];

const topProducts = [
  { rank: 1, name: "Lectogen 1", cat: "Inizio", qty: "17 Gram", amount: "Rs 22,100" },
  { rank: 2, name: "Lifebouy Shampoo", cat: "Inizio", qty: "13 Pack", amount: "Rs 1,950" },
  { rank: 3, name: "Lux Soap", cat: "Inizio", qty: "4 Pack", amount: "Rs 800" },
  { rank: 4, name: "Lectogen 2", cat: "Inizio", qty: "1 Small", amount: "Rs 1,000" },
  { rank: 5, name: "Longi 585 Watt", cat: "Inizio", qty: "1 Pack", amount: "Rs 15,200" },
];

const activity = [
  { date: "2026-06-30", ref: "INV-2026-7715", type: "Income", cat: "Sales", desc: "Invoice payment: INV-2026-7715 · Cash", amount: "+Rs 13,500", pos: true },
  { date: "2026-06-30", ref: "INV-2026-7573", type: "Income", cat: "Sales", desc: "Cash sale invoice: INV-2026-7573", amount: "+Rs 2,900", pos: true },
  { date: "2026-06-28", ref: "COLL-1782598046", type: "Income", cat: "Collection", desc: "Credit collection from Sajid Store · Bank Transfer", amount: "+Rs 5,200", pos: true },
  { date: "2026-06-27", ref: "EXP-2026-0311", type: "Expense", cat: "Utilities", desc: "Electricity bill payment · Cash", amount: "-Rs 3,450", pos: false },
  { date: "2026-06-26", ref: "PUR-2026-8842", type: "Expense", cat: "Purchases", desc: "Stock replenishment from Inizio Distributors", amount: "-Rs 42,000", pos: false },
];

/* --------------------------- Small pieces ------------------------------ */

function GradientIcon({ Icon, grad, size = 44 }: { Icon: React.ComponentType<{ size?: number; className?: string }>; grad: string; size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-2xl text-white shadow-[0_8px_24px_-6px_oklch(0_0_0/0.5)]"
      style={{ width: size, height: size, background: grad }}
    >
      <Icon size={size * 0.5} />
    </div>
  );
}

/* ------------------------------ Layout --------------------------------- */

function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const [openMenu, setOpenMenu] = useState<string | null>("Business Control");
  const [activeChild, setActiveChild] = useState<string>("Overview");
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);
  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={onClose}
        aria-hidden
        className={`lg:hidden fixed inset-0 z-40 bg-background/70 backdrop-blur-sm transition-opacity duration-300 ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`flex flex-col w-[280px] lg:w-[264px] shrink-0 h-screen border-r border-border bg-sidebar/95 lg:bg-sidebar/70 backdrop-blur-xl
          fixed z-50 top-0 left-0 transition-transform duration-300 ease-out
          lg:sticky lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="lg:hidden absolute top-4 right-4 h-9 w-9 grid place-items-center rounded-xl border border-border bg-card/60 text-muted-foreground hover:text-foreground"
        >
          <X size={16} />
        </button>
      <div className="flex items-center gap-3 px-5 pt-6 pb-5">
        <div className="h-11 w-11 rounded-2xl grid place-items-center text-primary-foreground shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-primary)" }}>
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="text-[15px] font-bold leading-none">Insaf Trading</h2>
          <p className="text-[11px] text-muted-foreground mt-1">Protected Workspace</p>
        </div>
      </div>

      <div className="px-3 py-3 flex-1 overflow-y-auto">
        {nav.map((sec) => (
          <div key={sec.label} className="mb-5">
            <div className="px-3 mb-2 text-[10px] tracking-[0.18em] font-semibold text-muted-foreground uppercase">{sec.label}</div>
            {sec.items.map((it) => {
              const Icon = it.icon;
              const isOpen = openMenu === it.name;
              const isActive = isOpen || it.active;
              return (
                <div key={it.name} className="mb-1">
                  <button
                    onClick={() => setOpenMenu(isOpen ? null : it.name)}
                    aria-expanded={isOpen}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      isActive
                        ? "text-foreground shadow-[var(--shadow-md)]"
                        : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60"
                    }`}
                    style={isActive ? { background: "linear-gradient(135deg, oklch(0.7 0.19 285 / 0.22), oklch(0.72 0.18 320 / 0.12))", borderLeft: "2px solid oklch(0.7 0.19 285)" } : undefined}
                  >
                    <Icon size={17} className={isActive ? "text-primary-glow" : ""} />
                    <span className="flex-1 text-left">{it.name}</span>
                    {it.badge ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "var(--gradient-sunset)" }}>{it.badge}</span>
                    ) : (
                      <ChevronRight
                        size={14}
                        className={`opacity-40 group-hover:opacity-80 transition-transform ${isOpen ? "rotate-90 opacity-90" : ""}`}
                      />
                    )}
                  </button>
                  {it.children && (
                    <div
                      className="grid transition-all duration-300 ease-out"
                      style={{
                        gridTemplateRows: isOpen ? "1fr" : "0fr",
                        opacity: isOpen ? 1 : 0,
                      }}
                    >
                      <div className="overflow-hidden">
                        <div className="mt-1 ml-4 pl-3 border-l border-border/60 flex flex-col gap-0.5 py-1">
                          {it.children.map((c) => {
                            const active = isOpen && activeChild === c.name;
                            return (
                              <button
                                key={c.name}
                                onClick={() => { setActiveChild(c.name); onClose(); }}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12.5px] transition-all ${
                                  active
                                    ? "text-foreground bg-sidebar-accent/70 font-semibold"
                                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/40"
                                }`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full transition ${
                                    active ? "bg-primary-glow shadow-[0_0_8px_var(--primary-glow,theme(colors.primary.DEFAULT))]" : "bg-border"
                                  }`}
                                />
                                <span className="flex-1 text-left">{c.name}</span>
                                {c.badge ? (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: "var(--gradient-sunset)" }}>
                                    {c.badge}
                                  </span>
                                ) : null}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mx-3 mb-4 p-3 rounded-2xl glass-card flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl grid place-items-center font-bold text-primary-foreground" style={{ background: "var(--gradient-accent)" }}>HK</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">Haji Karim Khan</p>
          <p className="text-[11px] text-muted-foreground">Admin</p>
        </div>
        <button className="h-8 w-8 rounded-lg grid place-items-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"><LogOut size={15} /></button>
      </div>
      </aside>
    </>
  );
}

function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/60 border-b border-border">
      <div className="flex items-center gap-3 px-4 sm:px-6 h-[72px]">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="lg:hidden h-10 w-10 grid place-items-center rounded-xl border border-border bg-card/60 text-foreground hover:border-primary/50 transition shrink-0"
        >
          <Menu size={18} />
        </button>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold truncate">Dashboard</h1>
          <p className="text-[11px] text-muted-foreground truncate hidden sm:block">Insaf Trading Company › General › <span className="text-foreground font-semibold">Overview</span></p>
        </div>
        <div className="flex-1" />
        <div className="hidden md:flex items-center gap-2 h-10 px-3 rounded-xl border border-border bg-card/60 w-[280px]">
          <Search size={15} className="text-muted-foreground" />
          <input className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground" placeholder="Search invoices, products…" />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">⌘K</kbd>
        </div>
        <button className="hidden sm:flex items-center gap-2 h-10 px-3 rounded-xl border border-border bg-card/60 text-sm hover:border-primary/50 transition">
          <Store size={15} className="text-primary-glow" /> Store Admin
        </button>
        <ThemeToggle />
        <button className="hidden sm:flex items-center gap-2 h-10 px-3 rounded-xl border border-border bg-card/60 text-sm hover:border-primary/50 transition">
          <Globe size={15} /> EN
        </button>
        <button className="relative h-10 w-10 grid place-items-center rounded-xl border border-border bg-card/60 hover:border-primary/50 transition">
          <Bell size={16} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive animate-[pulse-ring_1.8s_ease-out_infinite]" />
        </button>
        <div className="h-10 w-10 shrink-0 rounded-xl grid place-items-center font-bold text-primary-foreground text-sm shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-primary)" }}>HK</div>
      </div>
    </header>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const saved = (typeof localStorage !== "undefined" && localStorage.getItem("theme")) as
      | "dark"
      | "light"
      | null;
    const initial = saved ?? "dark";
    setTheme(initial);
    document.documentElement.classList.toggle("light", initial === "light");
    const onStorage = (e: StorageEvent) => {
      if (e.key !== "theme" || !e.newValue) return;
      const next = e.newValue === "light" ? "light" : "dark";
      setTheme(next);
      document.documentElement.classList.toggle("light", next === "light");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("light", next === "light");
    try { localStorage.setItem("theme", next); } catch {}
  };
  const isLight = theme === "light";
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative h-10 w-[68px] rounded-xl border border-border bg-card/60 hover:border-primary/50 transition flex items-center px-1"
    >
      <span
        className="absolute top-1 h-8 w-8 rounded-lg shadow-[var(--shadow-glow)] transition-all duration-300"
        style={{
          left: isLight ? "calc(100% - 36px)" : "4px",
          background: "var(--gradient-primary)",
        }}
      />
      <Sun size={14} className={`relative z-10 mx-1.5 transition ${isLight ? "text-primary-foreground" : "text-muted-foreground"}`} />
      <Moon size={14} className={`relative z-10 mx-1.5 ml-auto transition ${!isLight ? "text-primary-foreground" : "text-muted-foreground"}`} />
    </button>
  );
}

/* ---------------------------- Chart data ------------------------------- */

const chartData = [
  { m: "Jan", rev: 22400, exp: 15200 },
  { m: "Feb", rev: 28100, exp: 17500 },
  { m: "Mar", rev: 26800, exp: 19200 },
  { m: "Apr", rev: 34200, exp: 21400 },
  { m: "May", rev: 31200, exp: 22800 },
  { m: "Jun", rev: 40850, exp: 27600 },
  { m: "Jul", rev: 38500, exp: 25100 },
  { m: "Aug", rev: 44200, exp: 29800 },
];

/* ------------------------------ Page ----------------------------------- */

function Dashboard() {
  const [range, setRange] = useState<"1M" | "3M" | "6M" | "1Y">("6M");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    const saved = localStorage.getItem("mobile-nav-open");
    if (saved === "true") setMobileNavOpen(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "mobile-nav-open") {
        setMobileNavOpen(e.newValue === "true");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const setMobileNavOpenPersisted = (next: boolean | ((prev: boolean) => boolean)) => {
    setMobileNavOpen((prev) => {
      const value = typeof next === "function" ? next(prev) : next;
      try { localStorage.setItem("mobile-nav-open", String(value)); } catch {}
      return value;
    });
  };
  const totals = useMemo(() => {
    const rev = chartData.reduce((s, d) => s + d.rev, 0);
    const exp = chartData.reduce((s, d) => s + d.exp, 0);
    return { rev, exp, net: rev - exp };
  }, []);

  return (
    <div className="flex min-h-screen text-foreground">
      <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpenPersisted(false)} />
      <main className="flex-1 min-w-0">
        <Topbar onMenuClick={() => setMobileNavOpenPersisted(true)} />

        <div className="p-6 space-y-8">
          {/* HERO */}
          <section className="relative overflow-hidden rounded-3xl glass-card p-6 md:p-8">
            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-40" style={{ background: "var(--gradient-primary)" }} />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-30" style={{ background: "var(--gradient-accent)" }} />
            <div className="relative flex flex-col md:flex-row md:items-end gap-6 md:gap-10">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 text-[11px] font-semibold px-3 py-1 rounded-full border border-border bg-card/60 mb-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> LIVE · Monday, 13 Jul 2026
                </div>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  Good morning, <span className="text-gradient">Haji Karim</span>
                </h2>
                <p className="text-muted-foreground mt-2 max-w-xl">
                  Your shop is up <span className="text-success font-semibold">+12.4%</span> vs last month.
                  Six items need reordering and today's collection is still pending.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 md:gap-6">
                {[
                  { l: "Revenue", v: "Rs 40.8K", g: "var(--gradient-primary)" },
                  { l: "Net Cash", v: "Rs 13K", g: "var(--gradient-mint)" },
                  { l: "Orders", v: "128", g: "var(--gradient-cool)" },
                ].map((s) => (
                  <div key={s.l} className="min-w-[100px] rounded-2xl p-4 border border-border bg-card/40">
                    <p className="text-[10px] tracking-widest text-muted-foreground uppercase">{s.l}</p>
                    <p className="text-xl md:text-2xl font-bold mt-1" style={{ backgroundImage: s.g, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{s.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SHORTCUTS */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">Quick Actions</h3>
              <button className="text-xs font-semibold text-primary-glow hover:underline">Customize</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {shortcuts.map((s) => (
                <button key={s.label} className="glass-card hover-lift p-4 flex flex-col items-start gap-3 text-left">
                  <GradientIcon Icon={s.icon} grad={s.grad} />
                  <span className="text-sm font-semibold">{s.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* KPIs */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">Financial Overview</h3>
              <div className="flex items-center gap-1 p-1 rounded-xl border border-border bg-card/50">
                {(["1M", "3M", "6M", "1Y"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                      range === r ? "text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
                    }`}
                    style={range === r ? { background: "var(--gradient-primary)" } : undefined}
                  >{r}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map((k) => {
                const Icon = k.icon;
                const TrendIcon = k.up ? ArrowUpRight : ArrowDownRight;
                return (
                  <div key={k.label} className="glass-card hover-lift p-5 relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl" style={{ background: k.grad }} />
                    <div className="flex items-start justify-between relative">
                      <GradientIcon Icon={Icon} grad={k.grad} size={42} />
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full ${k.up ? "text-success bg-success/10" : "text-destructive bg-destructive/10"}`}>
                        <TrendIcon size={12} /> {k.trend}
                      </span>
                    </div>
                    <p className="text-[11px] tracking-wider uppercase text-muted-foreground mt-4">{k.label}</p>
                    <p className="text-2xl font-bold mt-1">{k.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* CHART + TOP PRODUCTS */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="glass-card p-5 xl:col-span-2">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div>
                  <h3 className="text-base font-bold">Cash Book Analytics</h3>
                  <p className="text-xs text-muted-foreground">Inflow vs outflow · last 8 months</p>
                </div>
                <div className="flex-1" />
                <div className="flex items-center gap-4 text-xs">
                  <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: "oklch(0.7 0.19 285)" }} /> Revenue</span>
                  <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: "oklch(0.7 0.22 15)" }} /> Expenses</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <Stat label="Total Revenue" value={`Rs ${totals.rev.toLocaleString()}`} tint="var(--gradient-primary)" />
                <Stat label="Total Expenses" value={`Rs ${totals.exp.toLocaleString()}`} tint="var(--gradient-sunset)" />
                <Stat label="Net Profit" value={`Rs ${totals.net.toLocaleString()}`} tint="var(--gradient-mint)" />
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.7 0.19 285)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="oklch(0.7 0.19 285)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.7 0.22 15)" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="oklch(0.7 0.22 15)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 6" stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                    <XAxis dataKey="m" stroke="oklch(0.74 0.03 265)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="oklch(0.74 0.03 265)" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "oklch(0.23 0.045 275)",
                        border: "1px solid oklch(1 0 0 / 0.1)",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                    />
                    <Area type="monotone" dataKey="rev" stroke="oklch(0.7 0.19 285)" strokeWidth={2.5} fill="url(#gRev)" />
                    <Area type="monotone" dataKey="exp" stroke="oklch(0.7 0.22 15)" strokeWidth={2.5} fill="url(#gExp)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Flame size={16} className="text-warning" />
                <h3 className="text-base font-bold">Top Selling Products</h3>
                <div className="flex-1" />
                <a className="text-xs font-semibold text-primary-glow hover:underline cursor-pointer">All →</a>
              </div>
              <div className="space-y-2">
                {topProducts.map((p) => {
                  const gradByRank =
                    p.rank === 1 ? "var(--gradient-gold)" :
                    p.rank === 2 ? "var(--gradient-cool)" :
                    p.rank === 3 ? "var(--gradient-sunset)" :
                    "linear-gradient(135deg, oklch(0.4 0.03 275), oklch(0.32 0.04 275))";
                  return (
                    <div key={p.rank} className="flex items-center gap-3 p-3 rounded-xl hover:bg-card/60 transition group">
                      <div className="relative">
                        <div className="h-11 w-11 rounded-xl grid place-items-center font-bold text-primary-foreground" style={{ background: gradByRank }}>
                          {p.rank <= 3 ? <Trophy size={16} /> : p.rank}
                        </div>
                        {p.rank <= 3 && <span className="absolute -bottom-1 -right-1 text-[10px] font-bold h-4 w-4 grid place-items-center rounded-full bg-card border border-border">{p.rank}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{p.name}</p>
                        <p className="text-[11px] text-muted-foreground">{p.cat} · {p.qty} sold</p>
                      </div>
                      <p className="text-sm font-bold text-success">{p.amount}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* LOW STOCK + ACTIVITY */}
          <section className="grid grid-cols-1 xl:grid-cols-5 gap-5">
            <div className="glass-card p-5 xl:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-xl grid place-items-center" style={{ background: "oklch(0.83 0.16 78 / 0.15)" }}>
                  <AlertTriangle size={16} className="text-warning" />
                </div>
                <h3 className="text-base font-bold">Low Stock Alert</h3>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full text-white" style={{ background: "var(--gradient-sunset)" }}>6 items</span>
                <div className="flex-1" />
                <a className="text-xs font-semibold text-primary-glow hover:underline cursor-pointer">View All →</a>
              </div>
              <div className="space-y-2">
                {lowStock.map((s) => (
                  <div key={s.sku} className="flex items-center gap-3 p-3 rounded-xl border border-border/60 hover:border-border transition">
                    <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${s.severity === "danger" ? "bg-destructive" : "bg-warning"}`} style={{ boxShadow: `0 0 12px ${s.severity === "danger" ? "oklch(0.68 0.22 20 / 0.7)" : "oklch(0.83 0.16 78 / 0.6)"}` }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{s.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">SKU: {s.sku}</p>
                    </div>
                    <div className={`text-right ${s.severity === "danger" ? "text-destructive" : "text-warning"}`}>
                      <p className="text-sm font-bold">{s.qty} {s.unit}</p>
                      <p className="text-[10px] text-muted-foreground">Left</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-5 xl:col-span-3">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h3 className="text-base font-bold">Recent Activity Log</h3>
                <a className="text-xs font-semibold text-primary-glow hover:underline cursor-pointer">View Cash Book</a>
                <div className="flex-1" />
                <button className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-border bg-card/60 hover:border-primary/50 transition">
                  <Download size={13} /> CSV
                </button>
                <button className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-border bg-card/60 hover:border-primary/50 transition">
                  <Printer size={13} /> Print
                </button>
              </div>
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[10px] tracking-wider text-muted-foreground uppercase">
                      <th className="font-semibold px-2 py-3">Date</th>
                      <th className="font-semibold px-2 py-3">Reference</th>
                      <th className="font-semibold px-2 py-3">Type</th>
                      <th className="font-semibold px-2 py-3">Description</th>
                      <th className="font-semibold px-2 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activity.map((a) => (
                      <tr key={a.ref} className="border-t border-border/60 hover:bg-card/40 transition">
                        <td className="px-2 py-3 text-muted-foreground whitespace-nowrap">{a.date}</td>
                        <td className="px-2 py-3">
                          <span className="font-mono text-[11px] font-semibold text-primary-glow">{a.ref}</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${a.pos ? "text-success bg-success/10" : "text-destructive bg-destructive/10"}`}>
                            {a.pos ? <CircleCheck size={11} /> : <CircleMinus size={11} />} {a.type}
                          </span>
                        </td>
                        <td className="px-2 py-3 text-muted-foreground max-w-[280px] truncate">{a.desc}</td>
                        <td className={`px-2 py-3 text-right font-bold whitespace-nowrap ${a.pos ? "text-success" : "text-destructive"}`}>{a.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <footer className="pt-2 pb-6 text-center text-[11px] text-muted-foreground">
            © 2026 Insaf Trading Company · Crafted for merchants who count every rupee.
          </footer>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value, tint }: { label: string; value: string; tint: string }) {
  return (
    <div className="rounded-2xl p-4 border border-border bg-card/40 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-0.5" style={{ background: tint }} />
      <p className="text-[10px] tracking-widest uppercase text-muted-foreground">{label}</p>
      <p className="text-lg font-bold mt-1" style={{ backgroundImage: tint, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{value}</p>
    </div>
  );
}
