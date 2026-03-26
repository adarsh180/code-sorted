import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./dashboard-client";
import { SmartAvatarHero } from "@/components/dashboard/SmartAvatarHero";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  // Fetch user analytics data to pass down
  const userId = session.user.id;
  
  // Calculate Streaks from Security Logs
  const activityLogs = await prisma.securityLog.findMany({
    where: { userId },
    orderBy: { timestamp: "desc" },
    select: { timestamp: true }
  });

  // Basic streak computation logic on the server to pass to client
  let currentStreak = 0;
  let isActive = false;
  
  if (activityLogs.length > 0) {
    const now = new Date();
    // Group logs by day string "YYYY-MM-DD"
    const uniqueDays = Array.from(new Set(activityLogs.map(l => l.timestamp.toISOString().split('T')[0])));
    
    // Sort descending
    uniqueDays.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    // Time since last active
    const hoursSinceLastActive = (now.getTime() - activityLogs[0].timestamp.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceLastActive <= 48) {
      isActive = true;
      currentStreak = 1;
      // Truncate logic to see consecutive days
      let checkDate = new Date(uniqueDays[0]);
      for (let i = 1; i < uniqueDays.length; i++) {
        const previousDay = new Date(uniqueDays[i]);
        const diffTime = Math.abs(checkDate.getTime() - previousDay.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (diffDays === 1) {
          currentStreak++;
          checkDate = previousDay;
        } else {
          break; // Streak broken
        }
      }
    }
  }

  // Calculate Performance Metrics
  const performanceLogs = await prisma.securityLog.findMany({
    where: { userId, actionType: "quiz_attempt" },
    orderBy: { timestamp: "asc" }
  });

  let performanceData = performanceLogs.map((log, i) => {
    // deviceInfo: "Quiz {quizId} - {score}/{total}"
    const match = log.deviceInfo?.match(/- (\d+)\/(\d+)/);
    let percentage = 0;
    if (match) {
      const score = parseInt(match[1]);
      const total = parseInt(match[2]);
      if (total > 0) percentage = Math.round((score / total) * 100);
    }
    return { x: i, y: percentage, label: new Date(log.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) };
  });

  if (performanceData.length === 0) {
    performanceData = [
      { x: 0, y: 0, label: "Start" },
      { x: 1, y: 0, label: "Now" }
    ];
  } else if (performanceData.length === 1) {
    performanceData.unshift({ x: 0, y: 0, label: "Start" });
  }

  // Find distinct passed quizzes (Quizzes Mastered = perfect score)
  const masteredQuizzes = new Set();
  performanceLogs.forEach(log => {
    const match = log.deviceInfo?.match(/- (\d+)\/(\d+)/);
    if (match && parseInt(match[2]) > 0 && match[1] === match[2]) { 
      masteredQuizzes.add(log.deviceInfo?.split(' - ')[0]);
    }
  });

  // Find Material Covered
  const noteLogs = await prisma.securityLog.findMany({
    where: { userId, actionType: "note_view" }
  });
  const materialSet = new Set();
  noteLogs.forEach(log => {
    const id = log.deviceInfo?.split(' - ')[0];
    if (id) materialSet.add(id);
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, image: true, college: true, course: true, gender: true }
  });

  return (
    <div className="w-full">
      {/* ── Hero Section: avatar centered with full-width welcome backdrop ── */}
      <div className="relative mb-12 rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.04) 50%, rgba(6,182,212,0.04) 100%)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Background mesh */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139,92,246,0.08) 0%, transparent 40%)" }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-0 lg:gap-8 px-6 lg:px-10 py-4">
          {/* Avatar hero — constrained width */}
          <div className="w-72 shrink-0">
            <SmartAvatarHero
              name={user?.name || session.user.name || "Student"}
              avatarUrl={user?.image || null}
              college={user?.college || null}
              course={user?.course || null}
            />
          </div>
          {/* Right: welcome text + quick info */}
          <div className="flex-1 text-center lg:text-left pb-4 lg:pb-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400/70 mb-2">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-3"
              style={{ background: "linear-gradient(100deg, rgba(255,255,255,0.95) 0%, rgba(165,180,252,0.9) 60%, rgba(196,181,253,0.85) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              Welcome back,<br />{(user?.name || session.user.name)?.split(" ")[0] || "Student"} 👋
            </h1>
            <p className="text-white/40 text-sm font-medium max-w-md">
              Here&apos;s everything you&apos;ve accomplished. Keep pushing — every session counts.
            </p>
          </div>
        </div>
      </div>

      <DashboardClient
        initialStreak={currentStreak}
        isActive={isActive}
        logs={activityLogs.map(l => l.timestamp.toISOString())}
        performanceData={performanceData}
        totalQuizzes={performanceLogs.length}
        quizzesMastered={masteredQuizzes.size}
        materialCovered={materialSet.size}
      />
    </div>
  );
}
