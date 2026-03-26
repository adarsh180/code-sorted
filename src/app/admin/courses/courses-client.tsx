"use client";

import { useState, useTransition } from "react";
import { createCourse, deleteCourse, togglePublish, updateCourse } from "./actions";

type Course = {
  id: string; title: string; description: string | null; thumbnail: string | null;
  price: number; isFree: boolean; isPublished: boolean; createdAt: Date;
  _count: { enrollments: number };
};

const INPUT = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-yellow-500/60 transition-colors";
const LABEL = "block text-xs font-semibold uppercase tracking-widest text-white/40 mb-1.5";

export function CoursesAdminClient({ initialCourses }: { initialCourses: Course[] }) {
  const [courses, setCourses] = useState(initialCourses);
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isFree, setIsFree] = useState(true);
  const [isPending, startTransition] = useTransition();

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("isFree", String(isFree));
    await createCourse(fd);
    setShowCreate(false);
    setIsFree(true);
    window.location.reload();
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this course?")) return;
    startTransition(() => { deleteCourse(id); });
    setCourses(c => c.filter(x => x.id !== id));
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    await togglePublish(id, !current);
    setCourses(c => c.map(x => x.id === id ? { ...x, isPublished: !current } : x));
  };

  return (
    <div className="space-y-6">
      {/* Create button */}
      <div className="flex justify-end">
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ background: "rgba(234,179,8,0.15)", color: "#fde047", border: "1px solid rgba(234,179,8,0.3)" }}>
          <span className="text-lg leading-none">+</span> New Course
        </button>
      </div>

      {/* Course cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {courses.map(course => (
          <div key={course.id} className="group rounded-2xl overflow-hidden flex flex-col"
            style={{ background: "rgba(255,255,255,0.022)", border: "1px solid rgba(255,255,255,0.06)" }}>
            {/* Thumbnail */}
            <div className="h-36 relative overflow-hidden"
              style={{ background: course.thumbnail ? undefined : "linear-gradient(135deg,rgba(234,179,8,0.15),rgba(249,115,22,0.1))" }}>
              {course.thumbnail
                ? <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">🎓</div>
              }
              {/* Published badge */}
              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
                style={course.isPublished
                  ? { background: "rgba(52,211,153,0.15)", color: "#6ee7b7", border: "1px solid rgba(52,211,153,0.3)" }
                  : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
                {course.isPublished ? "● Live" : "Draft"}
              </span>
            </div>

            <div className="p-5 flex flex-col flex-1 gap-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-white/85 text-sm leading-snug line-clamp-2 flex-1">{course.title}</h3>
                <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-bold"
                  style={course.isFree
                    ? { background: "rgba(52,211,153,0.12)", color: "#6ee7b7", border: "1px solid rgba(52,211,153,0.2)" }
                    : { background: "rgba(234,179,8,0.12)", color: "#fde047", border: "1px solid rgba(234,179,8,0.2)" }}>
                  {course.isFree ? "FREE" : `₹${course.price}`}
                </span>
              </div>

              {course.description && (
                <p className="text-xs text-white/35 line-clamp-2">{course.description}</p>
              )}

              <div className="flex items-center gap-2 text-[11px] text-white/30">
                <span>👥 {course._count.enrollments} enrolled</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-auto pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <button onClick={() => handleTogglePublish(course.id, course.isPublished)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={course.isPublished
                    ? { background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)" }
                    : { background: "rgba(52,211,153,0.1)", color: "#6ee7b7", border: "1px solid rgba(52,211,153,0.2)" }}>
                  {course.isPublished ? "Unpublish" : "Publish"}
                </button>
                <button onClick={() => setEditId(course.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{ background: "rgba(99,102,241,0.1)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(course.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{ background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)" }}>
                  Del
                </button>
              </div>
            </div>
          </div>
        ))}

        {courses.length === 0 && (
          <div className="col-span-3 py-20 text-center rounded-2xl"
            style={{ border: "2px dashed rgba(255,255,255,0.07)" }}>
            <p className="text-4xl mb-3">🎓</p>
            <p className="text-white/30 text-sm">No courses yet. Create your first one!</p>
          </div>
        )}
      </div>

      {/* Create Course Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-2xl p-8 shadow-2xl"
            style={{ background: "#0c0d1a", border: "1px solid rgba(234,179,8,0.2)" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Create New Course</h2>
              <button onClick={() => setShowCreate(false)} className="text-white/40 hover:text-white text-xl">✕</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className={LABEL}>Course Title</label>
                <input name="title" required placeholder="e.g. Full Stack Web Development" className={INPUT} />
              </div>
              <div>
                <label className={LABEL}>Description</label>
                <textarea name="description" rows={3} placeholder="What will students learn?" className={INPUT + " resize-none"} />
              </div>
              <div>
                <label className={LABEL}>Thumbnail URL (optional)</label>
                <input name="thumbnail" placeholder="https://..." className={INPUT} />
              </div>
              <div>
                <label className={LABEL}>Video Embed URL (optional)</label>
                <input name="videoUrl" placeholder="https://youtube.com/embed/..." className={INPUT} />
              </div>
              <div>
                <label className={LABEL}>Course Content (Markdown)</label>
                <textarea name="content" rows={5} placeholder="Write your course notes, syllabus, or markdown content here..." className={INPUT + " resize-none font-mono text-xs"} />
              </div>
              <div>
                <label className={LABEL}>Pricing</label>
                <div className="flex gap-3 mb-3">
                  {[true, false].map(f => (
                    <button key={String(f)} type="button" onClick={() => setIsFree(f)}
                      className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
                      style={isFree === f
                        ? { background: "rgba(234,179,8,0.2)", color: "#fde047", border: "1px solid rgba(234,179,8,0.4)" }
                        : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      {f ? "🆓 Free" : "₹ Paid"}
                    </button>
                  ))}
                </div>
                {!isFree && (
                  <input name="price" type="number" min="1" step="0.01" required placeholder="Price in INR (e.g. 499)" className={INPUT} />
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm text-white/50 hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={isPending}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{ background: "linear-gradient(135deg,#eab308,#f97316)", color: "#000" }}>
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
