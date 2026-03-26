"use client";

import { motion, useMotionValue, animate } from "framer-motion";
import { Heatmap } from "@/components/dashboard/Heatmap";
import { PerformanceGraph } from "@/components/dashboard/PerformanceGraph";
import { useEffect, useRef, useState } from "react";

// ─── Animated counter ───────────────────────────────────────────────────────
function Counter({ to, duration = 1.2 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const ctrl = animate(0, to, { duration, ease: "easeOut", onUpdate: v => setVal(Math.round(v)) });
    return ctrl.stop;
  }, [to, duration]);
  return <>{val}</>;
}

// ─── Stat card ───────────────────────────────────────────────────────────────
function StatCard({
  label, value, unit, icon, gradient, glowColor, delay
}: {
  label: string; value: number; unit: string;
  icon: React.ReactNode; gradient: string; glowColor: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-2xl overflow-hidden group cursor-default"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(24px)",
      }}
    >
      {/* hover gradient */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: gradient }}
      />
      {/* top glow line */}
      <div className="absolute top-0 left-6 right-6 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)` }}
      />

      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-5">
          <span className="text-white/40 text-xs font-semibold uppercase tracking-widest">{label}</span>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: gradient, boxShadow: `0 0 16px ${glowColor}40` }}>
            {icon}
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold tracking-tight" style={{ color: "rgba(255,255,255,0.92)" }}>
            <Counter to={value} />
          </span>
          <span className="text-white/35 text-sm font-medium">{unit}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Dashboard Client ────────────────────────────────────────────────────
export default function DashboardClient({
  initialStreak,
  isActive,
  logs,
  performanceData,
  totalQuizzes,
  quizzesMastered,
  materialCovered,
}: {
  initialStreak: number;
  isActive: boolean;
  logs: string[];
  performanceData: { x: number; y: number; label: string }[];
  totalQuizzes: number;
  quizzesMastered: number;
  materialCovered: number;
}) {
  const avgScore = performanceData.length > 0
    ? Math.round(performanceData.reduce((s, d) => s + d.y, 0) / performanceData.length)
    : 0;

  const stats = [
    {
      label: "Study Streak",
      value: initialStreak,
      unit: "days",
      gradient: "linear-gradient(135deg, rgba(251,146,60,0.18), rgba(239,68,68,0.08))",
      glowColor: "#f97316",
      delay: 0,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
    },
    {
      label: "Quizzes Mastered",
      value: quizzesMastered,
      unit: "perfect",
      gradient: "linear-gradient(135deg, rgba(99,102,241,0.18), rgba(139,92,246,0.08))",
      glowColor: "#818cf8",
      delay: 0.1,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      label: "Material Covered",
      value: materialCovered,
      unit: "docs",
      gradient: "linear-gradient(135deg, rgba(6,182,212,0.18), rgba(59,130,246,0.08))",
      glowColor: "#22d3ee",
      delay: 0.2,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
        </svg>
      ),
    },
    {
      label: "Avg Quiz Score",
      value: avgScore,
      unit: "%",
      gradient: "linear-gradient(135deg, rgba(52,211,153,0.18), rgba(16,185,129,0.08))",
      glowColor: "#34d399",
      delay: 0.3,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">

      {/* ── Streak status pill ── */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase"
        style={{
          background: isActive ? "rgba(52,211,153,0.1)" : "rgba(239,68,68,0.1)",
          border: `1px solid ${isActive ? "rgba(52,211,153,0.25)" : "rgba(239,68,68,0.25)"}`,
          color: isActive ? "#6ee7b7" : "#fca5a5",
        }}
      >
        <span className="relative flex h-2 w-2">
          {isActive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />}
          <span className="relative rounded-full h-2 w-2" style={{ background: isActive ? "#34d399" : "#f87171" }} />
        </span>
        {isActive ? "Active — Keep going!" : "Streak paused · Log in daily to keep your streak"}
      </motion.div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-2 rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)", backdropFilter: "blur(24px)" }}
        >
          <div className="px-6 pt-5 pb-2 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white/80">Performance Trend</h3>
              <p className="text-xs text-white/30 mt-0.5">Quiz scores over time</p>
            </div>
            <div className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: "rgba(99,102,241,0.12)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }}>
              {totalQuizzes} attempts
            </div>
          </div>
          <PerformanceGraph data={performanceData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-1 rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)", backdropFilter: "blur(24px)" }}
        >
          <div className="px-6 pt-5 pb-2">
            <h3 className="text-sm font-semibold text-white/80">Activity Heatmap</h3>
            <p className="text-xs text-white/30 mt-0.5">Daily study sessions</p>
          </div>
          <Heatmap logs={logs} />
        </motion.div>
      </div>

    </div>
  );
}
