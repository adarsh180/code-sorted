"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EMAIL = "codesorted0704@gmail.com";

// We use Web3Forms - a free, no-signup email API
// Get a free access key at https://web3forms.com/ and add to .env as WEB3FORMS_KEY
// Until configured, it falls back to a mailto: link
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    startTransition(async () => {
      try {
        if (!WEB3FORMS_KEY) {
          // Fallback: open mail client
          window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
          setStatus("success");
          return;
        }

        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: `[CodeSorted Contact] ${form.subject}`,
            from_name: form.name,
            email: EMAIL,
            reply_to: form.email,
            name: form.name,
            message: form.message,
          }),
        });

        const data = await res.json();
        setStatus(data.success ? "success" : "error");
        if (data.success) setForm({ name: "", email: "", subject: "", message: "" });
      } catch {
        setStatus("error");
      }
    });
  };

  const InputCls = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.06] transition-all duration-200";

  return (
    <div className="w-full max-w-2xl">
      {/* Header */}
      <div className="relative mb-10 p-8 rounded-3xl overflow-hidden"
        style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.07),rgba(139,92,246,0.04))", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 5% 50%, rgba(99,102,241,0.1) 0%, transparent 45%)" }} />
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400/70 mb-2">Support</p>
          <h1 className="text-4xl font-bold tracking-tight mb-2"
            style={{ background: "linear-gradient(100deg,rgba(255,255,255,0.95),rgba(165,180,252,0.9))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Contact Us
          </h1>
          <p className="text-white/40 text-sm font-medium">Have a question or feedback? We&apos;d love to hear from you.</p>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          {
            svg: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
            label: "Email", value: EMAIL, color: "#818cf8", glow: "rgba(99,102,241,0.3)",
            href: `mailto:${EMAIL}`,
          },
          {
            svg: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
            label: "Platform", value: "Code-Sorted", color: "#22d3ee", glow: "rgba(6,182,212,0.3)",
            href: undefined,
          },
        ].map((item, i) => (
          <a key={i} href={item.href} target="_blank" rel="noreferrer"
            className="p-5 rounded-2xl flex items-start gap-4 transition-all duration-200 hover:bg-white/[0.04]"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${item.glow}30`, border: `1px solid ${item.glow}` }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {item.svg}
              </svg>
            </div>
            <div>
              <p className="text-[10px] text-white/35 font-bold uppercase tracking-widest mb-1">{item.label}</p>
              <p className="text-sm text-white/80 font-medium break-all">{item.value}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-3xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Form header */}
        <div className="px-8 py-6 border-b border-white/[0.05]">
          <h2 className="text-lg font-bold text-white/85">Send a Message</h2>
          <p className="text-xs text-white/35 mt-0.5">We typically respond within 24 hours.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-white/40">Your Name</label>
              <input required name="name" value={form.name} onChange={handleChange}
                placeholder="e.g. Adarsh Kumar" className={InputCls} />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-white/40">Your Email</label>
              <input required type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" className={InputCls} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-white/40">Subject</label>
            <select required name="subject" value={form.subject} onChange={handleChange}
              className={InputCls} style={{ color: form.subject ? "white" : "rgba(255,255,255,0.25)" }}>
              <option value="" disabled style={{ background: "#1a1f35" }}>Select a topic…</option>
              {["General Enquiry", "Bug Report", "Feature Request", "Account Issue", "Course Enquiry", "Other"].map(o => (
                <option key={o} value={o} style={{ background: "#1a1f35" }}>{o}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-white/40">Message</label>
            <textarea required name="message" value={form.message} onChange={handleChange} rows={5}
              placeholder="Describe your issue or feedback in detail..."
              className={`${InputCls} resize-none`} />
          </div>

          {/* Status */}
          <AnimatePresence>
            {status === "success" && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium"
                style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", color: "#6ee7b7" }}>
                <span className="text-lg">✅</span> Message sent! We&apos;ll get back to you soon.
              </motion.div>
            )}
            {status === "error" && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
                <span className="text-lg">⚠️</span> Something went wrong. Please email us directly at {EMAIL}
              </motion.div>
            )}
          </AnimatePresence>

          <button type="submit" disabled={status === "sending" || isPending}
            className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.8), rgba(139,92,246,0.6))",
              boxShadow: "0 0 24px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.12)",
              border: "1px solid rgba(99,102,241,0.4)",
            }}>
            {status === "sending" ? (
              <>
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                Sending…
              </>
            ) : "Send Message →"}
          </button>

          <p className="text-[11px] text-white/25 text-center">
            Or email directly: <a href={`mailto:${EMAIL}`} className="text-indigo-400/70 hover:text-indigo-300 transition-colors">{EMAIL}</a>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
