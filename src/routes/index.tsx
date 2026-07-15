import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mizan — Cloud ERP for businesses that run on stock" },
      {
        name: "description",
        content:
          "Simplify inventory, billing, purchases, party ledgers, payroll and reporting — one cloud platform for traders, distributors and multi-store businesses.",
      },
      { property: "og:title", content: "Mizan — Cloud ERP for stock-based businesses" },
      {
        property: "og:description",
        content:
          "Inventory, sales, finance and reporting in one secure portal, built for traders and distributors.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

const COMPANY = "Mizan";

type TabKey = "inventory" | "sales" | "finance" | "insights";
type TabData = {
  title: string;
  body: string;
  label: string;
  kpis: { label: string; val: string; trend?: string }[];
  rows: { title: string; desc: string; time: string }[];
};

const TABS: Record<TabKey, TabData> = {
  inventory: {
    title: "Multi-warehouse inventory in real time.",
    body: "Track stock across warehouses, transfer with one click and let alerts catch low stock before customers do.",
    label: "Inventory",
    kpis: [
      { label: "SKUs tracked", val: "12,840" },
      { label: "Warehouses", val: "6" },
      { label: "Low stock alerts", val: "23" },
      { label: "Stock value", val: "Rs 12.4M", trend: "+2.1%" },
    ],
    rows: [
      { title: "Transfer #221", desc: "WH-A → WH-B · 240 units", time: "Now" },
      { title: "Adjustment", desc: "Damage write-off · 12 units", time: "32m" },
      { title: "Reorder PO #88", desc: "Apex Distribution · 1,200 units", time: "2h" },
    ],
  },
  sales: {
    title: "Invoice in seconds, not minutes.",
    body: "Keyboard-first billing with returns, credit notes, party ledger sync, and instant billing layouts.",
    label: "Sales",
    kpis: [
      { label: "Today's Sales", val: "Rs 842K", trend: "+18%" },
      { label: "Active Invoices", val: "128" },
      { label: "Product Returns", val: "4" },
      { label: "Receivables (AR)", val: "Rs 1.8M" },
    ],
    rows: [
      { title: "Invoice INV-2291", desc: "Insaf Trading · Rs 184,500", time: "Now" },
      { title: "Invoice INV-2290", desc: "Golden Ent. · Rs 56,200", time: "9m" },
      { title: "Credit note CN-118", desc: "Star Logistics · Rs 12,000", time: "1h" },
    ],
  },
  finance: {
    title: "Every transaction, one ledger.",
    body: "Real-time party balances, bank books, trial balance, and profit & loss sheets generated as you transact.",
    label: "Finance",
    kpis: [
      { label: "Revenue (MTD)", val: "Rs 4.2M", trend: "+12%" },
      { label: "Cost of Goods", val: "Rs 2.8M", trend: "66%" },
      { label: "Net profit", val: "Rs 980K", trend: "+12.4%" },
      { label: "Cash in Hand", val: "Rs 3.1M" },
    ],
    rows: [
      { title: "Bank transfer", desc: "HBL → Meezan · Rs 500,000", time: "11m" },
      { title: "Supplier payment", desc: "Prime Solutions · Rs 220,000", time: "1h" },
      { title: "P&L updated", desc: "June close · Rs 980K net", time: "3h" },
    ],
  },
  insights: {
    title: "Data-driven insights to scale.",
    body: "Real-time reporting on salesman commissions, low-stock forecasts, customer dues, and profit audits.",
    label: "Insights",
    kpis: [
      { label: "Weekly Growth", val: "+12.5%", trend: "growth" },
      { label: "New Clients", val: "142" },
      { label: "Conversion Rate", val: "8.4%" },
      { label: "Top Selling SKU", val: "Panadol" },
    ],
    rows: [
      { title: "Revenue report", desc: "Q2 close · Rs 4.2M", time: "Today" },
      { title: "Stock aging", desc: "23 SKUs > 90 days in storage", time: "1h" },
      { title: "Top customer", desc: "Insaf · 18% total revenue", time: "3h" },
    ],
  },
};

const CLIENTS = [
  "Insaf Trading", "Care Pharmacy", "Apex Distribution", "City Traders",
  "Al-Rashid Group", "Prime Solutions", "Golden Enterprises", "Star Logistics",
];

const FAQS = [
  { q: "What is Mizan?", a: "Mizan is a cloud ERP for traders and distributors — inventory, sales, purchases, finance, HR and reporting in a single secure portal." },
  { q: "Can I manage multiple stores and warehouses?", a: "Yes. Run unlimited stores and warehouses with isolated data and consolidated reports across the group." },
  { q: "How is my data secured?", a: "Role-based access, encrypted at rest, daily backups and isolated tenant portals. You decide who sees what." },
  { q: "Does it work in multiple currencies?", a: "Yes — 100+ currencies with real-time conversion and consolidated reporting." },
  { q: "What support do I get?", a: "Onboarding, data migration and ongoing technical support from a dedicated team." },
];

const styles = `
:root{--violet:#7c3aed;--violet-deep:#6d28d9;--violet-soft:#a78bfa;--violet-tint:#f5f3ff;--ink:#18142c;--ink-soft:#475569;--success:#10b981;--amber:#f59e0b;}
.mz-body{font-family:'Inter',ui-sans-serif,system-ui,sans-serif;color:#0f172a;background:#fff;-webkit-font-smoothing:antialiased;}
.mz-outfit{font-family:'Outfit','Inter',sans-serif;}
.mz-mono{font-family:'JetBrains Mono',monospace;}
.mz-lavender{background:radial-gradient(60% 80% at 50% 0%,oklch(0.92 0.07 295/0.6) 0%,transparent 60%),radial-gradient(40% 50% at 90% 30%,oklch(0.9 0.09 320/0.45) 0%,transparent 60%),radial-gradient(45% 55% at 10% 40%,oklch(0.92 0.06 270/0.5) 0%,transparent 60%),linear-gradient(180deg,#f5f3ff 0%,#fff 70%);}
.mz-grad{background-image:linear-gradient(135deg,#7c3aed 0%,#a78bfa 100%);}
.mz-text-grad{background-image:linear-gradient(120deg,#7c3aed 0%,#a78bfa 100%);-webkit-background-clip:text;background-clip:text;color:transparent;}
@keyframes mz-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.mz-marquee{animation:mz-marquee 40s linear infinite;}
@keyframes mz-float{0%,100%{transform:translate(0,0) rotate(var(--tilt,0deg))}50%{transform:translate(0,-8px) rotate(var(--tilt,0deg))}}
.mz-float{animation:mz-float 6s ease-in-out infinite;}
.mz-faq-a{transition:max-height .3s ease-out,padding .3s ease;}
`;

function Icon({ d, w = 16, sw = 2, className = "" }: { d: string; w?: number; sw?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={w} height={w} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} dangerouslySetInnerHTML={{ __html: d }} />
  );
}

