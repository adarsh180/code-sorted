"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

export function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 px-6 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(99,102,241,0.08) 0%, transparent 70%)",
        }}
      />

      <motion.div
        className="max-w-3xl mx-auto text-center relative"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8"
          style={{
            boxShadow: "0 0 20px var(--color-accent-glow)",
          }}
        >
          <span className="text-lg">✨</span>
          <span
            className="text-xs font-semibold tracking-wide"
            style={{ color: "var(--color-accent-primary)" }}
          >
            Free to start. No credit card required.
          </span>
        </div>

        {/* Heading */}
        <h2
          className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-[1.1]"
          style={{ color: "var(--color-text-primary)" }}
        >
          Ready to sort
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary), #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            your learning?
          </span>
        </h2>

        <p
          className="mt-6 text-lg max-w-md mx-auto"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Join thousands of learners who transformed chaos into clarity. 
          Your sorted journey starts now.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth/signup">
            <motion.button
              className="btn-primary text-base px-10 py-4 rounded-xl font-bold"
              style={{
                boxShadow: "0 0 50px var(--color-accent-glow), 0 8px 40px rgba(99,102,241,0.3)",
              }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 0 60px var(--color-accent-glow), 0 12px 48px rgba(99,102,241,0.4)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started — It&apos;s Free
            </motion.button>
          </Link>
          <Link
            href="/auth/signin"
            className="btn-glass text-base px-8 py-4 rounded-xl"
          >
            I have an account
          </Link>
        </div>

        {/* Trust note */}
        <p
          className="mt-8 text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          🔒 Your data is encrypted and secure. We never sell your information.
        </p>
      </motion.div>
    </section>
  );
}
