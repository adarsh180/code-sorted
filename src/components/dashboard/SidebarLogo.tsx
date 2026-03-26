"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

export function SidebarLogo() {
  const fullText = "CodeSorted";
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const typingSpeed = 150;
  const deletingSpeed = 100;
  const pauseTime = 3000;

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      if (displayedText === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        timer = setTimeout(() => {}, typingSpeed);
      } else {
        timer = setTimeout(() => {
          setDisplayedText(fullText.substring(0, displayedText.length - 1));
        }, deletingSpeed);
      }
    } else {
      if (displayedText === fullText) {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      } else {
        timer = setTimeout(() => {
          setDisplayedText(fullText.substring(0, displayedText.length + 1));
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, fullText, loopNum]);

  // Split Code and Sorted for coloring
  let codePart = "";
  let sortedPart = "";
  
  if (displayedText.length <= 4) {
    codePart = displayedText;
  } else {
    codePart = "Code";
    sortedPart = displayedText.substring(4);
  }

  return (
    <Link href="/" className="flex items-center gap-2 group">
      <img 
        src="/logo/logo.png" 
        alt="CodeSorted Logo" 
        className="w-7 h-7 object-contain drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]"
      />
      <span className="text-xl font-medium tracking-tight flex items-center">
        <span className="text-white/90">{codePart}</span>
        <span className="text-white/40">{sortedPart}</span>
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
          className="inline-block w-[2px] h-5 bg-white/70 ml-[2px]"
        />
      </span>
    </Link>
  );
}
