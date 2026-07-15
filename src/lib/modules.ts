import {
  Settings, Warehouse, ArrowLeftRight, SlidersHorizontal, AlertTriangle,
  Truck, ClipboardList, ClipboardCheck, PackageX, Undo2, HandCoins,
  ReceiptText, CheckCircle2, CircleDollarSign, Wallet, RotateCcw, Repeat,
  BookUser, UsersRound, Building2, UserSquare2, Contact, Receipt, Landmark, PiggyBank, Banknote,
  Users, FileSpreadsheet, HeartHandshake, BadgeDollarSign,
  BookOpenText, BookOpen, TrendingUp, TrendingDown,
  BarChart3, Package, Boxes, ShoppingCart, LineChart,
} from "lucide-react";

export type ModuleDef = {
  slug: string;
  title: string;
  section: string;
  icon: typeof Settings;
  grad: string;
  description: string;
  features: string[];
  metrics?: { label: string; value: string; hint?: string }[];
};

const G = {
  primary: "var(--gradient-primary)",
  cool: "var(--gradient-cool)",
  mint: "var(--gradient-mint)",
  gold: "var(--gradient-gold)",
  rose: "var(--gradient-rose)",
  sunset: "var(--gradient-sunset)",
  accent: "var(--gradient-accent)",
  warm: "var(--gradient-warm)",
};

