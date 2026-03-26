import { prisma } from "@/lib/prisma";
import QuizEngineClient from "./quiz-client";

export default async function QuizEnginePage() {
  const quizzes = await prisma.quiz.findMany({
    include: {
      folder: true,
      _count: { select: { questions: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  
  const folders = await prisma.subjectFolder.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-8"
        style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.07),rgba(99,102,241,0.04))", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 5% 50%, rgba(139,92,246,0.09) 0%, transparent 45%)" }} />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(139,92,246,0.8)" }}>Assessment</p>
            <h1 className="text-4xl font-bold tracking-tight mb-1"
              style={{ background: "linear-gradient(100deg,rgba(255,255,255,0.95),rgba(196,181,253,0.85))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Quiz Engine
            </h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              Create, edit, and manage multiple-choice assessments linked to subject folders.
            </p>
          </div>
          <div className="px-5 py-3 rounded-2xl" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <p className="text-2xl font-bold" style={{ color: "#a78bfa" }}>{quizzes.length}</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(167,139,250,0.6)" }}>Quizzes</p>
          </div>
        </div>
      </div>

      <QuizEngineClient initialQuizzes={quizzes} folders={folders} />
    </div>
  );
}
