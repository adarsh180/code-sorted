"use client";

import { useState, FormEvent, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { signInAction, googleSignInAction } from "@/app/auth/actions";

/* ─── Animation presets ─── */
const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function SignInPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const attemptSignIn = async (e: string, p: string) => {
    setError("");
    const fd = new FormData();
    fd.append("email", e);
    fd.append("password", p);
    const result = await signInAction(fd);
    if (result.success) {
      if (e.toLowerCase() === "codesorted0704@gmail.com") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    }
    else setError(result.error || "Invalid credentials");
  };

  const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    startTransition(() => attemptSignIn(email, password));
  };

  const handleAdminLogin = () =>
    startTransition(() => attemptSignIn("codesorted0704@gmail.com", "Adarsh180704##"));

  return (
    <div className="space-y-8">
      {/* ── Logo & Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <div className="flex flex-col items-center gap-4 mb-4">
          <img
            src="/logo/logo.png"
            alt="CodeSorted"
            className="w-28 h-28 object-contain drop-shadow-[0_0_32px_rgba(139,92,246,0.7)] mb-1"
          />
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#f1f5f9" }}>
            Welcome Back
          </h1>
        </div>
        <p className="text-sm font-medium" style={{ color: "#64748b" }}>
          Sign in to Code Sorted
        </p>
      </motion.div>

      {/* ── Glass Card ── */}
      <GlassCard className="p-8 sm:p-10">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl px-4 py-3 text-sm font-medium"
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  color: "#f87171",
                }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google OAuth */}
          <motion.div variants={fadeUp}>
            <form action={googleSignInAction}>
              <button
                type="submit"
                className="btn-glass w-full flex items-center justify-center gap-3 text-sm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>
            </form>
          </motion.div>

          {/* Admin Login */}
          <motion.div variants={fadeUp}>
            <button
              type="button"
              onClick={handleAdminLogin}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-[1px] active:translate-y-0"
              style={{
                background: "rgba(99, 102, 241, 0.12)",
                border: "1px solid rgba(99, 102, 241, 0.25)",
                color: "#a5b4fc",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(99, 102, 241, 0.2)";
                e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(99, 102, 241, 0.12)";
                e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.25)";
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Sign in as Admin
            </button>
          </motion.div>

          {/* Divider */}
          <motion.div variants={fadeUp} className="flex items-center gap-4 py-1">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)" }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: "#64748b" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)" }} />
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <motion.div variants={fadeUp} className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-widest pl-1" style={{ color: "#94a3b8" }}>
                Email
              </label>
              <div className="relative group">
                <div
                  className={`absolute -inset-[1px] rounded-xl opacity-0 blur-sm transition-opacity duration-500 ${focusedField === "email" ? "opacity-40" : "group-hover:opacity-20"}`}
                  style={{ background: "linear-gradient(to right, #6366f1, #8b5cf6)" }}
                />
                <input
                  id="signin-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="input-glass relative"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={fadeUp} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-widest pl-1" style={{ color: "#94a3b8" }}>
                  Password
                </label>
                <Link href="/auth/reset" className="text-[11px] font-semibold transition-colors hover:brightness-125" style={{ color: "#818cf8" }}>
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <div
                  className={`absolute -inset-[1px] rounded-xl opacity-0 blur-sm transition-opacity duration-500 ${focusedField === "password" ? "opacity-40" : "group-hover:opacity-20"}`}
                  style={{ background: "linear-gradient(to right, #6366f1, #8b5cf6)" }}
                />
                <input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="input-glass relative pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#64748b" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#94a3b8")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div variants={fadeUp} className="pt-3">
              <button
                id="signin-submit"
                type="submit"
                disabled={isPending}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Signing in…</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </motion.div>
          </form>
        </motion.div>
      </GlassCard>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-sm"
        style={{ color: "#64748b" }}
      >
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="font-semibold transition-colors hover:brightness-125" style={{ color: "#818cf8" }}>
          Create one
        </Link>
      </motion.p>
    </div>
  );
}
