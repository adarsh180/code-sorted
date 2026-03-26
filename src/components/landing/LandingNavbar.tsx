"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

export function LandingNavbar() {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 200], [0, 1]);
  const borderOpacity = useTransform(scrollY, [0, 200], [0, 0.08]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/5 backdrop-blur-[4px]"
      style={{
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <img
            src="/logo/logo.png"
            alt="CodeSorted Logo"
            className="w-12 h-12 object-contain drop-shadow-[0_0_14px_rgba(139,92,246,0.6)]"
          />
          <span className="text-xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
            Code<span style={{ color: "var(--color-accent-primary)" }}>Sorted</span>
          </span>
        </Link>

        {/* Center nav links (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-8">
          {["Features", "Courses", "Pricing"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: "var(--color-text-secondary)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/auth/signin"
            className="text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200"
            style={{
              color: "var(--color-text-secondary)",
              border: "1px solid transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-text-primary)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-text-secondary)";
              e.currentTarget.style.borderColor = "transparent";
              e.currentTarget.style.background = "transparent";
            }}
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="text-sm font-semibold px-5 py-2 rounded-lg transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))",
              color: "white",
              boxShadow: "0 0 20px var(--color-accent-glow)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 30px var(--color-accent-glow), 0 4px 20px rgba(99,102,241,0.3)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 0 20px var(--color-accent-glow)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
