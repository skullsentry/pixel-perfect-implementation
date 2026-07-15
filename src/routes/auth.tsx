import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  BarChart3,
  ArrowRight,
  Mail,
  Lock,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in · Mizan" },
      { name: "description", content: "Sign in or create your Mizan workspace." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Account created. Check your email if confirmation is required.");
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (result.error) throw result.error;
      if (!result.redirected) navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign in failed");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full text-foreground relative overflow-hidden"
      style={{ background: "var(--background)", backgroundImage: "var(--gradient-glow)" }}
    >
      <div className="relative z-10 min-h-screen grid lg:grid-cols-2">
        {/* Left: brand / marketing panel */}
        <aside className="hidden lg:flex flex-col justify-between p-12 relative">
          <div
            className="absolute inset-6 rounded-3xl opacity-90"
            style={{ background: "var(--gradient-surface)", boxShadow: "var(--shadow-lg)" }}
          />
          <div className="relative flex flex-col h-full">
            <Link to="/" className="flex items-center gap-3">
              <div
                className="h-11 w-11 rounded-2xl grid place-items-center text-primary-foreground"
                style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
              >
                <Sparkles size={20} />
              </div>
              <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Mizan
              </span>
            </Link>

            <div className="mt-auto space-y-8">
              <div>
                <h2
                  className="text-4xl xl:text-5xl font-bold leading-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Run your entire{" "}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: "var(--gradient-primary)" }}
                  >
                    business
                  </span>{" "}
                  from one control room.
                </h2>
                <p className="mt-4 text-muted-foreground max-w-md">
                  Inventory, sales, ledgers, and finance — unified in a fast, beautiful workspace built for modern shops.
                </p>
              </div>

              <ul className="space-y-4">
                {[
                  { icon: BarChart3, label: "Live dashboards & daybook analytics" },
                  { icon: Zap, label: "Fast invoicing, stock, and multi-warehouse ops" },
                  { icon: ShieldCheck, label: "Bank-grade security with row-level policies" },
                ].map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3 text-sm">
                    <span
                      className="h-9 w-9 rounded-xl grid place-items-center text-primary-foreground"
                      style={{ background: "var(--gradient-accent)" }}
                    >
                      <Icon size={16} />
                    </span>
                    <span className="text-foreground/90">{label}</span>
                  </li>
                ))}
              </ul>

              <div
                className="rounded-2xl p-5 border border-border/60"
                style={{ background: "color-mix(in oklab, var(--card) 70%, transparent)" }}
              >
                <p className="text-sm text-foreground/90 leading-relaxed">
                  “Mizan replaced three tools in our shop. Closing books used to take a weekend — now it's coffee time.”
                </p>
                <p className="mt-3 text-xs text-muted-foreground">— Owner, Insaf Store</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Right: auth card */}
        <main className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <Link to="/" className="lg:hidden flex items-center gap-3 mb-8">
              <div
                className="h-10 w-10 rounded-2xl grid place-items-center text-primary-foreground"
                style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
              >
                <Sparkles size={18} />
              </div>
              <span className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
                Mizan
              </span>
            </Link>

            <div
              className="rounded-3xl p-8 border border-border/60 backdrop-blur-xl"
              style={{
                background: "color-mix(in oklab, var(--card) 75%, transparent)",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              {/* Segmented mode switcher */}
              <div
                className="p-1 rounded-2xl border border-border/60 grid grid-cols-2 gap-1 mb-6"
                style={{ background: "color-mix(in oklab, var(--muted) 60%, transparent)" }}
              >
                {(["signin", "signup"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`h-9 rounded-xl text-sm font-medium transition ${
                      mode === m ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                    style={mode === m ? { background: "var(--gradient-primary)" } : undefined}
                  >
                    {m === "signin" ? "Sign in" : "Create account"}
                  </button>
                ))}
              </div>

              <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                {mode === "signin" ? "Welcome back" : "Create your workspace"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {mode === "signin"
                  ? "Sign in to continue to your dashboard."
                  : "Start managing your business in minutes."}
              </p>

              <button
                onClick={onGoogle}
                disabled={loading}
                className="mt-6 w-full h-11 rounded-xl border border-border bg-card/70 hover:border-primary/50 hover:bg-card transition flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-60"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <form onSubmit={onSubmit} className="space-y-3">
                {mode === "signup" && (
                  <Field icon={UserIcon}>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full name"
                      className="w-full h-11 pl-10 pr-3 rounded-xl border border-border bg-card/60 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-ring/30 transition"
                    />
                  </Field>
                )}
                <Field icon={Mail}>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full h-11 pl-10 pr-3 rounded-xl border border-border bg-card/60 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-ring/30 transition"
                  />
                </Field>
                <Field icon={Lock}>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full h-11 pl-10 pr-3 rounded-xl border border-border bg-card/60 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-ring/30 transition"
                  />
                </Field>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full h-11 rounded-xl text-primary-foreground text-sm font-semibold shadow-[var(--shadow-glow)] disabled:opacity-60 flex items-center justify-center gap-2 group"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
                  {!loading && (
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  )}
                </button>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-6">
                By continuing you agree to our Terms & Privacy Policy.
              </p>
            </div>

            <p className="text-sm text-muted-foreground text-center mt-6">
              {mode === "signin" ? "New to Mizan?" : "Already have an account?"}{" "}
              <button
                className="text-primary-glow font-semibold hover:underline"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              >
                {mode === "signin" ? "Create an account" : "Sign in"}
              </button>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      {children}
    </div>
  );
}
