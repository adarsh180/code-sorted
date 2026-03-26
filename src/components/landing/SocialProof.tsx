"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const stats = [
  { value: 10000, suffix: "+", label: "Active Learners" },
  { value: 150, suffix: "+", label: "Structured Courses" },
  { value: 95, suffix: "%", label: "Completion Rate" },
  { value: 365, suffix: "", label: "Day Streak Record" },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "UPSC Aspirant",
    quote: "CodeSorted turned my scattered notes into a structured study system. My revision time dropped by 60%.",
    avatar: "PS",
    color: "var(--color-accent-primary)",
  },
  {
    name: "Arjun Mehta",
    role: "Full-Stack Developer",
    quote: "The active recall feature is a game-changer. I finally retain what I learn instead of forgetting it in a week.",
    avatar: "AM",
    color: "var(--color-accent-secondary)",
  },
  {
    name: "Sneha Patel",
    role: "CS Student, IIT-B",
    quote: "Gamified quizzes made DSA prep actually fun. The streak system kept me consistent for 90+ days straight.",
    avatar: "SP",
    color: "#06b6d4",
  },
];

export function SocialProof() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Stats row */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-dense rounded-2xl p-6 text-center"
              style={{
                boxShadow: "0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              <div
                className="text-3xl md:text-4xl font-extrabold tracking-tight"
                style={{
                  background: "linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <p
                className="mt-2 text-sm font-medium"
                style={{ color: "var(--color-text-muted)" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Testimonials header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase"
            style={{ color: "var(--color-accent-primary)" }}
          >
            Loved by learners
          </span>
          <h2
            className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            Real results. Real people.
          </h2>
        </motion.div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="glass-dense rounded-2xl p-8 flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              style={{
                boxShadow: "0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              {/* Quote */}
              <p
                className="text-sm leading-relaxed flex-1 mb-6"
                style={{ color: "var(--color-text-secondary)" }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: `${t.color}20`,
                    color: t.color,
                    border: `1px solid ${t.color}30`,
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {t.name}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
