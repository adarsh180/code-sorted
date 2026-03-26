import { prisma } from "@/lib/prisma";
import { CoursesAdminClient } from "./courses-client";

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { enrollments: true } } },
  });

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl p-8"
        style={{ background: "linear-gradient(135deg,rgba(234,179,8,0.07),rgba(249,115,22,0.04))", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 5% 50%, rgba(234,179,8,0.1) 0%, transparent 45%)" }} />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(234,179,8,0.8)" }}>Learning</p>
            <h1 className="text-4xl font-bold tracking-tight mb-1"
              style={{ background: "linear-gradient(100deg,rgba(255,255,255,0.95),rgba(253,224,71,0.85))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Courses Manager
            </h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              Create and publish courses — set pricing or make them free.
            </p>
          </div>
          <div className="px-5 py-3 rounded-2xl" style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.2)" }}>
            <p className="text-2xl font-bold" style={{ color: "#facc15" }}>{courses.length}</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(250,204,21,0.6)" }}>Courses</p>
          </div>
        </div>
      </div>

      <CoursesAdminClient initialCourses={courses} />
    </div>
  );
}
