"use client";

import { motion } from "framer-motion";
import { ReactNode, useState, useId } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";

// --- Aurora Background ---
export function PremiumAuroraBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-black/90" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[40%] bg-blue-600/10 blur-[100px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }} />
      
      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
    </div>
  );
}

// --- Glass Layout Wrapper ---
export function PremiumAuthLayout({ children, leftPanel }: { children: ReactNode, leftPanel?: ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white selection:bg-violet-500/30">
      <PremiumAuroraBackground />
      
      <div className="relative z-10 w-full max-w-[1200px] flex mx-auto p-4 md:p-8 min-h-screen items-center">
        {/* Left Side (Brand/Logo) */}
        <div className="hidden lg:flex w-1/2 flex-col justify-center pr-12">
          {leftPanel || (
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3 mb-6">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="url(#logo-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <defs>
                    <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#c4b5fd" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
                <h1 className="text-3xl font-extrabold tracking-tight">Code Sorted</h1>
              </div>
              <h2 className="text-4xl xl:text-5xl font-bold tracking-tight mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/40">
                Elevate your <br className="hidden xl:block" /> coding journey.
              </h2>
              <p className="text-lg text-white/50 max-w-md font-medium">
                The most advanced learning OS built for developers. Perfect your craft with elite tools and structured roadmaps.
              </p>
            </motion.div>
          )}
        </div>

        {/* Right Side (Auth Form) */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[440px] relative group"
          >
            {/* Ambient Shadow behind the card */}
            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-1000 blur-sm pointer-events-none" />
            
            <div className="relative p-8 sm:p-12 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset,0_20px_40px_-10px_rgba(0,0,0,0.5)] backdrop-blur-3xl">
              {children}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// --- Apple-Styled Inputs ---
interface PremiumInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function PremiumInput({ label, type, className, ...props }: PremiumInputProps) {
  const id = useId();
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="space-y-2 w-full relative">
      <label htmlFor={id} className="text-xs font-semibold text-white/60 uppercase tracking-widest pl-1">
        {label}
      </label>
      <div className="relative group/input">
        {/* Glow behind input on focus */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isFocused ? 1 : 0 }}
          className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-violet-500/50 to-fuchsia-500/50 blur-md transition-opacity duration-500"
        />
        
        <div className="relative flex items-center bg-black/40 rounded-2xl border border-white/5 transition-colors group-hover/input:border-white/10 focus-within:border-violet-500/50 focus-within:bg-black/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] backdrop-blur-xl">
          <input
            id={id}
            type={isPassword ? (isVisible ? "text" : "password") : type}
            onFocus={(e) => { setIsFocused(true); props.onFocus && props.onFocus(e); }}
            onBlur={(e) => { setIsFocused(false); props.onBlur && props.onBlur(e); }}
            className={`w-full px-5 py-3.5 bg-transparent text-white placeholder:text-white/20 focus:outline-none focus:ring-0 ${isPassword ? 'pr-12' : ''} ${className || ''}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setIsVisible(!isVisible)}
              className="absolute right-4 text-white/30 hover:text-white/70 transition-colors"
            >
              {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Submit Button ---
interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export function PremiumButton({ children, isLoading, className, ...props }: PremiumButtonProps) {
  return (
    <button
      disabled={isLoading || props.disabled}
      className={`relative w-full group overflow-hidden rounded-2xl font-semibold shadow-[0_8px_20px_-8px_rgba(139,92,246,0.5)] transition-all duration-300 hover:shadow-[0_8px_25px_-5px_rgba(139,92,246,0.6)] hover:-translate-y-[1px] active:translate-y-[1px] disabled:opacity-50 disabled:hover:-translate-y-0 disabled:hover:shadow-none ${className || ''}`}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-[length:200%_auto] animate-[gradient_4s_linear_infinite]" />
      
      {/* Top reflection line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      <div className="relative px-6 py-4 flex items-center justify-center gap-2 text-white">
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            <span>Processing...</span>
          </>
        ) : (
          children
        )}
      </div>
    </button>
  );
}

// --- Google Auth Button ---
export function PremiumGoogleButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative w-full group overflow-hidden rounded-2xl font-medium shadow-[0_4px_15px_-5px_rgba(0,0,0,0.5)] transition-all duration-300 hover:shadow-[0_8px_20px_-5px_rgba(0,0,0,0.6)] hover:-translate-y-[1px] active:translate-y-[1px] bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
    >
      {/* Top reflection line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative px-6 py-4 flex items-center justify-center gap-3 text-white/90 group-hover:text-white">
        <img
          src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
          alt="Google"
          width={20}
          height={20}
          className="opacity-90 group-hover:opacity-100 transition-opacity"
        />
        <span>Continue with Google</span>
      </div>
    </button>
  );
}