export const MODULES: ModuleDef[] = [
  // Shop
  { slug: "shop-settings", title: "Shop Settings", section: "Configuration", icon: Settings, grad: G.cool,
    description: "Configure your store identity, taxes, currency, invoice numbering and printing preferences.",
    features: ["Business profile & logo", "Tax rates (GST/VAT)", "Invoice & receipt templates", "Currency & rounding", "User permissions"] },

  // Warehouses
  { slug: "warehouse-list", title: "Warehouse List", section: "Warehouses", icon: Warehouse, grad: G.primary,
    description: "Central register of every physical location where stock is held.",
    features: ["Main shop & branch warehouses", "Address & manager", "Enable / disable locations", "Location-level stock view"] },
  { slug: "stock-transfer", title: "Stock Transfer", section: "Warehouses", icon: ArrowLeftRight, grad: G.cool,
    description: "Move inventory between shelf and warehouses, log every hand-off.",
    features: ["Shelf ↔ warehouse moves", "Multi-line transfers", "Audit trail per transfer", "Print transfer slip"] },
  { slug: "stock-adjustment", title: "Stock Adjustment", section: "Warehouses", icon: SlidersHorizontal, grad: G.gold,
    description: "Correct physical stock counts after audits, damages, or discrepancies.",
    features: ["Positive / negative adjustments", "Reason codes", "Approval workflow", "Ties into cost of goods"] },
  { slug: "low-stock-alerts", title: "Low Stock Alerts", section: "Warehouses", icon: AlertTriangle, grad: G.sunset,
    description: "Live watchlist of items at or below their reorder point.",
    features: ["Severity: warning vs critical", "Suggested reorder quantity", "One-click purchase order", "Email / in-app alerts"] },

  // Purchases
  { slug: "purchase-entry", title: "Purchase Entry", section: "Purchases", icon: Truck, grad: G.primary,
    description: "Record incoming stock from suppliers with cost, tax and payment terms.",
    features: ["Multi-item bill", "Cash / credit", "Auto-updates stock", "Attach supplier invoice"] },
  { slug: "purchase-list", title: "Purchase List", section: "Purchases", icon: ClipboardList, grad: G.cool,
    description: "Every purchase you've logged, filterable by supplier, date, or status.",
    features: ["Advanced filters", "Bulk export CSV/PDF", "Drill down to bill", "Payment status badge"] },
  { slug: "purchase-orders", title: "Purchase Orders", section: "Purchases", icon: ClipboardCheck, grad: G.mint,
    description: "Draft POs, send to suppliers, and convert to purchases on delivery.",
    features: ["Send via email/WhatsApp", "Partial receipts", "Convert to bill", "PO ageing report"] },
  { slug: "lost-damaged", title: "Lost & Damaged Items", section: "Purchases", icon: PackageX, grad: G.rose,
    description: "Log breakage, expiry, or shrinkage; keep stock and books accurate.",
    features: ["Reason & cost impact", "Photo attachments", "Insurance claim tag", "Writes down inventory"] },
  { slug: "purchase-return", title: "Purchase Return", section: "Purchases", icon: Undo2, grad: G.gold,
    description: "Return goods to supplier and reconcile against the original bill.",
    features: ["Return against bill", "Debit note generation", "Auto stock reversal", "Credit reconciliation"] },
  { slug: "supplier-payments", title: "Supplier Payments", section: "Purchases", icon: HandCoins, grad: G.accent,
    description: "Pay off supplier dues and keep supplier ledgers up to date.",
    features: ["Cash / bank / cheque", "Multi-bill settlement", "Payment receipt", "Ageing report"] },

  // Sales
  { slug: "sales-invoice", title: "Sales Invoice", section: "Sales & Billing", icon: ReceiptText, grad: G.primary,
    description: "Fast POS-style invoicing with barcode scanning and instant printing.",
    features: ["Barcode / SKU lookup", "Cash / credit / split", "Auto stock deduction", "58/80mm thermal print"] },
  { slug: "paid-sales", title: "Paid Sales List", section: "Sales & Billing", icon: CheckCircle2, grad: G.mint,
    description: "All fully-paid sales invoices in one searchable view.",
    features: ["Cash & bank breakdown", "Date range filter", "Reprint receipts", "Daily totals"] },
  { slug: "unpaid-sales", title: "Unpaid Sales List", section: "Sales & Billing", icon: CircleDollarSign, grad: G.sunset,
    description: "Outstanding invoices by customer, with ageing buckets.",
    features: ["Ageing 0-30/30-60/60+", "Send reminder", "Convert to loan", "Customer ledger link"] },
  { slug: "loans", title: "Loans", section: "Sales & Billing", icon: Wallet, grad: G.rose,
    description: "Track credit given to customers as informal loans (udhaar).",
    features: ["Principal & running balance", "Repayment schedule", "Interest-free by default", "Ledger sync"] },
  { slug: "sales-return", title: "Sales Return", section: "Sales & Billing", icon: RotateCcw, grad: G.gold,
    description: "Handle refunds, replacements and store credit against sales.",
    features: ["Return against invoice", "Cash refund / credit note", "Stock restoration", "Reason tracking"] },
  { slug: "recovery-entry", title: "Recovery Entry", section: "Sales & Billing", icon: Repeat, grad: G.accent,
    description: "Record credit recoveries from customers, allocate to open bills.",
    features: ["Cash / bank / mobile wallet", "Auto-allocate FIFO", "Receipt print", "Customer ledger update"] },

  // Ledgers
  { slug: "all-ledgers", title: "All Ledgers List", section: "Ledgers & Profiles", icon: BookUser, grad: G.primary,
    description: "Single directory of every account in your books.",
    features: ["Customers, suppliers, staff", "Bank & cash accounts", "Search & filter", "Opening balances"] },
  { slug: "customer-ledgers", title: "Customer Ledgers", section: "Ledgers & Profiles", icon: UsersRound, grad: G.cool,
    description: "Complete transaction history per customer.",
    features: ["Sales, returns, receipts", "Running balance", "Statement export", "Ageing summary"] },
  { slug: "supplier-ledgers", title: "Supplier Ledgers", section: "Ledgers & Profiles", icon: Building2, grad: G.mint,
    description: "Complete transaction history per supplier.",
    features: ["Purchases, returns, payments", "Running balance", "Statement export", "Ageing summary"] },
  { slug: "employee-ledgers", title: "Employee Ledgers", section: "Ledgers & Profiles", icon: UserSquare2, grad: G.gold,
    description: "Track salary, advances and expenses per employee.",
    features: ["Advance & loan history", "Salary payouts", "Expense claims", "Statement export"] },
  { slug: "salesman-ledgers", title: "Sales Man Ledgers", section: "Ledgers & Profiles", icon: Contact, grad: G.rose,
    description: "Track sales by salesperson with commission accruals.",
    features: ["Commission tracking", "Sales performance", "Recoveries collected", "Statement export"] },
  { slug: "expenses-ledgers", title: "Expenses Ledgers", section: "Ledgers & Profiles", icon: Receipt, grad: G.sunset,
    description: "Categorised expense accounts (rent, utilities, salaries…).",
    features: ["Custom categories", "Monthly trend", "Vendor tagging", "Attach receipts"] },
  { slug: "general-ledgers", title: "General Ledgers", section: "Ledgers & Profiles", icon: BookOpen, grad: G.accent,
    description: "Miscellaneous accounts that don't fit other categories.",
    features: ["Custom ledger creation", "Journal entries", "Statement export", "Trial balance ready"] },
  { slug: "bank-accounts", title: "Bank Accounts", section: "Ledgers & Profiles", icon: Landmark, grad: G.primary,
    description: "Every bank/mobile-money account tied to your business.",
    features: ["Multi-currency", "Opening balance", "Reconciliation", "Statement export"] },
  { slug: "cash-bank-balances", title: "Cash & Bank Balances", section: "Ledgers & Profiles", icon: Banknote, grad: G.mint,
    description: "Live snapshot of every cash drawer and bank account.",
    features: ["Real-time balance", "Transfer between accounts", "Reconciliation tools", "Daily closing"] },

  // HR
  { slug: "hr-ledger-statements", title: "Ledger Statements", section: "Personnel & HR", icon: FileSpreadsheet, grad: G.cool,
    description: "Per-employee statement of salary, advances, loans and deductions.",
    features: ["Date range filter", "Running balance", "Export to PDF/Excel", "Ready for payroll"] },
  { slug: "advance-loans", title: "Advance & Loans", section: "Personnel & HR", icon: HeartHandshake, grad: G.rose,
    description: "Issue advances or loans to staff and schedule recovery.",
    features: ["Installment plan", "Auto salary deduction", "Approval workflow", "Outstanding balance"] },
  { slug: "salary-payouts", title: "Salary Payouts", section: "Personnel & HR", icon: BadgeDollarSign, grad: G.mint,
    description: "Run monthly payroll with advances and deductions applied.",
    features: ["Bulk payout run", "Cash / bank transfer", "Payslip print", "Ledger sync"] },

  // Finance Book
  { slug: "cash-book", title: "Cash Book", section: "Finance Book", icon: BookOpenText, grad: G.primary,
    description: "Daily cash inflow and outflow, closing balance per day.",
    features: ["Daily / monthly view", "Opening & closing balance", "Filter by account", "Print daily report"] },
  { slug: "bank-book", title: "Bank Book", section: "Finance Book", icon: Landmark, grad: G.cool,
    description: "Bank-side ledger with deposit/withdrawal history.",
    features: ["Per-account view", "Reconciliation status", "Statement import", "Auto-match transactions"] },
  { slug: "income-entry", title: "Income Entry", section: "Finance Book", icon: TrendingUp, grad: G.mint,
    description: "Log non-sales income (rent received, interest, other).",
    features: ["Custom categories", "Cash / bank source", "Receipt attachment", "P&L feed"] },
  { slug: "expense-entry", title: "Expense Entry", section: "Finance Book", icon: TrendingDown, grad: G.sunset,
    description: "Log any business expense against a category and account.",
    features: ["Recurring expenses", "Vendor tagging", "Attach receipt image", "P&L feed"] },

  // Reports
  { slug: "product-report", title: "Product Report", section: "Reports Hub", icon: Package, grad: G.primary,
    description: "Per-product performance across sales, purchases and stock.",
    features: ["Best / worst sellers", "Margin per SKU", "Stock turnover", "Export CSV/PDF"] },
  { slug: "stock-report", title: "Stock Report", section: "Reports Hub", icon: Boxes, grad: G.cool,
    description: "Snapshot of current inventory across all locations.",
    features: ["By warehouse", "Cost & retail value", "Below-reorder flag", "Aging by receipt date"] },
  { slug: "purchase-report", title: "Purchase Report", section: "Reports Hub", icon: ShoppingCart, grad: G.gold,
    description: "Purchase trends, supplier concentration and cost drivers.",
    features: ["Supplier breakdown", "Category spend", "Monthly trend", "Export CSV/PDF"] },
  { slug: "sales-report", title: "Sales Report", section: "Reports Hub", icon: LineChart, grad: G.mint,
    description: "Revenue trends by day, category, brand and salesperson.",
    features: ["Daily / monthly / yearly", "Top categories & brands", "Salesperson leaderboard", "Export CSV/PDF"] },
];

export const MODULE_MAP: Record<string, ModuleDef> = Object.fromEntries(MODULES.map((m) => [m.slug, m]));

// Re-export shared icons for anyone who wants them
export { Users, BarChart3 };
