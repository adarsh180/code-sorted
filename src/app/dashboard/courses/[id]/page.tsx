import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const course = await prisma.course.findUnique({
    where: { id: params.id },
  });

  if (!course) redirect("/dashboard/courses");

  // Verify enrollment
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
  });

  if (!enrollment) {
    // If not enrolled but they somehow got here, bounce them back to courses
    redirect("/dashboard/courses");
  }

  // Parse YouTube or general iframe URLs if they pasted just a watch url
  let embedUrl = course.videoUrl;
  if (embedUrl && embedUrl.includes("youtube.com/watch?v=")) {
    embedUrl = embedUrl.replace("watch?v=", "embed/");
  } else if (embedUrl && embedUrl.includes("youtu.be/")) {
    embedUrl = embedUrl.replace("youtu.be/", "youtube.com/embed/");
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <Link href="/dashboard/courses" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
        ← Back to Courses
      </Link>

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-8"
        style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.06),rgba(6,182,212,0.04))", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 10% 50%, rgba(99,102,241,0.08) 0%, transparent 40%)" }} />
        <div className="relative z-10">
          <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(165,180,252,0.7)" }}>Course Hub</p>
          <h1 className="text-3xl md:text-5xl font-bold mb-3"
            style={{ background: "linear-gradient(100deg,#fff,#a5b4fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {course.title}
          </h1>
          {course.description && (
            <p className="text-sm md:text-base text-white/50 max-w-2xl leading-relaxed">{course.description}</p>
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Video & Main content */}
        <div className="lg:col-span-2 space-y-8">
          {embedUrl ? (
            <div className="rounded-2xl overflow-hidden bg-black aspect-video relative"
              style={{ border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
              <iframe 
                src={embedUrl} 
                className="absolute inset-0 w-full h-full" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
            </div>
          ) : course.thumbnail ? (
            <div className="rounded-2xl overflow-hidden bg-white/5 aspect-video relative"
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <img src={course.thumbnail} alt="" className="w-full h-full object-cover opacity-60" />
            </div>
          ) : null}

          {/* Markdown Course Notes */}
          <div className="rounded-2xl p-6 md:p-8"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full" style={{ background: "#818cf8" }} />
              Course Notes & Syllabus
            </h2>
            {course.content ? (
              <div className="prose prose-invert prose-indigo max-w-none text-white/70 prose-headings:text-white/90 prose-a:text-indigo-400">
                <ReactMarkdown>{course.content}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-white/30 text-sm italic">No written content provided for this course.</p>
            )}
          </div>
        </div>

        {/* Right Column: Instructor / Progress Info */}
        <div className="space-y-6">
          <div className="rounded-2xl p-6"
            style={{ background: "rgba(52,211,153,0.03)", border: "1px solid rgba(52,211,153,0.15)" }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                style={{ background: "linear-gradient(135deg,#34d399,#10b981)" }}>
                ✅
              </div>
              <div>
                <p className="font-bold text-emerald-400">Active Enrollment</p>
                <p className="text-xs text-white/40 mt-1">
                  Started {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(enrollment.enrolledAt))}
                </p>
              </div>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: "100%", background: "#34d399" }} />
            </div>
            <p className="text-[10px] text-center text-white/30 uppercase tracking-widest mt-3 font-semibold">Lifetime Access</p>
          </div>
        </div>

      </div>
    </div>
  );
}
