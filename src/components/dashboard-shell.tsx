import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Bell, Search, Store, Globe, LogOut, LayoutDashboard, Boxes, Warehouse, Truck,
  ReceiptText, BookUser, BookOpenText, Users, BarChart3, AlertTriangle, Settings,
  ChevronRight, Sparkles, Sun, Moon, Menu, X,
} from "lucide-react";

type Child = { name: string; to?: string; badge?: number };
type NavItem = {
  icon: typeof LayoutDashboard;
  name: string;
  to?: string;
  badge?: number;
  children?: Child[];
};

export const nav: { label: string; items: NavItem[] }[] = [
  {
    label: "Main",
    items: [
      { icon: LayoutDashboard, name: "Business Control", to: "/dashboard" },
      { icon: Boxes, name: "Product Setup", children: [
        { name: "Products", to: "/products" },
        { name: "Categories", to: "/categories" },
        { name: "Brands & Companies", to: "/brands" },
        { name: "Units of Measure", to: "/units" },
      ]},
      { icon: Settings, name: "Shop Settings" },
      { icon: Warehouse, name: "Warehouses", children: [
        { name: "Warehouse List" },
        { name: "Stock Transfer" },
        { name: "Stock Adjustment" },
        { name: "Low Stock Alerts" },
      ]},
      { icon: Truck, name: "Purchases", children: [
        { name: "Purchase Entry" },
        { name: "Purchase List" },
        { name: "Purchase Orders" },
        { name: "Lost & Damaged Items" },
        { name: "Purchase Return" },
        { name: "Supplier Payments" },
      ]},
    ],
  },
  {
    label: "Finance",
    items: [
      { icon: ReceiptText, name: "Sales & Billing", children: [
        { name: "Sales Invoice" },
        { name: "Paid Sales List" },
        { name: "Unpaid Sales List" },
        { name: "Loans" },
        { name: "Sales Return" },
        { name: "Recovery Entry" },
      ]},
      { icon: BookUser, name: "Ledgers & Profiles", children: [
        { name: "All Ledgers List" },
        { name: "Customer Ledgers" },
        { name: "Supplier Ledgers" },
        { name: "Employee Ledgers" },
        { name: "Sales Man Ledgers" },
        { name: "Expenses Ledgers" },
        { name: "General Ledgers" },
        { name: "Bank Accounts" },
        { name: "Cash & Bank Balances" },
      ]},
    ],
  },
  {
    label: "Operations",
    items: [
      { icon: Users, name: "Personnel & HR", children: [
        { name: "Ledger Statements" },
        { name: "Advance & Loans" },
        { name: "Salary Payouts" },
      ]},
      { icon: BookOpenText, name: "Finance Book", children: [
        { name: "Cash Book" },
        { name: "Bank Book" },
        { name: "Income Entry" },
        { name: "Expense Entry" },
      ]},
      { icon: BarChart3, name: "Reports Hub", children: [
        { name: "Product Report" },
        { name: "Stock Report" },
        { name: "Purchase Report" },
        { name: "Sales Report" },
      ]},
    ],
  },
];

function findParent(pathname: string): string | null {
  for (const sec of nav) for (const it of sec.items)
    if (it.children?.some((c) => c.to === pathname)) return it.name;
  return null;
}

