"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCourse(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const thumbnail = formData.get("thumbnail") as string;
  const videoUrl = formData.get("videoUrl") as string;
  const content = formData.get("content") as string;
  const isFree = formData.get("isFree") === "true";
  const price = isFree ? 0 : parseFloat(formData.get("price") as string) || 0;
  await prisma.course.create({ data: { title, description, thumbnail, videoUrl, content, price, isFree, isPublished: false } });
  revalidatePath("/admin/courses");
}

export async function updateCourse(id: string, data: { title?: string; description?: string; thumbnail?: string; videoUrl?: string; content?: string; price?: number; isFree?: boolean; isPublished?: boolean }) {
  await prisma.course.update({ where: { id }, data });
  revalidatePath("/admin/courses");
}

export async function deleteCourse(id: string) {
  await prisma.course.delete({ where: { id } });
  revalidatePath("/admin/courses");
}

export async function togglePublish(id: string, isPublished: boolean) {
  await prisma.course.update({ where: { id }, data: { isPublished } });
  revalidatePath("/admin/courses");
}
