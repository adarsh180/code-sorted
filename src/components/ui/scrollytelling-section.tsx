"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import Link from "next/link";

const TOTAL_FRAMES = 80;
const FRAME_PATH = "/animation-code-sorted/ezgif-frame-";

function getFrameSrc(index: number): string {
  const padded = String(index + 1).padStart(3, "0");
  return `${FRAME_PATH}${padded}.jpg`;
}

// A reusable sub-component mapping scroll to individual word opacity for typewriter effect
function ScrollTypewriter({
  text,
  progress,
  rangeStart,
  rangeEnd,
  className = "",
}: {
  text: string;
  progress: import("framer-motion").MotionValue<number>;
  rangeStart: number;
  rangeEnd: number;
  className?: string;
}) {
  const words = text.split(" ");
  
  return (
    <span className={className}>
      {words.map((word, i) => {
        // Calculate the specific range for this word
        const step = (rangeEnd - rangeStart) / words.length;
        const wordStart = rangeStart + i * step;
        const wordEnd = rangeStart + (i + 1) * step;
        
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const opacity = useTransform(progress, [wordStart, wordEnd], [0.2, 1]);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const filter = useTransform(progress, [wordStart, wordEnd], ["blur(8px)", "blur(0px)"]);
        
        return (
          <motion.span key={i} style={{ opacity, filter, display: "inline-block", marginRight: "0.25em" }}>
            {word}
          </motion.span>
        );
      })}
    </span>
  );
}

// An auto-typing typewriter effect specifically for code-style reveals
function AutoTypewriter({ text, progress, start, end, className = "" }: { text: string, progress: any, start: number, end: number, className?: string }) {
  const [charsToShow, setCharsToShow] = useState(0);
  const [inRange, setInRange] = useState(false);

  useEffect(() => {
    if (inRange) {
      let current = 0;
      const interval = setInterval(() => {
        current += 1;
        setCharsToShow(current);
        if (current >= text.length) clearInterval(interval);
      }, 40);
      return () => clearInterval(interval);
    } else {
      setCharsToShow(0);
    }
  }, [inRange, text.length]);

  useMotionValueEvent(progress, "change", (latest: number) => {
    if (latest >= start && latest <= end) {
      if (!inRange) setInRange(true);
    } else {
      if (inRange) setInRange(false);
    }
  });

  return (
    <span className={`font-mono tracking-tight relative inline-block ${className}`}>
      {text.slice(0, charsToShow)}
      {inRange && (
        <motion.span 
          animate={{ opacity: [1, 0, 1] }} 
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-[0.4em] h-[0.9em] bg-currentColor align-middle ml-1 -translate-y-[0.1em]"
          style={{ backgroundColor: "currentColor" }}
        />
      )}
    </span>
  );
}

