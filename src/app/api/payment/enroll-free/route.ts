import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { courseId } = await req.json();
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!course.isFree && course.price > 0) return NextResponse.json({ error: "Not a free course" }, { status: 400 });
  await prisma.courseEnrollment.upsert({
    where: { userId_courseId: { userId: session.user.id as string, courseId } },
    create: { userId: session.user.id as string, courseId },
    update: {},
  });
  return NextResponse.json({ success: true });
}
