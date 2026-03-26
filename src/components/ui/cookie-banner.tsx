"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function CookieBanner() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session, update } = useSession();

  useEffect(() => {
    // Check local cookie first
    const consentCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("codesorted_cookie_consent="));

    if (!consentCookie) {
      // Small delay so it animates in nicely
      const t = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(t);
    } else if (
      consentCookie.split("=")[1] === "accepted" &&
      session?.user &&
      // @ts-ignore - custom property on next-auth session
      !session.user.consentGiven
    ) {
      // Sync local cookie accept state with DB silently if they are logged in but session says no
      syncAcceptToDb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const syncAcceptToDb = async () => {
    try {
      const res = await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          consentGiven: true, 
          preciseLocationAllowed: false,
          deviceInfo: navigator.userAgent
        }),
      });
      if (res.ok) {
        await update({ consentGiven: true });
      }
    } catch (err) {
      console.warn("Failed to sync consent status", err);
    }
  };

  const handleAccept = async () => {
    setLoading(true);

    let preciseCoordinates = null;
    let locationAllowed = false;

    // Trigger native browser permission prompt for location
    if ("geolocation" in navigator) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        preciseCoordinates = `${pos.coords.latitude},${pos.coords.longitude}`;
        locationAllowed = true;
      } catch (err) {
        console.warn("User dismissed or denied native location prompt", err);
      }
    }

    document.cookie = "codesorted_cookie_consent=accepted; path=/; max-age=31536000"; // 1 year
    
    if (session?.user) {
      try {
        const res = await fetch("/api/consent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            consentGiven: true, 
            preciseLocationAllowed: locationAllowed,
            preciseCoordinates,
            deviceInfo: navigator.userAgent
          }),
        });
        if (res.ok) {
          await update({ consentGiven: true });
        }
      } catch (err) {
        console.warn("Failed to sync consent status", err);
      }
    }
    
    setShow(false);
    setLoading(false);
  };

  const handleDecline = () => {
    document.cookie = "codesorted_cookie_consent=denied; path=/; max-age=31536000";
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 150, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
        >
          <div className="max-w-5xl mx-auto glass-dense rounded-2xl p-6 border border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="flex-1">
              <h3 className="text-white font-semibold flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" /> 
                Account Security & Cookie Preferences
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed max-w-3xl">
                We use strictly necessary cookies to keep your account secure and prevent unauthorized sharing. 
                By accepting, you consent to our <Link href="/terms" className="underline hover:text-white transition-colors">terms and services</Link>. 
                You can decline optional tracking, but essential services will still run.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 self-stretch md:self-auto justify-end">
              <button
                onClick={handleDecline}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? "Saving..." : "Accept Required"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
