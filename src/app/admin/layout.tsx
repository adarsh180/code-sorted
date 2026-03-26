import Link from "next/link";
import { ReactNode } from "react";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/admin/users", label: "Users", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { href: "/admin/content", label: "Content", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { href: "/admin/courses", label: "Courses", icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" },
  { href: "/admin/quizzes", label: "Quiz Engine", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7l2 2 4-4" },
  { href: "/admin/security", label: "Security", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }
  
  // @ts-ignore
  if (session?.user?.email !== "codesorted0704@gmail.com" && session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#05060f", color: "#e0e7ff" }}>

      {/* ── Sidebar ── */}
      <aside className="w-64 shrink-0 flex flex-col"
        style={{ background: "rgba(255,255,255,0.018)", borderRight: "1px solid rgba(255,255,255,0.06)" }}>

        {/* Logo */}
        <div className="px-6 py-7 flex items-center gap-3"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <img src="/logo/logo.png" alt="CodeSorted" className="w-10 h-10 object-contain"
            style={{ filter: "drop-shadow(0 0 12px rgba(139,92,246,0.7))" }} />
          <div>
            <div className="text-sm font-bold tracking-tight text-white">Code<span style={{ color: "#818cf8" }}>Sorted</span></div>
            <div className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: "rgba(239,68,68,0.8)" }}>Admin Panel</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5">
          {NAV.map(({ href, label, icon }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-white/50 hover:text-white/90 hover:bg-indigo-500/10">
              <svg className="w-4 h-4 shrink-0 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={icon} />
              </svg>
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <SignOutButton />
          <p className="text-center text-[10px] font-semibold uppercase tracking-widest mt-3"
            style={{ color: "rgba(239,68,68,0.5)" }}>
            Restricted · Level 5
          </p>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-8 py-4"
          style={{ background: "rgba(5,6,15,0.8)", borderBottom: "1px solid rgba(255,255,255,0.04)", backdropFilter: "blur(20px)" }}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#34d399" }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(52,211,153,0.8)" }}>
              Admin · Live
            </span>
          </div>
          <div className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.25)" }}>
            {new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
          </div>
        </div>

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
