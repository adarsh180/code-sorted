import { prisma } from "@/lib/prisma";
import ContentManagerClient from "@/app/admin/content/content-client";

export default async function ContentManagerPage() {
  const folders = await prisma.subjectFolder.findMany({
    include: {
      children: true,
      notes: true,
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-8"
        style={{ background: "linear-gradient(135deg,rgba(6,182,212,0.07),rgba(59,130,246,0.04))", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 5% 50%, rgba(6,182,212,0.09) 0%, transparent 45%)" }} />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(6,182,212,0.8)" }}>CMS</p>
            <h1 className="text-4xl font-bold tracking-tight mb-1"
              style={{ background: "linear-gradient(100deg,rgba(255,255,255,0.95),rgba(103,232,249,0.85))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Content Manager
            </h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              Organise subject folders, topics, and upload PDF notes for students.
            </p>
          </div>
          <div className="px-5 py-3 rounded-2xl" style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)" }}>
            <p className="text-2xl font-bold" style={{ color: "#22d3ee" }}>{folders.length}</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(34,211,238,0.6)" }}>Folders</p>
          </div>
        </div>
      </div>

      <ContentManagerClient initialFolders={folders} />
    </div>
  );
}
