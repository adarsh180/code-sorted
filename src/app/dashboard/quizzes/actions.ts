"use server";

import { prisma } from "@/lib/prisma";

export async function logQuizAttempt(userId: string, quizId: string, score: number, total: number) {
  try {
    // Log the attempt for streak processing
    await prisma.securityLog.create({
      data: {
        userId,
        actionType: "quiz_attempt",
        deviceInfo: `Quiz ${quizId} - ${score}/${total}`,
      }
    });
    return { success: true };
  } catch (err) {
    console.error("Failed to log quiz attempt:", err);
    return { success: false };
  }
}
