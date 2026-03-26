import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { decrypt } from "@/lib/encryption";
import { RemoveUserButton } from "@/components/admin/RemoveUserButton";

function parseDevice(userAgent: string | null) {
  if (!userAgent) return { os: "Unknown", browser: "Unknown", type: "Unknown", raw: "Hidden" };
  const ua = userAgent.toLowerCase();
  
  let os = "Unknown";
  let type = "Desktop";
  
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("mac os x")) os = "macOS";
  else if (ua.includes("android")) { os = "Android"; type = "Mobile"; }
  else if (ua.includes("iphone")) { os = "iOS"; type = "Mobile"; }
  else if (ua.includes("ipad")) { os = "iPadOS"; type = "Tablet"; }
  else if (ua.includes("cros")) os = "ChromeOS";
  else if (ua.includes("linux")) os = "Linux";
  
  let browser = "Unknown";
  if (ua.includes("brave")) browser = "Brave";
  else if (ua.match(/edg\//)) browser = "Edge";
  else if (ua.includes("vivaldi")) browser = "Vivaldi";
  else if (ua.includes("opr/") || ua.includes("opera")) browser = "Opera";
  else if (ua.includes("comet")) browser = "Comet Web3";
  else if (ua.includes("duckduckgo")) browser = "DuckDuckGo";
  else if (ua.match(/samsungbrowser\//)) browser = "Samsung Internet";
  else if (ua.includes("ucbrowser")) browser = "UC Browser";
  else if (ua.includes("crios")) browser = "Chrome (iOS)";
  else if (ua.includes("fxios")) browser = "Firefox (iOS)";
  else if (ua.includes("firefox")) browser = "Firefox";
  else if (ua.includes("chrome")) browser = "Chrome";
  else if (ua.includes("safari")) browser = "Safari";
  
  return { os, browser, type, raw: userAgent };
}

export default async function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const user = await prisma.user.findUnique({
    where: { id: resolvedParams.id },
    include: {
      accounts: true,
      userSessions: { orderBy: { lastActiveAt: "desc" } },
      securityLogs: { orderBy: { timestamp: "desc" }, take: 200 }, // Last 200 actions
      enrollments: { include: { course: true }, orderBy: { enrolledAt: "desc" } },
      payments: { include: { course: true }, orderBy: { createdAt: "desc" } },
    }
  });

  if (!user) return notFound();

  // Parse latest hardware
  const latestSession = user.userSessions[0];
  const device = parseDevice(latestSession?.deviceInfo || user.securityLogs[0]?.deviceInfo);

  // Parse Map Coordinates
  let latLng = null;
  const preciseLog = user.securityLogs.find(l => l.encryptedPreciseLocation);
  if (preciseLog?.encryptedPreciseLocation) {
    const rawData = decrypt(preciseLog.encryptedPreciseLocation);
    try {
      if (rawData) {
        const parsed = JSON.parse(rawData);
        if (parsed.lat && parsed.lng) latLng = parsed;
      }
    } catch {
      if (rawData && rawData.includes(",")) {
        const [lat, lng] = rawData.split(",");
        latLng = { lat: parseFloat(lat), lng: parseFloat(lng) };
      }
    }
  }

  // Calculate Heatmap (Last 100 days for UI fit)
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const activityMap: Record<string, number> = {};
  
  user.securityLogs.forEach(log => {
    const dateStr = log.timestamp.toISOString().split("T")[0];
    activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
  });

  const heatmapDays = Array.from({ length: 100 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (99 - i));
    const dateStr = d.toISOString().split("T")[0];
    return { date: dateStr, count: activityMap[dateStr] || 0 };
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      
      {/* Top Banner */}
      <div className="flex items-center gap-4 text-xs font-semibold tracking-widest uppercase text-indigo-400">
        <Link href="/admin/users" className="hover:text-indigo-300 transition-colors">Users Registry</Link>
        <span className="text-white/20">/</span>
        <span className="text-white/60">Dossier: {user.id}</span>
      </div>

      {/* Main Profile Header */}
      <div className="p-8 rounded-3xl relative overflow-hidden"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
          <div className="flex items-center gap-6">
            {user.image 
              ? <img src={user.image} className="w-24 h-24 rounded-2xl object-cover shadow-2xl shadow-indigo-500/20" />
              : <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-2xl shadow-indigo-500/20"
                  style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                  {user.name?.charAt(0) || "U"}
                </div>
            }
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white mb-1">{user.name || "Unnamed Student"}</h1>
              <p className="text-indigo-300 font-medium mb-3">{user.email}</p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-white/5 border border-white/10 text-white/70">
                  {user.role}
                </span>
                {user.accounts.some(a => a.provider === "google") && (
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-white/10 border border-white/10 text-white flex items-center gap-1.5">
                    Google Auth
                  </span>
                )}
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-white/5 border border-white/10 text-white/50">
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="shrink-0 flex gap-3">
             <RemoveUserButton userId={user.id} userName={user.name} />
          </div>
        </div>

        {/* Demographics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 pt-8 border-t border-white/5">
          {[
             { label: "Age", val: user.age ? `${user.age} yrs` : "—" },
             { label: "Gender", val: user.gender || "—" },
             { label: "College", val: user.college || "—" },
             { label: "Course/Branch", val: user.course || "—" },
             { label: "Birthday", val: user.birthday ? new Date(user.birthday).toLocaleDateString() : "—" }
          ].map(d => (
            <div key={d.label}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">{d.label}</p>
              <p className="text-sm font-medium text-white/80">{d.val}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hardware & Location Fingerprint Column */}
        <div className="space-y-6 lg:col-span-1">
          {/* Hardware Device */}
          <div className="p-6 rounded-3xl bg-white/[0.015] border border-white/5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-6">Device Fingerprint</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-xs text-white/40 uppercase tracking-widest font-bold">OS Platform</span>
                <span className="text-sm font-bold text-white">{device.os}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-xs text-white/40 uppercase tracking-widest font-bold">Browser</span>
                <span className="text-sm font-bold text-white">{device.browser}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-xs text-white/40 uppercase tracking-widest font-bold">Form Factor</span>
                <span className="text-sm font-bold text-white">{device.type}</span>
              </div>
              <p className="text-[10px] font-mono text-white/20 break-words mt-4 pt-4 border-t border-white/5">{device.raw}</p>
            </div>
          </div>

          {/* Map Embed */}
          <div className="p-6 rounded-3xl bg-white/[0.015] border border-white/5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-6 flex justify-between">
              Location Tracking
              <span className={user.preciseLocationAllowed ? "text-emerald-400" : "text-orange-400"}>
                {user.preciseLocationAllowed ? "● LIVE GPS" : "APPROX"}
              </span>
            </h3>
            
            {latLng ? (
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-black h-48 relative shadow-inner">
                <iframe 
                  src={`https://maps.google.com/maps?q=${latLng.lat},${latLng.lng}&z=14&output=embed`}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }} 
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-white/5 bg-white/5 h-48 flex items-center justify-center text-center p-6">
                <p className="text-xs text-white/30 font-medium">No Precise GPS Coordinates intercepted for this user yet.</p>
              </div>
            )}
            
            <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block mb-1">Network Approximate</span>
              <p className="text-sm text-white/90">{user.userSessions[0]?.approxLocation || "Unknown"}</p>
              <p className="text-xs font-mono text-white/40 mt-1">IP: {user.userSessions[0]?.ipAddress}</p>
            </div>
          </div>
        </div>

        {/* Analytics & History Column */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Heatmap Activity */}
          <div className="p-6 rounded-3xl bg-white/[0.015] border border-white/5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-6">Engagement Heatmap</h3>
            <div className="flex gap-1 flex-wrap">
              {heatmapDays.map((day, i) => (
                <div 
                  key={i}
                  title={`${day.date}: ${day.count} actions`}
                  className="w-4 h-4 rounded-sm transition-all"
                  style={{
                    background: day.count === 0 ? "rgba(255,255,255,0.05)" : 
                                day.count < 3 ? "rgba(99,102,241,0.4)" :
                                day.count < 8 ? "rgba(99,102,241,0.7)" : "#818cf8",
                    border: "1px solid rgba(255,255,255,0.02)"
                  }}
                />
              ))}
            </div>
            <div className="flex justify-end gap-2 items-center mt-4 text-[10px] text-white/40 uppercase tracking-widest font-bold">
              <span>Less</span>
              <div className="w-3 h-3 rounded-sm bg-white/5" />
              <div className="w-3 h-3 rounded-sm bg-indigo-500/40" />
              <div className="w-3 h-3 rounded-sm bg-indigo-500/70" />
              <div className="w-3 h-3 rounded-sm bg-indigo-400" />
              <span>More</span>
            </div>
          </div>

          {/* Action Timeline */}
          <div className="p-6 rounded-3xl bg-white/[0.015] border border-white/5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-6">Recent Platform Actions</h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {user.securityLogs.slice(0, 15).map(log => (
                <div key={log.id} className="flex gap-4">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-indigo-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-white/90">
                      {log.actionType === "LOGIN" ? "Logged into Platform" :
                       log.actionType === "DOWNLOAD_PDF" ? "Downloaded Content Material" :
                       log.actionType === "QUIZ_ATTEMPT" ? "Attempted a Quiz" : log.actionType}
                    </p>
                    <p className="text-xs text-white/40 mt-0.5">
                      {new Intl.DateTimeFormat('en-IN', { dateStyle: "medium", timeStyle: "medium" }).format(new Date(log.timestamp))}
                    </p>
                  </div>
                </div>
              ))}
              {user.securityLogs.length === 0 && <p className="text-xs text-white/30">No recorded actions.</p>}
            </div>
          </div>

          {/* Purchases Grid */}
          <div className="p-6 rounded-3xl bg-white/[0.015] border border-white/5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-6">Enrolled Courses & Payments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.enrollments.map(enr => (
                <div key={enr.id} className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
                  <h4 className="font-bold text-white text-sm line-clamp-1">{enr.course.title}</h4>
                  <p className="text-xs text-white/50 mt-1">Enrolled on {new Date(enr.enrolledAt).toLocaleDateString()}</p>
                </div>
              ))}
              {user.enrollments.length === 0 && <p className="text-xs text-white/30">No courses enrolled.</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
