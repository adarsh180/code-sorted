"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function logNoteView(noteId: string, title: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false };

    // Prevent duplicate spamming by checking if read in the last hour
    const recent = await prisma.securityLog.findFirst({
      where: {
        userId: session.user.id,
        actionType: "note_view",
        deviceInfo: { startsWith: `Note view: ${noteId} -` },
        timestamp: { gte: new Date(Date.now() - 60 * 60 * 1000) }
      }
    });

    if (recent) return { success: true };

    await prisma.securityLog.create({
      data: {
        userId: session.user.id,
        actionType: "note_view",
        deviceInfo: `Note view: ${noteId} - ${title}`,
      }
    });
    return { success: true };
  } catch(e) {
    return { success: false };
  }
}

export async function submitOnboardingDetails(userId: string, data: { age: number, birthday: Date, college: string, course: string, gender: string }) {
  try {
    let avatarUrl;
    if (data.gender === "Male") {
      const idx = Math.floor(Math.random() * 5) + 1;
      avatarUrl = `/avatar/boy/avatar-boy-0${idx}.png`;
    } else if (data.gender === "Female") {
      const idx = Math.floor(Math.random() * 5) + 1;
      avatarUrl = `/avatar/girl/avatar-girl-0${idx}.png`;
    } else {
      const isBoy = Math.random() > 0.5;
      const folder = isBoy ? "boy" : "girl";
      const idx = Math.floor(Math.random() * 5) + 1;
      avatarUrl = `/avatar/${folder}/avatar-${folder}-0${idx}.png`;
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        age: data.age,
        birthday: data.birthday,
        college: data.college,
        course: data.course,
        gender: data.gender,
        image: avatarUrl
      }
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function updateProfile(userId: string, data: { name: string, age: number, birthday: Date, college: string, course: string, gender: string }) {
  try {
    const session = await auth();
    if(session?.user?.id !== userId) throw new Error("Unauthorized");
    
    const currentUser = await prisma.user.findUnique({ where: { id: userId } });
    let avatarUrl = currentUser?.image;
    
    if (!avatarUrl || avatarUrl.startsWith('/avatar/')) {
        if (!avatarUrl || currentUser?.gender !== data.gender) {
            if (data.gender === "Male") {
              const idx = Math.floor(Math.random() * 5) + 1;
              avatarUrl = `/avatar/boy/avatar-boy-0${idx}.png`;
            } else if (data.gender === "Female") {
              const idx = Math.floor(Math.random() * 5) + 1;
              avatarUrl = `/avatar/girl/avatar-girl-0${idx}.png`;
            } else {
              const isBoy = Math.random() > 0.5;
              const folder = isBoy ? "boy" : "girl";
              const idx = Math.floor(Math.random() * 5) + 1;
              avatarUrl = `/avatar/${folder}/avatar-${folder}-0${idx}.png`;
            }
        }
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        age: data.age,
        birthday: data.birthday,
        college: data.college,
        course: data.course,
        gender: data.gender,
        image: avatarUrl
      }
    });
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}
