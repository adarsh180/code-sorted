import { prisma } from "@/lib/prisma";

const STATS = [
  { key: "totalUsers",           label: "Total Users",       color: "#818cf8", glow: "rgba(99,102,241,0.25)",   icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { key: "activeSessions",       label: "Active Sessions",   color: "#34d399", glow: "rgba(52,211,153,0.25)",   icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { key: "totalNotesRead",       label: "Notes Viewed",      color: "#22d3ee", glow: "rgba(6,182,212,0.25)",    icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
  { key: "totalQuizzesAttempted",label: "Quizzes Taken",     color: "#a78bfa", glow: "rgba(139,92,246,0.25)",   icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7l2 2 4-4" },
  { key: "suspiciousLogs",       label: "Flagged Events",    color: "#f87171", glow: "rgba(239,68,68,0.25)",    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
];

export default async function AdminOverview() {
  const totalUsers            = await prisma.user.count();
  const activeSessions        = await prisma.userSession.count({ where: { isActive: true } });
  const suspiciousLogs        = await prisma.securityLog.count({ where: { isSuspicious: true } });
  const totalNotesRead        = await prisma.securityLog.count({ where: { actionType: "note_view" } });
  const totalQuizzesAttempted = await prisma.securityLog.count({ where: { actionType: "quiz_attempt" } });
  const recentUsers           = await prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { name: true, email: true, image: true, createdAt: true, role: true } });

  const data: Record<string, number> = { totalUsers, activeSessions, suspiciousLogs, totalNotesRead, totalQuizzesAttempted };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-8"
        style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.04),rgba(6,182,212,0.03))", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 5% 50%, rgba(99,102,241,0.1) 0%, transparent 45%)" }} />
        <div className="relative z-10">
          <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(239,68,68,0.8)" }}>Admin Console</p>
          <h1 className="text-4xl font-bold tracking-tight mb-1"
            style={{ background: "linear-gradient(100deg,rgba(255,255,255,0.95),rgba(165,180,252,0.85))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Platform Overview
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>Real-time metrics for CodeSorted operations.</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {STATS.map(({ key, label, color, glow, icon }) => (
          <div key={key} className="relative rounded-2xl overflow-hidden p-6 group"
            style={{ background: "rgba(255,255,255,0.022)", border: "1px solid rgba(255,255,255,0.06)" }}>
            {/* top glow line */}
            <div className="absolute top-0 left-4 right-4 h-px"
              style={{ background: `linear-gradient(90deg,transparent,${glow},transparent)` }} />
            <div className="flex items-start justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${glow}40`, border: `1px solid ${glow}` }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={icon} />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold tracking-tight" style={{ color }}>{data[key]}</p>
          </div>
        ))}
      </div>

      {/* Recent signups table */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.018)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="px-6 py-5 flex items-center justify-between"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div>
            <h2 className="text-base font-bold text-white/85">Recent Signups</h2>
            <p className="text-xs text-white/30 mt-0.5">Latest 5 registered users</p>
          </div>
          <a href="/admin/users" className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)" }}>
            View All →
          </a>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {recentUsers.map(u => (
            <div key={u.email} className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
              {u.image
                ? <img src={u.image} alt="" className="w-9 h-9 object-contain shrink-0" style={{ filter: "drop-shadow(0 0 8px rgba(99,102,241,0.4))" }} />
                : <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: "linear-gradient(135deg,#6366f1,#7c3aed)" }}>
                    {u.name?.charAt(0) || "U"}
                  </div>
              }
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white/80 truncate">{u.name || "—"}</p>
                <p className="text-xs text-white/35 truncate">{u.email}</p>
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full"
                style={u.role === "ADMIN"
                  ? { background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }
                  : { background: "rgba(99,102,241,0.1)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)" }}>
                {u.role}
              </div>
              <div className="text-[11px] text-white/25 shrink-0">
                {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(u.createdAt))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
