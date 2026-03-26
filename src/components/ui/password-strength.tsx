"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface PasswordStrengthProps {
  password: string;
}

function getStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score: 1, label: "Weak", color: "#ef4444" };
  if (score <= 3) return { score: 2, label: "Fair", color: "#f59e0b" };
  if (score <= 4) return { score: 3, label: "Good", color: "#3b82f6" };
  return { score: 4, label: "Strong", color: "#22c55e" };
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = useMemo(() => getStrength(password), [password]);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className="h-1 flex-1 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <motion.div
              className="h-full rounded-full strength-bar"
              initial={{ width: 0 }}
              animate={{
                width: level <= strength.score ? "100%" : "0%",
                backgroundColor:
                  level <= strength.score
                    ? strength.color
                    : "rgba(255,255,255,0.06)",
              }}
              transition={{ duration: 0.4, delay: level * 0.05 }}
            />
          </div>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xs font-medium"
        style={{ color: strength.color }}
      >
        {strength.label}
      </motion.p>
    </div>
  );
}
