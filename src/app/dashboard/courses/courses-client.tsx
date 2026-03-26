"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type Course = {
  id: string; title: string; description: string | null; thumbnail: string | null;
  price: number; isFree: boolean; enrollmentCount: number; isEnrolled: boolean;
};

declare global { interface Window { Razorpay: any; } }

export default function CoursesPageClient({ courses }: { courses: Course[] }) {
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(
    new Set(courses.filter(c => c.isEnrolled).map(c => c.id))
  );
  const [paying, setPaying] = useState<string | null>(null);

  // Load Razorpay script
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    document.body.appendChild(s);
    return () => { document.body.removeChild(s); };
  }, []);

  const handleEnroll = async (course: Course) => {
    if (course.isFree || course.price === 0) {
      // Free — direct enrollment
      const res = await fetch("/api/payment/enroll-free", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ courseId: course.id }) });
      if (res.ok) setEnrolledIds(s => new Set([...s, course.id]));
      return;
    }

    // Paid — Razorpay
    setPaying(course.id);
    try {
      const orderRes = await fetch("/api/payment/create-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ courseId: course.id }) });
      if (!orderRes.ok) throw new Error("Failed to create order");
      const { orderId, amount, currency, courseName } = await orderRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount, currency, name: "CodeSorted", description: courseName,
        order_id: orderId,
        handler: async (response: any) => {
          const verRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, courseId: course.id }),
          });
          if (verRes.ok) {
            setEnrolledIds(s => new Set([...s, course.id]));
            alert("🎉 Payment successful! You now have access.");
          } else {
            alert("Payment verification failed. Contact support.");
          }
        },
        prefill: {},
        theme: { color: "#6366f1" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Payment error: " + (err as Error).message);
    } finally { setPaying(null); }
  };

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="text-6xl mb-4 opacity-30">🎓</div>
          <h1 className="text-3xl font-bold mb-2" style={{ background: "linear-gradient(100deg,#e0e7ff,#a5b4fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Courses
          </h1>
          <p className="text-white/30 text-sm max-w-sm">No courses are live yet. Check back soon — something exciting is coming.</p>
          <div className="mt-6 text-sm font-mono text-indigo-400/50 overflow-hidden">
            {["Preparing curriculum…", "Loading content…", "Going live soon…"].map((t, i) => (
              <motion.p key={t} initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }}
                transition={{ delay: i * 1.5, duration: 1.2, repeat: Infinity, repeatDelay: 4.5 - i * 1.5 }}>
                {t}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 mb-2"
        style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.04))", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 8% 50%, rgba(99,102,241,0.1) 0%, transparent 50%)" }} />
        <div className="relative z-10">
          <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(165,180,252,0.7)" }}>Learning</p>
          <h1 className="text-4xl font-bold mb-1"
            style={{ background: "linear-gradient(100deg,#e0e7ff,#a5b4fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Courses
          </h1>
          <p className="text-sm text-white/35">{courses.length} course{courses.length !== 1 ? "s" : ""} available</p>
        </div>
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course, i) => {
          const enrolled = enrolledIds.has(course.id);
          return (
            <motion.div key={course.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex flex-col rounded-2xl overflow-hidden group"
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>

              {/* Thumbnail */}
              <div className="h-40 relative overflow-hidden shrink-0"
                style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.1))" }}>
                {course.thumbnail
                  ? <img src={course.thumbnail} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                  : <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">🎓</div>
                }
                {/* Price badge */}
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold"
                  style={course.isFree || course.price === 0
                    ? { background: "rgba(52,211,153,0.9)", color: "#fff" }
                    : { background: "rgba(99,102,241,0.9)", color: "#fff" }}>
                  {course.isFree || course.price === 0 ? "FREE" : `₹${course.price}`}
                </span>
                {enrolled && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold"
                    style={{ background: "rgba(52,211,153,0.2)", color: "#6ee7b7", border: "1px solid rgba(52,211,153,0.4)" }}>
                    ✓ Enrolled
                  </span>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1 gap-3">
                <h3 className="font-bold text-white/90 text-base leading-snug">{course.title}</h3>
                {course.description && (
                  <p className="text-xs text-white/40 line-clamp-3 leading-relaxed">{course.description}</p>
                )}
                <p className="text-[11px] text-white/25">👥 {course.enrollmentCount} enrolled</p>

                <div className="mt-auto">
                  {enrolled ? (
                    <Link href={`/dashboard/courses/${course.id}`} className="block">
                      <button className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-emerald-500/20"
                        style={{ background: "rgba(52,211,153,0.1)", color: "#6ee7b7", border: "1px solid rgba(52,211,153,0.25)" }}>
                        ✓ Access Course
                      </button>
                    </Link>
                  ) : (
                    <button onClick={() => handleEnroll(course)} disabled={paying === course.id}
                      className="w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ background: "linear-gradient(135deg,#6366f1,#7c3aed)", color: "white", boxShadow: "0 0 20px rgba(99,102,241,0.25)" }}>
                      {paying === course.id ? "Processing…" : course.isFree || course.price === 0 ? "Enroll Free" : `Buy — ₹${course.price}`}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