export function ScrollytellingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const currentFrameRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map scroll progress purely linearly over the 80 frames since the user updated the animation assets
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

  // Preload frames
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new window.Image();
      img.src = getFrameSrc(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;
  }, []);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imagesRef.current[index];

    if (!canvas || !ctx || !img) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // Maintain aspect ratio while covering the canvas
    const imgRatio = img.width / img.height;
    const canvasRatio = rect.width / rect.height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgRatio > canvasRatio) {
      drawHeight = rect.height;
      drawWidth = rect.height * imgRatio;
      offsetX = (rect.width - drawWidth) / 2;
      offsetY = 0;
    } else {
      drawWidth = rect.width;
      drawHeight = rect.width / imgRatio;
      offsetX = 0;
      offsetY = (rect.height - drawHeight) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  useMotionValueEvent(frameIndex, "change", (latest) => {
    const index = Math.min(Math.max(Math.round(latest), 0), TOTAL_FRAMES - 1);
    if (index !== currentFrameRef.current) {
      currentFrameRef.current = index;
      drawFrame(index);
    }
  });

  useEffect(() => {
    if (isLoaded) {
      drawFrame(0);
      const handleResize = () => drawFrame(currentFrameRef.current);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [isLoaded, drawFrame]);

  // Content Visibility Transformers
  // Phase 1: The Hook (0.05 -> 0.15)
  const hookOpacity = useTransform(scrollYProgress, [0.0, 0.05, 0.15, 0.18], [0, 1, 1, 0]);
  const hookY = useTransform(scrollYProgress, [0.0, 0.18], [20, -20]);

  // Phase 2: The Pain (0.2 -> 0.35)
  const painOpacity = useTransform(scrollYProgress, [0.18, 0.22, 0.35, 0.38], [0, 1, 1, 0]);
  const painY = useTransform(scrollYProgress, [0.18, 0.38], [20, -20]);

  // Phase 3: The Pivot (0.4 -> 0.55) -> Violet glow happens around here
  const pivotOpacity = useTransform(scrollYProgress, [0.38, 0.45, 0.55, 0.58], [0, 1, 1, 0]);
  const pivotY = useTransform(scrollYProgress, [0.38, 0.58], [20, -20]);
  
  // Phase 4: The Result (0.6 -> 0.75) -> Snapping into place
  const resultOpacity = useTransform(scrollYProgress, [0.58, 0.65, 0.75, 0.78], [0, 1, 1, 0]);
  const resultY = useTransform(scrollYProgress, [0.58, 0.78], [20, -20]);

  // Phase 5: The CTA (0.8 -> 1.0) -> Scaling up
  const ctaOpacity = useTransform(scrollYProgress, [0.78, 0.85, 1], [0, 1, 1]);
  const ctaY = useTransform(scrollYProgress, [0.78, 1], [40, 0]);
  
  // Entire section scaling up from 0.7 to 1.0, matching user instruction
  const sectionScale = useTransform(scrollYProgress, [0.7, 1], [1, 1.05]);
  
  // Background gradient transitioning from #05060f to slate-950 and glowing
  const glowOpacity = useTransform(scrollYProgress, [0.4, 0.7], [0, 0.8]);

  return (
    <div 
      ref={containerRef} 
      className="relative" 
      style={{ 
        height: "300vh",
        marginTop: "-30vh",
        maskImage: "linear-gradient(to bottom, transparent, black 8%, black 95%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 8%, black 95%, transparent 100%)",
      }}
    >
      <motion.div 
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden"
        style={{ scale: sectionScale }}
      >
        {/* Violet glow overlay appearing at phase 0.4 */}
        <motion.div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{ 
            opacity: glowOpacity,
            background: "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 60%)",
            boxShadow: "inset 0 0 100px rgba(139, 92, 246, 0.1)"
          }}
        />

        {/* The Frame Animation Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full mix-blend-lighten z-0 object-cover"
          style={{
            opacity: isLoaded ? 0.7 : 0, // Lower opacity to let text pop
            transition: "opacity 0.6s ease",
          }}
        />
        
        {/* Fallback loading indicator */}
        {!isLoaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <span className="text-sm tracking-widest text-[#8b5cf6] animate-pulse">
              SYNCING FRAMES...
            </span>
          </div>
        )}

        {/* Text Storytelling Layers */}
        <div className="relative z-20 w-full h-full max-w-4xl px-6 text-center">
          
          {/* Phase 1: The Hook - Positioned higher up to clear center */}
          <motion.div 
            className="absolute left-1/2 top-1/4 -translate-x-1/2 w-full"
            style={{ opacity: hookOpacity, y: hookY }}
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              <ScrollTypewriter text="The world is full of noise." progress={scrollYProgress} rangeStart={0.02} rangeEnd={0.10} />
            </h2>
          </motion.div>

          {/* Phase 2: The Pain - Split into three separate floating elements */}
          {/* 1000+ PDFs - Top Left (Fixed to viewport) */}
          <motion.div 
            className="fixed top-[15vh] left-[5vw] md:left-[8vw] z-50 text-left pointer-events-none"
            style={{ opacity: painOpacity, y: painY }}
          >
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tighter text-white/90 drop-shadow-2xl">
              <ScrollTypewriter text="1000+ PDFs." progress={scrollYProgress} rangeStart={0.20} rangeEnd={0.24} />
            </h2>
          </motion.div>

          {/* 50+ Tabs - Top Right (Fixed to viewport) */}
          <motion.div 
            className="fixed top-[15vh] right-[5vw] md:right-[8vw] z-50 text-right pointer-events-none"
            style={{ opacity: painOpacity, y: painY }}
          >
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tighter text-white/80 drop-shadow-2xl">
              <ScrollTypewriter text="50+ Tabs." progress={scrollYProgress} rangeStart={0.25} rangeEnd={0.29} />
            </h2>
          </motion.div>

          {/* Zero Clarity - Bottom Center */}
          <motion.div 
            className="absolute left-1/2 bottom-12 -translate-x-1/2 w-full text-center flex flex-col items-center justify-end"
            style={{ opacity: painOpacity, y: painY }}
          >
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter">
              <ScrollTypewriter text="Zero Clarity." progress={scrollYProgress} rangeStart={0.30} rangeEnd={0.34} className="text-rose-400 drop-shadow-[0_0_20px_rgba(244,63,94,0.4)]" />
            </h2>
          </motion.div>

          {/* Phase 3: The Pivot - Positioned bottom center to match Zero Clarity */}
          <motion.div 
            className="absolute left-1/2 bottom-12 -translate-x-1/2 w-full text-center flex flex-col items-center justify-end"
            style={{ opacity: pivotOpacity, y: pivotY }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-violet-100 drop-shadow-[0_0_25px_rgba(139,92,246,0.6)]">
              <AutoTypewriter text="We found the signal in the static." progress={scrollYProgress} start={0.38} end={0.58} />
            </h2>
          </motion.div>

          {/* Phase 4: The Result - Kept mostly centered but pushed up slightly */}
          <motion.div 
            className="absolute left-1/2 top-[35%] -translate-x-1/2 w-full"
            style={{ opacity: resultOpacity, y: resultY }}
          >
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-100 to-violet-400 drop-shadow-[0_0_30px_rgba(139,92,246,0.4)] pb-4">
              <ScrollTypewriter text="Learning, finally Sorted." progress={scrollYProgress} rangeStart={0.60} rangeEnd={0.70} />
            </h2>
          </motion.div>

          {/* Phase 5: The CTA */}
          <motion.div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex flex-col items-center gap-8"
            style={{ opacity: ctaOpacity, y: ctaY }}
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <ScrollTypewriter text="Mastery starts with structure." progress={scrollYProgress} rangeStart={0.80} rangeEnd={0.90} />
            </h2>
            
            <motion.div
              style={{
                opacity: useTransform(scrollYProgress, [0.88, 0.95], [0, 1]),
                scale: useTransform(scrollYProgress, [0.88, 0.95], [0.9, 1]),
              }}
            >
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold text-white transition-all duration-300 bg-violet-600 rounded-xl shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)] hover:shadow-[0_0_60px_-15px_rgba(139,92,246,0.8)] hover:-translate-y-1 hover:bg-violet-500"
              >
                Get Started
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