const I = {
  star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
  arrow: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
  cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
  cam: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
  bars: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  book: '<rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><line x1="12" y1="4" x2="12" y2="20"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  bolt: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  trend: '<path d="M23 6l-9.5 9.5-5-5L1 18"/><polyline points="17 6 23 6 23 12"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  grid: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/>',
  menu: '<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  extlink: '<line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>',
};

function LandingPage() {
  const [tab, setTab] = useState<TabKey>("inventory");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const data = TABS[tab];

  // Load Google Fonts once on client
  useEffect(() => {
    if (document.getElementById("mz-fonts")) return;
    const l = document.createElement("link");
    l.id = "mz-fonts";
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap";
    document.head.appendChild(l);
  }, []);

  return (
    <div className="mz-body min-h-screen">
      <style>{styles}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 px-3 sm:px-4">
        <div className="mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-full border border-slate-200/60 bg-white/85 px-2.5 py-2 shadow-[0_4px_30px_-12px_rgba(124,58,237,0.15)] backdrop-blur-xl sm:mt-4 sm:px-3 md:px-5">
          <a href="/" className="flex items-center gap-2 pl-1.5 sm:pl-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full mz-grad text-white">
              <Icon d={I.star} sw={2.5} />
            </span>
            <span className="mz-outfit text-lg font-bold tracking-tight sm:text-xl">{COMPANY}</span>
          </a>
          <nav className="hidden items-center gap-1 md:flex">
            {[["#why","Solutions"],["#features","Features"],["#dashboard","Dashboard"],["#faq","FAQ"]].map(([h,l])=>(
              <a key={h} href={h} className="rounded-full px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-[var(--violet-tint)] hover:text-slate-900">{l}</a>
            ))}
          </nav>
          <div className="flex items-center gap-1.5">
            <Link to="/dashboard" className="hidden rounded-full px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 sm:inline-flex">Log In</Link>
            <a href="#cta" className="inline-flex items-center gap-1.5 rounded-full mz-grad px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(124,58,237,0.5)] transition-transform hover:-translate-y-0.5">Book a Demo</a>
            <button type="button" onClick={()=>setMenuOpen(v=>!v)} aria-label="Menu" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-900 transition-colors hover:bg-[var(--violet-tint)] md:hidden">
              <Icon d={menuOpen ? I.x : I.menu} w={20} />
            </button>
          </div>
        </div>
        <div className={`mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-xl backdrop-blur-xl transition-all duration-300 md:hidden ${menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
          <nav className="flex flex-col p-3">
            {[["#why","Solutions"],["#features","Features"],["#dashboard","Dashboard"],["#faq","FAQ"]].map(([h,l])=>(
              <a key={h} href={h} onClick={()=>setMenuOpen(false)} className="rounded-2xl px-4 py-3 text-base font-medium text-slate-900 hover:bg-[var(--violet-tint)]">{l}</a>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-slate-200 pt-3">
              <Link to="/dashboard" className="rounded-full border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-900 hover:bg-[var(--violet-tint)]">Log In</Link>
              <a href="#cta" className="inline-flex items-center justify-center gap-1.5 rounded-full mz-grad px-4 py-2.5 text-sm font-semibold text-white shadow-md">Book a Demo</a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden mz-lavender">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-12 text-center sm:px-6 sm:pb-24 sm:pt-20 md:pt-28 md:pb-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--violet)]/15 bg-[var(--violet-tint)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--violet)] sm:px-4 sm:text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--violet)]" />
            #1 Cloud ERP for stock-based businesses
          </div>
          <h1 className="mz-outfit mx-auto mt-6 max-w-5xl text-[2.25rem] font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl md:text-7xl lg:text-[88px] md:leading-[1.02]">
            Business Management &amp; <span className="mz-text-grad">Inventory</span> Software for <span className="mz-text-grad">Traders</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-500 sm:mt-7 sm:text-lg md:text-xl">
            Simplify inventory, billing, purchases, party ledgers, payroll and reporting — all in one easy-to-use cloud platform built for traders, distributors and multi-store businesses.
          </p>
          <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center">
            <a href="#cta" className="group inline-flex items-center justify-center gap-2 rounded-full mz-grad px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_-10px_rgba(124,58,237,0.55)] transition-transform hover:-translate-y-0.5 sm:px-7">
              Book a Demo <Icon d={I.arrow} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:bg-[var(--violet-tint)] sm:px-7">
              Start Free Trial
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500 sm:gap-x-7 sm:text-sm">
            {["No credit card required","Fast onboarding","Multi-currency"].map(t=>(
              <span key={t} className="inline-flex items-center gap-2"><Icon d={I.check} w={14} sw={2.5} className="text-[var(--success)]" />{t}</span>
            ))}
          </div>

          {/* Mobile cards */}
          <div className="mt-12 grid gap-3 md:hidden text-left">
            <KpiCard />
            <InvoiceCard />
            <StockAlertCard />
          </div>

          {/* Desktop floating cards */}
          <div className="pointer-events-none relative mx-auto mt-16 hidden h-72 max-w-5xl md:block">
            <div className="mz-float pointer-events-auto absolute left-4 top-4 w-[260px] rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_24px_60px_-20px_rgba(124,58,237,0.35)] text-left" style={{ ["--tilt" as string]: "-6deg" } as React.CSSProperties}>
              <KpiCard inner />
            </div>
            <div className="mz-float pointer-events-auto absolute right-4 top-10 w-[290px] rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_24px_60px_-20px_rgba(124,58,237,0.35)] text-left" style={{ ["--tilt" as string]: "5deg", animationDelay: "1.5s" } as React.CSSProperties}>
              <InvoiceCard inner />
            </div>
            <div className="mz-float pointer-events-auto absolute left-1/2 top-32 w-[260px] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_24px_60px_-20px_rgba(124,58,237,0.35)] text-left" style={{ ["--tilt" as string]: "-3deg", animationDelay: "3s" } as React.CSSProperties}>
              <StockAlertCard inner />
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="border-y border-slate-200/60 bg-white overflow-hidden py-10">
        <div className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 mb-6">
          Trusted by growing stock-based businesses
        </div>
        <div className="relative w-full overflow-hidden">
          <div className="flex w-[200%] mz-marquee items-center gap-14 whitespace-nowrap">
            {[...CLIENTS, ...CLIENTS].map((c, i) => (
              <span key={i} className="mz-outfit text-lg font-bold tracking-tight text-slate-400/70">{c}</span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent" />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[var(--violet-tint)]/60 border-b border-slate-100">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-16 md:grid-cols-4">
          {[["12K+","Invoices / month"],["500K+","SKUs tracked"],["99.9%","Cloud uptime"],["6+","Countries live"]].map(([v,l])=>(
            <div key={l} className="text-center">
              <div className="mz-outfit text-5xl font-bold tracking-tight mz-text-grad">{v}</div>
              <div className="mt-2 text-sm text-slate-500 font-medium">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why */}
      <section id="why" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--violet)]/15 bg-[var(--violet-tint)] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--violet)]">Why {COMPANY}</div>
            <h2 className="mz-outfit mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 md:text-6xl">
              Why businesses choose <span className="mz-text-grad">{COMPANY}</span>
            </h2>
            <p className="mt-5 text-lg text-slate-500">Because running a stock-based business is more than just taking invoices.</p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {[
              [I.grid,"Built for Real Operations","Manage stock, billing, purchases, ledgers, payroll and reporting in one place, synchronized in real time."],
              [I.trend,"Increase Revenue & Cash Flow","Fill more orders, reduce missed payments, track aging receivables, and optimize purchasing with custom models."],
              [I.info,"Autonomous AI & Comm","Built-in AI handles reorder alerts, payment reminders and party notifications — hands-off."],
              [I.bolt,"Reduce Admin Friction","Automate recurring invoices, inventory conversions, journal posting, and balance reconciliation tasks."],
            ].map(([d,t,b])=>(
              <div key={t} className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 transition-all hover:-translate-y-1 hover:shadow-xl">
                <span className="grid h-14 w-14 place-items-center rounded-2xl mz-grad text-white"><Icon d={d} w={24} /></span>
                <h3 className="mz-outfit mt-6 text-2xl font-bold tracking-tight text-slate-900">{t}</h3>
                <p className="mt-2 text-slate-500">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features tab */}
      <section id="features" className="relative overflow-hidden bg-[var(--violet-tint)]/40 py-24 border-y border-slate-100">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--violet)]/15 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--violet)] shadow-sm">Platform</div>
            <h2 className="mz-outfit mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 md:text-6xl">
              Everything you need to <span className="mz-text-grad">run and grow your business</span>
            </h2>
          </div>

          <div id="dashboard" className="mt-14 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
            <div className="flex gap-1.5 overflow-x-auto border-b border-slate-100 p-3">
              {([
                ["inventory", I.box, "Inventory & Stock"],
                ["sales", I.cart, "Sales & Billing"],
                ["finance", I.cam, "Financial Ledgers"],
                ["insights", I.bars, "Reports & Insights"],
              ] as [TabKey, string, string][]).map(([k,d,l])=>{
                const active = tab === k;
                return (
                  <button key={k} onClick={()=>setTab(k)} className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${active ? "mz-grad text-white" : "text-slate-500 hover:bg-[var(--violet-tint)] hover:text-slate-900"}`}>
                    <Icon d={d} sw={2.5} />{l}
                  </button>
                );
              })}
            </div>
            <div className="grid gap-8 p-6 md:grid-cols-[1fr_1.2fr] md:p-10">
              <div className="self-center text-left">
                <h3 className="mz-outfit text-3xl font-bold leading-tight tracking-tight md:text-4xl text-slate-900">{data.title}</h3>
                <p className="mt-4 text-slate-500">{data.body}</p>
                <a href="#cta" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--violet)] hover:text-[var(--violet-deep)]">
                  Explore {data.label} <Icon d={I.extlink} sw={2.5} />
                </a>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-[var(--violet-tint)]/40 p-5">
                <div className="grid grid-cols-2 gap-3">
                  {data.kpis.map(k=>(
                    <div key={k.label} className="rounded-xl border border-slate-200 bg-white p-4 text-left">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{k.label}</div>
                      <div className="mt-1.5 text-2xl font-bold text-slate-900 tracking-tight">{k.val}</div>
                      {k.trend && (
                        <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--success)]">
                          <Icon d={I.trend} w={12} sw={2.5} />{k.trend}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-xl border border-slate-200 bg-white text-left">
                  {data.rows.map((r,i)=>(
                    <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i < data.rows.length - 1 ? "border-b border-slate-100" : ""}`}>
                      <span className={`h-2 w-2 shrink-0 rounded-full bg-[var(--violet)] ${i===0 ? "animate-pulse" : ""}`} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-slate-900">{r.title}</div>
                        <div className="truncate text-xs text-slate-500">{r.desc}</div>
                      </div>
                      <div className="mz-mono text-[10px] text-slate-400">{r.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Six feature cards */}
          <div className="mt-12 grid gap-5 md:grid-cols-3 text-left">
            {[
              [I.box,"Inventory & Stock","Multi-warehouse stock, transfers, low-stock alerts and live adjustments — accurate to the unit."],
              [I.cart,"Purchase Orders","Raise POs, track supplier dues, and reconcile receipts against bills automatically."],
              [I.book,"Sales & Billing","Fast invoicing with keyboard shortcuts, returns, credit notes and party ledger sync."],
              [I.cam,"Financial Ledgers","Real-time party balances, bank books, trial balance, P&L and balance sheet."],
              [I.users,"HR & Payroll","Employees, attendance, advances and monthly payroll posted straight to the books."],
              [I.bars,"Reports & Analytics","Drill from a single KPI down to the source invoice. Export to CSV in a click."],
            ].map(([d,t,b])=>(
              <div key={t} className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-25px_rgba(124,58,237,0.4)]">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--violet-tint)] text-[var(--violet)] transition-colors group-hover:mz-grad group-hover:text-white">
                  <Icon d={d} w={20} />
                </span>
                <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-900">{t}</h3>
                <p className="mt-1.5 text-sm text-slate-500">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise dark */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-24">
        <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(50% 60% at 50% 0%, oklch(0.55 0.24 295 / 0.6) 0%, transparent 70%)" }} />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet-300">Enterprise-grade</div>
            <h2 className="mz-outfit mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl">
              Give your business the systems <span className="mz-text-grad">big brands use.</span>
            </h2>
            <p className="mt-5 text-lg text-white/70">Built on the same foundations as enterprise ERPs, packaged for businesses that move fast.</p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              [I.shield,"Role-based access","Granular permissions per user. Define exactly who can do what."],
              [I.globe,"Multi-currency","Transact in 100+ currencies with real-time conversion."],
              [I.bolt,"Built for speed","Keyboard-first UI, instant search, sub-second posting."],
            ].map(([d,t,b])=>(
              <div key={t} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur text-left">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--violet)]/20 text-violet-300"><Icon d={d} w={20} /></span>
                <h3 className="mt-5 text-xl font-bold tracking-tight text-white">{t}</h3>
                <p className="mt-1.5 text-sm text-white/70">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="relative bg-white py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--violet)]">Customer story</div>
          <p className="mz-outfit mt-6 text-3xl font-bold leading-snug tracking-tight text-slate-900 md:text-4xl">
            &ldquo;{COMPANY} transformed the way we manage our daily operations. Inventory, invoicing and reporting all in <span className="mz-text-grad">one place</span> — exactly what our growing business needed.&rdquo;
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <div className="mz-outfit grid h-12 w-12 place-items-center rounded-full mz-grad font-bold text-white">HK</div>
            <div className="text-left">
              <div className="text-sm font-semibold text-slate-900">Hikmat Khan</div>
              <div className="text-xs text-slate-500">Owner · Insaf Trading Company</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-[var(--violet-tint)]/40 py-24 border-y border-slate-100">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--violet)]/15 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--violet)] shadow-sm">FAQ</div>
            <h2 className="mz-outfit mt-5 text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
              Questions, <span className="mz-text-grad">answered</span>.
            </h2>
          </div>
          <div className="mt-12 space-y-3">
            {FAQS.map((f,i)=>{
              const open = openFaq === i;
              return (
                <div key={i} className="rounded-2xl border border-slate-200/60 bg-white">
                  <button onClick={()=>setOpenFaq(open ? null : i)} className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left font-semibold text-lg text-slate-900">
                    <span>{f.q}</span>
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-bold ${open ? "mz-grad text-white" : "bg-[var(--violet-tint)] text-[var(--violet)]"}`}>{open ? "−" : "+"}</span>
                  </button>
                  <div className="mz-faq-a overflow-hidden" style={{ maxHeight: open ? 300 : 0 }}>
                    <div className="px-6 pb-6 text-slate-500 text-sm">{f.a}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-24 bg-white">
        <div className="mx-auto max-w-6xl px-5">
          <div className="relative overflow-hidden rounded-[2rem] mz-grad p-8 text-white sm:p-12 md:p-16">
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="relative grid items-center gap-10 md:grid-cols-[1.3fr_1fr]">
              <div className="text-left">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">Get started</div>
                <h2 className="mz-outfit mt-4 text-4xl font-bold leading-[1.02] tracking-tight md:text-5xl">Ready to simplify your operations?</h2>
                <p className="mt-5 max-w-lg text-white/80">Join 800+ businesses that trust {COMPANY} to run their daily operations — from a single warehouse to a national distribution network.</p>
              </div>
              <form onSubmit={(e)=>e.preventDefault()} className="flex flex-col gap-3 rounded-2xl bg-white p-5 text-slate-900 shadow-2xl">
                <label className="text-xs font-semibold text-slate-500 text-left">Work email</label>
                <input type="email" placeholder="you@company.com" className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--violet)]" />
                <button type="submit" className="group inline-flex items-center justify-center gap-2 rounded-xl mz-grad px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_-10px_rgba(124,58,237,0.55)] transition-transform hover:-translate-y-0.5">
                  Book a Demo <Icon d={I.arrow} className="transition-transform group-hover:translate-x-0.5" />
                </button>
                <div className="text-[11px] text-slate-400 text-left">No credit card required · 14-day trial · Cancel anytime</div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-[var(--violet-tint)]/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] text-left">
          <div>
            <a href="/" className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full mz-grad text-white"><Icon d={I.star} sw={2.5} /></span>
              <span className="mz-outfit text-xl font-bold tracking-tight text-slate-900">{COMPANY}</span>
            </a>
            <p className="mt-4 max-w-sm text-sm text-slate-500">Cloud ERP for businesses that run on stock. Inventory, sales, finance &amp; reporting — one secure portal.</p>
          </div>
          {[
            ["Platform",["Inventory","Purchase Orders","Sales & Billing","Ledgers","Reports"]],
            ["Company",["About","Contact","Privacy","Terms"]],
            ["Support",["Help Center","Docs","Status","Contact"]],
          ].map(([h,items])=>(
            <div key={h as string}>
              <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-900">{h}</h4>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-500">
                {(items as string[]).map(it=><li key={it}><a href="#" className="transition-colors hover:text-slate-900">{it}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-200/60">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-slate-500 md:flex-row">
            <div>© {new Date().getFullYear()} {COMPANY}. All rights reserved.</div>
            <div>Built for traders &amp; distributors.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function KpiCard({ inner = false }: { inner?: boolean }) {
  const wrap = inner ? "" : "rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_40px_-20px_rgba(124,58,237,0.35)]";
  return (
    <div className={wrap}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Sales today</span>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">+18.2%</span>
      </div>
      <div className={`mt-2 ${inner ? "text-3xl mz-outfit" : "text-2xl"} font-bold tracking-tight text-slate-900`}>PKR 842K</div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--violet-tint)]">
        <div className="h-full w-[72%] rounded-full mz-grad" />
      </div>
      <div className="mt-2 text-[11px] text-slate-400">72% of daily target</div>
    </div>
  );
}

function InvoiceCard({ inner = false }: { inner?: boolean }) {
  const wrap = inner ? "" : "rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_40px_-20px_rgba(124,58,237,0.35)]";
  return (
    <div className={wrap}>
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full mz-grad text-white"><Icon d={I.box} sw={2.5} /></span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-slate-900">Invoice INV-2284</div>
          <div className="truncate text-xs text-slate-400">Insaf Trading · 24 SKUs</div>
        </div>
        <span className="shrink-0 rounded-full bg-[var(--violet-tint)] px-2.5 py-1 text-[10px] font-bold text-[var(--violet)]">PAID</span>
      </div>
      <div className="mt-3 flex items-end justify-between border-t border-slate-100 pt-3">
        <span className="text-[11px] text-slate-400">Total</span>
        <span className={`${inner ? "text-xl" : "text-lg"} font-bold text-slate-900`}>PKR 184,500</span>
      </div>
    </div>
  );
}

function StockAlertCard({ inner = false }: { inner?: boolean }) {
  const wrap = inner ? "" : "rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_40px_-20px_rgba(124,58,237,0.35)]";
  return (
    <div className={wrap}>
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[var(--amber)] font-bold">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--amber)]" /> Low stock alert
      </div>
      <div className="mt-2 text-sm font-semibold text-slate-900">Panadol 500mg · Warehouse A</div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        {[["On hand","24"],["Min","50"],["Reorder","+200"]].map(([l,v],i)=>(
          <div key={l} className="rounded-md bg-[var(--violet-tint)] py-2">
            <div className="text-[9px] uppercase text-slate-400">{l}</div>
            <div className={`text-sm font-bold ${i===2 ? "text-[var(--violet)]" : "text-slate-900"}`}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
