"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSubjectFolder(name: string, description: string, parentId: string | null) {
  try {
    await prisma.subjectFolder.create({
      data: {
        name,
        description,
        parentId,
      },
    });
    revalidatePath("/admin/content");
    return { success: true };
  } catch (error) {
    console.error("Failed to create folder:", error);
    return { success: false, error: "Failed to create folder" };
  }
}

export async function deleteSubjectFolder(id: string) {
  try {
    // Note: Due to SQLite limitations with cascading self-relations, 
    // manually deleting children or relying on basic delete.
    await prisma.subjectFolder.delete({ where: { id } });
    revalidatePath("/admin/content");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete folder:", error);
    return { success: false, error: "Failed to delete folder. It might have nested contents." };
  }
}

export async function createNote(title: string, description: string, fileUrl: string, folderId: string) {
  try {
    await prisma.note.create({
      data: {
        title,
        description,
        fileUrl,
        folderId,
      },
    });
    revalidatePath("/admin/content");
    return { success: true };
  } catch (error) {
    console.error("Failed to create note:", error);
    return { success: false, error: "Failed to create note" };
  }
}

export async function deleteNote(id: string) {
  try {
    await prisma.note.delete({ where: { id } });
    revalidatePath("/admin/content");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete note:", error);
    return { success: false, error: "Could not delete note" };
  }
}

export async function createQuiz(title: string, description: string, folderId: string) {
  try {
    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        folderId,
      },
    });
    revalidatePath("/admin/quizzes");
    return { success: true, quiz };
  } catch (error) {
    console.error("Failed to create quiz:", error);
    return { success: false, error: "Failed to create quiz" };
  }
}

export async function deleteQuiz(id: string) {
  try {
    await prisma.quiz.delete({ where: { id } });
    revalidatePath("/admin/quizzes");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete quiz:", error);
    return { success: false, error: "Could not delete quiz" };
  }
}

export async function saveQuestion(quizId: string, questionId: string | null, text: string, explanation: string, options: {id?: string, text: string, isCorrect: boolean}[]) {
  try {
    if (questionId) {
      // Update existing question
      await prisma.question.update({
        where: { id: questionId },
        data: { text, explanation }
      });
      
      // Sync options safely without breaking foreign keys blindly
      const existingOptionIds = options.filter(o => o.id).map(o => o.id as string);
      await prisma.option.deleteMany({
        where: {
          questionId,
          id: { notIn: existingOptionIds }
        }
      });
      
      for (const opt of options) {
        if (opt.id) {
          await prisma.option.update({
            where: { id: opt.id },
            data: { text: opt.text, isCorrect: opt.isCorrect }
          });
        } else {
          await prisma.option.create({
            data: { questionId, text: opt.text, isCorrect: opt.isCorrect }
          });
        }
      }
    } else {
      // Create new question
      await prisma.question.create({
        data: {
          quizId,
          text,
          explanation,
          options: {
            create: options.map(o => ({ text: o.text, isCorrect: o.isCorrect }))
          }
        }
      });
    }
    revalidatePath(`/admin/quizzes/${quizId}`);
    return { success: true };
  } catch (err) {
    console.error("Failed to save question:", err);
    return { success: false, error: "Failed to save question" };
  }
}

export async function deleteQuestion(questionId: string, quizId: string) {
  try {
    await prisma.question.delete({ where: { id: questionId } });
    revalidatePath(`/admin/quizzes/${quizId}`);
    return { success: true };
  } catch (err) {
    console.error("Failed to delete question:", err);
    return { success: false };
  }
}

export async function removeUser(userId: string) {
  try {
    await prisma.user.delete({ where: { id: userId } });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (err) {
    console.error("Failed to remove user:", err);
    return { success: false, error: "Failed to remove user" };
  }
}
