"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

export function HeroOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Phase 1: "Chaos" text (visible 0–25%)
  const chaosOpacity = useTransform(scrollYProgress, [0, 0.05, 0.2, 0.28], [0, 1, 1, 0]);
  const chaosY = useTransform(scrollYProgress, [0, 0.05, 0.28], [40, 0, -30]);

  // Phase 2: "Sorting" text (visible 25–55%)
  const sortingOpacity = useTransform(scrollYProgress, [0.25, 0.32, 0.48, 0.55], [0, 1, 1, 0]);
  const sortingY = useTransform(scrollYProgress, [0.25, 0.32, 0.55], [40, 0, -30]);

  // Phase 3: "Sorted" CTA (visible 55–100%)
  const sortedOpacity = useTransform(scrollYProgress, [0.52, 0.62, 0.9, 1], [0, 1, 1, 0.8]);
  const sortedY = useTransform(scrollYProgress, [0.52, 0.62], [50, 0]);
  const sortedScale = useTransform(scrollYProgress, [0.52, 0.62], [0.95, 1]);

  // Scroll indicator visibility
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.05, 0.1], [1, 1, 0]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ height: "400vh" }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center">
        {/* Phase 1: Chaos */}
        <motion.div
          className="absolute text-center px-6 max-w-3xl"
          style={{ opacity: chaosOpacity, y: chaosY }}
        >
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[0.9]"
            style={{
              color: "var(--color-text-primary)",
              textShadow: "0 0 80px rgba(99, 102, 241, 0.3), 0 4px 40px rgba(0,0,0,0.5)",
            }}
          >
            Your learning
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #ef4444, #f97316, #eab308)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              is chaos.
            </span>
          </h1>
          <p
            className="mt-6 text-lg md:text-xl max-w-lg mx-auto"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Scattered notes. Fragmented concepts. Lost progress.
          </p>
        </motion.div>

        {/* Phase 2: Sorting */}
        <motion.div
          className="absolute text-center px-6 max-w-3xl"
          style={{ opacity: sortingOpacity, y: sortingY }}
        >
          <h2
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[0.9]"
            style={{
              color: "var(--color-text-primary)",
              textShadow: "0 0 80px rgba(99, 102, 241, 0.3), 0 4px 40px rgba(0,0,0,0.5)",
            }}
          >
            Watch it get
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary), #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              sorted.
            </span>
          </h2>
          <p
            className="mt-6 text-lg md:text-xl max-w-lg mx-auto"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Every concept finds its place. Every skill builds on the last.
          </p>
        </motion.div>

        {/* Phase 3: Final CTA */}
        <motion.div
          className="absolute text-center px-6 max-w-3xl pointer-events-auto"
          style={{ opacity: sortedOpacity, y: sortedY, scale: sortedScale }}
        >
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-[0.9]"
            style={{
              color: "var(--color-text-primary)",
              textShadow: "0 0 80px rgba(99, 102, 241, 0.3), 0 4px 40px rgba(0,0,0,0.5)",
            }}
          >
            Code<span style={{ color: "var(--color-accent-primary)" }}>Sorted</span>
            <span className="align-super text-lg md:text-2xl" style={{ color: "var(--color-text-muted)" }}>
              ®
            </span>
          </h2>
          <p
            className="mt-4 text-lg md:text-xl max-w-md mx-auto"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Turn messy learning into sorted mastery.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="btn-primary text-base px-8 py-3.5 rounded-xl"
              style={{
                boxShadow: "0 0 40px var(--color-accent-glow), 0 8px 32px rgba(99,102,241,0.25)",
              }}
            >
              Start Learning — Free
            </Link>
            <Link
              href="#features"
              className="btn-glass text-base px-6 py-3.5 rounded-xl"
            >
              See Features ↓
            </Link>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: scrollIndicatorOpacity }}
        >
          <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "var(--color-text-muted)" }}>
            Scroll to discover
          </span>
          <motion.div
            className="w-6 h-10 rounded-full flex items-start justify-center pt-2"
            style={{ border: "1.5px solid rgba(255,255,255,0.15)" }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--color-accent-primary)" }}
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
