import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import CoursesPageClient from "./courses-client";

export default async function CoursesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { enrollments: true } } },
  });

  const enrollments = await prisma.courseEnrollment.findMany({
    where: { userId: session.user.id },
    select: { courseId: true },
  });

  const enrolledIds = new Set(enrollments.map(e => e.courseId));

  return (
    <CoursesPageClient
      courses={courses.map(c => ({
        id: c.id,
        title: c.title,
        description: c.description,
        thumbnail: c.thumbnail,
        price: c.price,
        isFree: c.isFree,
        enrollmentCount: c._count.enrollments,
        isEnrolled: enrolledIds.has(c.id),
      }))}
    />
  );
}
