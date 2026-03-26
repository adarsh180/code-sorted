"use client";

import { useState } from "react";
import { createQuiz, deleteQuiz } from "../actions";
import Link from "next/link";

type Quiz = any;
type Folder = any;

export default function QuizEngineClient({ initialQuizzes, folders }: { initialQuizzes: Quiz[], folders: Folder[] }) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [folderId, setFolderId] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!folderId) return alert("Please select a target folder");
    setLoading(true);
    await createQuiz(title, desc, folderId);
    setTitle("");
    setDesc("");
    setShowModal(false);
    setLoading(false);
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button 
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 font-medium text-sm transition-colors shadow-lg shadow-indigo-500/20"
        >
          + Create New Quiz
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialQuizzes.map(quiz => (
          <div key={quiz.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-colors group relative flex flex-col h-full">
            <button 
              onClick={() => deleteQuiz(quiz.id)}
              className="absolute top-4 right-4 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-rose-300"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-white mb-2 pr-6">{quiz.title}</h3>
            <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-grow">{quiz.description}</p>
            
            <div className="mt-auto space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10">
                  📁 {quiz.folder?.name || "Unassigned"}
                </span>
                <span>{quiz._count.questions} questions</span>
              </div>
              <Link 
                href={`/admin/quizzes/${quiz.id}`}
                className="block w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-center text-sm font-medium text-indigo-300 border border-white/5 transition-colors"
              >
                Edit Quiz Content &rarr;
              </Link>
            </div>
          </div>
        ))}
        {initialQuizzes.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-white/10 rounded-2xl">
            <p className="text-gray-500">No quizzes available in the system yet.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f1123] p-6 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl relative">
            <h3 className="text-xl font-semibold text-white mb-4">Create Quiz</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Quiz Title</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500" placeholder="e.g. Recursion Mastery Check" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea rows={2} value={desc} onChange={e => setDesc(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 flex-none resize-none" placeholder="Brief context about the test..." />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Target Folder</label>
                <select required value={folderId} onChange={e => setFolderId(e.target.value)} className="w-full bg-[#15182e] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
                  <option value="" disabled>Select a folder</option>
                  {folders.map((f: any) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors disabled:opacity-50">Create Quiz</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
