import { prisma } from "@/lib/prisma";
import SecurityTableClient from "./security-client";

export default async function SecurityAuditPage() {
  // Fetch users with their complete security logs for the admin review
  const users = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: {
      securityLogs: {
        orderBy: { timestamp: 'desc' }
      },
      userSessions: {
        where: { isActive: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-8"
        style={{ background: "linear-gradient(135deg,rgba(251,146,60,0.06),rgba(239,68,68,0.04))", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 5% 50%, rgba(251,146,60,0.09) 0%, transparent 45%)" }} />
        <div className="relative z-10">
          <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(251,146,60,0.8)" }}>Audit &amp; Compliance</p>
          <h1 className="text-4xl font-bold tracking-tight mb-1"
            style={{ background: "linear-gradient(100deg,rgba(255,255,255,0.95),rgba(253,186,116,0.85))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Security &amp; Audit
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
            End-to-end monitoring of student sessions, IP vectors, and geographic anomalies.
          </p>
        </div>
      </div>

      <SecurityTableClient initialUsers={users} />
    </div>
  );
}
