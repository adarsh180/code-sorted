import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OnboardingClient from "./onboarding-client";

export default async function OnboardingPageServer() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");
  
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.birthday) redirect("/dashboard"); // Already onboarded

  return <OnboardingClient userId={session.user.id} />;
}
