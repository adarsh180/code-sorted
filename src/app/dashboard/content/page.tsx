import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ContentLibraryClient from "./content-library-client";

export default async function StudentContentPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  // Fetch all folders
  const folders = await prisma.subjectFolder.findMany({
    include: {
      children: true,
      notes: true,
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="w-full">
      {/* Header */}
      <div className="relative mb-10 p-8 rounded-3xl overflow-hidden"
        style={{ background: "linear-gradient(135deg,rgba(6,182,212,0.07),rgba(59,130,246,0.04),rgba(99,102,241,0.03))", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 10% 50%, rgba(6,182,212,0.09) 0%, transparent 45%)" }} />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-400/70 mb-2">Library</p>
            <h1 className="text-4xl font-bold tracking-tight mb-2"
              style={{ background: "linear-gradient(100deg,rgba(255,255,255,0.95),rgba(103,232,249,0.85))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Learning Materials
            </h1>
            <p className="text-white/40 text-sm font-medium">Browse subjects, read notes, and download PDF resources.</p>
          </div>
          <div className="hidden lg:flex items-center gap-3 px-5 py-3 rounded-2xl"
            style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            <span className="text-cyan-300 text-sm font-semibold">{folders.length} subject{folders.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>

      <ContentLibraryClient folders={folders} />
    </div>
  );
}
