import Link from "next/link";
import { ReactNode } from "react";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SidebarLogo } from "@/components/dashboard/SidebarLogo";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.birthday) redirect("/onboarding");

  return (
    <div className="min-h-screen bg-[#02040a] flex text-gray-100 font-sans selection:bg-indigo-500/30">
      {/* Sleek Minimalist Sidebar - Non AI Glow */}
      <aside className="w-64 bg-white/[0.02] border-r border-white/5 flex flex-col backdrop-blur-3xl transition-all">
        <div className="p-8 pb-4">
          <SidebarLogo />
        </div>
        <nav className="flex-1 p-6 mt-4 space-y-1">
          {[
            { href: "/dashboard", label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
            { href: "/dashboard/content", label: "Learning Materials", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
            { href: "/dashboard/quizzes", label: "Quizzes", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7l2 2 4-4" },
            { href: "/dashboard/courses", label: "Courses", icon: "M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" },
          ].map(link => (
            <Link key={link.href} href={link.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all group">
              <svg className="w-4 h-4 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={link.icon}/>
              </svg>
              {link.label}
            </Link>
          ))}

          <div className="pt-4 pb-2">
            <div className="h-px mx-4" style={{ background: "rgba(255,255,255,0.05)" }} />
          </div>

          {[
            { href: "/dashboard/settings", label: "Account Details", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
            { href: "/dashboard/contact", label: "Contact Us", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
          ].map(link => (
            <Link key={link.href} href={link.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-all group">
              <svg className="w-4 h-4 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={link.icon}/>
              </svg>
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="p-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 px-2 pb-2 group/profile cursor-pointer">
              {user?.image ? (
                <div className="w-11 h-11 shrink-0 transition-all duration-300 group-hover/profile:scale-110 group-hover/profile:-translate-y-1">
                  <img src={user.image} alt={user.name || "User avatar"} className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(99,102,241,0.4)] transition-all duration-500" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#15182e] border border-white/10 shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.2)] group-hover/profile:shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all duration-300 group-hover/profile:scale-105 flex items-center justify-center text-white/90 text-sm font-bold bg-gradient-to-br from-indigo-500 to-purple-600">
                  {user?.name?.charAt(0) || "U"}
                </div>
              )}
            <div className="flex-1 min-w-0 transition-transform duration-300 group-hover/profile:translate-x-1">
              <p className="text-sm font-semibold text-white truncate group-hover/profile:text-indigo-300 transition-colors">{user?.name || "Student"}</p>
              <p className="text-xs text-white/50 truncate group-hover/profile:text-white/70 transition-colors">{user?.email}</p>
            </div>
          </div>
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full relative">
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
        <div className="relative z-10 p-8 max-w-6xl mx-auto min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
