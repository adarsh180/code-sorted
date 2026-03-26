import { prisma } from "@/lib/prisma";
import QuizEditorClient from "./quiz-editor-client";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function QuizEditorPage({ params }: { params: { id: string } }) {
  // Await params for next 15 compatibility officially if needed, but params.id is synchronous mostly.
  const quiz = await prisma.quiz.findUnique({
    where: { id: params.id },
    include: {
      folder: true,
      questions: {
        include: {
          options: true
        },
        orderBy: { createdAt: "asc" }
      }
    }
  });

  if (!quiz) return notFound();

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <Link href="/admin/quizzes" className="text-sm text-indigo-400 hover:text-indigo-300 mb-2 inline-block transition-colors">&larr; Back to Quizzes</Link>
          <h1 className="text-3xl font-bold text-white mb-2">{quiz.title}</h1>
          <p className="text-gray-400 text-sm">{quiz.description}</p>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs text-gray-500 mt-4">
            📁 Linked to Folder: {quiz.folder.name}
          </span>
        </div>
      </div>

      <QuizEditorClient quiz={quiz} />
    </div>
  );
}
