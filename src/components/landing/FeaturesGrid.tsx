"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const features = [
  {
    icon: "🧠",
    title: "Active Recall",
    description: "Toggle-to-reveal sections in every note. Learn by actively retrieving, not passively reading.",
    span: "col-span-1 md:col-span-2",
    accent: "var(--color-accent-primary)",
  },
  {
    icon: "🔥",
    title: "Learning Streaks",
    description: "Daily flame counter tracks your consistency. Build momentum that compounds.",
    span: "col-span-1",
    accent: "#f59e0b",
  },
  {
    icon: "⌘",
    title: "Global Search",
    description: "Cmd+K lightning-fast search across every note, quiz, and concept instantly.",
    span: "col-span-1",
    accent: "#06b6d4",
  },
  {
    icon: "🎮",
    title: "Gamified Quizzes",
    description: "3D flip-card MCQs with instant feedback. Learning that feels like play.",
    span: "col-span-1 md:col-span-2",
    accent: "#8b5cf6",
  },
  {
    icon: "📚",
    title: "Structured Notes",
    description: "Master reader with sticky TOC, progress tracking, and bookmarks powered by TiDB.",
    span: "col-span-1 md:col-span-2",
    accent: "#22c55e",
  },
  {
    icon: "🔗",
    title: "Share Gate",
    description: "Share a referral link, unlock premium cheat sheets for 24 hours. Viral growth built-in.",
    span: "col-span-1",
    accent: "#ec4899",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function FeaturesGrid() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" ref={ref} className="relative py-32 px-6">
      {/* Section background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase"
            style={{ color: "var(--color-accent-primary)" }}
          >
            Features
          </span>
          <h2
            className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            Everything you need to
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              master anything.
            </span>
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              className={`${feature.span} glass-dense rounded-2xl p-8 group cursor-default`}
              variants={cardVariants}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              style={{
                boxShadow: "0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5"
                style={{
                  background: `${feature.accent}15`,
                  boxShadow: `0 0 20px ${feature.accent}20`,
                }}
              >
                {feature.icon}
              </div>

              {/* Title */}
              <h3
                className="text-lg font-bold tracking-tight mb-2"
                style={{ color: "var(--color-text-primary)" }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {feature.description}
              </p>

              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${feature.accent}08 0%, transparent 60%)`,
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