function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const initialParent = findParent(pathname) ?? "Product Setup";
  const [openMenu, setOpenMenu] = useState<string | null>(initialParent);
  useEffect(() => {
    const p = findParent(pathname);
    if (p) setOpenMenu(p);
  }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);
  return (
    <>
      <div onClick={onClose} aria-hidden
        className={`lg:hidden fixed inset-0 z-40 bg-background/70 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} />
      <aside className={`flex flex-col w-[280px] lg:w-[264px] shrink-0 h-screen border-r border-border bg-sidebar/95 lg:bg-sidebar/70 backdrop-blur-xl
          fixed z-50 top-0 left-0 transition-transform duration-300 ease-out lg:sticky lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <button onClick={onClose} aria-label="Close menu"
          className="lg:hidden absolute top-4 right-4 h-9 w-9 grid place-items-center rounded-xl border border-border bg-card/60 text-muted-foreground hover:text-foreground">
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
                const hasActiveChild = it.children?.some((c) => c.to === pathname);
                const isSelfActive = it.to === pathname;
                const isActive = isOpen || hasActiveChild || isSelfActive;
                const topCls = `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive ? "text-foreground shadow-[var(--shadow-md)]" : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60"
                }`;
                const topStyle = isActive ? { background: "linear-gradient(135deg, oklch(0.7 0.19 285 / 0.22), oklch(0.72 0.18 320 / 0.12))", borderLeft: "2px solid oklch(0.7 0.19 285)" } : undefined;
                const topInner = (
                  <>
                    <Icon size={17} className={isActive ? "text-primary-glow" : ""} />
                    <span className="flex-1 text-left">{it.name}</span>
                    {it.badge ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "var(--gradient-sunset)" }}>{it.badge}</span>
                    ) : it.children ? (
                      <ChevronRight size={14} className={`opacity-40 group-hover:opacity-80 transition-transform ${isOpen ? "rotate-90 opacity-90" : ""}`} />
                    ) : null}
                  </>
                );
                return (
                  <div key={it.name} className="mb-1">
                    {it.children ? (
                      <button onClick={() => setOpenMenu(isOpen ? null : it.name)} aria-expanded={isOpen} className={topCls} style={topStyle}>
                        {topInner}
                      </button>
                    ) : it.to ? (
                      <Link to={it.to} onClick={onClose} className={topCls} style={topStyle}>
                        {topInner}
                      </Link>
                    ) : (
                      <button onClick={onClose} className={topCls} style={topStyle}>
                        {topInner}
                      </button>
                    )}
                    {it.children && (
                      <div className="grid transition-all duration-300 ease-out"
                        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr", opacity: isOpen ? 1 : 0 }}>
                        <div className="overflow-hidden">
                          <div className="mt-1 ml-4 pl-3 border-l border-border/60 flex flex-col gap-0.5 py-1">
                            {it.children.map((c) => {
                              const active = c.to === pathname;
                              const cls = `flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12.5px] transition-all ${
                                active ? "text-foreground bg-sidebar-accent/70 font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/40"
                              }`;
                              const inner = (
                                <>
                                  <span className={`h-1.5 w-1.5 rounded-full transition ${active ? "bg-primary-glow" : "bg-border"}`} style={active ? { boxShadow: "0 0 8px oklch(0.78 0.17 310)" } : undefined} />
                                  <span className="flex-1 text-left">{c.name}</span>
                                  {c.badge ? (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: "var(--gradient-sunset)" }}>{c.badge}</span>
                                  ) : null}
                                </>
                              );
                              return c.to ? (
                                <Link key={c.name} to={c.to} onClick={onClose} className={cls}>{inner}</Link>
                              ) : (
                                <button key={c.name} onClick={onClose} className={cls}>{inner}</button>
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

function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const saved = (typeof localStorage !== "undefined" && localStorage.getItem("theme")) as "dark" | "light" | null;
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
    <button onClick={toggle} aria-label="Toggle theme"
      className="relative h-10 w-[68px] rounded-xl border border-border bg-card/60 hover:border-primary/50 transition flex items-center px-1">
      <span className="absolute top-1 h-8 w-8 rounded-lg shadow-[var(--shadow-glow)] transition-all duration-300"
        style={{ left: isLight ? "calc(100% - 36px)" : "4px", background: "var(--gradient-primary)" }} />
      <Sun size={14} className={`relative z-10 mx-1.5 transition ${isLight ? "text-primary-foreground" : "text-muted-foreground"}`} />
      <Moon size={14} className={`relative z-10 mx-1.5 ml-auto transition ${!isLight ? "text-primary-foreground" : "text-muted-foreground"}`} />
    </button>
  );
}

function Topbar({ title, crumb, onMenuClick }: { title: string; crumb: ReactNode; onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/60 border-b border-border">
      <div className="flex items-center gap-3 px-4 sm:px-6 h-[72px]">
        <button onClick={onMenuClick} aria-label="Open menu"
          className="lg:hidden h-10 w-10 grid place-items-center rounded-xl border border-border bg-card/60 text-foreground hover:border-primary/50 transition shrink-0">
          <Menu size={18} />
        </button>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold truncate">{title}</h1>
          <p className="text-[11px] text-muted-foreground truncate hidden sm:block">{crumb}</p>
        </div>
        <div className="flex-1" />
        <div className="hidden md:flex items-center gap-2 h-10 px-3 rounded-xl border border-border bg-card/60 w-[260px]">
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

export function DashboardShell({ title, crumb, children }: { title: string; crumb: ReactNode; children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    const saved = localStorage.getItem("mobile-nav-open");
    if (saved === "true") setMobileNavOpen(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "mobile-nav-open") setMobileNavOpen(e.newValue === "true");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const set = (v: boolean) => {
    setMobileNavOpen(v);
    try { localStorage.setItem("mobile-nav-open", String(v)); } catch {}
  };
  return (
    <div className="flex min-h-screen text-foreground">
      <Sidebar mobileOpen={mobileNavOpen} onClose={() => set(false)} />
      <main className="flex-1 min-w-0">
        <Topbar title={title} crumb={crumb} onMenuClick={() => set(true)} />
        <div className="p-4 sm:p-6 space-y-6">{children}</div>
      </main>
    </div>
  );
}

export function PageHeader({ title, subtitle, icon: Icon, grad = "var(--gradient-primary)", actions }: {
  title: string; subtitle?: string; icon: typeof LayoutDashboard; grad?: string; actions?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl glass-card p-6 md:p-8">
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-40" style={{ background: grad }} />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-25" style={{ background: "var(--gradient-accent)" }} />
      <div className="relative flex flex-col md:flex-row md:items-center gap-5">
        <div className="h-14 w-14 rounded-2xl grid place-items-center text-primary-foreground shadow-[var(--shadow-glow)] shrink-0" style={{ background: grad }}>
          <Icon size={26} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl md:text-3xl font-bold leading-tight">{title}</h2>
          {subtitle && <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </section>
  );
}