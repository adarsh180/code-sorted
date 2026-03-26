import { prisma } from "@/lib/prisma";
import { RemoveUserButton } from "@/components/admin/RemoveUserButton";

export default async function UserManagementPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      userSessions: { orderBy: { lastActiveAt: "desc" }, take: 1 },
      securityLogs: { orderBy: { timestamp: "desc" }, take: 1 },
      accounts: true,
    }
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-8"
        style={{ background: "linear-gradient(135deg,rgba(239,68,68,0.06),rgba(139,92,246,0.04))", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 5% 50%, rgba(239,68,68,0.08) 0%, transparent 45%)" }} />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(239,68,68,0.8)" }}>Registry</p>
            <h1 className="text-4xl font-bold tracking-tight mb-1"
              style={{ background: "linear-gradient(100deg,rgba(255,255,255,0.95),rgba(252,165,165,0.85))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              User Management
            </h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              {users.length} registered user{users.length !== 1 ? "s" : ""} on the platform.
            </p>
          </div>
          <div className="px-5 py-3 rounded-2xl"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <p className="text-2xl font-bold" style={{ color: "#f87171" }}>{users.length}</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(248,113,113,0.6)" }}>Total</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.018)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "rgba(15,17,35,0.8)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {["User", "Auth", "Security Info", "Location", "Status", "Actions"].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(165,180,252,0.7)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => {
                const latestSession = user.userSessions[0];
                const latestLog = user.securityLogs[0];
                const hasGoogle = user.accounts.some(a => a.provider === "google");
                return (
                  <tr key={user.id}
                    className="transition-colors duration-200 group"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    onMouseEnter={undefined}
                  >
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.image
                          ? <img src={user.image} alt="" className="w-10 h-10 object-contain shrink-0"
                              style={{ filter: "drop-shadow(0 0 10px rgba(99,102,241,0.4))" }} />
                          : <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                              style={{ background: "linear-gradient(135deg,#6366f1,#7c3aed)" }}>
                              {user.name?.charAt(0) || "U"}
                            </div>
                        }
                        <div>
                          <p className="font-semibold text-white/85 text-sm">{user.name || "—"}</p>
                          <p className="text-xs text-white/35 mt-0.5">{user.email}</p>
                          <p className="text-[10px] font-mono text-white/20 mt-0.5">{user.id.slice(0, 12)}…</p>
                        </div>
                      </div>
                    </td>
                    {/* Auth */}
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                        style={hasGoogle
                          ? { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.12)" }
                          : { background: "rgba(99,102,241,0.12)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.22)" }}>
                        {hasGoogle ? "Google" : "Credentials"}
                      </span>
                      <p className="text-[11px] text-white/25 mt-2">
                        {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(user.createdAt))}
                      </p>
                    </td>
                    {/* Security */}
                    <td className="px-6 py-4 max-w-[200px]">
                      <p className="text-xs text-white/40 truncate"><span className="text-white/20">Device:</span> {latestSession?.deviceInfo || latestLog?.deviceInfo || "—"}</p>
                      <p className="text-xs font-mono text-white/30 mt-1 truncate"><span className="font-sans text-white/20">IP:</span> {latestSession?.ipAddress || "—"}</p>
                    </td>
                    {/* Location */}
                    <td className="px-6 py-4">
                      {user.preciseLocationAllowed
                        ? <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                            style={{ background: "rgba(52,211,153,0.1)", color: "#6ee7b7", border: "1px solid rgba(52,211,153,0.2)" }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> GPS
                          </span>
                        : <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                            style={{ background: "rgba(251,146,60,0.1)", color: "#fdba74", border: "1px solid rgba(251,146,60,0.2)" }}>
                            Approx
                          </span>
                      }
                      <p className="text-[11px] text-white/25 mt-1">{latestLog?.approxLocation || "—"}</p>
                    </td>
                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                        style={user.consentGiven
                          ? { background: "rgba(99,102,241,0.1)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }
                          : { background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)" }}>
                        {user.consentGiven ? "Consented" : "Opted Out"}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-4">
                      <RemoveUserButton userId={user.id} userName={user.name} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-white/30 text-sm">No users registered yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
