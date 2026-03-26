"use client";

import { motion } from "framer-motion";

const orbs = [
  {
    size: 500,
    color: "rgba(99, 102, 241, 0.15)",
    x: "10%",
    y: "20%",
    duration: 25,
  },
  {
    size: 400,
    color: "rgba(139, 92, 246, 0.12)",
    x: "70%",
    y: "60%",
    duration: 30,
  },
  {
    size: 350,
    color: "rgba(59, 130, 246, 0.1)",
    x: "80%",
    y: "10%",
    duration: 20,
  },
  {
    size: 300,
    color: "rgba(168, 85, 247, 0.08)",
    x: "20%",
    y: "75%",
    duration: 35,
  },
  {
    size: 250,
    color: "rgba(99, 102, 241, 0.06)",
    x: "50%",
    y: "40%",
    duration: 28,
  },
];

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 100%, rgba(139, 92, 246, 0.06) 0%, transparent 50%), #0a0a0f",
        }}
      />

      {/* Floating orbs */}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            left: orb.x,
            top: orb.y,
            filter: "blur(60px)",
          }}
          animate={{
            x: [0, 30, -20, 15, 0],
            y: [0, -25, 15, -10, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
