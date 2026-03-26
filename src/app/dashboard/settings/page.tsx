import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");
  
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/auth/signin");

  // Format dates consistently to avoid hydration mismatches
  const serializedUser = {
    ...user,
    birthday: user.birthday ? user.birthday.toISOString().split('T')[0] : "",
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    emailVerified: user.emailVerified?.toISOString() || null
  };

  return (
    <div className="w-full max-w-4xl">
      {/* Header */}
      <div className="relative mb-10 p-8 rounded-3xl overflow-hidden"
        style={{ background: "linear-gradient(135deg,rgba(52,211,153,0.07),rgba(16,185,129,0.04),rgba(99,102,241,0.03))", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 5% 50%, rgba(52,211,153,0.09) 0%, transparent 45%)" }} />
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-400/70 mb-2">Profile</p>
          <h1 className="text-4xl font-bold tracking-tight mb-2"
            style={{ background: "linear-gradient(100deg,rgba(255,255,255,0.95),rgba(110,231,183,0.85))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Account Details
          </h1>
          <p className="text-white/40 text-sm font-medium">Manage your personal demographics and platform preferences.</p>
        </div>
      </div>
      <SettingsClient user={serializedUser} />
    </div>
  );
}
