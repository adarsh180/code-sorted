"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const TOTAL_FRAMES = 80;
const FRAME_PATH = "/animation-code-sorted/ezgif-frame-";

function getFrameSrc(index: number): string {
  const padded = String(index + 1).padStart(3, "0");
  return `${FRAME_PATH}${padded}.jpg`;
}

export function ScrollFrameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const currentFrameRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

  // Preload all frames
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
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

    // Match canvas to viewport
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw image covering the canvas (object-fit: cover)
    const imgRatio = img.width / img.height;
    const canvasRatio = rect.width / rect.height;

    let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number;

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

  // Draw on frame change
  useMotionValueEvent(frameIndex, "change", (latest) => {
    const index = Math.min(Math.max(Math.round(latest), 0), TOTAL_FRAMES - 1);
    if (index !== currentFrameRef.current) {
      currentFrameRef.current = index;
      drawFrame(index);
    }
  });

  // Initial draw + resize
  useEffect(() => {
    if (isLoaded) {
      drawFrame(0);

      const handleResize = () => drawFrame(currentFrameRef.current);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [isLoaded, drawFrame]);

  return (
    <div ref={containerRef} className="relative" style={{ height: "400vh" }}>
      {/* Sticky canvas viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Loading state */}
        {!isLoaded && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4"
            style={{ background: "var(--color-surface-dark)" }}
          >
            <div className="relative w-16 h-16">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  border: "2px solid rgba(255,255,255,0.06)",
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  border: "2px solid transparent",
                  borderTopColor: "var(--color-accent-primary)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <span
              className="text-sm font-medium tracking-wide"
              style={{ color: "var(--color-text-muted)" }}
            >
              Loading experience...
            </span>
          </div>
        )}

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        />

        {/* Gradient overlays for text readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,10,15,0.4) 0%, transparent 30%, transparent 60%, rgba(10,10,15,0.8) 100%)",
          }}
        />
      </div>
    </div>
  );
}
