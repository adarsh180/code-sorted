import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { QuizPlayer } from "@/components/dashboard/QuizPlayer";
import Link from "next/link";

export default async function StudentQuizPlayerPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const quiz = await prisma.quiz.findUnique({
    where: { id: params.id },
    include: {
      folder: true,
      questions: {
        include: {
          options: true
        },
        orderBy: { orderIndex: "asc" }
      }
    }
  });

  if (!quiz) return notFound();

  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <Link href="/dashboard/quizzes" className="text-sm font-medium text-white/40 hover:text-white transition-colors mb-8 inline-flex items-center gap-2">
        <span className="text-lg leading-none">&larr;</span> Back to Quizzes
      </Link>
      
      <header className="mb-10 text-center">
        <span className="inline-block px-3 py-1 pb-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 uppercase tracking-widest mb-4">
          {quiz.folder.name}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{quiz.title}</h1>
        {quiz.description && <p className="text-white/50 mt-4 text-base">{quiz.description}</p>}
      </header>

      <QuizPlayer quiz={quiz} userId={session.user.id} />
    </div>
  );
}
