"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useCallback } from "react";

// ─── Style classification map ─────────────────────────────────────────────────
//  Style A – Cyber/Neon:  boy-01, boy-02, boy-03, girl-04
//  Style B – Code/Tech:   boy-03, girl-03   (boy-03 intentionally shares A + B → B wins)
//  Style C – Natural:     boy-04, boy-05, girl-01, girl-02, girl-05

type AvatarStyle = "A" | "B" | "C";

function getAvatarStyle(avatarUrl: string): AvatarStyle {
  if (!avatarUrl) return "C";
  const name = avatarUrl.split("/").pop() ?? "";
  // Style B takes priority for boy-03 and girl-03
  if (name.includes("boy-03") || name.includes("girl-03")) return "B";
  // Style A
  if (
    name.includes("boy-01") ||
    name.includes("boy-02") ||
    name.includes("girl-04")
  )
    return "A";
  // Everything else → Style C
  return "C";
}

// Glow colors per style
const STYLE_CONFIG: Record<AvatarStyle, { glow: string; bloom: string; pulse?: string }> = {
  A: { glow: "#00D1FF", bloom: "rgba(0,209,255,0.25)", pulse: "#BD00FF" },
  B: { glow: "#00FF85", bloom: "rgba(0,255,133,0.18)" },
  C: { glow: "#818cf8",  bloom: "rgba(99,102,241,0.22)" },
};

// ─── Style A: Neon pulse overlay ─────────────────────────────────────────────
function NeonCyberOverlay({ glow, pulse }: { glow: string; pulse?: string }) {
  return (
    <>
      {/* Pulsing outer aura */}
      <motion.div
        className="absolute inset-0 pointer-events-none bg-transparent"
        animate={{
          filter: [
            `drop-shadow(0 0 8px ${glow}) drop-shadow(0 0 2px ${pulse ?? glow})`,
            `drop-shadow(0 0 22px ${glow}) drop-shadow(0 0 10px ${pulse ?? glow})`,
            `drop-shadow(0 0 8px ${glow}) drop-shadow(0 0 2px ${pulse ?? glow})`,
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Lens scan line */}
      <motion.div
        className="absolute left-[30%] right-[30%] h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${glow}, transparent)`,
          top: "38%",
        }}
        animate={{ opacity: [0, 0.9, 0], scaleX: [0.6, 1.2, 0.6] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
    </>
  );
}

// ─── Style B: Code flicker ───────────────────────────────────────────────────
const CODE_SYMS = ["</>", "{}", "#;", "=>", "//", "[ ]"];
function CodeFlickerOverlay({ glow }: { glow: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none bg-transparent overflow-hidden flex flex-wrap items-end justify-center gap-1 px-3 pb-4">
      {CODE_SYMS.map((sym, i) => (
        <motion.span
          key={sym}
          className="text-[9px] font-mono font-bold select-none"
          style={{ color: glow, textShadow: `0 0 6px ${glow}` }}
          animate={{ opacity: [0, 1, 0.3, 1, 0] }}
          transition={{
            duration: 1.2 + i * 0.3,
            delay: i * 0.22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {sym}
        </motion.span>
      ))}
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface SmartAvatarHeroProps {
  name: string;
  avatarUrl: string | null;
  college: string | null;
  course: string | null;
}

// ─── Main component ───────────────────────────────────────────────────────────
export function SmartAvatarHero({ name, avatarUrl, college, course }: SmartAvatarHeroProps) {
  const firstName = name?.split(" ")[0] || "Student";
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect style
  const style: AvatarStyle = avatarUrl ? getAvatarStyle(avatarUrl) : "C";
  const { glow, bloom, pulse } = STYLE_CONFIG[style];

  // 3D hover tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 55, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 55, damping: 20 });
  const rotateX = useTransform(springY, [-1, 1], [8, -8]);
  const rotateY = useTransform(springX, [-1, 1], [-8, 8]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // Style C: breathing float animation on the motion div
  const floatAnimation =
    style === "C"
      ? { y: [0, -8, 0], scaleY: [1, 1.012, 1] }
      : undefined;

  // Style A: neon glow filter on the image container
  const glowFilter = [
    `drop-shadow(0 -3px 10px rgba(255,255,255,0.1))`,
    `drop-shadow(6px 0 16px ${glow}80)`,
    `drop-shadow(-6px 0 16px ${pulse ? pulse + "60" : glow + "60"})`,
    `drop-shadow(0 24px 32px rgba(0,0,0,0.7))`,
  ].join(" ");

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="flex flex-col items-center justify-center py-8 select-none"
      style={{ perspective: 900 }}
    >
      {/* Ambient bloom */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${bloom} 0%, transparent 70%)`,
          filter: "blur(28px)",
        }}
      />

      {/* 3D tilt + per-style float */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={floatAnimation}
        transition={
          style === "C"
            ? { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
        className="relative w-52 h-52 z-10 bg-transparent"
      >
        {avatarUrl ? (
          <>
            {/* Specular highlight */}
            <div
              className="absolute inset-0 z-20 pointer-events-none bg-transparent"
              style={{
                background:
                  "radial-gradient(ellipse at 28% 12%, rgba(255,255,255,0.2) 0%, transparent 48%)",
              }}
            />

            {/* Style-specific overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none bg-transparent">
              {style === "A" && <NeonCyberOverlay glow={glow} pulse={pulse} />}
              {style === "B" && <CodeFlickerOverlay glow={glow} />}
            </div>

            <Image
              src={avatarUrl}
              alt={`${firstName}'s avatar`}
              fill
              className="object-contain z-10"
              style={{ filter: glowFilter, background: "transparent" }}
              sizes="208px"
              priority
            />
          </>
        ) : (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-6xl font-bold text-white"
            style={{
              background: "linear-gradient(135deg,#6366f1,#7c3aed)",
              boxShadow: `0 0 40px ${glow}50`,
            }}
          >
            {firstName.charAt(0)}
          </div>
        )}

        {/* Ground shadow */}
        <div
          className="absolute bottom-[-18px] left-1/2 -translate-x-1/2 w-32 h-5 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse, ${glow}50 0%, transparent 75%)`,
            filter: "blur(10px)",
          }}
        />
      </motion.div>

      {/* Name badge */}
      <div className="mt-8 text-center z-10 relative">
        <h2
          className="text-2xl font-bold tracking-tight"
          style={{
            background: `linear-gradient(100deg, #e0e7ff 0%, ${glow}cc 55%, #c4b5fd 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {name}
        </h2>
        {(college || course) && (
          <p className="text-xs text-white/40 mt-1.5 font-medium tracking-wide">
            {course}{course && college ? " · " : ""}{college}
          </p>
        )}

        {/* Style badge */}
        <div
          className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
          style={{
            background: `${glow}15`,
            border: `1px solid ${glow}30`,
            color: glow,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: glow }} />
          {style === "A" ? "Cyber Mode" : style === "B" ? "Code Mode" : "Focus Mode"}
        </div>
      </div>
    </div>
  );
}
